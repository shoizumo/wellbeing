// 特別3dオブジェクトは初期化に使わず
// scene.getObjectByName( "objectName", true )
// などで、その都度取得する感じにする？



export class Location {
  // constructor(latlon, earthObj, controlsObj, cameraObj) {
  constructor(latlon) {
    this.data = latlon;
    this.numData = Object.keys(latlon).length;

    // this.earth = earthObj;
    // this.controls = controlsObj;
    // this.camera = cameraObj;

    const pinRadius = 0.0025;
    this.pinSphereRadius = 0.01;
    this.pinHeight = 0.025;


    this.center = new THREE.Vector3(0, 0, 0);
    this.pinMaterial = new THREE.MeshPhongMaterial({color: 0xf15b47});
    this.pinConeGeometry = new THREE.ConeBufferGeometry(pinRadius, this.pinHeight, 16, 1, true);
    this.pinSphereGeometry = new THREE.SphereBufferGeometry(this.pinSphereRadius, 60, 60);

    this.pinList = [];

    this.isMoveCamera = false;
  }


  countrynameToLatlon(countryName) {
    let latitude;
    let longitude;

    for (let i = 0; this.numData > i; i++) {
      if (this.data[i].country === countryName) {
        latitude = this.data[i].latitude;
        longitude = this.data[i].longitude;
      }
    }
    return {latitude: latitude, longitude: longitude};
  }

  // static moveCamera(latitude, longitude) {
  //   let targetPos = Location.convertGeoCoords(latitude, longitude);
  //   let targetVec = targetPos.sub(this.center);
  //   let prevVec = camera.position.sub(this.center);
  //
  //   let crossVec = prevVec.clone().cross(targetVec).normalize();
  //   let angle = prevVec.angleTo(targetVec);
  //
  //   let q = new THREE.Quaternion();
  //   let step = 100;
  //   let stepAngle = angle / step;
  //   let count = 0;
  //   let moveCameraQuaternion = function (stepAngle) {
  //     q.setFromAxisAngle(crossVec, stepAngle);
  //     camera.position.applyQuaternion(q);
  //     camera.lookAt(0.0, 0.0, 0.0);
  //     count++
  //   };
  //
  //   let id = setInterval(function () {
  //     earth.rotation.y = 0;
  //     // isMoveCamera = true;
  //     controls.enableRotate = false;
  //     moveCameraQuaternion(stepAngle);
  //     if (count > step - 1) {
  //       this.createPin(latitude, longitude);
  //       clearInterval(id);
  //       // isMoveCamera = false;
  //       // if (!isTravelAuto) {
  //       //   this.controls.enableRotate = true;
  //       // }
  //     }
  //   }, 1000 / step);
  // }


  moveCamera(latitude, longitude, earth, camera, controls) {
    // const earth
    // const camera
    // const controls

    let targetPos = this.convertGeoCoords(latitude, longitude);
    let targetVec = targetPos.sub(this.center);
    let prevVec = camera.position.sub(this.center);

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

    let id = setInterval(() => {
      earth.rotation.y = 0;
      this.isMoveCamera = true;
      controls.enableRotate = false;
      moveCameraQuaternion(stepAngle);
      if (count > step - 1) {
        this.createPin(earth, latitude, longitude);
        clearInterval(id);
        this.isMoveCamera = false;
        // if (!isTravelAuto) {
          controls.enableRotate = true;
        // }
      }
    }, 1000 / step);
  }


  convertGeoCoords(latitude, longitude, radius = 1.0) {
    let latRad = latitude * (Math.PI / 180);
    let lonRad = -longitude * (Math.PI / 180);

    let x = Math.cos(latRad) * Math.cos(lonRad) * radius;
    let y = Math.sin(latRad) * radius;
    let z = Math.cos(latRad) * Math.sin(lonRad) * radius;
    return new THREE.Vector3(x, y, z);
  }

  createPin(earth, latitude = 0, longitude = 0) {
    const pin = this.makePinObj();
    let latRad = latitude * (Math.PI / 180);
    let lonRad = -longitude * (Math.PI / 180);

    pin.position.copy(this.convertGeoCoords(latitude, longitude));
    pin.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
    pin.name = 'pin';
    this.pinList.push(pin);
    earth.add(pin);
  }

  makePinObj() {
    let cone = new THREE.Mesh(this.pinConeGeometry, this.pinMaterial);
    cone.position.y = this.pinHeight * 0.5;
    cone.rotation.x = Math.PI;

    let sphere = new THREE.Mesh(this.pinSphereGeometry, this.pinMaterial);
    sphere.position.y = this.pinHeight * 0.95 + this.pinSphereRadius;

    let group = new THREE.Group();
    group.add(cone);
    group.add(sphere);
    return group;
  }


  deletePin(earth) {
    for (let i = 0, l = this.pinList.length; l > i; i++) {
      earth.remove(this.pinList[i]);
    }
    this.pinList = [];
  }


}

