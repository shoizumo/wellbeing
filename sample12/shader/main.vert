precision mediump float;

// uniform
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float amplitude;
uniform float size;


// attribute
attribute vec3 position;
attribute vec2 uv;
attribute vec3 displacement;
//attribute vec4 color;

// vs to fs
varying vec2 vUv;
varying vec4 vColor;



void main(){
    //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size / 15.0;

    vUv = uv;
    vec3 newPosition = position + amplitude * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0 );

}