// originally from https://github.com/udmani/tessalator/
function Tessellator3D(data) {
  THREE.Geometry.call(this);
  let i, uvs = [];
  let inner_radius = 0.999;  // point of inner position(should be set 0 ~ sphere's radius)
  for (i = 0; i < data.vertices.length; i += 2) {
    let lon = data.vertices[i];
    let lat = data.vertices[i + 1];

    // var phi = +(90.0 - lat) * Math.PI / 180.0;
    // var the = +(180.0 - lon) * Math.PI / 180.0;
    // var wx = Math.sin(the) * Math.sin(phi) * -1;
    // var wz = Math.cos(the) * Math.sin(phi);
    // var wy = Math.cos(phi);
    // var wu = 0.25 + lon / 360.0;
    // var wv = 0.50 + lat / 180.0;

    let latRad = lat * (Math.PI / 180);
    let lonRad = -lon * (Math.PI / 180);

    let wx = Math.cos(latRad) * Math.cos(lonRad);
    let wz = Math.cos(latRad) * Math.sin(lonRad);
    let wy = Math.sin(latRad);

    let wu = 0.25 + lon / 360.0;
    let wv = 0.50 + lat / 180.0;

    this.vertices.push(new THREE.Vector3(wx, wy, wz));
    uvs.push(new THREE.Vector2(wu, wv))
  }
  let n = this.vertices.length;
  if (inner_radius <= 1) {
    for (i = 0; i < n; i++) {
      let v = this.vertices[i];
      this.vertices.push(v.clone()
        .multiplyScalar(inner_radius))
    }
  }
  for (i = 0; i < data.triangles.length; i += 3) {
    let a = data.triangles[i];
    let b = data.triangles[i + 1];
    let c = data.triangles[i + 2];
    this.faces.push(new THREE.Face3(a, b, c, [this.vertices[a], this.vertices[b], this.vertices[c]]));
    this.faceVertexUvs[0].push([uvs[a], uvs[b], uvs[c]]);
    if ((0 < inner_radius) && (inner_radius <= 1)) {
      this.faces.push(new THREE.Face3(n + b, n + a, n + c, [this.vertices[b].clone()
        .multiplyScalar(-1), this.vertices[a].clone()
        .multiplyScalar(-1), this.vertices[c].clone()
        .multiplyScalar(-1)
      ]));
      this.faceVertexUvs[0].push([uvs[b], uvs[a], uvs[c]])
    }
  }
  if (inner_radius < 1) {
    for (i = 0; i < data.polygons.length; i++) {
      let polyWithHoles = data.polygons[i];
      for (let j = 0; j < polyWithHoles.length; j++) {
        let polygonOrHole = polyWithHoles[j];
        for (let k = 0; k < polygonOrHole.length; k++) {
          let a = polygonOrHole[k],
            b = polygonOrHole[(k + 1) % polygonOrHole.length];
          let va1 = this.vertices[a],
            vb1 = this.vertices[b];
          let va2 = this.vertices[n + a];
          let normal;
          if (j < 1) {
            normal = vb1.clone()
              .sub(va1)
              .cross(va2.clone()
                .sub(va1))
              .normalize();
            this.faces.push(new THREE.Face3(a, b, n + a, [normal, normal, normal]));
            this.faceVertexUvs[0].push([uvs[a], uvs[b], uvs[a]]);
            if (inner_radius > 0) {
              this.faces.push(new THREE.Face3(b, n + b, n + a, [normal, normal, normal]));
              this.faceVertexUvs[0].push([uvs[b], uvs[b], uvs[a]])
            }
          } else {
            normal = va2.clone()
              .sub(va1)
              .cross(vb1.clone()
                .sub(va1))
              .normalize();
            this.faces.push(new THREE.Face3(b, a, n + a, [normal, normal, normal]));
            this.faceVertexUvs[0].push([uvs[b], uvs[a], uvs[a]]);
            if (inner_radius > 0) {
              this.faces.push(new THREE.Face3(b, n + a, n + b, [normal, normal, normal]));
              this.faceVertexUvs[0].push([uvs[b], uvs[a], uvs[b]])
            }
          }
        }
      }
    }
  }
  this.computeFaceNormals();
  this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1)
}
Tessellator3D.prototype = Object.create(THREE.Geometry.prototype);