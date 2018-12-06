(() => {
  // variables
  let canvasWidth = null;
  let canvasHeight = null;
  let targetDOM = null;
  let isDown = false;
  let isClick = false;
  let isdDblclick = false;
  // three objects
  let scene;
  let camera;
  let controls;
  let renderer;
  let geometry;
  let material;
  let earth;
  let axesHelper;

  let mouse;

  const clock = new THREE.Clock();
  let time = 0.0;

  let pageIndex = 1.0;
  const interactivePageIndex = 4;

  let stats;

  const wbLength = Object.keys(wbData).length;

  // constant variables
  const RENDERER_PARAM = {
    //clearColor: 0xffffff
    clearColor: 0x000000
  };

  let initEarthPosition = new THREE.Vector3(0.0, -1.1, 1.0);
  let initCameraPosition = new THREE.Vector3(0.0, 0.0, 2.0);

  // entry point
  window.addEventListener('load', () => {

    $('.main').onepage_scroll({
      sectionContainer: 'section',
      responsiveFallback: false, //600,
      easing: 'ease',
      pagination: true,
      //updateURL: true,
      animationTime: 500,
      loop: false,
      direction: 'vertical', //'horizontal'

      afterMove: function(pageId) {
        //console.log(pageId);
        typing(pageId);
        pageIndex = pageId;

        if (pageId === interactivePageIndex){
          $('.main').addClass("disabled-onepage-scroll");
          let duration = 2.0;
          let ease = Back.easeOut.config(1);

          TweenLite.to(earth.position, duration, {
            y: 0.0,
            z: 0.0,
            ease: ease
          });

          TweenLite.to(camera.position, duration, {
            z: 3.0,
            ease: ease,
            onComplete: function(){
              controls.enableZoom = true;
              // display button
              $(".wbButton").removeClass("hiddenBtn").addClass("normalBtn")
            }
          });


        }else{
          controls.enableZoom = false;
        }
      },
    });


    function typing(pageNo) {
      let str = [];
      // reset opacity(0.0) for displaying twice
      $('.fadein > span').css('opacity','0');

      let pageClass = '.page' + pageNo;
      $(pageClass + ' > .fadein > span').each(function(i){//セレクタで指定した要素すべて
        //console.log(this);
        $(this).css('opacity','1');//行を不透明にする
        str[i] = $(this).text();//元のテキストをコピーし
        //console.log(str);
        $(this).text('');//テキストを消す
        //console.log(this);
        let no = i;
        let self = this;
        let interval = setInterval(function(){
          if(no === 0 || Number($(pageClass + ' > .fadein > span').eq(no - 1).children('span:last').css('opacity')) === 1){//最初の要素または前の要素が全文字表示された時
            clearInterval(interval);
            for (let j = 0; j < str[no].length; j++) {
              $(self).append('<span>'+str[no].substr(j, 1)+'</span>');
              $(self).children('span:last').delay(80 * j).animate({opacity:'1'}, 300);
            }
          }
        }, 50);
      });
    }
    typing(1);


    // canvas
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    targetDOM = document.getElementById('webgl');

    // events
    // let devicePixelRatio = window.devicePixelRatio;
    let devicePixelRatio = 1;
    window.addEventListener('resize', () => {
      renderer.setPixelRatio(devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;

    }, false);
    window.addEventListener('mousedown', () => {
            isDown = true;
        }, false);
    window.addEventListener('mouseup', () => {
        isDown = false;
    }, false);
    window.addEventListener('click', () => {
        isClick = true;
    }, false);
    window.addEventListener('dblclick', () => {
        isdDblclick = true;
        $('.main').removeClass("disabled-onepage-scroll");
    }, false);


    mouse = new THREE.Vector2();
    window.addEventListener('mousemove', () => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    loadShader()

  }, false);

  function loadShader() {
    SHADER_LOADER.load((data) => {
      const vsPost = data.myShaderPost.vertex;
      const fsPost = data.myShaderPost.fragment;
      init(vsPost, fsPost);
    })
  }


  function init(vsPost, fsPost){
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

    // scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 5.0);
    camera.position.z = initCameraPosition.z;
    //camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
    renderer.setSize(canvasWidth, canvasHeight);
    targetDOM.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 2.0;
    controls.maxDistance = 4.0;
    // console.log(controls);



    let radius = 0.995;
    geometry = new THREE.SphereGeometry(radius, 60, 60);
    material = new THREE.MeshBasicMaterial({
        transparent: true,
        depthTest: true,
        depthWrite: false,
        opacity: 0.9,
        //map: sea_texture,
        color: 0x222222,
        alphaTest: 0.5
    });
    earth = new THREE.Mesh(geometry, material);


    let meshList = [];
    for (let name in country_data) {
      geometry = new Tessalator3D(country_data[name], 0);
      let continents = ["EU", "AN", "AS", "OC", "SA", "AF", "NA"];
      let color = new THREE.Color(0xaaaaaa);
      //color.setHSL(continents.indexOf(country_data[name].data.cont) * (1 / 7), Math.random() * 0.25 + 0.65, Math.random() / 2 + 0.25);

      let m = country_data[name].mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({
            color: color,
            // transparent: true,
            // opacity: 0.9
          }));
      m.name = "land";
      m.userData.country = name;

      earth.add(m);
      meshList.push(m);
    }

    scene.add(earth);
    earth.position.y = initEarthPosition.y;
    earth.position.z = initEarthPosition.z;
    earth.rotation.x -= 0.5;
    earth.rotation.y -= 2.0;

    console.log(earth.position)

    console.log(wbData);
    console.log(meshList);



    // set wellbeing score
    let GDPArray = [];
    let LadderArray = [];
    let PositiveArray = [];
    let NegativeArray = [];
    for(let i=0; wbLength>i; i++ ) {
      let wb = wbData[i];
      LadderArray.push(wb.ladder);
      PositiveArray.push(wb.positive);
      NegativeArray.push(wb.negative);
      GDPArray.push(wb.logGdp);

    }

    let ladderMax = Math.max(...LadderArray);
    let ladderMin = Math.min(...LadderArray);
    let positiveMax = Math.max(...PositiveArray);
    let positiveMin = Math.min(...PositiveArray);
    let negativeMax = Math.max(...NegativeArray);
    let negativeMin = Math.min(...NegativeArray);
    let gdpMax = Math.max(...GDPArray);
    let gdpMin = Math.min(...GDPArray);

    console.log(ladderMax, ladderMin);
    console.log(positiveMax, positiveMin);
    console.log(negativeMax, negativeMin);
    console.log(gdpMax, gdpMin);


    let wbButton = document.getElementsByClassName('wbButton');
    for (let i = 0, wbLen = wbButton.length; i < wbLen; i++) {
      wbButton[i].addEventListener('click', (e) => {
        let type = e.target.id;
        $(".wbButton").removeClass("selectedBtn");
        wbButton[i].classList.add("selectedBtn");

        for (let j = 0; wbLength > j; j++) {
          for (let i = 0, lm = meshList.length; lm > i; i++) {
            let countryName = meshList[i].userData.country;
            if (wbData[j].country === countryName) {
              coloringLand(i, j, type)
            }
          }
        }
      }, false);
    }

    function coloringLand(i, j, type) {
      let R, B;
      if (type === 'ladderBtn'){
        R = (wbData[j].ladder - ladderMin) / (ladderMax - ladderMin); //0.0 - 1.0 scale
      }else if (type === 'positiveBtn'){
        R = (wbData[j].positive - positiveMin) / (positiveMax - positiveMin); //0.0 - 1.0 scale
      }else if (type === 'negativeBtn'){
        R = (wbData[j].negative - negativeMin) / (negativeMax - negativeMin); //0.0 - 1.0 scale
        R = 1.0 - R  // reverse scale
      }else{
        R = (wbData[j].logGdp - gdpMin) / (gdpMax - gdpMin); //0.0 - 1.0 scale
      }
        B = 1.0 - R;
        meshList[i].material.color.r = R;
        meshList[i].material.color.g = 0.0;
        meshList[i].material.color.b = B;
    }



    let intersected_object = 0;
    let hover_scale = 1.015;
    let infoArea = $('#info');
    window.addEventListener('mousemove', onDocumentMouseMove, false);

    function onDocumentMouseMove(event) {
      if (pageIndex === interactivePageIndex){
        if (intersected_object !== 0) {
          intersected_object.scale.set(1.0, 1.0, 1.0);  // 前回のオブジェクトをもとに戻す
        }
        event.preventDefault();
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        let vector = new THREE.Vector3(mouseX, mouseY, -1);
        vector.unproject(camera);
        let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        let intersects = raycaster.intersectObject(earth, true);
        if (intersects.length > 0) {
          if (intersects[0].point !== null) {
            if (intersects[0].object.name === "land") {
              //console.log(intersects[0]);

              let countryName = intersects[0].object.userData.country;
              let res = calcWbInfo(countryName);

              if( typeof res !== 'undefined') {
                infoArea.empty()
                    .append('<p>' + countryName + '</p>')
                    .append(infoText(res, 'ladder'))
                    .append(infoText(res, 'positive'))
                    .append(infoText(res, 'negative'))
                    .append(infoText(res, 'gdp'));
              }else{
                infoArea.empty()
                    .append('<p>' + countryName + '</p>')
                    .append('<p>' + 'No data' + '</p>');
              }

              // console.log(intersects[0].object);
              intersects[0].object.scale.set(hover_scale, hover_scale, hover_scale);
              intersected_object = intersects[0].object;
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

    function infoText(weData, type) {
      let title;
      let rank;
      if (type === 'ladder'){
        title = 'Ladder';
        rank = 'lRank';
      }else if (type === 'positive'){
        title = 'Positive';
        rank = 'pRank';
      }else if (type === 'negative'){
        title = 'Negative';
        rank = 'nRank';
      }else{
        title = 'GDP';
        rank = 'gRank';
      }
      return '<p>' + title + ' : ' + weData[type].toFixed(1) + ' (' + (weData[rank] + 1) + '/' + String(wbLength+1) + ') ' + '</p>';
    }

    // helper
    axesHelper = new THREE.AxesHelper(5.0);
    scene.add(axesHelper);


    // rendering
    initPostprocessing(vsPost, fsPost, time);
    render();
  }

  // rendering
  let frame = 0;
  function render() {
    stats.update();
    frame++;
    if (pageIndex !== interactivePageIndex) {
      earth.rotation.x += 3.141592 * 2 / 90 / 60 / 60 * 2; // 1round/90m * 2
    }

    let nowTime = clock.getElapsedTime();
    requestAnimationFrame(render);

    // set 30ftp
    if(frame % 2 === 0) { return; }

    //renderer.render(scene, camera);
    //オフスクリーンレンダリング
    renderer.render( scene, camera, postprocessing.renderTarget );
    //平面オブジェクト用テクスチャ画像を更新
    postprocessing.plane.material.uniforms.texture.value = postprocessing.renderTarget.texture;
    postprocessing.plane.material.uniforms.time.value = nowTime;
    postprocessing.plane.material.uniforms.resolution.value = [canvasWidth * devicePixelRatio, canvasHeight * devicePixelRatio];
    postprocessing.plane.material.uniforms.mouse.value = mouse;
    postprocessing.plane.material.uniforms.pageIndex.value = pageIndex;

    //平面オブジェクトをレンダリング
    renderer.render(postprocessing.scene, postprocessing.camera );
  }

  //ポストプロセッシング関連情報保持用オブジェクト
  let postprocessing = {};

  function initPostprocessing(vsPost, fsPost) {
    time = 0.0;
    //ポストプロセッシング用シーンの生成
    postprocessing.scene = new THREE.Scene();
    postprocessing.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    //平面オブジェクトの生成
    postprocessing.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        //uniform型変数
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

    //平面オブジェクトをシーンへ追加
    postprocessing.scene.add(postprocessing.plane);

    //レンダラターゲットの生成
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

