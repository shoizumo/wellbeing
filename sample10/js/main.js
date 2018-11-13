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
  let earthSize;
  let earthMesh;
  let wireframeSphere;
  let directionalLight;
  let ambientLight;
  let axesHelper;
  // texture
  let earthmapLand;
  let earthOriginal;
  let textureImg;

  const clock = new THREE.Clock();
  let time = 0.0;


  // constant variables
  const RENDERER_PARAM = {
    // clearColor: 0x333333
    clearColor: 0x111111
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
    // canvas
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    targetDOM = document.getElementById('webgl');

    // events
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
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

    // texture
    let earthmapLandLoader = Loader = new THREE.TextureLoader();
    let earthOriginalLoader = new THREE.TextureLoader();
    let textureImgLoader = new THREE.TextureLoader();
    earthmapLand = earthmapLandLoader.load('img/earthmap_land.png', () => {
      earthOriginal = earthOriginalLoader.load('img/earthmap.jpg', () => {
        textureImg = textureImgLoader.load('img/sample.png', loadShader);
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


    let R = 3;
    geometry = new THREE.SphereBufferGeometry(R, 360, 360) ;
    //geometry = new THREE.PlaneBufferGeometry(100, 100);

    // let num = geometry.attributes.position.count;
    // geometry.addAttribute('displacement', new THREE.BufferAttribute(new Float32Array(num), 1));

    // for(i = 0; i < resolution; ++i){
    //             s = i / resolution;
    //             for(j = 0; j < resolution; ++j){
    //                 t = 1.0 - j / resolution;
    //                 );
    //                 texCoord.push(s, t);

    time = 0.0;
    material = new THREE.RawShaderMaterial({
      vertexShader: vsMain,
      fragmentShader: fsMain,
      uniforms: {
        // Map
        map: {type: "t", value: earthOriginal},
        land: {type: "t", value: earthmapLand},
        textureImg: {type: "t", value: textureImg},
        isText: {type: "bool", value: true},
        time: {type: "f", value: time},
        //材質色
        //color: {type: "c", value: new THREE.Color(0xff2200)},
        //テクスチャ座標のスライド量
        //amplitude: {type: "f", value: 1.0},
      },
      side: THREE.DoubleSide,
      //depthWrite: false,
      //transparent: true,
      //opacity: 0.5,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.position.y = -0.5;
    mesh.position.z = 7.0;
    mesh.rotation.x -= 0.5;

    console.log(mesh.geometry.attributes.position.count);
    console.log(mesh.geometry.attributes.position);
    console.log(mesh.geometry.attributes.position.getX(0));
    console.log(mesh.geometry.attributes.position.getY(0));
    console.log(mesh.geometry.attributes.position.getZ(0));

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
  function render() {
    mesh.rotation.x += 3.141592 * 2 / 90 / 60 / 60 * 10; // 1round/90m

    if (run) {
      requestAnimationFrame(render);
    }
    //console.log(material.uniforms);

    if (isDown === true) {
      material.uniforms.isText.value = false;
      //console.log('down');
    }else{
      material.uniforms.isText.value = true;
      //console.log('up');
    }
    //material.uniforms.isText.needsUpdate = true;
    let nowTime = clock.getElapsedTime();
    material.uniforms.time.value = nowTime;

    //renderer.render(scene, camera);
    //オフスクリーンレンダリング
    renderer.render( scene, camera, postprocessing.renderTarget );
    //平面オブジェクト用テクスチャ画像を更新
    postprocessing.plane.material.uniforms.texture.value = postprocessing.renderTarget;
    postprocessing.plane.material.uniforms.time.value = nowTime;

    //平面オブジェクトをレンダリング
    renderer.render(postprocessing.scene, postprocessing.camera );
  }

  //ポストプロセッシング関連情報保持用オブジェクト
  let postprocessing = {};

  function initPostprocessing(vsPost, fsPost) {
    time = 0.0;
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

