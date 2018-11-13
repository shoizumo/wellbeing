precision mediump float;

// uniform
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

// attribute
attribute vec3 position;
attribute vec2 uv;

// vs to fs
varying vec2 vUv;


void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
}