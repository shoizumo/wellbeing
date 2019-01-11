precision mediump float;

// uniform
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float amplitude;
uniform float size;
uniform float time;
uniform sampler2D earthTex;
//uniform float bump;



// attribute
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
//attribute vec3 displacement;
//attribute vec4 color;
attribute vec2 texCoord;


// vs to fs
varying vec2 vUv;
varying vec3 mvPosition;



void main(){
    vec4 earthColor = texture2D(earthTex, vUv);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
    vUv = uv;

}