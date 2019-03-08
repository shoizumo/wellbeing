// Data class //
class Data {
  constructor(dataArray, scoreArray, type) {
    this.data = dataArray;
    this.scoreData = scoreArray;
    this.type = type;
  }

  clacMaxScore() {
    return Math.max(this.scoreData[0].score);
  }

  clacMinScore() {
    return Math.min(this.scoreData[this.scoreData.length - 1].score);
  }

  drawHist() {

  }
}


const wbLength = Object.keys(wbData).length;
const latLength = Object.keys(latlon).length;
const pantheonLength = Object.keys(pantheon).length;




    drawHist = function (type, duration, drawType) {
      /* drawType: new, redraw */
      let res;
      if (isPantheon) {
        res = drawPantheonHist(duration, drawType);
      } else {
        res = drawWbHist(type, duration, drawType);
      }

      // well-being typeが変わるとき(=draw hist時)にinfoも書き直す(time line->pie chartのときにtweenが無効になるため)
      if (typeof countryNameDisplayed !== 'undefined') {
        if (drawType === 'new') {
          if (!isTravelAuto) {
            deletePin();
            displayInfo(countryNameDisplayed);
          }
        }
      }
      return {width: res.width, histData: res.histData, scoreMax: res.scoreMax, scoreData: res.scoreData};
    };



    get max() {
        return this.type === 'negative' ? Math.min(this.scoreData[this.scoreData.length - 1].score) : Math.max(this.scoreData[0].score);
      }

      get min() {
        return this.type === 'negative' ? Math.max(this.scoreData[0].score) : Math.min(this.scoreData[this.scoreData.length - 1].score);
      }