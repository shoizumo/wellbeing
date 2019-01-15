(() => {

  ///////////////////////
  /* Declare variables */
  ///////////////////////

  // global val
  let canvasWidth = null;
  let canvasHeight = null;
  let targetDOM = null;
  let devicePixelRatio = 1;
  // let devicePixelRatio = window.devicePixelRatio;

  // three objects
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
  let landBase;
  let radius = 0.994;
  let axesHelper;

  // texture
  let earthMap;
  let earthMapLoader;

  // constant variables
  const RENDERER_PARAM = {
    clearColor: 0x000000
  };

  // val for shader
  const clock = new THREE.Clock();
  let time = 0.0;
  let mouse;

  // val for well-being data
  let GDPArray = [];
  let LadderArray = [];
  let PositiveArray = [];
  let NegativeArray = [];

  const wbLength = Object.keys(wbData).length;
  let meshList;
  let ladderMax, ladderMin;
  let positiveMax, positiveMin;
  let negativeMax, negativeMin;
  let gdpMax, gdpMin;
  let t1, t2, t3, t4;
  let s1, s2, s3, s4;
  let wbButton;
  let svgRadius;
  let searchArray;

  // val for ranking histgram
  let histCanvas;
  let histData;
  let scoreMax;
  let barWidth;
  let isHistDisplay = false;
  let mouseonCountry;

  const barColor = "rgb(200, 225, 225)";
  const heightBarColor = "rgb(245, 70, 240)";

  // val for interactive land function
  let countryName = 0;
  let isClicked = false;
  let dragFlag = false;
  let isLand = false;
  let isInfoObject = false;
  let isFillHist = false;
  let infoObject1;
  let infoObject2;
  let isFirstClick = true;
  let latitude;
  let longitude;
  let landBaseOpacity = 0.0;

  // val for scroll
  let pageIndex = 1.0;
  const interactivePageIndex = 5;
  let initEarthPosition = new THREE.Vector3(0.0, -1.1, 1.0);
  let initCameraPosition = new THREE.Vector3(0.0, 0.0, 2.0);
  let center = new THREE.Vector3(0, 0, 0);

  // val for rendering
  let frame = 0;
  let speed = 3.141592 * 2 / 90 / 60 / 60;  // 1round/90m
  let postprocessing = {};

  // temp val
  let stats;

  // function
  let drawHist;
  let clickBtn;
  let travelRanking;
  let travelSetInterval;
  let drawSetInterval;


  /////////////////
  /* Entry point */
  /////////////////
  window.addEventListener('load', () => {
    /*
    // scroll function
    */
    $('.main').onepage_scroll({
      sectionContainer: 'section',
      responsiveFallback: false, //600,
      easing: 'ease',
      pagination: true,
      //updateURL: true,
      animationTime: 500,
      loop: false,
      keyboard: false,
      direction: 'vertical', //'horizontal'

      afterMove: function (pageId) {
        typing(pageId);
        pageIndex = pageId;

        /* show well-being button */
        $(".wbButton").removeClass("selectedBtn")
            .removeClass("normalBtn")
            .addClass("hiddenBtn");

        /* disable scroll function */
        if (pageId === interactivePageIndex) {
          $('.main').addClass("disabled-onepage-scroll");
          let duration = 2.0;
          let ease = Back.easeOut.config(1);

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
              controls.enableZoom = true;
              preventScroll();
              document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false});

              $(".wbButton").removeClass("hiddenBtn").addClass("normalBtn");
              let wbButton = document.getElementsByClassName('wbButton');
              setTimeout(() => {
                wbButton[0].classList.add("selectedBtn");
              }, 400);
              setTimeout(() => {
                // landBase.material.opacity = 1.0;
                clickBtn('ladderBtn', 0.0);
              }, 500);
            }
          });
        }
        else {
          controls.enableZoom = false;
          enableScroll();
        }
      },
    });

    function preventScroll(){
      // for PC
      let scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
      $(document).on(scroll_event,function(e){e.preventDefault();});
      // for SP
      $(document).on('touchmove.noScroll', function(e) {e.preventDefault();});
    }
    function enableScroll(){
      // for PC
      let scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
      $(document).off(scroll_event);
      // for SP
      $(document).off('.noScroll');
    }
    // function enableScrollSearch(){
    //   // for PC
    //   let scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    //   $('.ui-autocomplete').off(scroll_event);
    //   // for SP
    //   $('.ui-autocomplete').off('.noScroll');
    // }
    // enableScrollSearch();


    /* typing effect function */
    function typing(pageNo) {
      $('.fadein > span').css('opacity', '0');  // reset opacity(0.0) for displaying again
      let str = [];
      let pageClass = '.page' + pageNo;
      $(pageClass + ' > .fadein > span').each(function (i) {
        $(this).css('opacity', '1');
        str[i] = $(this).text();  // copy original text
        $(this).text('');  // delete text
        let no = i;
        let self = this;
        let interval = setInterval(function () {
          if (no === 0 || Number($(pageClass + ' > .fadein > span').eq(no - 1).children('span:last').css('opacity')) === 1) {  // 最初の要素または前の要素が全文字表示された時
            clearInterval(interval);
            for (let j = 0; j < str[no].length; j++) {
              $(self).append('<span>' + str[no].substr(j, 1) + '</span>');
              $(self).children('span:last').delay(50 * j).animate({opacity: '1'}, 300);
            }
          }
        }, 50);
      });
    }

    typing(1);


    /*
    // initial setting
    */
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    targetDOM = document.getElementById('webgl');

    /* window size setting */
    window.addEventListener('resize', () => {
      renderer.setPixelRatio(devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;

      if (pageIndex === interactivePageIndex) {
        if (canvasWidth < 900) {
          svgRadius = 40;
          t1.setAttributeNS(null, "font-size", "22px");
          t2.setAttributeNS(null, "font-size", "22px");
          t3.setAttributeNS(null, "font-size", "22px");
          t4.setAttributeNS(null, "font-size", "22px");
          s1.setAttributeNS(null, "font-size", "12px");
          s2.setAttributeNS(null, "font-size", "12px");
          s3.setAttributeNS(null, "font-size", "12px");
          s4.setAttributeNS(null, "font-size", "12px");

        }else{
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
        if (canvasWidth < 500) {
          histCanvasWidth = 320;
        } else if (canvasWidth >= 500 && canvasWidth < 700) {
          histCanvasWidth = 500;
        } else if (canvasWidth >= 700 && canvasWidth < 900) {
          histCanvasWidth = 700;
        } else {
          histCanvasWidth = 900;
        }

        if (histCanvas.width !== histCanvasWidth) {
          histCanvas.width = histCanvasWidth;
          let selectedType = $('.selectedBtn');
          console.log(selectedType[0].innerHTML);
          let res = drawHist(selectedType, 0);
          barWidth = res.width;
          histData = res.histData;
          scoreMax = res.scoreMax
        }
      }
    }, false);

    /* set mouse position function */
    mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (event) => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    /* detect mouse drag */
    window.addEventListener("mousedown", function () {
      dragFlag = false;
    }, false);
    window.addEventListener("mousemove", function () {
      dragFlag = true;
    }, false);

    /* switch earth type */
    window.addEventListener("keydown", function (event) {
      if (event.keyCode === 37) {  // left
        landBaseOpacity = 0.0;
        landBase.material.opacity = landBaseOpacity;
        earthOutline.scale.set(1.0, 1.0, 1.0);
        for (let i = 0, lm = meshList.length; lm > i; i++) {
          meshList[i].material.opacity = 0.0;
        }
      }
      if (event.keyCode === 39) {  // right
        // landBaseOpacity = 1.0;
        // landBase.material.opacity = landBaseOpacity;
        // earthOutline.scale.set(1.002, 1.002, 1.002);
        // for (let i = 0, lm = meshList.length; lm > i; i++) {
        //   meshList[i].material.opacity = 1.0;
        // }
      }
      if (event.keyCode === 38) {
        console.log(event.keyCode);
        travelRanking()
      }
    }, false);

    // window.addEventListener('dblclick', () => {
    //     isdDblclick = true;
    //     $('.main').removeClass("disabled-onepage-scroll");
    // }, false);

    /* load texture */
    earthMapLoader = new THREE.TextureLoader();
    earthMap = earthMapLoader.load('img/mapNight.jpg', loadShader);

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
      stats.domElement.style.top = '0px';
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
    controls.rotateSpeed = 2.0;
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
        pageIndex: {type: "f", value: pageIndex},
      },
      side: THREE.FrontSide, //DoubleSide,
      //depthWrite: false,
      transparent: true,
      //opacity: 0.5,
      //wireframe: true,
    });
    earth = new THREE.Mesh(geometry, material);

    /* earth for land in order to hide earth map ver. */
    geometry = new THREE.SphereGeometry(radius + 0.002, 60, 60);
    material = new THREE.MeshBasicMaterial({
      transparent: true,
      // depthTest: true,
      depthWrite: true,
      opacity: 0.0,
      //map: sea_texture,
      color: 0x040410,
      // alphaTest: 0.5
    });
    landBase = new THREE.Mesh(geometry, material);

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
    earth.add(landBase);
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
    }


    /* sort rank array */
    LadderArray.sort(function sortRank(a, b) {
      if (a.rank < b.rank) {
        return -1;
      }
      else if (a.rank > b.rank) {
        return 1;
      }
      return 0;
    });

    PositiveArray.sort(function sortRank(a, b) {
      if (a.rank < b.rank) {
        return -1;
      }
      else if (a.rank > b.rank) {
        return 1;
      }
      return 0;
    });

    NegativeArray.sort(function sortRank(a, b) {
      if (a.rank < b.rank) {
        return -1;
      }
      else if (a.rank > b.rank) {
        return 1;
      }
      return 0;
    });

    GDPArray.sort(function sortRank(a, b) {
      if (a.rank < b.rank) {
        return -1;
      }
      else if (a.rank > b.rank) {
        return 1;
      }
      return 0;
    });

    /* calc MaxMin */
    ladderMax = Math.max(LadderArray[0].score);
    ladderMin = Math.min(LadderArray[wbLength - 1].score);
    positiveMax = Math.max(PositiveArray[0].score);
    positiveMin = Math.min(PositiveArray[wbLength - 1].score);
    negativeMax = Math.max(NegativeArray[0].score);
    negativeMin = Math.min(NegativeArray[wbLength - 1].score);
    gdpMax = Math.max(GDPArray[0].score);
    gdpMin = Math.min(GDPArray[wbLength - 1].score);


    /* make well-being button in order to show score */
    wbButton = document.getElementsByClassName('wbButton');
    for (let i = 0, wbLen = wbButton.length; i < wbLen; i++) {
      wbButton[i].addEventListener('click', (e) => {
        let type = e.target.id;
        $(".wbButton").removeClass("selectedBtn");

        wbButton[i].classList.add("selectedBtn");
        clickBtn(type, landBaseOpacity);
      }, false);
    }

    clickBtn = function (type, opacity = 1.0) {
      for (let i = 0, lm = meshList.length; lm > i; i++) {
        meshList[i].material.opacity = opacity;
      }
      if (opacity > 0.0) {
        for (let j = 0; wbLength > j; j++) {
          for (let i = 0, lm = meshList.length; lm > i; i++) {
            let countryName = meshList[i].userData.country;
            if (wbData[j].country === countryName) {
              coloringLand(i, j, type)
            }
          }
        }
      } else {
        earthOutline.scale.set(1.0, 1.0, 1.0);
      }

      let res = drawHist(type);
      // console.log(res);
      barWidth = res.width;
      histData = res.histData;
      scoreMax = res.scoreMax
    };

    /*
    // coloring land object using well-being score
    */
    function coloringLand(i, j, type) {
      let L;
      if (type === 'ladderBtn') {
        L = (wbData[j].ladder - ladderMin) / (ladderMax - ladderMin); //0.0 - 1.0 scale
      } else if (type === 'positiveBtn') {
        L = (wbData[j].positive - positiveMin) / (positiveMax - positiveMin); //0.0 - 1.0 scale
      } else if (type === 'negativeBtn') {
        L = (wbData[j].negative - negativeMin) / (negativeMax - negativeMin); //0.0 - 1.0 scale
        L = 1.0 - L  // reverse scale
      } else {
        L = (wbData[j].logGdp - gdpMin) / (gdpMax - gdpMin); //0.0 - 1.0 scale
      }
      let RGB = hslToRgb(0.5, 1, L);
      //console.log(RGB, RGB[0]);
      meshList[i].material.color.r = RGB[0];
      meshList[i].material.color.g = RGB[1];
      meshList[i].material.color.b = RGB[2];
      meshList[i].material.opacity = 1.0;
      earthOutline.scale.set(1.002, 1.002, 1.002);
    }

    function hslToRgb(h, s, l) {
      let r, g, b;
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        let hue2rgb = function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return [r, g, b];
    }

    /*
    // score ranking board
    */
    if (canvasWidth < 900) {
      svgRadius = 40;
    }else{
      svgRadius = 48;
    }
    function createRankText(type) {
      let px;
      if (canvasWidth < 900) {
          px = "22px";
        }else{
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

    // t1.setAttributeNS(null, "font-size", "25px");
    // console.log(t1);

    function createScoreText(type) {
      let px;
      if (canvasWidth < 900) {
          px = "12px";
        }else{
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
    let tween;

    function displayRanking(type, rank, num, duration, rankText, score, scoreText) {
      let id = '#' + type + 'Ranking';
      let svg = $(id).children().children()[2];
      let radius = (num - rank + 1) / num * svgRadius; // responsive
      let rUnit;
      let sUnit = type === 'GDP' ? 'US$' : 'pt';
      let rankStr = rank.toString();
      rankStr = rankStr.substring(rankStr.length - 1, rankStr.length);
      if (rankStr === '1') {
        rUnit = 'st'
      } else if (rankStr === '2') {
        rUnit = 'nd'
      } else if (rankStr === '3') {
        rUnit = 'rd'
      } else {
        rUnit = 'th'
      }

      tween = TweenMax.fromTo(svg, duration,
          {attr: {r: 0}},
          {
            attr: {r: radius},
            ease: Power1.easeInOut,
            onComplete: function () {
              rankText.innerHTML = String(rank) + "<tspan font-size='12px'>" + rUnit + "</tspan>";
              $(id).children()[0].appendChild(rankText);
              scoreText.textContent = '(' + String(score) + sUnit + ')';
              $(id).children()[0].appendChild(scoreText);

              $('.info' + type).attr('opacity', 1.0);
            }
          }
      );
    }

    /* display in turn rank type */
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

    function doRankingPromise(wbData, wbLength) {
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


    /*
    // interactive land object function
    */
    let tooltip = $('#tooltip');
    let infoBoard = $('#infoBoard');
    let body = $('body');

    // let intersected_object = 0;
    // let hover_scale = 1.0;
    window.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('click', onDocumentMouseClick, false);

    /* mouse over land */
    function onDocumentMouseMove(event) {
      if (pageIndex === interactivePageIndex) {
        // if (intersected_object !== 0) {
        //   intersected_object.scale.set(1.0, 1.0, 1.0);  // 前回のオブジェクトをもとに戻す
        // }
        event.preventDefault();
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        let vector = new THREE.Vector3(mouseX, mouseY, -1);
        vector.unproject(camera);
        let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        let intersects = raycaster.intersectObject(earth, true);
        // set tooltip not display
        tooltip.css({opacity: 0.0});
        // infoBoard.css({opacity: 0.0});
        isLand = false;
        body.css('cursor', 'default');

        if (!isInfoObject) {
          if (intersects.length > 0) {
            if (intersects[0].point !== null) {
              if (intersects[0].object.name === "land") {
                //console.log(intersects[0]);

                countryName = intersects[0].object.userData.country;
                tooltip[0].innerText = countryName;
                tooltip.css({opacity: 1.0});
                // infoBoard.css({opacity: 1.0});
                isLand = true;
                body.css('cursor', 'pointer');

                let res = calcWbInfo(countryName);
                if (typeof res !== 'undefined') {
                  tooltip.css({top: event.clientY * 0.97});
                  tooltip.css({left: event.clientX * 1.03});
                }

                // intersects[0].object.scale.set(hover_scale, hover_scale, hover_scale);
                // intersected_object = intersects[0].object;
              }
            }
          }
        }
      }
    }

    /* detect whether onInfo or not */
    infoObject1 = document.getElementById('infoBoard');
    infoObject2 = document.getElementById('rankingWrapper');
    histCanvas = document.querySelector("#histgram");

    infoObject1.addEventListener('mouseenter', onInfoObject, false);
    infoObject2.addEventListener('mouseenter', onInfoObject, false);

    infoObject1.addEventListener('mouseleave', outInfoObject, false);
    infoObject2.addEventListener('mouseleave', outInfoObject, false);

    histCanvas.addEventListener('mousemove', getCanvasColor, false);


    function onInfoObject() {
      isInfoObject = true;
    }
    function outInfoObject() {
      isInfoObject = false;
    }

    /* get canvas color */
    function getCanvasColor(event){
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
        return { x: curleft, y: curtop };
      }
      return undefined;
    }

    function getEventLocation(element,event){
      let pos = getElementPosition(element);
      return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
      };
    }


    /* click land */
    function onDocumentMouseClick() {
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
          infoBoard.css({opacity: 1.0});

          if (typeof res !== 'undefined') {
            $('#country').empty().append(countryName);
            doRankingPromise(res, wbLength);
          } else {
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
            }, 500)
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

    /*
    // ranking
    */
    // histCanvas.width = 700;  // responsive
    if (canvasWidth < 500) {
      histCanvas.width = 320;
    } else if (canvasWidth >= 500 && canvasWidth < 700) {
      histCanvas.width = 500;
    } else if (canvasWidth >= 700 && canvasWidth < 900) {
      histCanvas.width = 700;
    } else {
      histCanvas.width = 900;
    }
    histCanvas.height = 120;
    let canvasContext = histCanvas.getContext("2d");
    canvasContext.globalAlpha = 0.7;  // for safari(fillStyle alpha doesn't work)

    // function drawHist(data, scoreMax){
    drawHist = function (type, duration = 3000) {
      clearInterval(drawSetInterval);
      let data;
      let scoreMax;
      if (type === 'ladderBtn') {
        data = LadderArray;
        scoreMax = ladderMax;
      } else if (type === 'positiveBtn') {
        data = PositiveArray;
        scoreMax = positiveMax;
      } else if (type === 'negativeBtn') {
        data = NegativeArray;
        scoreMax = negativeMin;
      } else {
        data = GDPArray;
        scoreMax = gdpMax;
      }

      canvasContext.clearRect(0, 0, histCanvas.width, histCanvas.height);
      // canvasContext.fillStyle = "rgb(0, 0, 0, 0)";  // not fill
      // canvasContext.fillRect(0, 0, histCanvas.width, histCanvas.height);

      let numData = data.length;
      let width = histCanvas.width / numData;
      canvasContext.fillStyle = barColor;

      // draw histogram with loop rect
      let i = 0;
      // console.log(numData, data);
      drawSetInterval = setInterval(function () {
        let h = (data[i].score) / scoreMax * histCanvas.height;
        canvasContext.fillRect(width * i, histCanvas.height - h, width, h);
        i++;

        if (i > numData - 1) {
          clearInterval(drawSetInterval);
        }
      }, duration / numData);

      isHistDisplay = true;
      return {width: width, histData: data, scoreMax: scoreMax};
    };

    /* mouse over histogram */
    let tooltipHist = $('#tooltipHist');
    histCanvas.addEventListener('mousemove', onHistRanking, false);
    histCanvas.addEventListener('mouseout', outHistRanking, false);
    histCanvas.addEventListener('click', clickHistRanking, false);

    function onHistRanking(event) {
      console.log('onHist', isFillHist);
      if (isHistDisplay) {
        if (isFillHist){
          let rect = event.target.getBoundingClientRect();
          let mouseX = Math.abs(event.clientX - rect.x);
          let index = Math.floor(mouseX / barWidth);
          let data = histData;
          // console.log(data[index].country, data[index].rank);

          document.getElementById("canvasWrapper").classList.add("canvasWrapperPointer");
          mouseonCountry = data[index].country;
          tooltipHist[0].innerText = mouseonCountry;
          tooltipHist.css({opacity: 1.0});

          tooltipHist.css({top: event.clientY * 0.95});
          tooltipHist.css({left: event.clientX * 1.0 - tooltipHist.width() / 2 - 5});
        }else{
          document.getElementById("canvasWrapper").classList.remove("canvasWrapperPointer");
          tooltipHist.css({opacity: 0.0});
          tooltipHist.css({top: 0});
          tooltipHist.css({left: 0});
        }
      }
    }

    /* mouse off histgram */
    function outHistRanking() {
      tooltipHist.css({opacity: 0.0});
    }

    /* mouse click histogram */
    function clickHistRanking() {
      console.log(isFillHist);
      if (isFillHist) {
        console.log('click', mouseonCountry);

        // after setting mouseonCountry, this function can be used
        if (typeof mouseonCountry !== 'undefined') {
          let res = countrynameToLatlon(mouseonCountry);
          latitude = res.latitude;
          longitude = res.longitude;

          moveCamera(latitude, longitude);
          clickHistRankingDisplayScore(mouseonCountry);
        }
        //tooltipHist.css({opacity: 0.0});
      }
    }

    function clickHistRankingDisplayScore(countryName) {
      if (!isFirstClick) {
        TweenMax.killAll();
        positive.cancel();
        negative.cancel();
        gdp.cancel();
      }
      clearInfo();
      let res = calcWbInfo(countryName);
      infoBoard.css({opacity: 1.0});

      $('#country').empty().append(countryName);
      doRankingPromise(res, wbLength);
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

    function highlightSelectedBar(index, data, scoreMax) {
      let h;
      // highlight color
      canvasContext.fillStyle = heightBarColor;
      h = (data[index].score) / scoreMax * histCanvas.height;
      canvasContext.fillRect(barWidth * index, histCanvas.height - h, barWidth, h);

      // return color
      canvasContext.fillStyle = barColor;
      if (index > 0){
        h = (data[index-1].score) / scoreMax * histCanvas.height;
        canvasContext.fillRect(barWidth * (index-1), histCanvas.height - h, barWidth, h);
      }
      if (index > 1){
        h = (data[index-2].score) / scoreMax * histCanvas.height;
        canvasContext.fillRect(barWidth * (index-2), histCanvas.height - h, barWidth, h);
      }
    }

    /*
    // move camera position function
    */
    /* move position in some separate times using quaternion */
    function moveCamera(latitude, longitude) {
      let targetPos = convertGeoCoords(latitude, longitude);
      let targetVec = targetPos.sub(center);
      let prevVec = camera.position.sub(center);

      let crossVec = prevVec.clone().cross(targetVec).normalize();
      let angle = prevVec.angleTo(targetVec);

      let q = new THREE.Quaternion();
      let step = 25;
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
        moveCameraQuaternion(stepAngle);
        if (count > step) {
          createPoint(latitude, longitude);
          clearInterval(id);
        }
      }, 1000 / step);

      // console.log(prevVec);

    }


    function convertGeoCoords(latitude, longitude, radius = 1.0) {
      let latRad = latitude * (Math.PI / 180);
      let lonRad = -longitude * (Math.PI / 180);

      let x = Math.cos(latRad) * Math.cos(lonRad) * radius;
      let y = Math.sin(latRad) * radius;
      let z = Math.cos(latRad) * Math.sin(lonRad) * radius;

      return new THREE.Vector3(x, y, z);
    }


    function createPin() {
      let radius = 0.0025;
      let sphereRadius = 0.01;
      let height = 0.025;

      let material = new THREE.MeshPhongMaterial({color: 0xC9C7B7});

      let cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, height, 16, 1, true), material);
      cone.position.y = height * 0.5;
      cone.rotation.x = Math.PI;

      let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(sphereRadius, 60, 60), material);
      sphere.position.y = height * 0.95 + sphereRadius;

      let group = new THREE.Group();
      group.add(cone);
      group.add(sphere);
      return group;
    }


    function createPoint(latitude = 0, longitude = 0) {
      const pin = createPin();
      let latRad = latitude * (Math.PI / 180);
      let lonRad = -longitude * (Math.PI / 180);

      pin.position.copy(convertGeoCoords(latitude, longitude));
      pin.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
      earth.add(pin);
    }


    /*
    // travel ranking country
    */
    travelRanking = function () {
      let i = 0;
      travelSetInterval = setInterval(function () {
        highlightSelectedBar(i, histData, scoreMax);

        let countryName = histData[i].country;
        let res = countrynameToLatlon(countryName);
        latitude = res.latitude;
        longitude = res.longitude;
        moveCamera(latitude, longitude);
        // createPoint(latitude, longitude);
        clickHistRankingDisplayScore(countryName);
        i++;
        if (i > wbLength - 1) {
          clearInterval(travelSetInterval);
        }
      }, 3500);
    };

    // helper
    axesHelper = new THREE.AxesHelper(5.0);
    scene.add(axesHelper);

    /* conduct rendering */
    initPostprocessing(vsPost, fsPost, time);
    render();


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

    selectorSearch.on("autocompleteclose", function(){
      let inputCountry = document.getElementById('country').textContent;
      console.log(inputCountry);

      let res = countrynameToLatlon(inputCountry);
      console.log(res.latitude);

      if( typeof res.latitude !== 'undefined'){
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

    if (pageIndex !== interactivePageIndex) {
      earth.rotation.x += speed;
    } else {
      earth.rotation.y += speed;
    }

    let nowTime = clock.getElapsedTime();
    requestAnimationFrame(render);

    /* set 30ftp */
    if (frame % 2 === 0) {
      return;
    }
    //renderer.render(scene, camera);

    //オフスクリーンレンダリング
    renderer.render(scene, camera, postprocessing.renderTarget);
    //平面オブジェクト用テクスチャ画像を更新
    postprocessing.plane.material.uniforms.texture.value = postprocessing.renderTarget.texture;
    postprocessing.plane.material.uniforms.time.value = nowTime;
    postprocessing.plane.material.uniforms.resolution.value = [canvasWidth * devicePixelRatio, canvasHeight * devicePixelRatio];
    postprocessing.plane.material.uniforms.mouse.value = mouse;
    postprocessing.plane.material.uniforms.pageIndex.value = pageIndex;

    //平面オブジェクトをレンダリング
    renderer.render(postprocessing.scene, postprocessing.camera);
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
            mouse: {type: "v2", value: mouse},
            pageIndex: {type: "f", value: pageIndex},
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

