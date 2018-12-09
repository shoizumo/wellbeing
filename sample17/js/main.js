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
  let directionalLight;
  let ambientLight;
  let axesHelper;
  // texture
  let earthLand;
  let earthBump;
  let earthMap;

  let mouse;
  let pX, pY;
  let vecMouse = new THREE.Vector2();

  const clock = new THREE.Clock();
  let time = 0.0;

  let pageIndex = 1.0;


  // constant variables
  const RENDERER_PARAM = {
    //clearColor: 0xffffff
    clearColor: 0x000000
  };

  const DIRECTIONAL_LIGHT_PARAM = {
    // color: 0xffffff,
    color: 0x42f4cb,
    intensity: 0.5,
    x: 1.0,
    y: 1.0,
    z: 1.0
  };
  const AMBIENT_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 0.2
  };

  // entry point
  window.addEventListener('load', () => {

    // $('.main').onepage_scroll({
    //   sectionContainer: 'section',
    //   responsiveFallback: false, //600,
    //   easing: 'ease',
    //   pagination: true,
    //   //updateURL: true,
    //   animationTime: 500,
    //   loop: false,
    //   direction: 'vertical', //'horizontal'
    //
    //   afterMove: function(pageId) {
    //     //console.log(pageId);
    //     typing(pageId);
    //     pageIndex = pageId;
    //   },
    //
    // });


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
    }, false);

    mouse = new THREE.Vector2();
    window.addEventListener('mousemove', () => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);



    // texture
    let earthLandLoader = Loader = new THREE.TextureLoader();
    let earthBumpLoader = new THREE.TextureLoader();
    let earthMapLoader = new THREE.TextureLoader();
    earthLand = earthLandLoader.load('img/earthspec.png', () => {
      earthBump = earthBumpLoader.load('img/earthbump.png', () => {
        earthMap = earthMapLoader.load('img/earthmap.jpg', loadShader);
      })
    });

  }, false);

  function loadShader() {
    SHADER_LOADER.load((data) => {

      const vsMain = data.myShaderMain.vertex;
      const fsMain = data.myShaderMain.fragment;
      const vsPost = data.myShaderPost.vertex;
      const fsPost = data.myShaderPost.fragment;


      init(vsMain, fsMain, vsPost, fsPost);
    })
  }


  function init(vsMain, fsMain, vsPost, fsPost){
    // scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 150.0);
    camera.position.x = 0.0;
    camera.position.y = 3.0;
    camera.position.z = 10.0;
    camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
    renderer.setSize(canvasWidth, canvasHeight);
    targetDOM.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);


    let earthSize = 3;
    geometry = new THREE.SphereBufferGeometry(earthSize, 60, 60) ;
    let vertices = geometry.attributes.position.array;
    let displacement = new THREE.Float32Attribute( vertices.length * 3, 3 );

    // for ( let i = 0; i < vertices.length / 3; i++ ) {
    //   displacement.setXYZ( i ,
    //       (0.5 - Math.random()) / 20,
    //       (0.5 - Math.random()) / 20,
    //       (0.5 - Math.random()) / 20);
    // }

    let vPos = geometry.attributes.position;
    for ( let i = 0; i < vertices.length / 3; i++ ) {
      displacement.setXYZ( i ,
          vPos.getX(i) / earthSize,
          vPos.getY(i) / earthSize,
          vPos.getZ(i) / earthSize);
    }
    geometry.addAttribute('displacement', displacement );


    // let num = 100;
    // let texCoord = new THREE.Float32Attribute(num * 2, 2 );
    // for(let i = 0; i < num; ++i){
    //   s = i / num;
    //   for(let j = 0; j < num; ++j){
    //     t = 1.0 - j / num;
    //     texCoord.setXY(i, s, t);
    //   }
    // }
    // geometry.addAttribute('texCoord', texCoord );



    let time = 0.0;
    material = new THREE.RawShaderMaterial({
      vertexShader: vsMain,
      fragmentShader: fsMain,
      uniforms: {
        // Map
        bumpTex: {type: "t", value: earthBump},
        landTex: {type: "t", value: earthLand},
        earthTex: {type: "t", value: earthMap},
        isText: {type: "bool", value: true},
        amplitude: { type: "f", value: 0.0 },
        //size: {type: 'f', value: 32.0},
        time: {type: "f", value: time},
        resolution: {type: "v2", value: [canvasWidth, canvasHeight]},
      },
      side: THREE.FrontSide, //DoubleSide,
      //depthWrite: false,
      //transparent: true,
      //opacity: 0.5,
      //wireframe: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    //mesh = new THREE.Line(geometry, material);
    //mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
    mesh.position.y = -1.5;
    mesh.position.z = 3.0;
    //mesh.rotation.x -= 0.2;

    const points = new THREE.Group();

    let latitude = 35.683333;
    let longitude = 139.683333;
    let point1 = createPoint(latitude, longitude);
    point1.name = 'point1';
    //mesh.add(point1);
    console.log(point1);

    latitude = 0.0;
    longitude = 0.0;
    let point2 = createPoint(latitude, longitude);
    point2.name = 'point2';
    //mesh.add(point2);
    console.log(point2);

    points.add(point1);
    points.add(point2);
    mesh.add(points);
    console.log(points);


    document.addEventListener( 'mousedown', clickPosition, false );
    function clickPosition( event ) {
        // 画面上のマウスクリック位置
        var x = event.clientX;
        var y = event.clientY;

        // マウスクリック位置を正規化
        var mouse = new THREE.Vector2();
        mouse.x =  ( x / window.innerWidth ) * 2 - 1;
        mouse.y = -( y / window.innerHeight ) * 2 + 1;

        // Raycasterインスタンス作成
        var raycaster = new THREE.Raycaster();
        // 取得したX、Y座標でrayの位置を更新
        raycaster.setFromCamera(mouse, camera );

        //console.log(scene)


        // オブジェクトの取得
        var intersects = raycaster.intersectObjects(scene.children, true );

        //console.log(intersects)
        //console.log(sphereBase.name)

        // WEBコンソールにオブジェクト上の座標を出力
        //console.log( 'x座標=%f', intersects[0].point.x );
        //console.log( 'y座標=%f', intersects[0].point.y );
        //console.log( 'z座標=%f', intersects[0].point.z );

        if (intersects.length > 0) {
            // 交差していたらintersectsが1以上になるので、やりたいことをやる。
            //intersects[0].object.position.x = 100;
            //why "parent" is needed??????
            var selectedName = intersects[0]//.object.parent.name;
            console.log(selectedName);
        }
    }

    // function createPoint(latitude = 0, longitude = 0, color=0xFF0000) {
    //   const sphere = new THREE.Mesh(
    //       new THREE.SphereGeometry(earthSize / 100, 8, 8),
    //       new THREE.MeshBasicMaterial({color: color}));
    //   sphere.position.copy(convertGeoCoords(latitude, longitude, earthSize));
    //   return sphere;
    // }

    function convertGeoCoords(latitude, longitude, radius) {
      const latRad = latitude * (Math.PI / 180);
      const lonRad = -longitude * (Math.PI / 180);

      const x = Math.cos(latRad) * Math.cos(lonRad) * radius;
      const y = Math.sin(latRad) * radius;
      const z = Math.cos(latRad) * Math.sin(lonRad) * radius;

      let position = new THREE.Vector3(x, y, z);
      let rotation = new THREE.Vector3(0.0, -lonRad, latRad - Math.PI * 0.5);
      return {position:position, rotation:rotation}
    }


    function createPoint(latitude = 0, longitude = 0, color=0xFF0000) {
      const radius = 0.01;
      const sphereRadius = 0.04;
      const height = 0.1;

      const pin = new THREE.Group();

      const material = new THREE.MeshBasicMaterial({ color: color });
      const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(sphereRadius, 32, 16),
          material);
      sphere.position.y = height * 0.95 + sphereRadius;

      const cone = new THREE.Mesh(
          new THREE.ConeBufferGeometry(radius, height, 8, 1, true),
          material);
      cone.position.y = height * 0.5;
      cone.rotation.x = Math.PI;

      pin.add(sphere);
      pin.add(cone);

      let res = convertGeoCoords(latitude, longitude, earthSize);
      pin.position.copy(res.position);
      // pin.rotation.set(res.rotation);
      pin.rotation.y = res.rotation.y;
      pin.rotation.z = res.rotation.z;

      return pin;
    }

  //   function Marker() {
  //     THREE.Object3D.call(this);
  //
  //     var radius = 0.005;
  //     var sphereRadius = 0.02;
  //     var height = 0.05;
  //
  //     var material = new THREE.MeshPhongMaterial({ color: 0xbab68f });
  //
  //     var cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, height, 8, 1, true), material);
  //     cone.position.y = height * 0.5;
  //     cone.rotation.x = Math.PI;
  //
  //     var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(sphereRadius, 16, 8), material);
  //     sphere.position.y = height * 0.95 + sphereRadius;
  //
  //     this.add(cone, sphere);
  // }

    // console.log(mesh);
    // console.log(mesh.geometry.attributes.position.count);
    // console.log(mesh.geometry.attributes.position);
    // console.log(mesh.geometry.attributes.position.getX(0));
    // console.log(mesh.geometry.attributes.position.getY(0));
    // console.log(mesh.geometry.attributes.position.getZ(0));

    // lights
    directionalLight = new THREE.DirectionalLight(
        DIRECTIONAL_LIGHT_PARAM.color,
        DIRECTIONAL_LIGHT_PARAM.intensity
    );
    directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
    directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
    directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
    scene.add(directionalLight);
    ambientLight = new THREE.AmbientLight(
        AMBIENT_LIGHT_PARAM.color,
        AMBIENT_LIGHT_PARAM.intensity
    );
    scene.add(ambientLight);

    // helper
    axesHelper = new THREE.AxesHelper(5.0);
    scene.add(axesHelper);


    // rendering
    initPostprocessing(vsPost, fsPost, time);
    render();
  }

  // rendering
  let step = 1.0;
  function render() {
    if (pX !== mouse.x){
      vecMouse.x = mouse.x - pX;
      vecMouse.y = mouse.y - pY;
    }else{
      vecMouse.x = vecMouse.x * 0.99;
      vecMouse.y = vecMouse.y * 0.99;
    }
    pX = mouse.x;
    pY = mouse.y;
    //console.log(Math.abs(vecMouse.x)*100.0);


    mesh.rotation.x += 3.141592 * 2 / 90 / 60 / 60 * 10; // 1round/90m

    let nowTime = clock.getElapsedTime();
    material.uniforms.time.value = nowTime;
    mesh.material.uniforms.amplitude.value = Math.sin(nowTime);
    mesh.material.uniforms.resolution.value = [canvasWidth, canvasHeight];

    if (run) {
      requestAnimationFrame(render);
    }


    //renderer.render(scene, camera);
    //オフスクリーンレンダリング
    renderer.render( scene, camera, postprocessing.renderTarget );
    //平面オブジェクト用テクスチャ画像を更新
    postprocessing.plane.material.uniforms.texture.value = postprocessing.renderTarget;
    postprocessing.plane.material.uniforms.time.value = nowTime;
    postprocessing.plane.material.uniforms.resolution.value = [canvasWidth, canvasHeight];
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
          resolution: {type: "v2", value: [canvasWidth, canvasHeight]},
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
