  countrynameToLatlon(countryName) {
    let latitude;
    let longitude;

    for (let i = 0; latLength > i; i++) {
      if (latlon[i].country === countryName) {
        latitude = latlon[i].latitude;
        longitude = latlon[i].longitude;
      }
    }
    return {latitude: latitude, longitude: longitude};
  }

  /* dring move, rotate is not enable */

  moveCamera(latitude, longitude) {
    let targetPos = convertGeoCoords(latitude, longitude);
    let targetVec = targetPos.sub(center);
    let prevVec = camera.position.sub(center);

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

    let id = setInterval(function () {
      earth.rotation.y = 0;
      isMoveCamera = true;
      controls.enableRotate = false;
      moveCameraQuaternion(stepAngle);
      if (count > step - 1) {
        createPoint(latitude, longitude);
        clearInterval(id);
        isMoveCamera = false;
        if (!isTravelAuto) {
          controls.enableRotate = true;
        }
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


  /* marker pin */
  let pinList;
  let pinRadius;
  let pinSphereRadius;
  let pinHeight;
  let pinMaterial;
  let pinConeGeometry;
  let pinSphereGeometry;

  pinRadius = 0.0025;
  pinSphereRadius = 0.01;
  pinHeight = 0.025;
  pinConeGeometry = new THREE.ConeBufferGeometry(pinRadius, pinHeight, 16, 1, true);
  pinSphereGeometry = new THREE.SphereBufferGeometry(pinSphereRadius, 60, 60);


  createPin() {
    pinMaterial = new THREE.MeshPhongMaterial({color: 0xf15b47});
    let cone = new THREE.Mesh(pinConeGeometry, pinMaterial);
    cone.position.y = pinHeight * 0.5;
    cone.rotation.x = Math.PI;

    let sphere = new THREE.Mesh(pinSphereGeometry, pinMaterial);
    sphere.position.y = pinHeight * 0.95 + pinSphereRadius;

    let group = new THREE.Group();
    group.add(cone);
    group.add(sphere);
    return group;
  }

  pinList = [];


  createPoint(latitude = 0, longitude = 0) {
    const pin = createPin();
    let latRad = latitude * (Math.PI / 180);
    let lonRad = -longitude * (Math.PI / 180);

    pin.position.copy(convertGeoCoords(latitude, longitude));
    pin.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
    pin.name = 'pin';
    pinList.push(pin);
    earth.add(pin);
  }


  deletePin() {
    for (let i = 0, l = pinList.length; l > i; i++) {
      earth.remove(pinList[i]);
    }
    pinList = [];
  }
