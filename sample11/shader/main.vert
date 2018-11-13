precision mediump float;

// uniform
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform vec2 resolution;

// attribute
attribute vec3 position;
attribute vec2 uv;
attribute float vertexId;

// vs to fs
varying vec2 vUv;
varying vec4 v_color;


//void main(){
//    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//    vUv = uv;
//}

//void main() {
//  float v=vertexId/300.0;
//  int num=int(sin(time)*1.0+10.0);
//  int den=int(exp(sin(time)*3.0+3.0));
//  float frac=1.0-float(num)/float(den);
//  vec2 xy=vec2(sin(v),cos(v)*sin(v*frac))/2.0;
//  vec2 aspect = vec2(1, resolution.x / resolution.y);
//  gl_Position = projectionMatrix * modelViewMatrix * vec4(xy * aspect, 0.0, 1.0);
//
//  //vUv = uv;
//}


void main() {
  float phi = vertexId / 1369.0 * 3.14159265*2.0;

  float x = cos(phi);
  float y = sin(phi);
  float z = 0.0;

  float theta = sin(cos(phi)*3.1415192 + time);//(x+time * 0.3) * 3.141592*2.0;

  theta *= 10.0;

  y *= cos(theta);
  z = sin(theta) * sin(phi);

  vec4 pos = vec4(x, y, z, 1.0);

  vec3 eye = vec3(sin(time*0.3), 0, cos(time*0.3));
  vec3 right = vec3(-eye.z, 0, eye.x);
  vec3 look = -eye;

  mat4 L = mat4(vec4(right, 0),
                vec4(0, 1, 0, 0),
                vec4(look, 0),
                vec4(0, 0, 0, 1));

  gl_Position = projectionMatrix * modelViewMatrix * pos * vec4((resolution.y / resolution.x) * 0.5, 0.5, 0.5, 1);
  v_color = vec4(sin(theta) * 0.5 + 0.5,
                 cos(phi) * 0.5 + 0.5,
                 sin(time) * 0.5 + 0.5,
                 1.0);
}