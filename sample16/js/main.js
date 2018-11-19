// $(document).ready(function(){
//   $('.main').onepage_scroll({
//     sectionContainer: 'section',
//     responsiveFallback: false, //600,
//     easing: 'ease',
//     pagination: true,
//     //updateURL: true,
//     loop: false,
//     direction: 'vertical', //'horizontal'
//     afterMove: function(index) {
//       console.log(index);
//     }
//   });
// });


(() => {
  // variables
  let canvasWidth = null;
  let canvasHeight = null;
  let targetDOM = null;
  let run = true;
  let isDown = false;
  // three objects
  let scene;
  let camera;
  let controls;
  let renderer;
  let geometry;
  let material;
  let earthSize;
  let earthMesh;
  let wireframeSphere;
  let directionalLight;
  let ambientLight;
  let axesHelper;
  // texture
  let earthmapLand;
  let earthBump;

  // constant variables
  const RENDERER_PARAM = {
    // clearColor: 0x333333
    clearColor: 0xffffff
  };
  const MATERIAL_PARAM = {
    color: 0xffffff,
    // specular: 0xffffff
    transparent: true,
    opacity: 0.80
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
      },

    });


    let str = [];
    function typing(pageNo) {
      // reset opacity(0.0) for displaying twice
      $('.fadein > span').css('opacity','0');

      let pageClass = '.page' + pageNo;
      console.log($(pageClass + ' > .fadein > span'));
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
          //console.log(no, $('.fadein > span').eq(no - 1).children('span:last').css('opacity'))
          if(no === 0 || Number($(pageClass + ' > .fadein > span').eq(no - 1).children('span:last').css('opacity')) === 1){//最初の要素または前の要素が全文字表示された時
            //console.log(no, $('.fadein > span').eq(no - 1).children('span:last').css('opacity'))
            //console.log(no)
            clearInterval(interval);
            for (let j = 0; j < str[no].length; j++) {
              $(self).append('<span>'+str[no].substr(j, 1)+'</span>');
              $(self).children('span:last').delay(100 * j).animate({opacity:'1'}, 500);
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
    }, false);
    window.addEventListener('mousedown', () => {
            isDown = true;
        }, false);
    window.addEventListener('mouseup', () => {
        isDown = false;
    }, false);

    // texture
    let earthmapLandLoader = Loader = new THREE.TextureLoader();
    let earthBumpLoader = new THREE.TextureLoader();
    earthmapLand = earthmapLandLoader.load('img/earthmap_land.png', () => {
      earthBump = earthBumpLoader.load('img/earthbump.jpg', loadShader);
    });

  }, false);

  function loadShader() {
    SHADER_LOADER.load((data) => {

      const vs = data.myShader.vertex;
      const fs = data.myShader.fragment;

      init(vs, fs);
    })
  }


  function init(vs, fs){


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


    let geometry = new THREE.Geometry();

    let vertices = [
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(-1, -1, 0),
      new THREE.Vector3(1, -1, 0),
    ];

    let faces = [
      new THREE.Face3(0, 1, 2),
    ];

    geometry.vertices = vertices;
    geometry.faces = faces;

    let material = new THREE.ShaderMaterial({
      vertexShader: vs,
      fragmentShader: fs,
      uniforms: {
        //map: {type: "t", value: earthmapLand}
      },
    });

    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);



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
    render();
  }


  // rendering
  function render() {
    if (run) {
      requestAnimationFrame(render);
    }

    if (isDown === true) {
      // earthMesh.rotation.y += 0.002;
      // cloudMesh.rotation.y += 0.003;
    }

    renderer.render(scene, camera);
  }
})();

