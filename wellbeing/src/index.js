import {Dataset} from './Dataset';
import {Location} from './Location';
import {InfoBord} from './InfoBord';
import {HistCanvas} from './HistCanvas';
import {Hist} from './Hist';
import {Menu} from './Menu';


import {country_data} from './data/country_data';
import {latlon} from './data/lat_lon';
import {wbData} from './data/wellbeing_data';
import {pantheon} from './data/pantheon';
import {timeline} from './data/timeline';


(() => {

  ///////////////////////
  /* Declare variables */
  ///////////////////////

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
  const RENDERER_PARAM = {
    clearColor: 0x000000
  };


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
  let meshList;
  let wbButton;
  let searchArray;
  let travelModeSwitch;
  let isTouchInfoObject = false;
  let isSPBtnDisplay = true;


  /* ranking histogram */
  let travelIndex = 0;

  /* interactive land function */
  let dragFlag = false;
  let isLand = false;
  let isInfoObject = false;
  let infoObject;
  let isSearching = false;
  let latitude;
  let longitude;
  let isFinishStartTween = false;
  let isMoveStop = true;


  /* init tween */
  let initEarthPosition = new THREE.Vector3(0.0, -1.1, 1.0);
  let initCameraPosition = new THREE.Vector3(0.0, 0.0, 2.0);


  /* rendering */
  let frame = 0;
  let speed = 3.141592 * 2 / 90 / 60 / 60;  // 1round/90m
  let postprocessing = {};
  // temp val
  // let stats;
  // let axesHelper;


  let isPantheon;

  /* function */
  let travelWellbeing;
  let travelPantheon;
  let travelSetInterval;
  let stopTravel;


  let returnSelectedWBtype;
  let setSelectedDataTypeButton;
  let setSelectedTravelModeButton;
  let killTweenTextAnimation;


  let drawHistDurationNomal = 1500;
  let drawHistDurationRedraw = 0;


  /////////////////
  /* Entry point */
  /////////////////
  window.addEventListener('load', () => {

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
    // stats = initStats();
    //
    // function initStats() {
    //   let stats = new Stats();
    //   stats.setMode(0); // 0: fps, 1: ms
    //   // Align top-left
    //   stats.domElement.style.position = 'absolute';
    //   stats.domElement.style.left = '0px';
    //   stats.domElement.style.top = '200px';
    //   document.getElementById("Stats-output").appendChild(stats.domElement);
    //   return stats;
    // }


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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const datasetdObj = new Dataset(wbData, pantheon, timeline);
    const locationObj = new Location(latlon, earth, controls, camera);
    const infoBordObj = new InfoBord(datasetdObj, locationObj);
    const histCanvas = new HistCanvas();


    const ladderData = new Hist(datasetdObj.ladder, datasetdObj.ladderScore, 'ladder', infoBordObj, histCanvas);
    const positiveData = new Hist(datasetdObj.positive, datasetdObj.positiveScore, 'positive', infoBordObj, histCanvas);
    const negativeData = new Hist(datasetdObj.negative, datasetdObj.negativeScore, 'negative', infoBordObj, histCanvas);
    const gdpData = new Hist(datasetdObj.gdp, datasetdObj.gdpScore, 'gdp', infoBordObj, histCanvas);
    const pantheonData = new Hist(datasetdObj.pantheon, datasetdObj.pantheonScore, 'pantheon', infoBordObj, histCanvas);

    const dataList = {ladderData, positiveData, negativeData, gdpData, pantheonData};

    function checkIsTravelManual() {
      return document.getElementById("travelModeSwitch-checkbox").checked;
    }


    //////////////////////////////////////////////////////////////////////////
    // /* menu */
    //////////////////////////////////////////////////////////////////////////
    Menu.initMenu();
    Menu.initModal();


    //////////////////////////////////////////////////////////////////////////
    returnSelectedWBtype = function () {
      return $('#wbButton2').find('.selectedBtn').attr("id").slice(0, -4) + 'Data';
    };

    setSelectedDataTypeButton = function (index) {
      $(".wbButton").removeClass("selectedBtn");
      document.getElementsByClassName('wbButton1')[index].classList.add("selectedBtn");
      document.getElementsByClassName('wbButton2')[index].classList.add("selectedBtn");
    };

    setSelectedTravelModeButton = function () {
      $(".travelMode").removeClass("selectedBtn");
      if (checkIsTravelManual()) {
        // -> AutoModeになったとき
        setAutoModeTravel();
      } else {
        // -> ManualModeになったとき
        setManualModeTravel();
      }
    };

    function setManualModeTravel() {
      $("#manualMode").addClass("selectedBtn");
    }

    function setAutoModeTravel() {
      $("#autoMode").addClass("selectedBtn");
    }


    let travelModeBtn = document.getElementsByClassName('travelMode');
    for (let i = 0, l = travelModeBtn.length; i < l; i++) {
      travelModeBtn[i].addEventListener('click', (e) => {
        $(".travelMode").removeClass("selectedBtn");
        travelModeBtn[i].classList.add("selectedBtn");
        changeTravelMode();

        let mode = e.target.id.slice(0,6);
        document.getElementById("travelModeSwitch-checkbox").checked = mode === 'manual';
      })
    }


    //////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////
    /* switch travel type button */
    travelModeSwitch = document.getElementById('travelModeSwitch-label');
    travelModeSwitch.addEventListener('click', () => {
      changeTravelMode();
    });

    function changeTravelMode() {
      setSelectedTravelModeButton();
      // canvasContext.globalAlpha = 0.5;
      let selectedType = returnSelectedWBtype();
      console.log(selectedType);
      dataList[selectedType].drawHist(drawHistDurationNomal, 'travel');

      infoBordObj.fadeInfoBoardVisual();
      infoBordObj.fadeInfoBoardText();

      TweenMax.killAll();
      locationObj.deletePin();
      stopTravel();

      // この処理終了後に、checkedの値が変わるため、変更前の値に基づいて分岐
      if (checkIsTravelManual()) {
        // -> AutoModeになったとき
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
        // -> ManualModeになったとき
        isMoveStop = false;
        controls.enableRotate = true;
        stopMove.setAttribute('style', 'opacity:0.0;');
        if (!isPantheon) {
          infoBordObj.setInfoTypeLinechart();
        } else {
          infoBordObj.setInfoTypeNone();
        }
      }
    }

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
    //////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////
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
            setSelectedDataTypeButton(0);
            infoBordObj.infoBtn[2].classList.add("selectedBtn"); // infoBordObj.setInfoTypeLinechart
            infoBordObj.setInfoTypeLinechart();
            setManualModeTravel();

          }, 400);
          setTimeout(() => {
            // landBase.material.opacity = 1.0;
            dataList['ladderData'].drawHist(drawHistDurationNomal, 'new');


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
    //////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////
    killTweenTextAnimation = function () {
      if (!infoBordObj.isFirstDisplay) {
        infoBordObj.tweenWb1.kill();
        infoBordObj.tweenP1.kill();
        if (infoBordObj.tweenWb2 !== '') {
          infoBordObj.tweenWb2.kill();
        }
        if (infoBordObj.tweenP2 !== '') {
          infoBordObj.tweenP2.kill();
        }
      }
    };
    //////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////
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
          dataList[selectedType].drawHist(drawHistDurationRedraw, 'redraw');
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
          if (checkIsTravelManual()) {
            if (!locationObj.isMoveCamera) {
              infoBordObj.fadeInfoBoardText();
              killTweenTextAnimation();
              locationObj.deletePin();
            }
          }
        }
      }
    }, false);


    /* touch event for SP */
    window.addEventListener("touchstart", function () {
      if (isFinishStartTween) {
        if (checkIsTravelManual()) {
          if (!locationObj.isMoveCamera) {
            if (isLand) {
              infoBordObj.fadeInfoBoardText();
              killTweenTextAnimation();
              locationObj.deletePin();
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
    //////////////////////////////////////////////////////////////////////////


    /* make well-being button in order to show score */
    wbButton = document.getElementsByClassName('wbButton');
    for (let i = 0, wbLen = wbButton.length; i < wbLen; i++) {
      wbButton[i].addEventListener('click', (e) => {

        /* delete infoBoard2 */
        killTweenTextAnimation();
        infoBordObj.fadeInfoBoardText();
        locationObj.deletePin();

        // clearDrawHist();

        const wbType = {'ladderData': 0, 'positiveData': 1, 'negativeData': 2, 'gdpData': 3};
        const type = e.target.id.slice(0, -4) + 'Data';
        const index = wbType[type];
        setSelectedDataTypeButton(index);
        dataList[type].drawHist(drawHistDurationNomal, 'new');

        /* travel type check */
        if (!checkIsTravelManual()) {
          locationObj.deletePin();
          travelWellbeing();
        }
      }, false);
    }

    
    // function clearDrawHist(){
    //   const wbType = ['ladderData', 'positiveData', 'negativeData', 'gdpData'];
    //   for (let i = 0, wbLen = wbButton.length; i < wbLen; i++) {
    //     dataList[wbType[i]].clearCanvas();
    //   }
    // }


    /* pantheon mode */
    isPantheon = false;
    window.addEventListener("keydown", function (event) {
      // console.log(event.keyCode, event.keyCode === 32);
      if (!locationObj.isMoveCamera) {
        if (event.keyCode === 32) {  // space
          console.log('space');
          onPantheon();
          if (!checkIsTravelManual()) {
            infoBordObj.fadeInfoBoardPantheon();
            travelPantheon();
          }

        } else if (event.keyCode === 27) {
          console.log('esc');
          offPantheon();
          if (!checkIsTravelManual()) {
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
      locationObj.deletePin();
      stopTravel();
      isPantheon = true;
      dataList['pantheonData'].drawHist(drawHistDurationNomal, 'new');

      $('#wbButton2').css("display", 'none');
    }

    function offPantheon() {
      // let selectedType = returnSelectedWBtype();

      // $('#country2').css("display", 'block');
      $('#infoBoard3').css("display", 'none');
      $(".infoType").removeClass("selectedBtn");

      // もとに戻すときのinfoType設定
      if (!checkIsTravelManual()) {
        infoBordObj.infoBtn[0].classList.add("selectedBtn");
        infoBordObj.setInfoTypeText();
      } else {
        infoBordObj.infoBtn[2].classList.add("selectedBtn");
        infoBordObj.setInfoTypeLinechart();
      }

      TweenMax.killAll();
      locationObj.deletePin();
      isPantheon = false;

      let selectedType = returnSelectedWBtype();
      console.log(selectedType);
      dataList[selectedType].drawHist(drawHistDurationNomal, 'new');

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
          if (checkIsTravelManual()) {
            if (!isInfoObject) {
              if (!locationObj.isMoveCamera) {
                if (intersects.length > 0) {
                  if (intersects[0].point !== null) {
                    if (intersects[0].object.name === "land") {

                      infoBordObj.countryNameOnLand = intersects[0].object.userData.country;
                      tooltip[0].innerText = infoBordObj.countryNameOnLand;
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
            locationObj.deletePin();
            infoBordObj.displayInfo(infoBordObj.countryNameOnLand);
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


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
    // travel ranking country
    */
    travelWellbeing = function (index = 0) {
      stopTravel();  // clear previous travel
      let i = index;
      travelSetInterval = setInterval(function () {
        if (i > 0) {
          locationObj.pinList[i - 1].children[0].material.color.setHex(0xC9C7B7);
          locationObj.pinList[i - 1].children[1].material.color.setHex(0xC9C7B7);
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
            setSelectedDataTypeButton(nextIndex);
            dataList[type].drawHist(drawHistDurationNomal, 'new');

            infoBordObj.fadeInfoBoardVisual();
            infoBordObj.fadeInfoBoardText();

            locationObj.deletePin();
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
          if (numPinList === locationObj.pinList.length) {
            isClear = true;
          }
          let pins = locationObj.pinList[locationObj.pinList.length - 1].children;
          pins[0].material.color.setHex(0xC9C7B7);
          pins[1].material.color.setHex(0xC9C7B7);
          numPinList = locationObj.pinList.length;
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
          for (let i = 0, l = locationObj.pinList.length; l > i; i++) {
            let pins = locationObj.pinList[i].children;
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // helper
    // axesHelper = new THREE.AxesHelper(5.0);
    // scene.add(axesHelper);


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

    let selectorSearchID = ['#country', '#country2', '#country3', '#country4'];
    for (let i = 0, l = selectorSearchID.length; i < l; i++) {
      let selectorSearch = $(selectorSearchID[i]);
      selectorSearch.autocomplete({
        source: searchArray,
        autoFocus: false, //defo:false
        delay: 300,
        minLength: 1
      });

      selectorSearch.on("autocompleteclose", function () {
        infoBordObj.countryNameOnLand = $(selectorSearchID[i])[0].innerHTML;
        locationObj.deletePin();

        infoBordObj.displayInfo(infoBordObj.countryNameOnLand);
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
    // stats.update();
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
    // stats.update();
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

