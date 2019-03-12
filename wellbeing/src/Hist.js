import {HistCanvas} from './HistCanvas';

export class Hist {
  constructor(dataArray, scoreArray, type, infoBordObj) {
    this.data = dataArray;
    this.scoreData = scoreArray;
    this.type = type;

    this.infoBord = infoBordObj;

    this.canvas = new HistCanvas();
    this.highlightedBarList = [];

    this.canvas.histArea.addEventListener('mousemove', this.onHistRanking.bind(this), false);
    this.canvas.histArea.addEventListener('mouseout', this.outHistRanking.bind(this), false);
    this.canvas.histArea.addEventListener('click', this.clickHistRanking.bind(this), false);

    this.highlightedBarList = [];

    this.isHistDisplay = false;
    this.drawSetInterval = '';

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
    this.resetHighlightedBarList();

    /* drawType: new, redraw */
    console.log('drawWbHist', this.type);
    clearInterval(this.drawSetInterval);
    this.histLoop(this.data, duration, drawType);

    // well-being typeが変わるとき(=draw hist時)にinfoも書き直す(time line->pie chartのときにtweenが無効になるため)
    if (!this.infoBord.isFirstDisplay){
      if (typeof this.infoBord.countryNameDisplayed !== 'undefined') {
        if (drawType === 'new') {
          if (this.checkIsTravelManual()) {
            this.infoBord.location.deletePin();
            this.infoBord.displayInfo(this.infoBord.countryNameDisplayed);
          }
        }
      }
    }
  };

  histLoop(data, duration, drawType) {
    console.log(this.type);
    this.canvas.context.clearRect(0, 0, 9000, this.canvas.height);
    let numData = data.length;
    let width = this.histWidth;

    // draw histogram with loop rect
    let i = 0;
    // console.log(numData, data);
    this.drawSetInterval = setInterval(() => {
      this.fillBar(width, i);
      i++;

      if (i > numData - 1) {
        clearInterval(this.drawSetInterval);
        this.highlightRedrawHist(drawType)
      }
    }, duration / numData);
    this.isHistDisplay = true;
  }

  get histWidth() {
    return this.mathFloor(this.canvas.width / this.data.length, 5);
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
      this.canvas.context.fillRect(this.histWidth * indexList[i], this.canvas.height - h, this.histWidth, h);
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
    this.canvas.context.fillRect(this.histWidth * index, this.canvas.height - h, this.histWidth, h);
  }


  onHistRanking(event) {
    if (this.getSelectedTypeFromButton() === this.type) {
      // console.log('onHist', isFillHist);
      if (this.isHistDisplay) {
        if (this.canvas.isFillHist) {
          let rect = event.target.getBoundingClientRect();
          let mouseX = Math.abs(event.clientX - rect.left);
          let index = Math.floor(mouseX / this.histWidth);

          document.getElementById("canvasWrapper").classList.add("canvasWrapperPointer");
          // console.log(index);
          this.canvas.mouseOnCountry = this.data[index]['country'];
          this.canvas.tooltipHist[0].innerText = this.canvas.mouseOnCountry;
          this.canvas.tooltipHist.css({opacity: 1.0});

          this.canvas.tooltipHist.css({top: event.clientY * 0.95});
          this.canvas.tooltipHist.css({left: event.clientX * 1.0 - this.canvas.tooltipHist.width() / 2 - 5});

        } else {
          document.getElementById("canvasWrapper").classList.remove("canvasWrapperPointer");
          this.canvas.tooltipHist.css({opacity: 0.0});
          this.canvas.tooltipHist.css({top: 0});
          this.canvas.tooltipHist.css({left: 0});
        }
      }
    }
  }

  outHistRanking() {
    this.canvas.tooltipHist.css({opacity: 0.0});
  }

  clickHistRanking() {
    if (this.getSelectedTypeFromButton() === this.type) {
      if (this.checkIsTravelManual()) {
        if (this.canvas.isFillHist) {
          // if (!isMoveCamera) {
          console.log('click', this.canvas.mouseOnCountry, this.type);
          this.infoBord.location.deletePin();
          console.log(this.type);
          this.infoBord.displayInfo(this.canvas.mouseOnCountry);
          console.log('conducted', this.type);
          // }
        }
      }
    }
  }

  getSelectedTypeFromButton() {
    let type = $('.wbButton1.selectedBtn')[0].id.slice(0, -4);
    if (typeof type === 'undefined') {
      type = 'pantheon'
    }
    return type
  }

  checkIsTravelManual(){
    return document.getElementById("travelModeSwitch-checkbox").checked;
  }

}