export class HistCanvas {
  constructor(soundMouseOverObj) {
    this.histArea = document.querySelector("#histogram");
    this.context = this.histArea.getContext("2d");
    this.context.globalAlpha = 1.0;  // for safari(fillStyle alpha doesn't work)

    const histogram = $('#histogram');
    this.histArea.width = histogram.width();
    this.histArea.height = histogram.height();
    this.previousWidth = histogram.width();

    this.tooltipHist = $('#tooltipHist');
    this.mouseOnCountry = '';

    this.isOnFillHist = false;

    this.drawSetInterval = '';

    this.histArea.addEventListener('mousemove', this.mouseMoveHist.bind(this), false);
    this.histArea.addEventListener('mouseout', this.magnifyOff.bind(this), false);

    this.soundMouseOverObj = soundMouseOverObj;

    this.zoom = document.getElementById("zoomCanvas");
    this.zoomCtx = this.zoom.getContext("2d");
    this.zoomSize = 100;

    this.isMagnifyingOn = true;
  }

  get width() {
    return this.histArea.width;
  }

  get height() {
    return this.histArea.height;
  }

  set width(w) {
    this.histArea.width = w;
    this.previousWidth = w;
  }


  mouseMoveHist(event){
    this.magnifyOn(event);
    this.getCanvasColor(event);
  }

  magnifyOn(event) {
      this.zoomCtx.fillStyle = "rgb(0, 0, 0)";
      this.zoomCtx.fillRect(0, 0, this.zoom.width, this.zoom.height);

      let clientRect = this.histArea.getBoundingClientRect() ;
      let positionX = clientRect.left + window.pageXOffset ;
      let positionY = clientRect.top + window.pageYOffset ;

      let X = event.clientX - positionX;
      let Y = event.clientY - positionY;

      this.zoomCtx.drawImage(this.histArea, X-this.zoomSize/2, Y-this.zoomSize/2, this.zoomSize, this.zoomSize, 0, 0, this.zoom.width, this.zoom.height);

      this.zoom.style.left = event.pageX - this.zoom.width / 2 + "px";
      this.zoom.style.top = event.pageY - this.zoom.height / 2 + "px";
      this.zoom.style.display = this.isMagnifyingOn ? "block" : "none";
  }

  magnifyOff() {
    this.zoom.style.display = "none";
  }



  getCanvasColor(event) {
    let eventLocation = this.getEventLocation(this.histArea, event);
    // let context = this.getContext('2d');
    let pixelData = this.context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;

    // if nofill, isInfoObject = false
    this.isOnFillHist = (pixelData[0] > 0);
  }

  getEventLocation(element, event) {
    let pos = this.getElementPosition(element);
    return {
      x: (event.pageX - pos.x),
      y: (event.pageY - pos.y)
    };
  }


  getElementPosition(obj) {
    let curleft = 0, curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return {x: curleft, y: curtop};
    }
    return undefined;
  }


  setNomalColor() {
    this.context.fillStyle = "rgb(100, 100, 100)";
  }

  setHighlightColor() {
    // this.context.fillStyle = "rgb(150, 50, 50)";
    this.context.fillStyle = "rgb(120, 120, 30)";
  }

  highlightBarOnHistColor() {
    this.context.fillStyle = "rgb(130, 130, 130)";
  }
}