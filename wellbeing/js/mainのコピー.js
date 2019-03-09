(() => {


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // クラス用の設定
  /*
  // setting well-being data, pantheon data
  */

  let GDPArray = [];
  let LadderArray = [];
  let PositiveArray = [];
  let NegativeArray = [];
  let GDPScoreArray = [];
  let LadderScoreArray = [];
  let PositiveScoreArray = [];
  let NegativeScoreArray = [];

  let PantheonArray = [];
  let PantheonScoreArray = [];


  for (let i = 0, l = Object.keys(wbData).length; l > i; i++) {
    let wb = wbData[i];
    let ladder = {country: wb.country, rank: wb.lRank, score: wb.ladder};
    let positive = {country: wb.country, rank: wb.pRank, score: wb.positive};
    let negative = {country: wb.country, rank: wb.nRank, score: wb.negative};
    let logGdp = {country: wb.country, rank: wb.gRank, score: wb.logGdp};

    LadderArray.push(ladder);
    PositiveArray.push(positive);
    NegativeArray.push(negative);
    GDPArray.push(logGdp);

    LadderScoreArray.push(ladder);
    PositiveScoreArray.push(positive);
    NegativeScoreArray.push(negative);
    GDPScoreArray.push(logGdp);
  }

  for (let i = 0, l = Object.keys(pantheon).length; l > i; i++) {
    let P = pantheon[i];
    let p = {country: P.country, rank: P.rank, score: P.nPeople};

    PantheonArray.push(p);
    PantheonScoreArray.push(p);
  }

  sortDesc(LadderArray, 'country');
  sortDesc(PositiveArray, 'country');
  sortDesc(NegativeArray, 'country');
  sortDesc(GDPArray, 'country');
  sortDesc(PantheonArray, 'country');

  sortDesc(LadderScoreArray, 'rank');
  sortDesc(PositiveScoreArray, 'rank');
  sortDesc(NegativeScoreArray, 'rank');
  sortDesc(GDPScoreArray, 'rank');
  sortDesc(PantheonScoreArray, 'rank');

  function sortDesc(array, type) {
    array.sort(function sortRank(a, b) {
      if (a[type] < b[type]) {
        return -1;
      }
      else if (a[type] > b[type]) {
        return 1;
      }
      return 0;
    });
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Data canvas //
  class HistCanvas {
    constructor() {
      this.histArea = document.querySelector("#histgram");
      this.context = this.histArea.getContext("2d");
      this.setCanvasSize();
      this.context.globalAlpha = 1.0;  // for safari(fillStyle alpha doesn't work)

      this.tooltipHist = $('#tooltipHist');
      this.mouseOnCountry = '';
      this.histArea.addEventListener('mousemove', this.getCanvasColor.bind(this), false);
    }

    setCanvasSize() {
      const w1000 = 1000;
      const w800 = 800;
      const w680 = 680;
      const w500 = 500;

      let canvasWidth = window.innerWidth;
      if (canvasWidth < w500) {
        this.histArea.width = 320;
      } else if (canvasWidth >= w500 && canvasWidth < w680) {
        this.histArea.width = w500;
      } else if (canvasWidth >= w680 && canvasWidth < w800) {
        this.histArea.width = w680;
      } else if (canvasWidth >= w800 && canvasWidth < w1000) {
        this.histArea.width = w800;
      } else {
        this.histArea.width = 900;
      }
      this.histArea.height = 90;
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

    setAlpha(alpha){
      this.globalAlpha = alpha;
    }


    setNomalColor() {
      this.context.fillStyle = "rgb(100, 100, 100)";
    }

    setHighlightColor() {
      this.context.fillStyle = "rgb(150, 50, 50)";
    }
  }


  // Data class //
  class Data {
    constructor(dataArray, scoreArray, type) {
      this.data = dataArray;
      this.scoreData = scoreArray;
      this.type = type;

      this.canvas = new HistCanvas();
      this.highlightedBarList = [];

      this.canvas.histArea.addEventListener('mousemove', this.onHistRanking.bind(this), false);
      this.canvas.histArea.addEventListener('mouseout', this.outHistRanking.bind(this), false);
      this.canvas.histArea.addEventListener('click', this.clickHistRanking.bind(this), false);

    }

    get max() {
      return Math.max(this.scoreData[0].score);
    }

    get min() {
      return Math.min(this.scoreData[this.scoreData.length - 1].score);
    }

    resetHighlightedBarList() {
      highlightedBarList = [];
    }

    drawHist(duration, drawType) {
      this.resetHighlightedBarList();

      /* drawType: new, redraw */
      console.log('drawWbHist', this.type);
      clearInterval(drawSetInterval);
      this.histLoop(this.data, duration, drawType, this.canvas.histArea);

      // well-being typeが変わるとき(=draw hist時)にinfoも書き直す(time line->pie chartのときにtweenが無効になるため)
      if (typeof countryNameDisplayed !== 'undefined') {
        if (drawType === 'new') {
          if (!isTravelAuto) {
            deletePin();
            // displayInfo(countryNameDisplayed);
          }
        }
      }
    };

    histLoop(data, duration, drawType, histArea) {
      this.canvas.context.clearRect(0, 0, histArea.width, histArea.height);
      let numData = data.length;
      let width = this.histWidth;

      // draw histogram with loop rect
      let i = 0;
      // console.log(numData, data);
      drawSetInterval = setInterval(() => {
        this.fillBar(width, i, histArea);
        i++;

        if (i > numData - 1) {
          clearInterval(drawSetInterval);
          this.highlightRedrawHist(drawType)
        }
      }, duration / numData);
      isHistDisplay = true;
    }

    get histWidth() {
      return this.mathFloor(this.canvas.histArea.width / this.data.length, 5);
    }

    fillBar(width, i, histArea) {
      this.canvas.setNomalColor();
      // this.canvas.setAlpha(0.5);
      let max = this.type === 'negative' ? this.min : this.max;
      let h = (this.data[i].score) / max * histArea.height;
      this.canvas.context.fillRect(width * i, histArea.height - h, width, h);
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
        h = (data[indexList[i]].score) / max * canvas.histArea.height;
        this.canvas.context.fillRect(this.histWidth * indexList[i], canvas.histArea.height - h, this.histWidth, h);
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
      h = (this.data[index].score) / max * this.canvas.histArea.height;
      this.canvas.context.fillRect(this.histWidth * index, this.canvas.histArea.height - h, this.histWidth, h);
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
            if (!isMoveCamera) {
              console.log('click', this.canvas.mouseOnCountry, this.type);
              deletePin();
              // displayInfo(this.canvas.mouseOnCountry);
              console.log('conducted', this.type);
            }
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


  const ladderData = new Data(LadderArray, LadderScoreArray, 'ladder');
  const positiveData = new Data(PositiveArray, PositiveScoreArray, 'positive');
  const negativeData = new Data(NegativeArray, NegativeScoreArray, 'negative');
  const gdpData = new Data(GDPArray, GDPScoreArray, 'gdp');
  const pantheonData = new Data(PantheonArray, PantheonScoreArray, 'pantheon');

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
  let t1, t2, t3, t4;
  let s1, s2, s3, s4;
  let wbButton;
  let svgRadius;
  let searchArray;
  let travelModeSwitch;
  let isTravelAuto = false;
  let infoType;
  let infoBtn;
  let isTouchInfoObject = false;
  let isSPBtnDisplay = true;

  const w1000 = 1000;
  const w800 = 800;
  const w680 = 680;
  const w500 = 500;


  /* pantheon data */


  /* marker pin */
  let pinList;
  let pinRadius;
  let pinSphereRadius;
  let pinHeight;
  let pinMaterial;
  let pinConeGeometry;
  let pinSphereGeometry;


  /* timeline mode */
  const timelineSVG = $('#infoBoardTimeline')[0].children[1];
  const timelineDuration = 0.07;
  const timelineOffset = 20;
  const timelineYearList = [2005, 2006, 2007, 2008, 2009, 20010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
  let timelineWidth;
  let timelineHeight;

  /* ranking histogram */
  let histCanvas;
  let canvasContext;
  let histData;
  let histScoreData;
  let scoreMax;
  let barWidth;
  let isHistDisplay = false;
  let travelIndex = 0;
  let highlightedBarList;

  // const barColor = "rgb(0, 2, 255)";
  // const highlightedBarColor = "rgb(241, 23, 53)";


  /* interactive land function */
  let countryNameGlobal = 0;
  let countryNameDisplayed;
  let isClicked = false;
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
  let isMoveCamera = false;
  let isMoveStop = true;


  /* init tween */
  let initEarthPosition = new THREE.Vector3(0.0, -1.1, 1.0);
  let initCameraPosition = new THREE.Vector3(0.0, 0.0, 2.0);
  let center = new THREE.Vector3(0, 0, 0);


  /* rendering */
  let frame = 0;
  let speed = 3.141592 * 2 / 90 / 60 / 60;  // 1round/90m
  let postprocessing = {};
  // temp val
  let stats;

  let isPantheon;

  /* function */
  let drawHist;
  let drawHistDurationNomal = 1500;
  let drawHistDurationRedraw = 0;
  let redrawHighlightedBar;
  let clickBtnDrawHist;
  let travelWellbeing;
  let travelPantheon;
  let travelSetInterval;
  let stopTravel;
  let drawSetInterval;
  let deletePin;
  let timelineSetInterval;
  let deleteTimeline;

  let setInfoTypeText;
  let setInfoTypePiechart;
  let setInfoTypeNone;
  let setInfoTypeLinechart;

  let fadeInfoBoardVisual;
  let fadeInfoBoardText;
  let fadeInfoBoardPantheon;
  let fadeInfoBoardLinechart;

  let returnSelectedWBtype;
  let setSelectedWBButton;

  let tweenTextCountryW;
  let tweenTextCountryP;
  let tweenTextContentsW;
  let tweenTextContentsP;
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
    infoBtn = document.getElementsByClassName('infoType');
    for (let i = 0, l = infoBtn.length; i < l; i++) {
      infoBtn[i].addEventListener('click', (e) => {
        $(".infoType").removeClass("selectedBtn");
        infoBtn[i].classList.add("selectedBtn");
        infoType = e.target.id.slice(4,);
        if (infoType === 'Text') {
          console.log('text');
          setInfoTypeText();
        } else if (infoType === 'Piechart') {
          console.log('piechart');
          setInfoTypePiechart();
        } else if (infoType === 'Linechart') {
          console.log('linechart');
          setInfoTypeLinechart();
        } else {
          console.log('none');
          setInfoTypeNone();
        }
      })
    }

    setInfoTypeText = function () {
      $('#infoBoard').css("display", 'none');
      $('#infoBoard2').css("display", 'block');
      $('#infoBoardTimeline').css("display", 'none');

      $(".infoType").removeClass("selectedBtn");
      infoBtn[0].classList.add("selectedBtn");
    };

    setInfoTypePiechart = function () {
      $('#infoBoard').css("display", 'grid');
      $('#infoBoard2').css("display", 'none');
      $('#infoBoardTimeline').css("display", 'none');

      $(".infoType").removeClass("selectedBtn");
      infoBtn[1].classList.add("selectedBtn");
    };

    setInfoTypeLinechart = function () {
      $('#infoBoard').css("display", 'none');
      $('#infoBoard2').css("display", 'none');
      $('#infoBoardTimeline').css("display", 'grid');


      $(".infoType").removeClass("selectedBtn");
      infoBtn[2].classList.add("selectedBtn");
    };

    setInfoTypeNone = function () {
      $('#infoBoard').css("display", 'none');
      $('#infoBoard2').css("display", 'none');
      $('#infoBoardTimeline').css("display", 'none');

      $(".infoType").removeClass("selectedBtn");
      // infoBtn[2].classList.add("selectedBtn");
    };


    fadeInfoBoardVisual = function () {
      $('#infoBoard').css({opacity: 0.0});
      fadeInfoBoardLinechart();
    };

    fadeInfoBoardText = function () {
      $('#country2').css({opacity: 0.0});
      $('.infoBoardContent2').css({opacity: 0.0});
      fadeInfoBoardPantheon();
    };

    fadeInfoBoardPantheon = function () {
      $('#country3').css({opacity: 0.0});
      $('.infoBoardContent3').css({opacity: 0.0}).css("display", 'none');
    };

    fadeInfoBoardLinechart = function () {
      $('#infoBoardTimeline').css({opacity: 0.0});
    };


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
      // highlightedBarList = [];  // reset

      // canvasContext.globalAlpha = 0.5;
      let selectedType = returnSelectedWBtype();
      console.log(selectedType);
      dataList[selectedType].drawHist(2000, 'new');

      // let res = drawHist(selectedType, drawHistDurationNomal, 'new');
      // barWidth = res.width;
      // histData = res.histData;
      // scoreMax = res.scoreMax;
      // histScoreData = res.scoreData;

      fadeInfoBoardVisual();
      fadeInfoBoardText();

      TweenMax.killAll();
      deletePin();
      stopTravel();

      if (isTravelAuto) {
        isMoveStop = true;
        controls.enableRotate = false;
        if (!isPantheon) {
          travelWellbeing();
          setInfoTypeText();
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
          setInfoTypeLinechart();
        } else {
          setInfoTypeNone();
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
            infoBtn[2].classList.add("selectedBtn"); // setInfoTypeLinechart
            setInfoTypeLinechart();

          }, 400);
          setTimeout(() => {
            // landBase.material.opacity = 1.0;
            // clickBtnDrawHist('ladderBtn');
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
      if (!isFirstClick) {
        tweenTextCountryW.kill();
        tweenTextContentsW.kill();
        tweenTextCountryP.kill();
        tweenTextContentsP.kill();
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

    /* typing effect function */
    // function typing(pageNo) {
    //   $('.fadein > span').css('opacity', '0');  // reset opacity(0.0) for displaying again
    //   let str = [];
    //   let pageClass = '.page' + pageNo;
    //   $(pageClass + ' > .fadein > span').each(function (i) {
    //     $(this).css('opacity', '1');
    //     str[i] = $(this).text();  // copy original text
    //     $(this).text('');  // delete text
    //     let no = i;
    //     let self = this;
    //     let interval = setInterval(function () {
    //       if (no === 0 || Number($(pageClass + ' > .fadein > span').eq(no - 1).children('span:last').css('opacity')) === 1) {  // 最初の要素または前の要素が全文字表示された時
    //         clearInterval(interval);
    //         for (let j = 0; j < str[no].length; j++) {
    //           $(self).append('<span>' + str[no].substr(j, 1) + '</span>');
    //           $(self).children('span:last').delay(50 * j).animate({opacity: '1'}, 300);
    //         }
    //       }
    //     }, 50);
    //   });
    // }
    //
    // typing(1);


    /*
    // initial setting
    */
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    targetDOM = document.getElementById('webgl');


    if (canvasWidth < w680) {
      timelineWidth = 320;
      timelineHeight = 80;
    } else if (canvasWidth >= w680 && canvasWidth < w800) {
      timelineWidth = 480;
      timelineHeight = 80;
    } else if (canvasWidth >= w800 && canvasWidth < w1000) {
      timelineWidth = 600;
      timelineHeight = 80;
    } else {
      timelineWidth = 800;
      timelineHeight = 105;
    }

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
        if (canvasWidth < w1000) {
          svgRadius = 40;
          t1.setAttributeNS(null, "font-size", "22px");
          t2.setAttributeNS(null, "font-size", "22px");
          t3.setAttributeNS(null, "font-size", "22px");
          t4.setAttributeNS(null, "font-size", "22px");
          s1.setAttributeNS(null, "font-size", "12px");
          s2.setAttributeNS(null, "font-size", "12px");
          s3.setAttributeNS(null, "font-size", "12px");
          s4.setAttributeNS(null, "font-size", "12px");

        } else {
          svgRadius = 48;
          t1.setAttributeNS(null, "font-size", "28px");
          t2.setAttributeNS(null, "font-size", "28px");
          t3.setAttributeNS(null, "font-size", "28px");
          t4.setAttributeNS(null, "font-size", "28px");
          s1.setAttributeNS(null, "font-size", "16px");
          s2.setAttributeNS(null, "font-size", "16px");
          s3.setAttributeNS(null, "font-size", "16px");
          s4.setAttributeNS(null, "font-size", "16px");
        }

        let histCanvasWidth;
        if (canvasWidth < w500) {
          histCanvasWidth = 320;
        } else if (canvasWidth >= w500 && canvasWidth < w680) {
          histCanvasWidth = w500;
        } else if (canvasWidth >= w680 && canvasWidth < w800) {
          histCanvasWidth = w680;
        } else if (canvasWidth >= w800 && canvasWidth < w1000) {
          histCanvasWidth = w800;
        } else {
          histCanvasWidth = 900;
        }

        if (histCanvas.width !== histCanvasWidth) {
          histCanvas.width = histCanvasWidth;
          // let selectedType = returnSelectedWBtype();
          // canvasContext.globalAlpha = 0.5;
          // let res = drawHist(selectedType, drawHistDurationRedraw, 'redraw');
          //
          // barWidth = res.width;
          // histData = res.histData;
          // scoreMax = res.scoreMax;
          // histScoreData = res.scoreData;

          let selectedType = returnSelectedWBtype();
          console.log(selectedType);
          dataList[selectedType].drawHist(2000, 'new');
        }

        if (canvasWidth < w680) {
          timelineWidth = 320;
          timelineHeight = 80;
        } else if (canvasWidth >= w680 && canvasWidth < w800) {
          timelineWidth = 480;
          timelineHeight = 80;
        } else if (canvasWidth >= w800 && canvasWidth < w1000) {
          timelineWidth = 600;
          timelineHeight = 80;
        } else {
          timelineWidth = 800;
          timelineHeight = 105;
        }
      }
    }, false);

    /* set mouse position function */
    // mouse = new THREE.Vector2();
    // window.addEventListener('mousemove', (event) => {
    //   event.preventDefault();
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // }, false);


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
            if (!isMoveCamera) {
              fadeInfoBoardText();
              killTweenTextAnimation();
              deletePin();
            }
          }
        }
      }
    }, false);


    /* touch event for SP */
    window.addEventListener("touchstart", function () {
      if (isFinishStartTween) {
        if (!isTravelAuto) {
          if (!isMoveCamera) {
            if (isLand) {
              fadeInfoBoardText();
              killTweenTextAnimation();
              deletePin();
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
    camera.position.z = initCameraPosition.z;
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 2.0;
    controls.maxDistance = 4.0;
    controls.rotateSpeed = 0.1;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;


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




    /* make well-being button in order to show score */
    wbButton = document.getElementsByClassName('wbButton');
    for (let i = 0, wbLen = wbButton.length; i < wbLen; i++) {
      wbButton[i].addEventListener('click', (e) => {

        /* delete infoBoard2 */
        killTweenTextAnimation();
        fadeInfoBoardText();
        deletePin();

        const wbType = {'ladderData': 0, 'positiveData': 1, 'negativeData': 2, 'gdpData': 3};
        const type = e.target.id.slice(0, -4) + 'Data';
        const index = wbType[type];
        setSelectedWBButton(index);
        dataList[type].drawHist(2000, 'new');

        /* travel type check */
        if (isTravelAuto) {
          if (type === 'ladderBtn') {
            histScoreData = LadderScoreArray;
          } else if (type === 'positiveBtn') {
            histScoreData = PositiveScoreArray;
          } else if (type === 'negativeBtn') {
            histScoreData = NegativeScoreArray;
          } else {
            histScoreData = GDPScoreArray;
          }
          deletePin();
          travelWellbeing();
        }
      }, false);
    }

    clickBtnDrawHist = function (type) {
      // highlightedBarList = [];  // reset
      // let res = drawHist(type, drawHistDurationNomal, 'new');
      // // console.log(res);
      // barWidth = res.width;
      // histData = res.histData;
      // scoreMax = res.scoreMax;
      // histScoreData = res.scoreData;
    };


    /*
    // score ranking board
    */
    /* setting infoBoard circle size */
    if (canvasWidth < w1000) {
      svgRadius = 40;
    } else {
      svgRadius = 48;
    }


    /* infoBoard text */
    function createRankText(type) {
      let px;
      if (canvasWidth < w1000) {
        px = "22px";
      } else {
        px = "28px";
      }
      let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttributeNS(null, "x", '50%');
      text.setAttributeNS(null, "y", '50%');
      text.setAttributeNS(null, 'text-anchor', 'middle');
      text.setAttributeNS(null, 'dominant-baseline', 'central');
      text.setAttributeNS(null, "fill", "#ffffff");
      text.setAttributeNS(null, "font-size", px);
      text.setAttributeNS(null, "class", "info" + type);
      text.setAttributeNS(null, "id", "info" + type);
      return text;
    }

    t1 = createRankText('Ladder');
    t2 = createRankText('Positive');
    t3 = createRankText('Negative');
    t4 = createRankText('GDP');


    function createScoreText(type) {
      let px;
      if (canvasWidth < w1000) {
        px = "12px";
      } else {
        px = "16px";
      }
      let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttributeNS(null, "x", '50%');
      text.setAttributeNS(null, "y", '70%');
      text.setAttributeNS(null, 'text-anchor', 'middle');
      text.setAttributeNS(null, 'dominant-baseline', 'central');
      text.setAttributeNS(null, "fill", "#eeeeee");
      text.setAttributeNS(null, "font-size", px);
      text.setAttributeNS(null, "class", "info" + type);
      return text;
    }

    s1 = createScoreText('Ladder');
    s2 = createScoreText('Positive');
    s3 = createScoreText('Negative');
    s4 = createScoreText('GDP');


    /* display score result */
    function displayInfo(countryName) {
      countryNameDisplayed = countryName;
      if (!isFirstClick) {
        TweenMax.killAll();
        positive.cancel();
        negative.cancel();
        gdp.cancel();
      }
      clearInfo();
      let res = calcWbInfo(countryName);
      infoBoard.css({opacity: 0.8});
      infoBoardTimeline.css({opacity: 0.8});
      // deletePin();
      tooltip.css({opacity: 0.0});


      if (typeof res !== 'undefined') {
        displayVisualInfo(res, wbLength);
        displayTextInfo(countryName, res);  // テキストでの結果表示

        if (!isPantheon) {
          if ($('.infoType.selectedBtn')[0].id.slice(4,) === 'Linechart') {
            let wellbeingType = $('.wbButton1.selectedBtn')[0].id.slice(0, -4);
            console.log(wellbeingType);
            displayTimeline(wellbeingType, countryName, timelineSVG, timelineOffset);
          }
        }
      } else {
        displayVisulalNoInfo();
        displayTextNoInfo();
        if (!isPantheon) {
          if ($('.infoType.selectedBtn')[0].id.slice(4,) === 'Linechart') {
            displayTimelineNoInfo();
          }
        }
      }
      // display pantheon data / no data
      displayPantheon(countryName);

      // well-beingデータがあってもなくても移動(念の為、データの有無を確認)
      let location = countrynameToLatlon(countryName);
      if (typeof location.latitude !== 'undefined') {
        latitude = location.latitude;
        longitude = location.longitude;
        moveCamera(latitude, longitude);

        $('#country').empty().append(countryName);
        $('#country4').empty().append(countryName);
      }
    }


    function displayRanking(type, rank, num, duration, rankText, score, scoreText) {
      let id = '#' + type + 'Ranking';
      let svg = $(id).children().children()[2];
      let radius = (num - rank + 1) / num * svgRadius; // responsive
      let rankOrdinal;
      let scoreUnit = type === 'GDP' ? 'US$' : 'pt';
      rankOrdinal = putRankOrdinal(rank);

      TweenMax.fromTo(svg, duration,
          {attr: {r: 0}},
          {
            attr: {r: radius},
            ease: Power1.easeInOut,
            onComplete: function () {
              rankText.innerHTML = String(rank) + "<tspan font-size='12px'>" + rankOrdinal + "</tspan>";
              $(id).children()[0].appendChild(rankText);
              scoreText.textContent = '(' + String(score.toFixed(1)) + scoreUnit + ')';
              $(id).children()[0].appendChild(scoreText);

              $('.info' + type).attr('opacity', 1.0);
            }
          });
    }

    function putRankOrdinal(rank) {
      let ordinal;
      let rankStr = rank.toString();
      rankStr = rankStr.substring(rankStr.length - 1, rankStr.length);
      if (rankStr === '1') {
        ordinal = 'st'
      } else if (rankStr === '2') {
        ordinal = 'nd'
      } else if (rankStr === '3') {
        ordinal = 'rd'
      } else {
        ordinal = 'th'
      }
      return ordinal;
    }


    /* display each rank type */
    function createPromise(type, rank, num, svgDuration, text, nextStartDuration, score, scoreText) {
      let promise;
      let timeout;
      promise = new Promise((resolve) => {
        timeout = setTimeout(() => {
          resolve(displayRanking(type, rank, num, svgDuration, text, score, scoreText));
        }, nextStartDuration)
      });
      return {
        promise: promise,
        cancel: function () {
          clearTimeout(timeout);
          isClicked = false;
        }
      };
    }


    let positive, negative, gdp;

    function displayVisualInfo(wbData, wbLength) {
      new Promise((resolve) => {
        resolve(displayRanking('Ladder', wbData['lRank'], wbLength, 1.0, t1, wbData['ladder'], s1));
      }).then(() => {
        positive = createPromise('Positive', wbData['pRank'], wbLength, 1.0, t2, 500, wbData['positive'], s2);
        return positive.promise;
      }).then(() => {
        negative = createPromise('Negative', wbData['nRank'], wbLength, 1.0, t3, 500, wbData['negative'], s3);
        return negative.promise;
      }).then(() => {
        gdp = createPromise('GDP', wbData['gRank'], wbLength, 1.0, t4, 500, wbData['gdp'], s4);
        isFirstClick = false;
        return gdp.promise;
      }).catch(() => {
        console.error('Something wrong!')
      });
    }


    function displayTextInfo(countryName, wbData) {
      let lRank = wbData['lRank'];
      let pRank = wbData['pRank'];
      let nRank = wbData['nRank'];
      let gRank = wbData['gRank'];

      fadeInfoBoardText();
      setTimeout(() => {
        tweenTextCountryW = TweenMax.to("#country2", 1.0, {
          opacity: 1.0,
          onComplete: function () {
            tweenTextContentsW = TweenMax.to(".infoBoardContent2", 1.0, {
              opacity: 1.0,
            });
          }
        })
      }, 1000);

      document.getElementById("country2").innerHTML = countryName;
      document.getElementById("Ladder2").innerHTML = '- L : ' + lRank + putRankOrdinal(lRank);
      document.getElementById("Positive2").innerHTML = '- P : ' + pRank + putRankOrdinal(pRank);
      document.getElementById("Negative2").innerHTML = '- N : ' + nRank + putRankOrdinal(nRank);
      document.getElementById("GDP2").innerHTML = '- G : ' + gRank + putRankOrdinal(gRank);
    }


    function displayVisulalNoInfo() {
      setTimeout(() => {
        t1.textContent = 'No data';
        $('#LadderRanking').children()[0].appendChild(t1);
        t2.textContent = 'No data';
        $('#PositiveRanking').children()[0].appendChild(t2);
        t3.textContent = 'No data';
        $('#NegativeRanking').children()[0].appendChild(t3);
        t4.textContent = 'No data';
        $('#GDPRanking').children()[0].appendChild(t4);

        $('#infoLadder').attr('opacity', 1.0);
        $('#infoPositive').attr('opacity', 1.0);
        $('#infoNegative').attr('opacity', 1.0);
        $('#infoGDP').attr('opacity', 1.0);
      }, 500);
    }

    function displayTextNoInfo() {
      fadeInfoBoardText();
      setTimeout(() => {
        tweenTextCountryW = TweenMax.to("#country2", 1.0, {
          opacity: 1.0,
          onComplete: function () {
            tweenTextContentsW = TweenMax.to(".infoBoardContent2", 1.0, {
              opacity: 1.0,
            });
          }
        })
      }, 1000);

      document.getElementById("country2").innerHTML = countryNameGlobal;
      document.getElementById("Ladder2").innerHTML = 'No data';
      document.getElementById("Positive2").innerHTML = '';
      document.getElementById("Negative2").innerHTML = '';
      document.getElementById("GDP2").innerHTML = '';

    }


    /* timeline mode */
    function displayTimeline(type, countryName, svg, offset) {
      deleteTimeline();
      let data;
      for (let i = 0, l = timeline.length; i < l; i++) {
        if (timeline[i]['country'] === countryName) {
          data = timeline[i][type];
        }
      }
      let rank = searchTimelineRank(type, countryName);
      const spanSize = '<span style="font-size: 18px;">';
      const spanWeight = '<span style="font-weight: 200;">';
      document.getElementById("country4").innerHTML = countryName + spanWeight + ' ( ' + rank.rank + spanSize + rank.rankOrdinal + '</span>' + ' ) ' + '</span>';
      let max, min;
      if (type === 'ladder') {
        max = ladderData.max;
        min = ladderData.min;
      } else if (type === 'positive') {
        max = positiveData.max;
        min = positiveData.min;
      } else if (type === 'negative') {
        // negativeは順位が逆
        max = negativeData.min;
        min = negativeData.max;
      } else {
        max = gdpData.max;
        min = gdpData.min;
      }
      let timeLen = data.length;
      let w = (timelineWidth - offset * 2) / (timeLen - 1);
      let startX, startY, endX, endY;

      max = max * 1.1;
      min = min * 0.5;


      let i = 0;
      let isPathFirst = true;
      timelineSetInterval = setInterval(function () {
        addTimelineScale(timelineYearList, timelineOffset, i);

        let h = (data[i] - min) / (max - min) * timelineHeight;
        endX = w * i + offset;
        endY = timelineHeight - h;

        // データが有るときのみ描画、無いときはスキップして次の点と結ぶ
        if (data[i] !== -999) {
          // 1回目は点のみ
          if (isPathFirst) {
            svgMarker(endX, endY, svg);
            startX = endX;
            startY = endY;
            isPathFirst = !isPathFirst;
          } else {
            drawTimelinePath(startX, startY, endX, endY, timelineSVG);
            startX = endX;
            startY = endY;
          }
        }
        i++;
        if (i > timeLen - 1) {

          clearInterval(timelineSetInterval);
        }
      }, timelineDuration * 1500);
    }


    function drawTimelinePath(startX, startY, endX, endY, svg) {
      // create line
      let line = svgLine(startX, startY, endX, endY, svg);

      // line animation
      TweenMax.fromTo(line, timelineDuration,
          {attr: {x2: startX, y2: startY}},
          {
            attr: {x2: endX, y2: endY},
            ease: CustomEase.create("custom", "M0,0,C-0.024,0.402,0.456,0.48,0.5,0.5,0.622,0.556,0.978,0.616,1,1"),
            onComplete: function () {
              svgMarker(endX, endY, svg)
            }
          });
    }

    function svgLine(startX, startY, endX, endY, svg) {
      let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', startX);
      line.setAttribute('y1', startY);
      line.setAttribute('x2', endX);
      line.setAttribute('y2', endY);
      line.setAttribute("stroke", "#ffffff");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);
      return line;
    }

    function svgMarker(x, y, svg) {
      let marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      marker.setAttribute("cx", x);
      marker.setAttribute("cy", y);
      marker.setAttribute("r", '4px');
      marker.setAttribute("fill", "#ffffff");
      svg.appendChild(marker);
    }

    function searchTimelineRank(type, countryName) {
      let res = calcWbInfo(countryName);
      let rankKey = type.slice(0, 1) + 'Rank';
      let rank = res[rankKey];
      let rankOrdinal = putRankOrdinal(rank);

      return {rank: rank, rankOrdinal: rankOrdinal};
    }

    function addTimelineScale(yearList, offset, index) {
      let timelineScaleArea = document.getElementById('infoBoardTimelineScale');
      let width = (timelineScaleArea.width.baseVal.value - offset * 2) / (yearList.length - 1);
      let px = '10px';

      let textX = String(width * index + offset) + 'px';
      let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttributeNS(null, "x", textX);
      text.setAttributeNS(null, "y", '50%');
      text.setAttributeNS(null, 'text-anchor', 'middle');
      text.setAttributeNS(null, 'dominant-baseline', 'central');
      text.setAttributeNS(null, "fill", "#ffffff");
      text.setAttributeNS(null, "font-size", px);
      text.textContent = String(yearList[index]);
      timelineScaleArea.appendChild(text);
    }

    deleteTimeline = function () {
      let d = $('#infoBoardTimelineSvg')[0].children;
      let l = d.length;
      for (let i = 0; i < l; i++) {
        d[0].remove();
      }

      d = $('#infoBoardTimelineScale')[0].children;
      l = d.length;
      for (let i = 0; i < l; i++) {
        d[0].remove();
      }
      clearInterval(timelineSetInterval);
    };


    function displayTimelineNoInfo() {
      deleteTimeline();

      setTimeout(() => {
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttributeNS(null, "x", '50%');
        text.setAttributeNS(null, "y", '50%');
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'dominant-baseline', 'central');
        text.setAttributeNS(null, "fill", "#ffffff");
        text.setAttributeNS(null, "font-size", '25px');
        text.textContent = 'No data';
        document.getElementById('infoBoardTimelineSvg').appendChild(text);
      }, 500);
    }


    /* pantheon mode */
    isPantheon = false;
    window.addEventListener("keydown", function (event) {
      // console.log(event.keyCode, event.keyCode === 32);
      if (!isMoveCamera) {
        if (event.keyCode === 32) {  // space
          console.log('space');
          onPantheon();
          if (isTravelAuto) {
            fadeInfoBoardPantheon();
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


    const path1 = '<a href=http://pantheon.media.mit.edu/people/';
    const path2 = ' target="_blank"> - ';
    const path3 = '</a>';
    const born = '<span style="font-size: 12px;"> born in </span>';
    const space = '<span style="font-size: 12px;"> </span>';

    function displayPantheon(countryName) {
      let infoBoardContent3 = document.getElementsByClassName('infoBoardContent3');
      let pIndex = -1;
      let url;
      let name;
      let occupation;
      let year;
      for (let i = 0; pantheonLength > i; i++) {
        if (pantheon[i]['country'] === countryName) {
          pIndex = i;
        }
      }
      document.getElementById("country3").innerHTML = countryName;
      let numPanheonPeople = 5;
      for (let i = 0; numPanheonPeople > i; i++) {
        infoBoardContent3[i].innerHTML = ''; // clear previous result
      }
      if (pIndex !== -1) {
        let d = pantheon[pIndex];
        for (let i = 0; d['name'].length > i; i++) {
          url = d['url'][i];
          name = d['name'][i];
          occupation = d['occ'][i];
          year = d['year'][i];
          infoBoardContent3[i].innerHTML = path1 + url + path2 + name + ' <span style="color:#dae1f7; font-size: 16px;">(' + space + occupation + born + year + space + ')</span>' + path3;
        }
      } else {
        infoBoardContent3[0].innerHTML = 'No data';
      }

      fadeInfoBoardPantheon();
      setTimeout(() => {
        tweenTextCountryP = TweenMax.to("#country3", 1.0, {
          opacity: 1.0,
          onComplete: function () {
            $('.infoBoardContent3').css("display", 'block');
            tweenTextContentsP = TweenMax.to(".infoBoardContent3", 1.0, {
              opacity: 1.0,
            });
          }
        })
      }, 1000);
    }


    function onPantheon() {
      // $('#country2').css("display", 'none');
      $('#infoBoard3').css("display", 'block');
      $(".infoType").removeClass("selectedBtn");
      infoBtn[2].classList.add("selectedBtn");
      setInfoTypeNone();

      TweenMax.killAll();
      deletePin();
      stopTravel();
      isPantheon = true;

      // let res = drawHist('pantheon', drawHistDurationNomal, 'new');
      // barWidth = res.width;
      // histData = res.histData;
      // scoreMax = res.scoreMax;
      // histScoreData = res.scoreData;

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
        infoBtn[0].classList.add("selectedBtn");
        setInfoTypeText();
      } else {
        infoBtn[2].classList.add("selectedBtn");
        setInfoTypeLinechart();
      }

      TweenMax.killAll();
      deletePin();
      isPantheon = false;
      // let res = drawHist(selectedType, drawHistDurationNomal, 'new');
      // barWidth = res.width;
      // histData = res.histData;
      // scoreMax = res.scoreMax;
      // histScoreData = res.scoreData;

      let selectedType = returnSelectedWBtype();
      console.log(selectedType);
      dataList[selectedType].drawHist(2000, 'new');

      $('#wbButton2').css("display", 'block');
    }


    /*
    // interactive land object function
    */
    let tooltip = $('#tooltip');
    let infoBoard = $('#infoBoard');
    let infoBoardTimeline = $('#infoBoardTimeline');
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
              if (!isMoveCamera) {
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
            deletePin();
            displayInfo(countryNameGlobal);
          }
        }
      }
    }


    function calcWbInfo(countryName) {
      for (let i = 0; wbLength > i; i++) {
        if (wbData[i].country === countryName) {
          return wbData[i];
        }
      }
    }

    function clearInfo() {
      let l = $('#LadderRanking').children().children()[2];
      let p = $('#PositiveRanking').children().children()[2];
      let n = $('#NegativeRanking').children().children()[2];
      let g = $('#GDPRanking').children().children()[2];

      $(l).attr('r', 0.0);
      $(p).attr('r', 0.0);
      $(n).attr('r', 0.0);
      $(g).attr('r', 0.0);

      $('.infoLadder').attr('opacity', 0.0);
      $('.infoPositive').attr('opacity', 0.0);
      $('.infoNegative').attr('opacity', 0.0);
      $('.infoGDP').attr('opacity', 0.0);
    }


    function countrynameToLatlon(countryName) {
      let latitude;
      let longitude;

      for (let i = 0; latLength > i; i++) {
        if (latlon[i].country === countryName) {
          latitude = latlon[i].latitude;
          longitude = latlon[i].longitude;
        }
      }
      return {latitude: latitude, longitude: longitude};
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

    histCanvas = document.querySelector("#histgram");
    histCanvas.addEventListener('mousemove', getCanvasColor, false);

    /* get canvas color */
    function getCanvasColor(event) {
      let eventLocation = getEventLocation(this, event);
      let context = this.getContext('2d');
      let pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;

      // if nofill, isInfoObject = false
      isInfoObject = (pixelData[0] > 0);
      isFillHist = (pixelData[0] > 0);
    }

    function getElementPosition(obj) {
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

    function getEventLocation(element, event) {
      let pos = getElementPosition(element);
      return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
      };
    }


    /*
    // ranking histogram
    */
    drawHist = function () {
      return {};
    };


    /* highlight selected country */
    // highlightedBarList = [];
    //
    // function highlightedBar(countryName, data, scoreMax) {
    //   let h;
    //   let index;
    //   for (let i = 0; data.length > i; i++) {
    //     if (data[i].country === countryName) {
    //       index = i;
    //       highlightedBarList.push(i)
    //     }
    //   }
    //   // highlight color
    //   canvasContext.fillStyle = highlightedBarColor;
    //   h = (data[index].score) / scoreMax * histCanvas.height;
    //   canvasContext.fillRect(barWidth * index, histCanvas.height - h, barWidth, h);
    // }
    //
    // redrawHighlightedBar = function (indexList, data, scoreMax) {
    //   let h;
    //   for (let i = 0; indexList.length > i; i++) {
    //     // highlight color
    //     canvasContext.fillStyle = highlightedBarColor;
    //     h = (data[indexList[i]].score) / scoreMax * histCanvas.height;
    //     canvasContext.fillRect(barWidth * indexList[i], histCanvas.height - h, barWidth, h);
    //   }
    // };


    /*
    // move camera position function
    */
    /* move position in some separate times using quaternion */

    /* dring move, rotate is not enable */
    function moveCamera(latitude, longitude) {
      let targetPos = convertGeoCoords(latitude, longitude);
      let targetVec = targetPos.sub(center);
      let prevVec = camera.position.sub(center);

      let crossVec = prevVec.clone().cross(targetVec).normalize();
      let angle = prevVec.angleTo(targetVec);

      let q = new THREE.Quaternion();
      let step = 100;
      let stepAngle = angle / step;
      let count = 0;
      let moveCameraQuaternion = function (stepAngle) {
        q.setFromAxisAngle(crossVec, stepAngle);
        camera.position.applyQuaternion(q);
        camera.lookAt(0.0, 0.0, 0.0);
        count++
      };

      let id = setInterval(function () {
        earth.rotation.y = 0;
        isMoveCamera = true;
        controls.enableRotate = false;
        moveCameraQuaternion(stepAngle);
        if (count > step - 1) {
          createPoint(latitude, longitude);
          clearInterval(id);
          isMoveCamera = false;
          if (!isTravelAuto) {
            controls.enableRotate = true;
          }
        }
      }, 1000 / step);
    }


    function convertGeoCoords(latitude, longitude, radius = 1.0) {
      let latRad = latitude * (Math.PI / 180);
      let lonRad = -longitude * (Math.PI / 180);

      let x = Math.cos(latRad) * Math.cos(lonRad) * radius;
      let y = Math.sin(latRad) * radius;
      let z = Math.cos(latRad) * Math.sin(lonRad) * radius;
      return new THREE.Vector3(x, y, z);
    }


    /* marker pin */
    pinRadius = 0.0025;
    pinSphereRadius = 0.01;
    pinHeight = 0.025;
    pinConeGeometry = new THREE.ConeBufferGeometry(pinRadius, pinHeight, 16, 1, true);
    pinSphereGeometry = new THREE.SphereBufferGeometry(pinSphereRadius, 60, 60);

    function createPin() {
      pinMaterial = new THREE.MeshPhongMaterial({color: 0xf15b47});
      let cone = new THREE.Mesh(pinConeGeometry, pinMaterial);
      cone.position.y = pinHeight * 0.5;
      cone.rotation.x = Math.PI;

      let sphere = new THREE.Mesh(pinSphereGeometry, pinMaterial);
      sphere.position.y = pinHeight * 0.95 + pinSphereRadius;

      let group = new THREE.Group();
      group.add(cone);
      group.add(sphere);
      return group;
    }

    pinList = [];

    function createPoint(latitude = 0, longitude = 0) {
      const pin = createPin();
      let latRad = latitude * (Math.PI / 180);
      let lonRad = -longitude * (Math.PI / 180);

      pin.position.copy(convertGeoCoords(latitude, longitude));
      pin.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
      pin.name = 'pin';
      pinList.push(pin);
      earth.add(pin);
    }

    deletePin = function () {
      for (let i = 0, l = pinList.length; l > i; i++) {
        earth.remove(pinList[i]);
      }
      pinList = [];
    };


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
        let countryName = data.data[i].country;
        data.highlightBar(countryName);
        displayInfo(countryName);
        i++;
        travelIndex = i;  // val for continue
        if (i > wbLength - 1) {
          // if (i > 3 - 1) {
          console.log('clearInterval', i);
          clearInterval(travelSetInterval);

          // next travel
          setTimeout(() => {
            let selectedType = returnSelectedWBtype();
            let nextType;
            // let btnIndex;
            // if (selectedType === 'ladderBtn') {
            //   nextType = 'positiveBtn';
            //   btnIndex = 1;
            // } else if (selectedType === 'positiveBtn') {
            //   nextType = 'negativeBtn';
            //   btnIndex = 2;
            // } else if (selectedType === 'negativeBtn') {
            //   nextType = 'gdpBtn';
            //   btnIndex = 3;
            // } else {
            //   nextType = 'ladderButton';
            //   btnIndex = 0;
            // }
            //
            // setSelectedWBButton(btnIndex);
            // console.log('next travel', nextType);

            const wbType = {'ladderData': 1, 'positiveData': 2, 'negativeData': 3, 'gdpData': 0};
            const type = e.target.id.slice(0, -4) + 'Data';
            const nextIndex = wbType[type];
            setSelectedWBButton(nextIndex);
            dataList[type].drawHist(2000, 'new');

            fadeInfoBoardVisual();
            fadeInfoBoardText();


            // let res = drawHist(nextType, drawHistDurationNomal, 'new');
            // histData = res.histData;
            // scoreMax = res.scoreMax;
            // histScoreData = res.scoreData;
            deletePin();
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


        let countryName = PantheonScoreArray[i]['country'];
        console.log(countryName);
        highlightedBar(countryName, histData, scoreMax);
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
        deletePin();

        console.log(countryNameGlobal);

        displayInfo(countryNameGlobal);
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

