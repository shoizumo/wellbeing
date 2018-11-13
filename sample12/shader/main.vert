precision mediump float;

// uniform
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float amplitude;


// attribute
attribute vec3 position;
attribute vec2 uv;
attribute vec3 displacement;
//attribute vec4 color;

// vs to fs
varying vec2 vUv;
varying vec4 vColor;



void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
    vec3 newPosition = position + amplitude * displacement;

    //クリップ座標系の頂点座標
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0 );

}