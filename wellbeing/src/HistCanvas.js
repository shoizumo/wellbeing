export class HistCanvas {
  constructor() {
    this.histArea = document.querySelector("#histgram");
    this.context = this.histArea.getContext("2d");
    // this.setCanvasSize();
    this.context.globalAlpha = 1.0;  // for safari(fillStyle alpha doesn't work)

    const histgram = $('#histgram');
    this.histArea.width = histgram.width();
    this.histArea.height = histgram.height();
    this.previousWidth = histgram.width();

    this.tooltipHist = $('#tooltipHist');
    this.mouseOnCountry = '';
    this.histArea.addEventListener('mousemove', this.getCanvasColor.bind(this), false);

    this.isFillHist = false;

    this.drawSetInterval = '';
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

  getCanvasColor(event) {
    let eventLocation = this.getEventLocation(this.histArea, event);
    // let context = this.getContext('2d');
    let pixelData = this.context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;

    // if nofill, isInfoObject = false
    // isInfoObject = (pixelData[0] > 0);  // 不要かも？
    this.isFillHist = (pixelData[0] > 0);
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

  // setAlpha(alpha) {
  //   this.globalAlpha = alpha;
  // }


  setNomalColor() {
    this.context.fillStyle = "rgb(100, 100, 100)";
  }

  setHighlightColor() {
    this.context.fillStyle = "rgb(150, 50, 50)";
  }

  highlightBarOnHistColor() {
    this.context.fillStyle = "rgb(130, 130, 130)";
  }
}