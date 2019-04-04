import {Dataset} from './Dataset';
import {Location} from './Location';
import {InfoBord} from './InfoBord';
import {HistCanvas} from './HistCanvas';
import {Hist} from './Hist';
import {Menu} from './Menu';
import {Howl, Howler} from 'howler';

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
  const latLength = Object.keys(latlon).length;
  let meshList;
  let wbButton;
  let searchArray;
  let travelModeSwitch;
  let isTouchInfoObject = false;
  let isSPBtnDisplay = true;
  let infoObject;


  /* ranking histogram */
  let travelIndex = 0;

  /* interactive land function */
  let dragFlag = false;
  let isLand = false;
  let isInfoObject = false;
  let isSearching = false;
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


  /* function */
  let travelWellbeing;
  let travelPantheon;
  let travelSetInterval;
  let stopTravel;


  let returnSelectedWBtype;
  let setSelectedDataTypeButton;
  let setSelectedTravelModeButton;
  let killTweenTextAnimation;


  let drawHistDurationNomal = 1000;
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
    if (userAgent.indexOf('iPad') > 0 || userAgent.indexOf('iPhone') > 0 || userAgent.indexOf('Android') > 0 && userAgent.indexOf('Mobile') > 0) {
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
    camera.position.z = initCameraPosition.z;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.name = 'controls';  // name for Location class
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

    let soundBGM = new Howl({
      src: ['sound/bgm.mp3'],
      loop: true,
      volume: 0.2,
    });

    let soundMouseOver = new Howl({
      src: ['sound/mouse_over.mp3'],
      loop: false,
      volume: 0.7,
    });

    let soundMoveCamera = new Howl({
      src: ['sound/move_camera.mp3'],
      loop: false,
      volume: 0.7,
    });


    const datasetdObj = new Dataset(wbData, pantheon, timeline);
    const locationObj = new Location(latlon, earth, controls, camera, soundMoveCamera);
    const infoBordObj = new InfoBord(datasetdObj, locationObj);
    const histCanvas = new HistCanvas(soundMouseOver);


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

        let mode = e.target.id.slice(0, 6);
        document.getElementById("travelModeSwitch-checkbox").checked = mode === 'manual';
      })
    }


    //////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////
    /* switch travel type button */
    let stopMove = document.getElementById('stopMove');
    stopMove.addEventListener('click', clickStopMoveBtn, false);

    function clickStopMoveBtn() {
      if (isMoveStop) {
        stopMove.style.backgroundColor = '#647d7d';
        stopMove.innerText = 'Play';
        stopTravel();
      } else {
        // Pantheon のclick状態を解除しておく
        dataList['pantheonData'].isOnClickHist = false;

        stopMove.style.backgroundColor = '#111111';
        stopMove.innerText = 'Stop';
        travelPantheon(travelIndex);
      }
      isMoveStop = !isMoveStop;
    }


    travelModeSwitch = document.getElementById('travelModeSwitch-label');
    travelModeSwitch.addEventListener('click', () => {
      changeTravelMode();
    });

    // Auto Modeでは常にPantheon Mode
    function changeTravelMode() {
      setSelectedTravelModeButton();
      infoBordObj.fadeInfoBoardVisual();
      infoBordObj.fadeInfoBoardText();

      TweenMax.killAll();
      locationObj.deletePin();
      clearSmallText();

      // この処理終了後に、checkedの値が変わるため、変更前の値に基づいて分岐
      if (checkIsTravelManual()) {
        // -> AutoModeになったとき
        onPantheon();
        isMoveStop = true;
        controls.enableRotate = false;
        travelPantheon();
        stopMove.innerText = 'Stop';
        stopMove.setAttribute('style', 'opacity:1.0;');
      } else {
        // -> ManualModeになったとき
        offPantheon();
        isMoveStop = false;
        controls.enableRotate = true;
        stopMove.setAttribute('style', 'opacity:0.0;');
      }
    }

    function clearSmallText() {
      document.getElementById("Ladder2s").innerHTML = '';
      document.getElementById("Positive2s").innerHTML = '';
      document.getElementById("Negative2s").innerHTML = '';
      document.getElementById("GDP2s").innerHTML = '';
    }
    //////////////////////////////////////////////////////////////////////////



    //////////////////////////////////////////////////////////////////////////
    /* start button */
    let startButton = document.getElementsByClassName('startButton');
    for (let i = 0, l = startButton.length; l > i; i++) {
      startButton[i].addEventListener('click', function(){

        soundBGM.play();


        let isSoundOn = this.id === 'soundOn';
        Howler.mute(!isSoundOn);
        document.addEventListener('dblclick', () => {
          isSoundOn = !isSoundOn;
          Howler.mute(!isSoundOn);
        });


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
      })
    }


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


    let main = document.getElementById("histogram");
    let zoom = document.getElementById("zoomCanvas");
    let zoomCtx = zoom.getContext("2d");


    const zoomSize = 50;
    main.addEventListener("mousemove", function (e) {
      // console.log(main, e)
      // console.log(e.clientX - zoomSize / 2, e.clientY - zoomSize / 2, zoomSize, zoomSize);

      zoomCtx.fillStyle = "rgb(0, 0, 0)";
      zoomCtx.fillRect(0, 0, zoom.width, zoom.height);

      let clientRect = this.getBoundingClientRect() ;
      let positionX = clientRect.left + window.pageXOffset ;
      let positionY = clientRect.top + window.pageYOffset ;

      let X = e.clientX - positionX;
      let Y = e.clientY - positionY;

      zoomCtx.drawImage(main, X-zoomSize/2, Y-zoomSize/2, zoomSize, zoomSize, 0, 0, zoom.width, zoom.height);      // zoomCtx.drawImage(main, 150, 175, zoomSize, zoomSize, 0, 0, zoom.width, zoom.height);

      // chromaKey();

      zoom.style.left = e.pageX - zoom.width / 2 + "px";
      zoom.style.top = e.pageY - zoom.height / 2 + "px";
      zoom.style.display = "block";
    });

    main.addEventListener("mouseout", function () {
      zoom.style.display = "none";
    });


    // クロマキー処理
    function chromaKey() {
        let imageData = zoomCtx.getImageData(0, 0, zoom.width, zoom.height);
        let data = imageData.data;
        for (let i = 0, l = data.length; i < l; i += 4) {
            if (data[i] === 255) {
                data[i + 3] = 0;
            }
        }
        let newImageData = new ImageData(new Uint8ClampedArray(data), zoom.width, zoom.height);
        zoomCtx.putImageData(newImageData, 0, 0);
    }





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
        let histWidth = $('#histogram').width();
        if (dataList['ladderData'].canvas.previousWidth !== histWidth) {
          // dataListのうち、1つだけ更新すればOK！？
          dataList['ladderData'].canvas.width = histWidth;


          if (infoBordObj.isPantheon){
            dataList['pantheonData'].drawHist(drawHistDurationRedraw, 'redraw');
          }else{
            let selectedType = returnSelectedWBtype();
            console.log(selectedType);
            dataList[selectedType].drawHist(drawHistDurationRedraw, 'redraw');
          }
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

      }, false);
    }

    function onPantheon() {
      infoBordObj.isPantheon = true;
      $('#infoBoard3').css("display", 'block');
      $(".infoType").removeClass("selectedBtn");
      infoBordObj.infoBtn[2].classList.add("selectedBtn");
      infoBordObj.setInfoTypePantheon();

      TweenMax.killAll();
      locationObj.deletePin();
      dataList['pantheonData'].drawHist(drawHistDurationNomal, 'travel');

      $('#wbButton2').css("display", 'none');
    }

    function offPantheon() {
      stopTravel();

      infoBordObj.isPantheon = false;
      $('#infoBoard3').css("display", 'none');
      $(".infoType").removeClass("selectedBtn");
      infoBordObj.infoBtn[2].classList.add("selectedBtn");
      infoBordObj.setInfoTypeLinechart();

      TweenMax.killAll();
      locationObj.deletePin();

      let selectedType = returnSelectedWBtype();
      console.log(selectedType);
      dataList[selectedType].drawHist(drawHistDurationNomal, 'travel');

      $('#wbButton2').css("display", 'block');

    }


    /*
    // interactive land object function
    */
    let tooltip = $('#tooltip');
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


    stopTravel = function () {
      console.log('stopTravel');
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
        let data = dataList['pantheonData'];

        if (!data.isOnClickHist) {
          if (i > 0) {
            if (numPinList === locationObj.pinList.length) {
              isClear = true;
            }
            let pins = locationObj.pinList[locationObj.pinList.length - 1].children;
            pins[0].material.color.setHex(0xC9C7B7);
            pins[1].material.color.setHex(0xC9C7B7);
            numPinList = locationObj.pinList.length;
          }
          let countryName = data.scoreData[i].country;
          data.highlightBar(countryName);
          infoBordObj.displayInfo(countryName);
          i++;

          if (isClear) {
            for (let i = 0, l = locationObj.pinList.length; l > i; i++) {
              let pins = locationObj.pinList[i].children;
              pins[0].material.color.setHex(0xC9C7B7);
              pins[1].material.color.setHex(0xC9C7B7);
            }
          }
          travelIndex = i;  // val for continue


          if (i <= pantheon.length) {
            travelSetInterval = setTimeout(travel, 6185);  // 1200(=20m) / 194(Num of Pantheon data)
          }
        } else {
          if (travelIndex !== 0) {
            TweenMax.killAll();
            infoBordObj.positiveTween.cancel();
            infoBordObj.negativeTween.cancel();
            infoBordObj.gdpTween.cancel();
            clearInterval(travelSetInterval);
          }

          // stop buttonを'STOP'状態にする
          isMoveStop = false;
          data.isOnClickHist = false;
        }
      }

      travelSetInterval = setTimeout(travel, 2000);  // 1800(=30m) / 194(Num of Pantheon data)
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

