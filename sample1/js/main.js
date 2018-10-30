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
  let cloudMesh;
  let galaxyField;
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
    // canvas
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    targetDOM = document.getElementById('webgl');

    let earthmapLand = Loader = new THREE.TextureLoader();
    let earthBumpLoader = new THREE.TextureLoader();
    earthTexture = earthmapLand.load('img/earthmap_land.png', () => {
      moonTexture = earthBumpLoader.load('img/earthbump.jpg', init);
    });

  }, false);


  function init(){
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

    // material and geometory
    // material = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
    material = new THREE.MeshBasicMaterial(MATERIAL_PARAM);
    material.map = earthTexture;
    material.bumpMap = moonTexture;
    material.bumpScale = 0.5;
    //material.specularMap = THREE.ImageUtils.loadTexture('img/earthspec.jpg');
    //material.specular  = new THREE.Color('gray');
    material.transparent = true;
    material.side = THREE.DoubleSide;
    material.depthWrite = false;

    // earthMesh
    earthSize = 1.5;
    geometry = new THREE.SphereGeometry(earthSize, 32, 32);
    earthMesh = new THREE.Mesh(geometry, material);
    earthMesh.position.x = 0.0;
    earthMesh.position.y = 0.0;
    earthMesh.position.z = 0.0;


    wireframeSphere = new THREE.Mesh(
        new THREE.SphereGeometry(earthSize - 0.01 , 32, 32),
        new THREE.MeshPhongMaterial({
          color: 0x000000,
          specular: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.2} )
    );

    wireframeSphere.position.x = 0.0;
    wireframeSphere.position.y = 0.0;
    wireframeSphere.position.z = 0.0;


    // add point on earth

    let latitude = 35.683333;
    let longitude = 139.683333;
    const point = createPoint(latitude, longitude);
    earthMesh.add(point);

    function createPoint(latitude = 0, longitude = 0, color=0xFF0000) {
      const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(earthSize / 100, 8, 8),
          new THREE.MeshBasicMaterial({color: color}));
      sphere.position.copy(convertGeoCoords(latitude, longitude, earthSize));
      return sphere;
    }

    function convertGeoCoords(latitude, longitude, radius) {
      const latRad = latitude * (Math.PI / 180);
      const lonRad = -longitude * (Math.PI / 180);

      const x = Math.cos(latRad) * Math.cos(lonRad) * radius;
      const y = Math.sin(latRad) * radius;
      const z = Math.cos(latRad) * Math.sin(lonRad) * radius;

      return new THREE.Vector3(x, y, z);
    }

    renderer.sortObjects = false;

    scene.add(wireframeSphere);
    scene.add(earthMesh);



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

