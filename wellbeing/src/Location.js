export class Location {
  constructor(latlon, earthObj, controlsObj, cameraObj, soundObj) {
    this.data = latlon;
    this.numData = Object.keys(latlon).length;

    this.earth = earthObj;
    this.controls = controlsObj;
    this.camera = cameraObj;
    this.soundObj = soundObj;

    const pinRadius = 0.0025;
    this.pinSphereRadius = 0.01;
    this.pinHeight = 0.025;


    this.center = new THREE.Vector3(0, 0, 0);
    this.pinConeGeometry = new THREE.ConeBufferGeometry(pinRadius, this.pinHeight, 16, 1, true);
    this.pinSphereGeometry = new THREE.SphereBufferGeometry(this.pinSphereRadius, 60, 60);

    this.pinList = [];

    this.isMoveCamera = false;

    this.clearMoveCameraId = 0;
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


  moveCamera(latitude, longitude) {
    clearInterval(this.clearMoveCameraId);
    let targetPos = this.convertGeoCoords(latitude, longitude);
    let targetVec = targetPos.sub(this.center);
    let prevVec = this.camera.position.sub(this.center);

    let crossVec = prevVec.clone().cross(targetVec).normalize();
    let angle = prevVec.angleTo(targetVec);

    let q = new THREE.Quaternion();
    let step = 100;
    let stepAngle = angle / step;
    let count = 0;
    this.soundObj.play()

    let moveCameraQuaternion = (stepAngle) => {
      q.setFromAxisAngle(crossVec, stepAngle);
      this.camera.position.applyQuaternion(q);
      this.camera.lookAt(0.0, 0.0, 0.0);
      count++
    };

    let clearId = setInterval(() => {
      this.earth.rotation.y = 0;
      this.isMoveCamera = true;
      this.controls.enableRotate = false;
      moveCameraQuaternion(stepAngle);
      if (count > step - 1) {
        this.createPin(latitude, longitude);
        clearInterval(clearId);
        this.isMoveCamera = false;
        if (this.checkIsTravelManual()) {
          this.controls.enableRotate = true;
        }
      }
    }, 1000 / step);

    this.clearMoveCameraId = clearId;
  }


  convertGeoCoords(latitude, longitude, radius = 1.0) {
    let latRad = latitude * (Math.PI / 180);
    let lonRad = -longitude * (Math.PI / 180);

    let x = Math.cos(latRad) * Math.cos(lonRad) * radius;
    let y = Math.sin(latRad) * radius;
    let z = Math.cos(latRad) * Math.sin(lonRad) * radius;
    return new THREE.Vector3(x, y, z);
  }

  createPin(latitude = 0, longitude = 0) {
    const pin = this.makePinObj();
    let latRad = latitude * (Math.PI / 180);
    let lonRad = -longitude * (Math.PI / 180);

    pin.position.copy(this.convertGeoCoords(latitude, longitude));
    pin.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
    pin.name = 'pin';
    this.pinList.push(pin);
    this.earth.add(pin);
  }

  makePinObj() {
    const pinMaterial = new THREE.MeshPhongMaterial({color: 0xf9ff54});  // あとで色を変えることがあるから、毎回設定
    let cone = new THREE.Mesh(this.pinConeGeometry, pinMaterial);
    cone.position.y = this.pinHeight * 0.5;
    cone.rotation.x = Math.PI;

    let sphere = new THREE.Mesh(this.pinSphereGeometry, pinMaterial);
    sphere.position.y = this.pinHeight * 0.95 + this.pinSphereRadius;

    let group = new THREE.Group();
    group.add(cone);
    group.add(sphere);
    return group;
  }


  deletePin() {
    for (let i = 0, l = this.pinList.length; l > i; i++) {
      this.earth.remove(this.pinList[i]);
    }
    this.pinList = [];
  }

  checkIsTravelManual(){
    return document.getElementById("travelModeSwitch-checkbox").checked;
  }


}

