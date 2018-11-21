/**
 * Country Selector
 * @author Callum Prentice / http://callum.com/
 */
var camera, scene, renderer, controls;
var radius = 0.995;
var base_globe = 0;

var intersected_object = 0;
var overlay_element = 0;
var hover_scale = 1.01;


window.addEventListener('load', () => {
    
    //init();
    loadShader()
    animate();
})

function loadShader() {
    SHADER_LOADER.load((data) => {

      const vsMain = data.myShaderMain.vertex;
      const fsMain = data.myShaderMain.fragment;
      //return {vsMain:vsMain, fsMain:fsMain}
      init(vsMain, fsMain)
    })
  }

function init(vsMain, fsMain) {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 0.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    targetDOM = document.getElementById('webgl');
    targetDOM.appendChild(renderer.domElement);
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 4500);
    camera.position.z = 10;
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    scene.add(new THREE.AmbientLight(0x555555));


    

    geometry = new THREE.SphereBufferGeometry(radius, 60, 60) ;
    // material = new THREE.RawShaderMaterial({
    //   vertexShader: vsMain,
    //   fragmentShader: fsMain,
    // })

    material = new THREE.MeshLambertMaterial({
        transparent: true,
        depthTest: true,
        depthWrite: false,
        opacity: 0.5,
        //map: sea_texture,
        color: 0x6699ff
    });

    M = new THREE.RawShaderMaterial({
      vertexShader: vsMain,
      fragmentShader: fsMain,
    })

    base_globe = new THREE.Mesh(geometry, material);
    scene.add(base_globe);


    for (var name in country_data) {
        geometry = new Tessalator3D(country_data[name], 0);

        var continents = ["EU", "AN", "AS", "OC", "SA", "AF", "NA"];
        var color = new THREE.Color(0xff0000);
        color.setHSL(continents.indexOf(country_data[name].data.cont) * (1 / 7), Math.random() * 0.25 + 0.65, Math.random() / 2 + 0.25);
        var mesh = country_data[name].mesh = new THREE.Mesh(geometry, M);
        mesh.name = "land";
        mesh.userData.country = name;
        base_globe.add(mesh);
    }


    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    if (intersected_object !== 0) {
        intersected_object.scale.set(1.0, 1.0, 1.0);
    }

    event.preventDefault();
    var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    var vector = new THREE.Vector3(mouseX, mouseY, -1);
    vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObject(base_globe, true);
    if (intersects.length > 0) {
        if (intersects[0].point !== null) {
            if (intersects[0].object.name === "land") {
                console.log(intersects[0].object.userData.country);

                if (overlay_element === 0) {
                    overlay_element = document.getElementById("overlay");
                }
                overlay_element.innerHTML = intersects[0].object.userData.country;

                intersects[0].object.scale.set(hover_scale, hover_scale, hover_scale);
                intersected_object = intersects[0].object;
            } else {
                overlay_element.innerHTML = "";
            }
        } else {
            overlay_element.innerHTML = "";
        }
    } else {
            overlay_element.innerHTML = "";
    }
}

function animate(time) {
    requestAnimationFrame(animate);
    //controls.update();
    renderer.render(scene, camera);
}