(() => {
  // variables
  let canvasWidth = null;
  let canvasHeight = null;
  let targetDOM = null;
  let run = true;
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
  let mesh;
  let axesHelper;

  let mouse;
  let vecMouse = new THREE.Vector2();

  const clock = new THREE.Clock();
  let time = 0.0;

  let pageIndex = 1.0;
const interactivePageIndex = 4;

  // constant variables
  const RENDERER_PARAM = {
    //clearColor: 0xffffff
    clearColor: 0x000000
  };

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
           // $('.main').attr('height', '10%')
        }
      },

      beforeMove: function(pageId) {
        // if (pageId === 4){
        //    $('.main').addClass("disabled-onepage-scroll");
        // }
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
    window.addEventListener('resize', () => {
      renderer.setPixelRatio(window.devicePixelRatio);
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
    // scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 150.0);
    camera.position.x = 0.0;
    camera.position.y = 3.0;
    camera.position.z = 3.0;
    //camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
    renderer.setSize(canvasWidth, canvasHeight);
    targetDOM.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);


    let radius = 0.995;
    geometry = new THREE.SphereGeometry(radius, 60, 60);
    material = new THREE.MeshBasicMaterial({
        transparent: true,
        depthTest: true,
        depthWrite: false,
        opacity: 0.9,
        //map: sea_texture,
        color: 0x222222
    });
    mesh = new THREE.Mesh(geometry, material);


    let meshList = [];
    for (let name in country_data) {
      geometry = new Tessalator3D(country_data[name], 0);
      let continents = ["EU", "AN", "AS", "OC", "SA", "AF", "NA"];
      let color = new THREE.Color(0xaaaaaa);
      //color.setHSL(continents.indexOf(country_data[name].data.cont) * (1 / 7), Math.random() * 0.25 + 0.65, Math.random() / 2 + 0.25);

      let m = country_data[name].mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({
            color: color
          }));
      m.name = "land";
      m.userData.country = name;

      // ここにWell-being Dataを加える

      mesh.add(m);
      meshList.push(m);
    }

    scene.add(mesh);
    mesh.position.y = 1.5;
    mesh.position.z = 3.0;


    console.log(meshList);
    //meshList[0].material.color.setRGB(1.0, 1.0, 1.0);
    console.log(meshList[0]);

    // meshList.map(mesh => {
    //   // 交差しているオブジェクトが1つ以上存在し、
    //   // 交差しているオブジェクトの1番目(最前面)のものだったら
    //   if (intersects.length > 0 && mesh === intersects[0].object) {
    //     // 色を赤くする
    //     mesh.material.color.setHex(0xFF0000);
    //   } else {
    //     // それ以外は元の色にする
    //     mesh.material.color.setHex(0xFFFFFF);
    //   }
    // });

    // meshList.map(mesh => {
    //   if (mesh === intersects[0].object) {
    //     mesh.material.color.setHex(0xFF0000);
    //   } else {
    //     mesh.material.color.setHex(0xFFFFFF);
    //   }
    // });

    let intersected_object = 0;
    let overlay_element = 0;
    let hover_scale = 1.015;
    window.addEventListener('mousemove', onDocumentMouseMove, false);
    function onDocumentMouseMove(event) {
      if (intersected_object !== 0) {
        intersected_object.scale.set(1.0, 1.0, 1.0);
      }
      event.preventDefault();
      let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      let vector = new THREE.Vector3(mouseX, mouseY, -1);
      vector.unproject(camera);
      let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      let intersects = raycaster.intersectObject(mesh, true);
      if (intersects.length > 0) {
        if (intersects[0].point !== null) {
          if (intersects[0].object.name === "land") {
            //console.log(intersects[0]);

            if (pageIndex === interactivePageIndex){
              console.log(intersects[0].object.userData.country);
              intersects[0].object.scale.set(hover_scale, hover_scale, hover_scale);
              intersected_object = intersects[0].object;

              // color
              intersects[0].object.material.color.setHex(0xFF0000);
            }

            if (overlay_element === 0) {
              // overlay_element = document.getElementById("overlay");
            }
            // overlay_element.innerHTML = intersects[0].object.userData.country;
          } else {
            // overlay_element.innerHTML = "";
          }
        } else {
          // overlay_element.innerHTML = "";
        }
      } else {
        // overlay_element.innerHTML = "";
      }
    }

    // helper
    axesHelper = new THREE.AxesHelper(5.0);
    scene.add(axesHelper);


    // rendering
    initPostprocessing(vsPost, fsPost, time);
    render();
  }

  // rendering
  function render() {
    mesh.rotation.x += 3.141592 * 2 / 90 / 60 / 60; // 1round/90m
    let nowTime = clock.getElapsedTime();
    if (run) {
      requestAnimationFrame(render);
    }


    //renderer.render(scene, camera);
    //オフスクリーンレンダリング
    renderer.render( scene, camera, postprocessing.renderTarget );
    //平面オブジェクト用テクスチャ画像を更新
    postprocessing.plane.material.uniforms.texture.value = postprocessing.renderTarget;
    postprocessing.plane.material.uniforms.time.value = nowTime;
    postprocessing.plane.material.uniforms.resolution.value = [canvasWidth * window.devicePixelRatio, canvasHeight * window.devicePixelRatio];
    postprocessing.plane.material.uniforms.mouse.value = mouse;
    if(!isNaN(vecMouse.x)){
      postprocessing.plane.material.uniforms.vecMouse.value = vecMouse;
    }
    postprocessing.plane.material.uniforms.pageIndex.value = pageIndex;

    //平面オブジェクトをレンダリング
    renderer.render(postprocessing.scene, postprocessing.camera );
  }

  //ポストプロセッシング関連情報保持用オブジェクト
  let postprocessing = {};

  function initPostprocessing(vsPost, fsPost) {
    time = 0.0;
    vecMouse = new THREE.Vector2(0.01, 0.01);
    //ポストプロセッシング用シーンの生成
    postprocessing.scene = new THREE.Scene();

    //正投影カメラの生成
    postprocessing.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    //平面オブジェクトの生成
    postprocessing.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        //uniform型変数
        uniforms: {
          texture: {type: "t", value: null},
          resolution: {type: "v2", value: [canvasWidth * window.devicePixelRatio, canvasHeight * window.devicePixelRatio]},
          time: {type: "f", value: time},
          mouse: {type: "v2", value: mouse},
          vecMouse: {type: "v2", value: vecMouse},
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

