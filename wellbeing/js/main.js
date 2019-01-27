(() => {

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
  let GDPArray = [];
  let LadderArray = [];
  let PositiveArray = [];
  let NegativeArray = [];
  let GDPScoreArray = [];
  let LadderScoreArray = [];
  let PositiveScoreArray = [];
  let NegativeScoreArray = [];

  const wbLength = Object.keys(wbData).length;
  let meshList;
  let ladderMax, ladderMin;
  let positiveMax, positiveMin;
  let negativeMax, negativeMin;
  let gdpMax, gdpMin;
  let t1, t2, t3, t4;
  let s1, s2, s3, s4;
  let wbButton;
  let wbButton1;
  let wbButton2;
  let svgRadius;
  let searchArray;
  let travelModeSwitch;
  let isTravelAuto = false;
  let infoTypeText = true;
  let infoBtn;

  const widthWidePC = 1000;
  const widthMediumPC = 800;
  const widthTablet = 680;
  const widthSP = 500;



  /* marker pin */
  let pinList;
  let pinRadius;
  let pinSphereRadius;
  let pinHeight;
  let pinMaterial;
  let pinConeGeometry;
  let pinSphereGeometry;


  /* ranking histogram */
  let histCanvas;
  let canvasContext;
  let histData;
  let histScoreData;
  let scoreMax;
  let barWidth;
  let isHistDisplay = false;
  let mouseOnCountry;
  let travelIndex = 0;
  let highlightSelectedBarList;

  const barColor = "rgb(200, 225, 225)";
  const heightBarColor = "rgb(245, 70, 240)";


  /* interactive land function */
  let countryName = 0;
  let isClicked = false;
  let dragFlag = false;
  let isLand = false;
  let isInfoObject = false;
  let isFillHist = false;
  let infoObject;
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


  /* function */
  let drawHist;
  let drawHistDurationNomal = 2500;
  let drawHistDurationRedraw = 0;
  let redrawHighlightSelectedBar;
  let clickBtn;
  let travelRanking;
  let travelSetInterval;
  let stopTravelRanking;
  let drawSetInterval;
  let deletePin;



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
              $("#modalContentWrapper"  + id.toString() + ", #modalOverlay").fadeOut(400, function () {
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
        infoTypeText = e.target.id.slice(4,) === 'Text';


        let infoBoard1 = $('#infoBoard');
        if (infoTypeText){
           infoBoard1.css("top", -1000);
           $('.infoBoardContent2').css("margin-left", 5);
        }else{
          infoBoard1.css("top", 0);
          $('.infoBoardContent2').css("margin-left", -1000);
        }
      })
    }


    /* switch travel type button */
    travelModeSwitch = document.getElementById('travelModeSwitch-label');
    travelModeSwitch.addEventListener('click', () => {
      isTravelAuto = !isTravelAuto;
      highlightSelectedBarList = [];  // reset

      let selectedType = $('#wbButton2').find('.selectedBtn').attr("id").slice(0,-1);
      console.log(selectedType);
      canvasContext.globalAlpha = 0.5;
      let res = drawHist(selectedType, drawHistDurationNomal, 'new');
      barWidth = res.width;
      histData = res.histData;
      scoreMax = res.scoreMax;
      histScoreData = res.scoreData;

      $('#country2').css({opacity: 0.0});
      $('.infoBoardContent2').css({opacity: 0.0});
      TweenMax.killAll();
      deletePin();
      stopTravelRanking();

      if (isTravelAuto){
        isMoveStop = true;
        controls.enableRotate = false;
        travelRanking();
        stopMove.innerText = 'Stop';
        stopMove.setAttribute('style', 'opacity:1.0;');
      }else{
        isMoveStop = false;
        controls.enableRotate = true;
        stopMove.setAttribute('style', 'opacity:0.0;');
      }
    });

    let stopMove = document.getElementById('stopMove');
    stopMove.addEventListener('click', () => {
      if (isMoveStop){
        stopMove.innerText = 'Play';
        stopTravelRanking();
      }else{
        stopMove.innerText = 'Stop';
        travelRanking(travelIndex);
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

          // $(".wbButton").removeClass("hiddenBtn").addClass("normalBtn");
          let wbButton1 = document.getElementsByClassName('wbButton1');
          let wbButton2 = document.getElementsByClassName('wbButton2');
          setTimeout(() => {
            wbButton1[0].classList.add("selectedBtn");
            wbButton2[0].classList.add("selectedBtn");
            infoBtn[0].classList.add("selectedBtn");

          }, 400);
          setTimeout(() => {
            // landBase.material.opacity = 1.0;
            clickBtn('ladderBtn');
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
        if (canvasWidth < widthWidePC) {
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
        if (canvasWidth < widthSP) {
          histCanvasWidth = 320;
        } else if (canvasWidth >= widthSP && canvasWidth < widthTablet) {
          histCanvasWidth = widthSP;
        } else if (canvasWidth >= widthTablet && canvasWidth < widthMediumPC) {
          histCanvasWidth = widthTablet;
        } else if (canvasWidth >= widthMediumPC && canvasWidth < widthWidePC) {
          histCanvasWidth = widthMediumPC;
        } else {
          histCanvasWidth = 900;
        }

        if (histCanvas.width !== histCanvasWidth) {
          histCanvas.width = histCanvasWidth;
          let selectedType = $('#wbButton2').find('.selectedBtn').attr("id").slice(0,-1);
          canvasContext.globalAlpha = 0.5;
          let res = drawHist(selectedType, drawHistDurationRedraw, 'redraw');

          barWidth = res.width;
          histData = res.histData;
          scoreMax = res.scoreMax;
          histScoreData = res.scoreData;
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
      console.log(length);
      dragFlag = length > 100;

      if (dragFlag) {
        if (isFinishStartTween) {
          if (!isTravelAuto) {
            if (!isMoveCamera){
              $('#country2').css({opacity: 0.0});
              $('.infoBoardContent2').css({opacity: 0.0});
              TweenMax.killAll();
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
          if (!isMoveCamera){
            $('#country2').css({opacity: 0.0});
            $('.infoBoardContent2').css({opacity: 0.0});
            TweenMax.killAll();
            deletePin();
          }
        }
      }
    }, false);


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



    /*
    // setting well-being data
    */
    for (let i = 0; wbLength > i; i++) {
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


    sortDesc(LadderArray, 'country');
    sortDesc(PositiveArray, 'country');
    sortDesc(NegativeArray, 'country');
    sortDesc(GDPArray, 'country');

    sortDesc(LadderScoreArray, 'rank');
    sortDesc(PositiveScoreArray, 'rank');
    sortDesc(NegativeScoreArray, 'rank');
    sortDesc(GDPScoreArray, 'rank');

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


    /* calc MaxMin */
    ladderMax = Math.max(LadderScoreArray[0].score);
    ladderMin = Math.min(LadderScoreArray[wbLength - 1].score);
    positiveMax = Math.max(PositiveScoreArray[0].score);
    positiveMin = Math.min(PositiveScoreArray[wbLength - 1].score);
    negativeMax = Math.max(NegativeScoreArray[0].score);
    negativeMin = Math.min(NegativeScoreArray[wbLength - 1].score);
    gdpMax = Math.max(GDPScoreArray[0].score);
    gdpMin = Math.min(GDPScoreArray[wbLength - 1].score);


    /* make well-being button in order to show score */
    wbButton = document.getElementsByClassName('wbButton');
    wbButton1 = document.getElementsByClassName('wbButton1');
    wbButton2 = document.getElementsByClassName('wbButton2');

    for (let i = 0, wbLen = wbButton.length; i < wbLen; i++) {
      wbButton[i].addEventListener('click', (e) => {
        let type = e.target.id.slice(0,-1);
        clickBtn(type);
        let index;
        if (type === 'ladderBtn') {
          index = 0;
        } else if (type === 'positiveBtn') {
          index = 1;
        } else if (type === 'negativeBtn') {
          index = 2;
        } else {
          index = 3;
        }

        $(".wbButton").removeClass("selectedBtn");
        wbButton1[index].classList.add("selectedBtn");
        wbButton2[index].classList.add("selectedBtn");

        /* delete infoBoard2 */
        TweenMax.killAll();
        $('#country2').css({opacity: 0.0});
        $('.infoBoardContent2').css({opacity: 0.0});
        deletePin();

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
          travelRanking();
        }
      }, false);
    }

    clickBtn = function (type) {
       highlightSelectedBarList = [];  // reset
      let res = drawHist(type, drawHistDurationNomal, 'new');
      // console.log(res);
      barWidth = res.width;
      histData = res.histData;
      scoreMax = res.scoreMax;
      histScoreData = res.scoreData;
    };



    /*
    // score ranking board
    */
    /* setting infoBoard circle size */
    if (canvasWidth < widthWidePC) {
      svgRadius = 40;
    } else {
      svgRadius = 48;
    }


    /* infoBoard text */
    function createRankText(type) {
      let px;
      if (canvasWidth < widthWidePC) {
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
      if (canvasWidth < widthWidePC) {
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
    let displayTween;
    function displayRanking(type, rank, num, duration, rankText, score, scoreText) {
      let id = '#' + type + 'Ranking';
      let svg = $(id).children().children()[2];
      let radius = (num - rank + 1) / num * svgRadius; // responsive
      let rankOrdinal;
      let scoreUnit = type === 'GDP' ? 'US$' : 'pt';
      rankOrdinal = putRankOrdinal(rank);

      displayTween = TweenMax.fromTo(svg, duration,
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

    function putRankOrdinal(rank){
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

      $('#country2').css({opacity: 0.0});
      $('.infoBoardContent2').css({opacity: 0.0});

      setTimeout(() => {
        TweenMax.to("#country2", 1.0, {
          opacity: 1.0,
          onComplete: function () {
            TweenMax.to(".infoBoardContent2", 1.0, {
              opacity: 1.0,
            });
          }
        })
      }, 1000);

      document.getElementById("country2").innerHTML = countryName;
      document.getElementById("Ladder2").innerHTML = 'L : ' + lRank + putRankOrdinal(lRank);
      document.getElementById("Positive2").innerHTML = 'P : ' + pRank + putRankOrdinal(pRank);
      document.getElementById("Negative2").innerHTML = 'N : ' + nRank + putRankOrdinal(nRank);
      document.getElementById("GDP2").innerHTML = 'G : ' + gRank + putRankOrdinal(gRank);
    }



    /*
    // interactive land object function
    */
    let tooltip = $('#tooltip');
    let infoBoard = $('#infoBoard');
    let body = $('body');

    window.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('click', onDocumentMouseClick, false);


    /* mouse over land */
    function onDocumentMouseMove(event) {
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

        if (isFinishStartTween){
          if (!isTravelAuto){
            if (!isInfoObject) {
              if (!isMoveCamera){
                if (intersects.length > 0) {
                  if (intersects[0].point !== null) {
                    if (intersects[0].object.name === "land") {

                      countryName = intersects[0].object.userData.country;
                      tooltip[0].innerText = countryName;
                      tooltip.css({opacity: 1.0});
                      isLand = true;
                      body.css('cursor', 'pointer');

                      let res = calcWbInfo(countryName);
                      if (typeof res !== 'undefined') {
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
    }


    /* click land */
    function onDocumentMouseClick() {
      if (isFinishStartTween){
        if (!dragFlag) {
          if (isLand) {
            if (!isFirstClick) {
              TweenMax.killAll();
              positive.cancel();
              negative.cancel();
              gdp.cancel();
            }

            clearInfo();
            let res = calcWbInfo(countryName);
            infoBoard.css({opacity: 0.8});
            deletePin();
            tooltip.css({opacity: 0.0});

            if (typeof res !== 'undefined') {
              $('#country').empty().append(countryName);
              displayVisualInfo(res, wbLength);
              displayTextInfo(countryName, res);  // テキストでの結果表示

              let location = countrynameToLatlon(countryName);
              latitude = location.latitude;
              longitude = location.longitude;
              moveCamera(latitude, longitude);

            } else {
              /* visual info */
              $('#country').empty().append(countryName);
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

              /* text info */
              $('#country2').css({opacity: 0.0});
              $('.infoBoardContent2').css({opacity: 0.0});
              setTimeout(() => {
                TweenMax.to("#country2", 1.0, {
                  opacity: 1.0,
                  onComplete: function () {
                    console.log('tween');
                    TweenMax.to(".infoBoardContent2", 1.0, {
                      opacity: 1.0,
                    });
                  }
                })
              }, 1000);

              document.getElementById("country2").innerHTML = countryName;
              document.getElementById("Ladder2").innerHTML = 'No data';
              document.getElementById("Positive2").innerHTML = '';
              document.getElementById("Negative2").innerHTML = '';
              document.getElementById("GDP2").innerHTML = '';
            }
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

      for (let i = 0; wbLength > i; i++) {
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
    }

    function onInfoObject() {
      isInfoObject = true;
    }

    function outInfoObject() {
      isInfoObject = false;
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
    if (canvasWidth < widthSP) {
      histCanvas.width = 320;
    } else if (canvasWidth >= widthSP && canvasWidth < widthTablet) {
      histCanvas.width = widthSP;
    } else if (canvasWidth >= widthTablet && canvasWidth < widthMediumPC) {
      histCanvas.width = widthTablet;
    } else if (canvasWidth >= widthMediumPC && canvasWidth < widthWidePC) {
      histCanvas.width = widthMediumPC;
    } else {
      histCanvas.width = 900;
    }
    histCanvas.height = 90;
    canvasContext = histCanvas.getContext("2d");
    canvasContext.globalAlpha = 0.5;  // for safari(fillStyle alpha doesn't work)

    drawHist = function (type, duration, drawType) {
      clearInterval(drawSetInterval);
      let data;
      let scoreMax;
      let scoreData;
      if (type === 'ladderBtn') {
        data = LadderArray;
        scoreMax = ladderMax;
        scoreData = LadderScoreArray;
      } else if (type === 'positiveBtn') {
        data = PositiveArray;
        scoreMax = positiveMax;
        scoreData = PositiveScoreArray;
      } else if (type === 'negativeBtn') {
        data = NegativeArray;
        scoreMax = negativeMin;
        scoreData = NegativeScoreArray;
      } else {
        data = GDPArray;
        scoreMax = gdpMax;
        scoreData = GDPScoreArray;
      }

      canvasContext.clearRect(0, 0, histCanvas.width, histCanvas.height);
      let numData = data.length;
      let width = histCanvas.width / numData;

      // draw histogram with loop rect
      let i = 0;
      // console.log(numData, data);
      drawSetInterval = setInterval(function () {
        canvasContext.fillStyle = barColor;
        let h = (data[i].score) / scoreMax * histCanvas.height;
        canvasContext.fillRect(width * i, histCanvas.height - h, width, h);
        i++;

        if (i > numData - 1) {
          clearInterval(drawSetInterval);

          // 再描画時の関数
          if (drawType === 'redraw'){
            redrawHighlightSelectedBar(highlightSelectedBarList, histData, scoreMax);
          }
        }
      }, duration / numData);

      isHistDisplay = true;
      return {width: width, histData: data, scoreMax: scoreMax, scoreData: scoreData};
    };


    /* mouse event histogram */
    let tooltipHist = $('#tooltipHist');
    histCanvas.addEventListener('mousemove', onHistRanking, false);
    histCanvas.addEventListener('mouseout', outHistRanking, false);
    histCanvas.addEventListener('click', clickHistRanking, false);

    function onHistRanking(event) {
      // console.log('onHist', isFillHist);
      if (isHistDisplay) {
        if (isFillHist) {
          let rect = event.target.getBoundingClientRect();
          let mouseX = Math.abs(event.clientX - rect.left);
          let index = Math.floor(mouseX / barWidth);
          let data = histData;
          // console.log(data[index].country, data[index].rank);

          document.getElementById("canvasWrapper").classList.add("canvasWrapperPointer");
          mouseOnCountry = data[index]['country'];
          tooltipHist[0].innerText = mouseOnCountry;
          tooltipHist.css({opacity: 1.0});

          tooltipHist.css({top: event.clientY * 0.95});
          tooltipHist.css({left: event.clientX * 1.0 - tooltipHist.width() / 2 - 5});
        } else {
          document.getElementById("canvasWrapper").classList.remove("canvasWrapperPointer");
          tooltipHist.css({opacity: 0.0});
          tooltipHist.css({top: 0});
          tooltipHist.css({left: 0});
        }
      }
    }

    function outHistRanking() {
      tooltipHist.css({opacity: 0.0});
    }

    function clickHistRanking() {
      console.log(isFillHist);
      if (!isTravelAuto){
        if (isFillHist) {
          if (!isMoveCamera){
            console.log('click', mouseOnCountry);

            // after setting mouseOnCountry, this function can be used
            if (typeof mouseOnCountry !== 'undefined') {
              let res = countrynameToLatlon(mouseOnCountry);
              latitude = res.latitude;
              longitude = res.longitude;

              deletePin();
              moveCamera(latitude, longitude);
              clickHistRankingDisplayScore(mouseOnCountry);
            }
            //tooltipHist.css({opacity: 0.0});
          }
        }
      }
    }


    /* show info */
    function clickHistRankingDisplayScore(countryName) {
      if (!isFirstClick) {
        TweenMax.killAll();
        positive.cancel();
        negative.cancel();
        gdp.cancel();
      }
      clearInfo();
      let res = calcWbInfo(countryName);
      infoBoard.css({opacity: 0.8});

      $('#country').empty().append(countryName);
      displayVisualInfo(res, wbLength);
      displayTextInfo(countryName, res);  // テキストでの結果表示
    }


    /* highlight selected country */
    highlightSelectedBarList = [];
    function highlightSelectedBar(countryName, data, scoreMax) {
      let h;
      let index;
      for (let i = 0; wbLength > i; i++) {
        if (data[i].country === countryName) {
          index = i;
          highlightSelectedBarList.push(i)
        }
      }
      // highlight color
      canvasContext.fillStyle = heightBarColor;
      h = (data[index].score) / scoreMax * histCanvas.height;
      canvasContext.fillRect(barWidth * index, histCanvas.height - h, barWidth, h);
    }

    redrawHighlightSelectedBar = function(indexList, data, scoreMax) {
      let h;
      for (let i = 0; indexList.length > i; i++) {
        console.log('redrawHighlightSelectedBar', i);
        // highlight color
        canvasContext.fillStyle = heightBarColor;
        h = (data[indexList[i]].score) / scoreMax * histCanvas.height;
        canvasContext.fillRect(barWidth * indexList[i], histCanvas.height - h, barWidth, h);
      }
    };



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
          if (!isTravelAuto){
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
    travelRanking = function (index = 0) {
      stopTravelRanking();  // clear previous travel
      let i = index;
      travelSetInterval = setInterval(function () {
        if (i > 0) {
          pinList[i - 1].children[0].material.color.setHex(0xC9C7B7);
          pinList[i - 1].children[1].material.color.setHex(0xC9C7B7);
        }

        let countryName = histScoreData[i].country;
        highlightSelectedBar(countryName, histData, scoreMax);
        let res = countrynameToLatlon(countryName);
        latitude = res.latitude;
        longitude = res.longitude;
        moveCamera(latitude, longitude);
        // createPoint(latitude, longitude);
        clickHistRankingDisplayScore(countryName);
        i++;
        travelIndex = i;  // val for continue
        if (i > wbLength - 1) {
          clearInterval(travelSetInterval);
        }

      }, 3500);
    };


    stopTravelRanking = function () {
      clearInterval(travelSetInterval);
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
    serch country name
    */
    searchArray = [];
    for (let i = 0; i < wbLength; i++) {
      searchArray.push(latlon[i].country);
    }
    searchArray = searchArray.sort();

    let selectorSearch = $("#country");
    selectorSearch.autocomplete({
      source: searchArray,
      autoFocus: false, //defo:false
      delay: 300,
      minLength: 1
    });

    selectorSearch.on("autocompleteclose", function () {
      let inputCountry = document.getElementById('country').textContent;
      console.log(inputCountry);

      let res = countrynameToLatlon(inputCountry);
      console.log(res.latitude);

      if (typeof res.latitude !== 'undefined') {
        moveCamera(res.latitude, res.longitude);
        clickHistRankingDisplayScore(inputCountry);
      }
    });

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

