import {Dataset} from './Dataset';
import {Location} from './Location';
import {InfoBord} from './InfoBord';


(() => {



  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // クラス用の設定
  /*
  // setting well-being data, pantheon data
  */

  // let GDPArray = [];
  // let LadderArray = [];
  // let PositiveArray = [];
  // let NegativeArray = [];
  // let GDPScoreArray = [];
  // let LadderScoreArray = [];
  // let PositiveScoreArray = [];
  // let NegativeScoreArray = [];
  //
  // let PantheonArray = [];
  // let PantheonScoreArray = [];
  //
  //
  // for (let i = 0, l = Object.keys(wbData).length; l > i; i++) {
  //   let wb = wbData[i];
  //   let ladder = {country: wb.country, rank: wb.lRank, score: wb.ladder};
  //   let positive = {country: wb.country, rank: wb.pRank, score: wb.positive};
  //   let negative = {country: wb.country, rank: wb.nRank, score: wb.negative};
  //   let logGdp = {country: wb.country, rank: wb.gRank, score: wb.logGdp};
  //
  //   LadderArray.push(ladder);
  //   PositiveArray.push(positive);
  //   NegativeArray.push(negative);
  //   GDPArray.push(logGdp);
  //
  //   LadderScoreArray.push(ladder);
  //   PositiveScoreArray.push(positive);
  //   NegativeScoreArray.push(negative);
  //   GDPScoreArray.push(logGdp);
  // }
  //
  // for (let i = 0, l = Object.keys(pantheon).length; l > i; i++) {
  //   let P = pantheon[i];
  //   let p = {country: P.country, rank: P.rank, score: P.nPeople};
  //
  //   PantheonArray.push(p);
  //   PantheonScoreArray.push(p);
  // }
  //
  // sortDesc(LadderArray, 'country');
  // sortDesc(PositiveArray, 'country');
  // sortDesc(NegativeArray, 'country');
  // sortDesc(GDPArray, 'country');
  // sortDesc(PantheonArray, 'country');
  //
  // sortDesc(LadderScoreArray, 'rank');
  // sortDesc(PositiveScoreArray, 'rank');
  // sortDesc(NegativeScoreArray, 'rank');
  // sortDesc(GDPScoreArray, 'rank');
  // sortDesc(PantheonScoreArray, 'rank');
  //
  // function sortDesc(array, type) {
  //   array.sort(function sortRank(a, b) {
  //     if (a[type] < b[type]) {
  //       return -1;
  //     }
  //     else if (a[type] > b[type]) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // function countrynameToLatlon(countryName) {
  //   let latitude;
  //   let longitude;
  //
  //   for (let i = 0; latLength > i; i++) {
  //     if (latlon[i].country === countryName) {
  //       latitude = latlon[i].latitude;
  //       longitude = latlon[i].longitude;
  //     }
  //   }
  //   return {latitude: latitude, longitude: longitude};
  // }
  //
  // /* dring move, rotate is not enable */
  // function moveCamera(latitude, longitude) {
  //   let targetPos = convertGeoCoords(latitude, longitude);
  //   let targetVec = targetPos.sub(center);
  //   let prevVec = camera.position.sub(center);
  //
  //   let crossVec = prevVec.clone().cross(targetVec).normalize();
  //   let angle = prevVec.angleTo(targetVec);
  //
  //   let q = new THREE.Quaternion();
  //   let step = 100;
  //   let stepAngle = angle / step;
  //   let count = 0;
  //   let moveCameraQuaternion = function (stepAngle) {
  //     q.setFromAxisAngle(crossVec, stepAngle);
  //     camera.position.applyQuaternion(q);
  //     camera.lookAt(0.0, 0.0, 0.0);
  //     count++
  //   };
  //
  //   let id = setInterval(function () {
  //     earth.rotation.y = 0;
  //     isMoveCamera = true;
  //     controls.enableRotate = false;
  //     moveCameraQuaternion(stepAngle);
  //     if (count > step - 1) {
  //       createPoint(latitude, longitude);
  //       clearInterval(id);
  //       isMoveCamera = false;
  //       if (!isTravelAuto) {
  //         controls.enableRotate = true;
  //       }
  //     }
  //   }, 1000 / step);
  // }
  //
  //
  // function convertGeoCoords(latitude, longitude, radius = 1.0) {
  //   let latRad = latitude * (Math.PI / 180);
  //   let lonRad = -longitude * (Math.PI / 180);
  //
  //   let x = Math.cos(latRad) * Math.cos(lonRad) * radius;
  //   let y = Math.sin(latRad) * radius;
  //   let z = Math.cos(latRad) * Math.sin(lonRad) * radius;
  //   return new THREE.Vector3(x, y, z);
  // }
  //
  //
  // /* marker pin */
  // let pinList;
  // let pinRadius;
  // let pinSphereRadius;
  // let pinHeight;
  // let pinMaterial;
  // let pinConeGeometry;
  // let pinSphereGeometry;
  //
  // pinRadius = 0.0025;
  // pinSphereRadius = 0.01;
  // pinHeight = 0.025;
  // pinConeGeometry = new THREE.ConeBufferGeometry(pinRadius, pinHeight, 16, 1, true);
  // pinSphereGeometry = new THREE.SphereBufferGeometry(pinSphereRadius, 60, 60);
  //
  // function createPin() {
  //   pinMaterial = new THREE.MeshPhongMaterial({color: 0xf15b47});
  //   let cone = new THREE.Mesh(pinConeGeometry, pinMaterial);
  //   cone.position.y = pinHeight * 0.5;
  //   cone.rotation.x = Math.PI;
  //
  //   let sphere = new THREE.Mesh(pinSphereGeometry, pinMaterial);
  //   sphere.position.y = pinHeight * 0.95 + pinSphereRadius;
  //
  //   let group = new THREE.Group();
  //   group.add(cone);
  //   group.add(sphere);
  //   return group;
  // }
  //
  // pinList = [];
  //
  // function createPoint(latitude = 0, longitude = 0) {
  //   const pin = createPin();
  //   let latRad = latitude * (Math.PI / 180);
  //   let lonRad = -longitude * (Math.PI / 180);
  //
  //   pin.position.copy(convertGeoCoords(latitude, longitude));
  //   pin.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
  //   pin.name = 'pin';
  //   pinList.push(pin);
  //   earth.add(pin);
  // }
  //
  // function deletePin(earth) {
  //   for (let i = 0, l = pinList.length; l > i; i++) {
  //     earth.remove(pinList[i]);
  //   }
  //   pinList = [];
  // }

  /* three objects */
  let scene;
  let camera;
  let controls;
  let ambientLight;
  let directionalLight1;
  let directionalLight2;
  let renderer;
  let geometry;
  let material;
  let earth;
  let earthOutline;
  let radius = 0.994;
  let axesHelper;
  const RENDERER_PARAM = {
    clearColor: 0x000000
  };



  // function moveCamera(latitude, longitude) {
  //   let targetPos = Location.convertGeoCoords(latitude, longitude);
  //   let targetVec = targetPos.sub(this.center);
  //   let prevVec = camera.position.sub(this.center);
  //
  //   let crossVec = prevVec.clone().cross(targetVec).normalize();
  //   let angle = prevVec.angleTo(targetVec);
  //
  //   let q = new THREE.Quaternion();
  //   let step = 100;
  //   let stepAngle = angle / step;
  //   let count = 0;
  //   let moveCameraQuaternion = function (stepAngle) {
  //     q.setFromAxisAngle(crossVec, stepAngle);
  //     camera.position.applyQuaternion(q);
  //     camera.lookAt(0.0, 0.0, 0.0);
  //     count++
  //   };
  //
  //   let id = setInterval(function () {
  //     earth.rotation.y = 0;
  //     // isMoveCamera = true;
  //     controls.enableRotate = false;
  //     moveCameraQuaternion(stepAngle);
  //     if (count > step - 1) {
  //       this.createPin(latitude, longitude);
  //       clearInterval(id);
  //       // isMoveCamera = false;
  //       // if (!isTravelAuto) {
  //       //   this.controls.enableRotate = true;
  //       // }
  //     }
  //   }, 1000 / step);
  // }

  const datasetdObj = new Dataset(wbData, pantheon, timeline);
  // const locationObj = new Location(latlon, earth, controls, camera);
  const locationObj = new Location(latlon);

  const infoBordObj = new InfoBord(datasetdObj, locationObj);


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // Data canvas //
  class HistCanvas {
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
      isInfoObject = (pixelData[0] > 0);
      isFillHist = (pixelData[0] > 0);
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
  }



  // Hist class //
  class Hist {
    constructor(dataArray, scoreArray, type) {
      this.data = dataArray;
      this.scoreData = scoreArray;
      this.type = type;

      this.infoBordObj = infoBordObj;

      this.canvas = new HistCanvas();
      this.highlightedBarList = [];

      this.canvas.histArea.addEventListener('mousemove', this.onHistRanking.bind(this), false);
      this.canvas.histArea.addEventListener('mouseout', this.outHistRanking.bind(this), false);
      this.canvas.histArea.addEventListener('click', this.clickHistRanking.bind(this), false);

    }

    get max() {
      return this.scoreData[0].score;
    }

    get min() {
      return this.scoreData[this.scoreData.length - 1].score;
    }

    resetHighlightedBarList() {
      highlightedBarList = [];
    }

    drawHist(duration, drawType) {
      this.resetHighlightedBarList();

      /* drawType: new, redraw */
      console.log('drawWbHist', this.type);
      clearInterval(drawSetInterval);
      this.histLoop(this.data, duration, drawType);

      // well-being typeが変わるとき(=draw hist時)にinfoも書き直す(time line->pie chartのときにtweenが無効になるため)
      if (typeof countryNameDisplayed !== 'undefined') {
        if (drawType === 'new') {
          if (!isTravelAuto) {
            locationObj.deletePin(earth);
            // this.infoBordObj.displayInfo(countryNameDisplayed);
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
      drawSetInterval = setInterval(() => {
        this.fillBar(width, i);
        i++;

        if (i > numData - 1) {
          clearInterval(drawSetInterval);
          this.highlightRedrawHist(drawType)
        }
      }, duration / numData);
      isHistDisplay = true;
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
        if (isHistDisplay) {
          if (isFillHist) {
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
        if (!isTravelAuto) {
          if (isFillHist) {
            // if (!isMoveCamera) {
              console.log('click', this.canvas.mouseOnCountry, this.type);
              locationObj.deletePin(earth);
              console.log(this.type);
              this.infoBordObj.displayInfo(this.canvas.mouseOnCountry);
              console.log('conducted', this.type);
            // }
          }
        }
      }
    }

    getSelectedTypeFromButton() {
      let type = $('.wbButton1.selectedBtn')[0].id.slice(0, -4)
      if (typeof type === 'undefined') {
        type = 'pantheon'
      }
      return type
    }

  }


  const ladderData = new Hist(datasetdObj.ladder, datasetdObj.ladderScore, 'ladder', infoBordObj);
  const positiveData = new Hist(datasetdObj.positive, datasetdObj.positiveScore, 'positive', infoBordObj);
  const negativeData = new Hist(datasetdObj.negative, datasetdObj.negativeScore, 'negative', infoBordObj);
  const gdpData = new Hist(datasetdObj.gdp, datasetdObj.gdpScore, 'gdp', infoBordObj);
  const pantheonData = new Hist(datasetdObj.pantheon, datasetdObj.pantheonScore, 'pantheon', infoBordObj);

  const dataList = {ladderData, positiveData, negativeData, gdpData, pantheonData};


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  ///////////////////////
  /* Declare variables */
  ///////////////////////

  /* global */
  let canvasWidth = null;
  let canvasHeight = null;
  let targetDOM = null;
  let devicePixelRatio = 1;
  // let devicePixelRatio = window.devicePixelRatio;
  let isSP;
  let userAgent;




  /* texture */
  let earthMap;
  let earthMapLoader;


  /* shader */
  const clock = new THREE.Clock();
  let time = 0.0;


  /* well-being data */

  const wbLength = Object.keys(wbData).length;
  const latLength = Object.keys(latlon).length;
  const pantheonLength = Object.keys(pantheon).length;
  let meshList;
  let wbButton;
  let searchArray;
  let travelModeSwitch;
  let isTravelAuto = false;
  let infoType;
  let infoBtn;
  let isTouchInfoObject = false;
  let isSPBtnDisplay = true;


  /* ranking histogram */
  let isHistDisplay = false;
  let travelIndex = 0;
  let highlightedBarList;


  /* interactive land function */
  let countryNameGlobal = 0;
  let countryNameDisplayed;
  // let isClicked = false;
  let dragFlag = false;
  let isLand = false;
  let isInfoObject = false;
  let isFillHist = false;
  let infoObject;
  let isSearching = false;
  let isFirstClick = true;
  let latitude;
  let longitude;
  let isFinishStartTween = false;
  // let isMoveCamera = false;
  let isMoveStop = true;


  /* init tween */
  let initEarthPosition = new THREE.Vector3(0.0, -1.1, 1.0);
  let initCameraPosition = new THREE.Vector3(0.0, 0.0, 2.0);
  // let center = new THREE.Vector3(0, 0, 0);


  /* rendering */
  let frame = 0;
  let speed = 3.141592 * 2 / 90 / 60 / 60;  // 1round/90m
  let postprocessing = {};
  // temp val
  let stats;

  let isPantheon;

  /* function */
  let travelWellbeing;
  let travelPantheon;
  let travelSetInterval;
  let stopTravel;
  let drawSetInterval;
  let timelineSetInterval;


  let returnSelectedWBtype;
  let setSelectedWBButton;

  // let tweenTextCountryW;
  // let tweenTextCountryP;
  // let tweenTextContentsW;
  // let tweenTextContentsP;
  let killTweenTextAnimation;


  /////////////////
  /* Entry point */
  /////////////////
  window.addEventListener('load', () => {


    /* menu */
    $('.navToggle').click(function () {
      $(this).toggleClass('active');

      if ($(this).hasClass('active')) {
        $('.globalMenu').addClass('active');
      } else {
        $('.globalMenu').removeClass('active');
      }
    });

    // if content is clicked, close menu.
    $('.globalMenu').click(function () {
      $('.navToggle').removeClass('active');
      $('.globalMenu').removeClass('active');
    });


    /* modal window */
    let menuSetting = document.getElementsByClassName('menu');
    for (let i = 0, l = menuSetting.length; i < l; i++) {
      menuSetting[i].addEventListener('click', (e) => {
        let id = e.target.id.slice(4,);
        $(this).blur();
        if ($("#modalOverlay")[0]) {
          return false;
        }
        $("body").append('<div id="modalOverlay"></div>');
        $("#modalOverlay").fadeIn(400);

        // contentごとに書き換え
        $("#modalContentWrapper" + id.toString()).fadeIn(400);
        $("#modalOverlay, .modalClose").unbind()
            .click(function () {
              $("#modalContentWrapper" + id.toString() + ", #modalOverlay").fadeOut(400, function () {
                $("#modalOverlay").remove();
              });
            });
      }, false);
    }


    /* setting info type */
    // infoBtn = document.getElementsByClassName('infoType');
    // for (let i = 0, l = infoBtn.length; i < l; i++) {
    //   infoBtn[i].addEventListener('click', (e) => {
    //     $(".infoType").removeClass("selectedBtn");
    //     infoBtn[i].classList.add("selectedBtn");
    //     infoType = e.target.id.slice(4,);
    //     if (infoType === 'Text') {
    //       console.log('text');
    //       InfoBoard.setInfoTypeText();
    //     } else if (infoType === 'Piechart') {
    //       console.log('piechart');
    //       InfoBoard.setInfoTypePiechart();
    //     } else if (infoType === 'Linechart') {
    //       console.log('linechart');
    //       InfoBoard.setInfoTypeLinechart();
    //     } else {
    //       console.log('none');
    //       InfoBoard.setInfoTypeNone();
    //     }
    //   })
    // }

    // InfoBord.setInfoTypeText = function () {
    //   $('#infoBoard').css("display", 'none');
    //   $('#infoBoard2').css("display", 'block');
    //   $('#infoBoardTimeline').css("display", 'none');
    //
    //   $(".infoType").removeClass("selectedBtn");
    //   infoBtn[0].classList.add("selectedBtn");
    // };
    //
    // InfoBord.setInfoTypePiechart = function () {
    //   $('#infoBoard').css("display", 'grid');
    //   $('#infoBoard2').css("display", 'none');
    //   $('#infoBoardTimeline').css("display", 'none');
    //
    //   $(".infoType").removeClass("selectedBtn");
    //   infoBtn[1].classList.add("selectedBtn");
    // };
    //
    // InfoBord.setInfoTypeLinechart = function () {
    //   $('#infoBoard').css("display", 'none');
    //   $('#infoBoard2').css("display", 'none');
    //   $('#infoBoardTimeline').css("display", 'grid');
    //
    //
    //   $(".infoType").removeClass("selectedBtn");
    //   infoBtn[2].classList.add("selectedBtn");
    // };
    //
    // InfoBord.setInfoTypeNone = function () {
    //   $('#infoBoard').css("display", 'none');
    //   $('#infoBoard2').css("display", 'none');
    //   $('#infoBoardTimeline').css("display", 'none');
    //
    //   $(".infoType").removeClass("selectedBtn");
    //   // infoBtn[2].classList.add("selectedBtn");
    // };
    //
    //
    // InfoBord.fadeInfoBoardVisual = function () {
    //   $('#infoBoard').css({opacity: 0.0});
    //   InfoBord.fadeInfoBoardLinechart();
    // };
    //
    // InfoBord.fadeInfoBoardText = function () {
    //   $('#country2').css({opacity: 0.0});
    //   $('.infoBoardContent2').css({opacity: 0.0});
    //   InfoBord.fadeInfoBoardPantheon();
    // };
    //
    // InfoBord.fadeInfoBoardPantheon = function () {
    //   $('#country3').css({opacity: 0.0});
    //   $('.infoBoardContent3').css({opacity: 0.0}).css("display", 'none');
    // };
    //
    // InfoBord.fadeInfoBoardLinechart = function () {
    //   $('#infoBoardTimeline').css({opacity: 0.0});
    // };


    returnSelectedWBtype = function () {
      return $('#wbButton2').find('.selectedBtn').attr("id").slice(0, -4) + 'Data';
    };

    setSelectedWBButton = function (index) {
      $(".wbButton").removeClass("selectedBtn");
      document.getElementsByClassName('wbButton1')[index].classList.add("selectedBtn");
      document.getElementsByClassName('wbButton2')[index].classList.add("selectedBtn");
    };


    /* switch travel type button */
    travelModeSwitch = document.getElementById('travelModeSwitch-label');
    travelModeSwitch.addEventListener('click', () => {
      isTravelAuto = !isTravelAuto;

      // canvasContext.globalAlpha = 0.5;
      let selectedType = returnSelectedWBtype();
      console.log(selectedType);
      dataList[selectedType].drawHist(2000, 'new');

      infoBordObj.fadeInfoBoardVisual();
      infoBordObj.fadeInfoBoardText();

      TweenMax.killAll();
      locationObj.deletePin(earth);
      stopTravel();

      if (isTravelAuto) {
        isMoveStop = true;
        controls.enableRotate = false;
        if (!isPantheon) {
          travelWellbeing();
          infoBordObj.setInfoTypeText();
        } else {
          travelPantheon();
        }
        stopMove.innerText = 'Stop';
        stopMove.setAttribute('style', 'opacity:1.0;');
      } else {
        isMoveStop = false;
        controls.enableRotate = true;
        stopMove.setAttribute('style', 'opacity:0.0;');
        if (!isPantheon) {
          infoBordObj.setInfoTypeLinechart();
        } else {
          infoBordObj.setInfoTypeNone();
        }
      }
    });

    let stopMove = document.getElementById('stopMove');
    stopMove.addEventListener('click', () => {
      if (isMoveStop) {
        stopMove.innerText = 'Play';
        stopTravel();
      } else {
        stopMove.innerText = 'Stop';
        if (!isPantheon) {
          travelWellbeing(travelIndex);
        } else {
          travelPantheon(travelIndex);
        }
      }
      isMoveStop = !isMoveStop;
    }, false);


    /* start button */
    let startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
      let duration = 5.0;
      // let ease = Back.easeOut.config(1);
      let ease = CustomEase.create("custom", "M0,0 C0.404,0.594 0.339,0.958 0.594,1.032 0.754,1.078 0.838,1 1,1");

      TweenMax.to(earth.position, duration, {
        y: 0.0,
        z: 0.0,
        ease: ease
      });

      /* show button & land*/
      TweenMax.to(camera.position, duration, {
        z: 2.5,
        ease: ease,
        onComplete: function () {
          $('.allButton').css('opacity', '1');

          document.addEventListener('touchmove', function (e) {
            e.preventDefault();
          }, {passive: false});

          setTimeout(() => {
            setSelectedWBButton(0);
            infoBordObj.infoBtn[2].classList.add("selectedBtn"); // infoBordObj.setInfoTypeLinechart
            infoBordObj.setInfoTypeLinechart();

          }, 400);
          setTimeout(() => {
            // landBase.material.opacity = 1.0;
            dataList['ladderData'].drawHist(2000, 'new');


            isFinishStartTween = true;
            controls.enableZoom = true;
          }, 500);
        }
      });

      TweenMax.to(".load", duration - 3.0, {
        opacity: 0.0,
        onComplete: function () {
          $('.load').remove();
        }
      })
    });

    killTweenTextAnimation = function () {
      if (!infoBordObj.isFirstDisplay) {
        infoBordObj.tweenWb1.kill();
        infoBordObj.tweenWb2.kill();
        infoBordObj.tweenP1.kill();
        infoBordObj.tweenP2.kill();
      }
    };


    /* drag object function */
    let draggableObject = document.getElementsByClassName("dragDrop");
    let draggableObjectX;
    let draggableObjectY;

    for (let i = 0; i < draggableObject.length; i++) {
      draggableObject[i].addEventListener("mousedown", dragMousedown, false);
      draggableObject[i].addEventListener("touchstart", dragMousedown, false);
    }

    function dragMousedown(e) {
      let event;
      this.classList.add("drag");

      // mouse & touch event
      if (e.type === "mousedown") {
        event = e;
      } else {
        event = e.changedTouches[0];
      }
      draggableObjectX = event.pageX - this.offsetLeft;
      draggableObjectY = event.pageY - this.offsetTop;

      document.body.addEventListener("mousemove", dragMousemove, false);
      document.body.addEventListener("touchmove", dragMousemove, false);
    }


    function dragMousemove(e) {
      let drag = document.getElementsByClassName("drag")[0];
      let event;

      // mouse & touch event
      if (e.type === "mousemove") {
        event = e;
      } else {
        event = e.changedTouches[0];
      }

      // prevent flick
      e.preventDefault();

      drag.style.left = event.pageX - draggableObjectX + "px";
      drag.style.top = event.pageY - draggableObjectY + "px";

      drag.addEventListener("mouseup", dragMouseUp, false);
      document.body.addEventListener("mouseleave", dragMouseUp, false);
      drag.addEventListener("touchend", dragMouseUp, false);
      document.body.addEventListener("touchleave", dragMouseUp, false);

    }

    function dragMouseUp() {
      let drag = document.getElementsByClassName("drag")[0];
      if (typeof drag !== 'undefined') {
        document.body.removeEventListener("mousemove", dragMousemove, false);
        drag.removeEventListener("mouseup", dragMouseUp, false);
        document.body.removeEventListener("touchmove", dragMousemove, false);
        drag.removeEventListener("touchend", dragMouseUp, false);

        drag.classList.remove("drag");
      }
    }


    /*
    // initial setting
    */
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    targetDOM = document.getElementById('webgl');


    /* device check */
    userAgent = navigator.userAgent;
    if (userAgent.indexOf('iPhone') > 0 || userAgent.indexOf('Android') > 0 && userAgent.indexOf('Mobile') > 0) {
      isSP = true;
    }


    /* window size setting */
    window.addEventListener('resize', () => {
      renderer.setPixelRatio(devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;

      if (isFinishStartTween) {
        let histWidth = $('#histgram').width();
        if (dataList['ladderData'].canvas.previousWidth !== histWidth) {
          // dataListのうち、1つだけ更新すればOK！？
          dataList['ladderData'].canvas.width = histWidth;

          let selectedType = returnSelectedWBtype();
          console.log(selectedType);
          dataList[selectedType].drawHist(2000, 'new');
        }
      }
    }, false);


    /* detect mouse drag(distinguish mouse “click” and “drag”) */
    let dragStartPos = new THREE.Vector2();
    let dragEndPos = new THREE.Vector2();

    window.addEventListener("mousedown", function (event) {
      dragFlag = false;
      dragStartPos.x = event.clientX;
      dragStartPos.y = event.clientY;
    }, false);


    window.addEventListener("mouseup", function (event) {
      dragEndPos.x = event.clientX;
      dragEndPos.y = event.clientY;
      let length = Math.pow((dragEndPos.x - dragStartPos.x), 2) + Math.pow((dragEndPos.y - dragStartPos.y), 2);
      dragFlag = length > 100;

      if (dragFlag) {
        if (isFinishStartTween) {
          if (!isTravelAuto) {
            if (!locationObj.isMoveCamera) {
              infoBordObj.fadeInfoBoardText();
              killTweenTextAnimation();
              locationObj.deletePin(earth);
            }
          }
        }
      }
    }, false);


    /* touch event for SP */
    window.addEventListener("touchstart", function () {
      if (isFinishStartTween) {
        if (!isTravelAuto) {
          if (!locationObj.isMoveCamera) {
            if (isLand) {
              infoBordObj.fadeInfoBoardText();
              killTweenTextAnimation();
              locationObj.deletePin(earth);
            }
          }
        }
        if (!isSearching) {
          isTouchInfoObject = false;
        }
      }
    }, false);


    /* double tap event for SP */
    let tapCount = 0;
    window.addEventListener("touchstart", function () {
      // single tap
      if (!tapCount) {
        ++tapCount;

        setTimeout(function () {
          tapCount = 0;
        }, 350);

        // double tap
      } else {
        if (isSPBtnDisplay) {
          $('#travelModeSwitch').css({'display': 'none'});
          $('#stopMove').css({'display': 'none'});
          $('.navToggle').css({'display': 'none'});
        } else {
          $('#travelModeSwitch').css({'display': 'block'});
          $('#stopMove').css({'display': 'block'});
          $('.navToggle').css({'display': 'block'});
        }
        isSPBtnDisplay = !isSPBtnDisplay;
        e.preventDefault();
        tapCount = 0;
      }
    });


    /* load earth texture */
    earthMapLoader = new THREE.TextureLoader();
    if (isSP) {
      earthMap = earthMapLoader.load('img/mapNightSP.jpg', loadShader);
      console.log('sp')
    } else {
      earthMap = earthMapLoader.load('img/mapNight.jpg', loadShader);
    }

  }, false);

  /* END Entry point */


  function loadShader() {
    SHADER_LOADER.load((data) => {
      const vsMain = data.myShaderMain.vertex;
      const fsMain = data.myShaderMain.fragment;
      const vsPost = data.myShaderPost.vertex;
      const fsPost = data.myShaderPost.fragment;
      init(vsMain, fsMain, vsPost, fsPost);
    })
  }


  /////////////////////////
  /* Initialize function */

  /////////////////////////
  function init(vsMain, fsMain, vsPost, fsPost) {
    stats = initStats();

    function initStats() {
      let stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms
      // Align top-left
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '200px';
      document.getElementById("Stats-output").appendChild(stats.domElement);
      return stats;
    }


    /*
    // setting three object
    */
    scene = new THREE.Scene();

    /* renderer */
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
    renderer.setSize(canvasWidth, canvasHeight);
    targetDOM.appendChild(renderer.domElement);


    /* camera */
    camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 5.0);
    // camera.name = 'camera';  // name for Location class
    camera.position.z = initCameraPosition.z;
    // scene.add(camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.name = 'controls';  // name for Location class
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 2.0;
    controls.maxDistance = 4.0;
    controls.rotateSpeed = 0.1;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    // scene.add(controls);


    /* light for marker Pin */
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(5.0, 2.0, 5.0);
    scene.add(directionalLight1);

    directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5.0, 2.0, -5.0);
    scene.add(directionalLight2);


    /* earth map ver. */
    geometry = new THREE.SphereBufferGeometry(radius, 60, 60);
    material = new THREE.RawShaderMaterial({
      vertexShader: vsMain,
      fragmentShader: fsMain,
      uniforms: {
        // Map
        earthTex: {type: "t", value: earthMap},
        time: {type: "f", value: time},
        resolution: {type: "v2", value: [canvasWidth, canvasHeight]},
      },
      side: THREE.FrontSide, //DoubleSide,
      //depthWrite: false,
      transparent: true,
      //opacity: 0.5,
      //wireframe: true,
    });
    earth = new THREE.Mesh(geometry, material);
    // earth.name = 'earth';  // name for Location class




    /* earth outline object */
    geometry = new THREE.SphereGeometry(radius + 0.003, 120, 120);
    material = new THREE.MeshBasicMaterial({
      color: 0x555555,
      side: THREE.BackSide
      // alphaTest: 0.5
    });
    earthOutline = new THREE.Mesh(geometry, material);

    meshList = [];
    for (let name in country_data) {
      geometry = new Tessellator3D(country_data[name]);
      // let continents = ["EU", "AN", "AS", "OC", "SA", "AF", "NA"];
      let color = new THREE.Color().setHSL(0, 0, 0.3);

      let m = country_data[name].mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.0
          }));
      m.name = "land";
      m.userData.country = name;

      earth.add(m);
      meshList.push(m);
    }


    /* add to scene */
    earth.add(earthOutline);
    scene.add(earth);
    earth.position.y = initEarthPosition.y;
    earth.position.z = initEarthPosition.z;

    // console.log(scene.getObjectByName('earth', true));
    // console.log(scene.getObjectByName('camera', true));
    // console.log(scene.getObjectByName('controls', true));


    /* make well-being button in order to show score */
    wbButton = document.getElementsByClassName('wbButton');
    for (let i = 0, wbLen = wbButton.length; i < wbLen; i++) {
      wbButton[i].addEventListener('click', (e) => {

        /* delete infoBoard2 */
        killTweenTextAnimation();
        infoBordObj.fadeInfoBoardText();
        locationObj.deletePin(earth);

        const wbType = {'ladderData': 0, 'positiveData': 1, 'negativeData': 2, 'gdpData': 3};
        const type = e.target.id.slice(0, -4) + 'Data';
        const index = wbType[type];
        setSelectedWBButton(index);
        dataList[type].drawHist(2000, 'new');

        /* travel type check */
        if (isTravelAuto) {
          locationObj.deletePin(earth);
          travelWellbeing();
        }
      }, false);
    }


    /* pantheon mode */
    isPantheon = false;
    window.addEventListener("keydown", function (event) {
      // console.log(event.keyCode, event.keyCode === 32);
      if (!locationObj.isMoveCamera) {
        if (event.keyCode === 32) {  // space
          console.log('space');
          onPantheon();
          if (isTravelAuto) {
            infoBordObj.fadeInfoBoardPantheon();
            travelPantheon();
          }

        } else if (event.keyCode === 27) {
          console.log('esc');
          offPantheon();
          if (isTravelAuto) {
            stopTravel();
            travelWellbeing();
          }
        }
      }
    }, false);


    function onPantheon() {
      // $('#country2').css("display", 'none');
      $('#infoBoard3').css("display", 'block');
      $(".infoType").removeClass("selectedBtn");
      infoBordObj.infoBtn[2].classList.add("selectedBtn");
      infoBordObj.setInfoTypeNone();

      TweenMax.killAll();
      locationObj.deletePin(earth);
      stopTravel();
      isPantheon = true;
      dataList['pantheonData'].drawHist(2000, 'new');

      $('#wbButton2').css("display", 'none');
    }

    function offPantheon() {
      // let selectedType = returnSelectedWBtype();

      // $('#country2').css("display", 'block');
      $('#infoBoard3').css("display", 'none');
      $(".infoType").removeClass("selectedBtn");

      // もとに戻すときのinfoType設定
      if (isTravelAuto) {
        infoBordObj.infoBtn[0].classList.add("selectedBtn");
        infoBordObj.setInfoTypeText();
      } else {
        infoBordObj.infoBtn[2].classList.add("selectedBtn");
        infoBordObj.setInfoTypeLinechart();
      }

      TweenMax.killAll();
      locationObj.deletePin(earth);
      isPantheon = false;

      let selectedType = returnSelectedWBtype();
      console.log(selectedType);
      dataList[selectedType].drawHist(2000, 'new');

      $('#wbButton2').css("display", 'block');
    }


    /*
    // interactive land object function
    */
    let tooltip = $('#tooltip');
    // let infoBoard = $('#infoBoard');
    // let infoBoardTimeline = $('#infoBoardTimeline');
    let body = $('body');

    window.addEventListener('mousemove', onLandMouseMove, false);
    window.addEventListener('click', onLandMouseClick, false);


    /* mouse over land */
    function onLandMouseMove(event) {
      if (isFinishStartTween) {
        event.preventDefault();
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        let vector = new THREE.Vector3(mouseX, mouseY, -1);
        vector.unproject(camera);
        let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        let intersects = raycaster.intersectObject(earth, true);

        // set tooltip not display
        tooltip.css({opacity: 0.0});
        isLand = false;
        body.css('cursor', 'default');

        if (isFinishStartTween) {
          if (!isTravelAuto) {
            if (!isInfoObject) {
              if (!locationObj.isMoveCamera) {
                if (intersects.length > 0) {
                  if (intersects[0].point !== null) {
                    if (intersects[0].object.name === "land") {

                      countryNameGlobal = intersects[0].object.userData.country;
                      tooltip[0].innerText = countryNameGlobal;
                      tooltip.css({opacity: 1.0});
                      isLand = true;
                      body.css('cursor', 'pointer');
                      tooltip.css({top: event.clientY * 0.97});
                      tooltip.css({left: event.clientX * 1.03});
                    }
                  }
                }
              }
            }
          }
        }
      }
    }


    /* click land */
    function onLandMouseClick() {
      if (isFinishStartTween) {
        if (!dragFlag) {
          if (isLand) {
            locationObj.deletePin(earth);
            infoBordObj.displayInfo(countryNameGlobal, earth, camera, controls);
          }
        }
      }
    }


    /* detect whether onInfo or not */
    infoObject = document.getElementsByClassName('infoObject');
    for (let i = 0, l = infoObject.length; i < l; i++) {
      infoObject[i].addEventListener('mouseenter', onInfoObject, false);
      infoObject[i].addEventListener('mouseleave', outInfoObject, false);
      infoObject[i].addEventListener('touchstart', touchInfoObject, false);
    }


    function onInfoObject() {
      isInfoObject = true;
    }

    function outInfoObject() {
      if (!isSearching) {
        isInfoObject = false;
      }
    }

    function touchInfoObject() {
      isTouchInfoObject = true;
    }



    /*
    // travel ranking country
    */
    travelWellbeing = function (index = 0) {
      stopTravel();  // clear previous travel
      let i = index;
      travelSetInterval = setInterval(function () {
        if (i > 0) {
          pinList[i - 1].children[0].material.color.setHex(0xC9C7B7);
          pinList[i - 1].children[1].material.color.setHex(0xC9C7B7);
        }

        let selectedType = returnSelectedWBtype();
        let data = dataList[selectedType];
        let countryName = data.scoreData[i].country;
        data.highlightBar(countryName);
        infoBordObj.displayInfo(countryName);
        i++;
        travelIndex = i;  // val for continue
        if (i > wbLength - 1) {
          // if (i > 3 - 1) {
          console.log('clearInterval', i);
          clearInterval(travelSetInterval);

          // next travel
          setTimeout(() => {
            const wbType = {'ladderData': 1, 'positiveData': 2, 'negativeData': 3, 'gdpData': 0};
            const type = e.target.id.slice(0, -4) + 'Data';
            const nextIndex = wbType[type];
            setSelectedWBButton(nextIndex);
            dataList[type].drawHist(2000, 'new');

            infoBordObj.fadeInfoBoardVisual();
            infoBordObj.fadeInfoBoardText();

            locationObj.deletePin(earth);
            travelWellbeing();
          }, 5000);
        }
      }, 3140);  // 1800(=30m) / 143(Num of well-being data) / 4
    };


    stopTravel = function () {
      clearInterval(travelSetInterval);
    };


    /*
    // travel pantheon
    */
    travelPantheon = function (index = 0) {
      stopTravel();  // clear previous travel
      let i = index;
      let numPinList = 0;
      let isClear = false;

      function travel() {
        if (i > 0) {
          if (numPinList === pinList.length) {
            isClear = true;
          }
          let pins = pinList[pinList.length - 1].children;
          pins[0].material.color.setHex(0xC9C7B7);
          pins[1].material.color.setHex(0xC9C7B7);
          numPinList = pinList.length;
        }


        let data = dataList['pantheon'];
        let countryName = data.scoreData[i].country;
        data.highlightBar(countryName);


        // let countryName = PantheonScoreArray[i]['country'];
        // console.log(countryName);
        // highlightedBar(countryName, histData, scoreMax);
        let res = countrynameToLatlon(countryName);
        latitude = res.latitude;
        longitude = res.longitude;
        moveCamera(latitude, longitude);
        displayPantheon(countryName);
        i++;

        if (isClear) {
          for (let i = 0, l = pinList.length; l > i; i++) {
            let pins = pinList[i].children;
            pins[0].material.color.setHex(0xC9C7B7);
            pins[1].material.color.setHex(0xC9C7B7);
          }
        }
        travelIndex = i;  // val for continue
        if (i > pantheon.length - 1) {
          console.log('clearInterval', i);
          clearInterval(travelSetInterval);
        }
        travelSetInterval = setTimeout(travel, 9250);  // 1800(=30m) / 194(Num of Pantheon data)
      }

      // travel();
      travelSetInterval = setTimeout(travel, 3000);  // 1800(=30m) / 194(Num of Pantheon data)
    };


    // helper
    axesHelper = new THREE.AxesHelper(5.0);
    scene.add(axesHelper);


    /* conduct rendering */
    if (isSP) {
      spRender();
    } else {
      initPostprocessing(vsPost, fsPost);
      render();
    }


    /*
    search country name
    */
    searchArray = [];
    for (let i = 0; i < latLength; i++) {
      searchArray.push(latlon[i].country);
    }
    searchArray = searchArray.sort();

    let selectorSearchID = ["#country", "#country4"];
    for (let i = 0, l = selectorSearchID.length; i < l; i++) {
      let selectorSearch = $(selectorSearchID[i]);
      selectorSearch.autocomplete({
        source: searchArray,
        autoFocus: false, //defo:false
        delay: 300,
        minLength: 1
      });

      selectorSearch.on("autocompleteclose", function () {
        countryNameGlobal = $(selectorSearchID[i])[0].innerHTML;
        locationObj.deletePin(earth);

        console.log(countryNameGlobal);

        infoBordObj.displayInfo(countryNameGlobal, earth, camera, controls);
        isSearching = false;
        isInfoObject = false;
        // console.log(isInfoObject);
      });

      selectorSearch.on("autocompleteopen", function () {
        isSearching = true;
        isInfoObject = true;
        // console.log(isInfoObject);
      });
    }

  }

  /* END Initialize function */

  ////////////////////////
  /* Rendering function */

  ////////////////////////
  function render() {
    // controls.update();
    stats.update();
    frame++;
    earth.rotation.y += speed;

    let nowTime = clock.getElapsedTime();
    requestAnimationFrame(render);

    /* set 30ftp */
    if (frame % 2 === 0) {
      return;
    }

    //オフスクリーンレンダリング
    renderer.render(scene, camera, postprocessing.renderTarget);
    //平面オブジェクト用テクスチャ画像を更新
    postprocessing.plane.material.uniforms.texture.value = postprocessing.renderTarget.texture;
    postprocessing.plane.material.uniforms.time.value = nowTime;
    postprocessing.plane.material.uniforms.resolution.value = [canvasWidth * devicePixelRatio, canvasHeight * devicePixelRatio];

    //平面オブジェクトをレンダリング
    renderer.render(postprocessing.scene, postprocessing.camera);
  }

  /* Rendering function for SP */
  function spRender() {
    stats.update();
    frame++;
    earth.rotation.y += speed;

    requestAnimationFrame(spRender);

    /* set 30ftp */
    if (frame % 2 === 0) {
      return;
    }
    renderer.render(scene, camera);
  }


  /////////////////////////////
  /* Postprocessing function */

  /////////////////////////////
  function initPostprocessing(vsPost, fsPost) {
    time = 0.0;
    postprocessing.scene = new THREE.Scene();
    postprocessing.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    postprocessing.plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2, 2),
        new THREE.RawShaderMaterial({
          uniforms: {
            texture: {type: "t", value: null},
            resolution: {type: "v2", value: [canvasWidth * devicePixelRatio, canvasHeight * devicePixelRatio]},
            time: {type: "f", value: time},
          },
          vertexShader: vsPost,
          fragmentShader: fsPost,
        })
    );

    postprocessing.scene.add(postprocessing.plane);
    postprocessing.renderTarget = new THREE.WebGLRenderTarget(
        targetDOM.clientWidth,
        targetDOM.clientHeight,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBFormat,
          stencilBuffer: false
        }
    );
  }

})();

