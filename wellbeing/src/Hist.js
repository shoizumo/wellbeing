export class Hist {
  constructor(dataArray, scoreArray, type, infoBordObj, histCanvas) {
    this.data = dataArray;
    this.scoreData = scoreArray;
    this.type = type;

    this.infoBord = infoBordObj;

    // this.canvas = new HistCanvas();
    this.canvas = histCanvas;
    this.highlightedBarList = [];

    this.canvas.histArea.addEventListener('mousemove', this.onHistRanking.bind(this), false);
    this.canvas.histArea.addEventListener('mouseout', this.outHistRanking.bind(this), false);
    this.canvas.histArea.addEventListener('click', this.clickHistRanking.bind(this), false);

    this.isHistDisplay = false;
    this.canvas.drawSetInterval = '';

    this.isOnClickHist = false;

    this.highlightBarOnHistIndex = -1;
  }


  get max() {
    return this.scoreData[0].score;
  }

  get min() {
    return this.scoreData[this.scoreData.length - 1].score;
  }

  resetHighlightedBarList() {
    this.highlightedBarList = [];
  }

  drawHist(duration, drawType) {
    /* drawType: new, redraw, travel */

    if (drawType !== 'redraw'){
      this.resetHighlightedBarList();
    }
    clearInterval(this.canvas.drawSetInterval);
    this.histLoop(this.data, duration, drawType);

    // well-being typeが変わるとき(=draw hist時)にinfoも書き直す(time line->pie chartのときにtweenが無効になるため)
    if (!this.infoBord.isFirstDisplay){
      if (typeof this.infoBord.countryNameDisplayed !== 'undefined') {
        if (drawType === 'new') {
          // if (this.checkIsTravelManual()) {
            this.infoBord.location.deletePin();
            this.infoBord.displayInfo(this.infoBord.countryNameDisplayed);
          // }
        }
      }
    }
  };

  histLoop(data, duration, drawType) {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.clearCanvas();
    let numData = data.length;
    let width = this.histBarWidth;

    // draw histogram with loop rect
    let i = 0;
    // console.log(numData, data);
    this.canvas.drawSetInterval = setInterval(() => {
      this.fillBar(width, i);
      i++;

      if (i > numData - 1) {
        clearInterval(this.canvas.drawSetInterval);
        this.highlightRedrawHist(drawType)
      }
    }, duration / numData);
    this.isHistDisplay = true;
  }

  get histBarWidth() {
    return this.mathFloor(this.canvas.width / this.data.length, 15);
  }

  fillBar(width, i) {
    this.canvas.setNomalColor();
    // this.canvas.setAlpha(0.5);
    let max = this.type === 'negative' ? this.min : this.max;
    let h = (this.data[i].score) / max * this.canvas.height;
    this.canvas.context.fillRect(width * i, this.canvas.height - h, width, h);
  }

  highlightRedrawHist(drawType) {
    if (drawType === 'redraw') {
      this.redrawHighlightedBar(this.highlightedBarList, this.data);
    }
  }

  mathFloor(value, base) {
    let b = Math.pow(10, base);
    return Math.floor(value * b) / b;
  }

  redrawHighlightedBar(indexList, data) {
    let h;
    for (let i = 0; indexList.length > i; i++) {
      // highlight color
      this.canvas.setHighlightColor();
      let max = this.type === 'negative' ? this.min : this.max;
      h = (data[indexList[i]].score) / max * this.canvas.height;
      this.canvas.context.fillRect(this.histBarWidth * indexList[i], this.canvas.height - h, this.histBarWidth, h);
    }
  }

  highlightBar(countryName) {
    let h;
    let index;
    for (let i = 0, l = this.data.length; l > i; i++) {
      if (this.data[i].country === countryName) {
        index = i;
        this.highlightedBarList.push(i)
      }
    }
    // highlight color
    this.canvas.setHighlightColor();
    let max = this.type === 'negative' ? this.min : this.max;
    h = (this.data[index].score) / max * this.canvas.height;
    this.canvas.context.fillRect(this.histBarWidth * index, this.canvas.height - h, this.histBarWidth, h);
  }


  highlightBarOnHist(index) {
    if (this.highlightBarOnHistIndex !== index) {
      this.returnHighlightBarOnHist();
    }

    this.canvas.highlightBarOnHistColor();
    let max = this.type === 'negative' ? this.min : this.max;
    let h = (this.data[index].score) / max * this.canvas.height;
    this.canvas.context.fillRect(this.histBarWidth * index, this.canvas.height - h, this.histBarWidth, h);
    this.highlightBarOnHistIndex = index;
  }

  returnHighlightBarOnHist() {

    let prevIndex = this.highlightBarOnHistIndex;
    this.canvas.setNomalColor();

    for(let i = 0, l = this.highlightedBarList.length; l > i; i++){
      if(this.highlightedBarList[i] === prevIndex){
        this.canvas.setHighlightColor();
      }
    }
    let max = this.type === 'negative' ? this.min : this.max;
    let d = this.data[prevIndex];
    if (typeof d !== 'undefined'){
      let h_ = (d.score) / max * this.canvas.height;
      this.canvas.context.fillRect(this.histBarWidth * prevIndex, this.canvas.height - h_, this.histBarWidth, h_);
    }
  }


  onHistRanking(event) {
    if (this.getSelectedTypeFromButton() === this.type) {
      // console.log('onHist', isOnFillHist);
      if (this.isHistDisplay) {
        if (this.canvas.isOnFillHist) {
          let rect = event.target.getBoundingClientRect();
          let mouseX = Math.abs(event.clientX - rect.left);
          let index = Math.floor(mouseX / this.histBarWidth);

          document.getElementById("canvasWrapper").classList.add("canvasWrapperPointer");
          // console.log(index);
          this.canvas.mouseOnCountry = this.data[index]['country'];
          this.canvas.tooltipHist[0].innerText = this.canvas.mouseOnCountry;
          this.canvas.tooltipHist.css({opacity: 1.0});

          this.canvas.tooltipHist.css({top: Math.max(event.clientY - 70, window.innerHeight - this.canvas.height - 20)});
          this.canvas.tooltipHist.css({left: event.clientX * 1.0 - this.canvas.tooltipHist.width() / 2 - 5});

          this.highlightBarOnHist(index);

        } else {
          document.getElementById("canvasWrapper").classList.remove("canvasWrapperPointer");
          this.canvas.tooltipHist.css({opacity: 0.0});
          this.canvas.tooltipHist.css({top: 0});
          this.canvas.tooltipHist.css({left: 0});

          this.returnHighlightBarOnHist();
        }
      }
    }
  }

  outHistRanking() {
    this.canvas.tooltipHist.css({opacity: 0.0});
    this.returnHighlightBarOnHist();
  }


  clickHistRanking() {
    if (this.getSelectedTypeFromButton() === this.type) {
      if (this.canvas.isOnFillHist) {
        this.isOnClickHist = true;
        this.infoBord.location.deletePin();
        this.infoBord.displayInfo(this.canvas.mouseOnCountry);

        // travel modeのためにクリック時に表示が変わるように
        let stopMove = document.getElementById('stopMove');
        stopMove.innerText = 'Play';
        stopMove.style.backgroundColor = '#647d7d';
      }
    }
  }

  getSelectedTypeFromButton() {
    let type;
    if (this.checkIsTravelManual()){
      type = $('.wbButton1.selectedBtn')[0].id.slice(0, -4);
    }else{
      type = 'pantheon';
    }
    return type
  }

  checkIsTravelManual(){
    return document.getElementById("travelModeSwitch-checkbox").checked;
  }

}