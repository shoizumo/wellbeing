precision mediump float;

// uniform
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float amplitude;
uniform float size;
uniform float time;


// attribute
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 displacement;
//attribute vec4 color;

// vs to fs
varying vec2 vUv;
varying vec3 mvPosition;
varying vec3 vNormal;


void main(){
    //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //gl_PointSize = size / 10.0;

    vUv = uv;
    //vec3 newPosition = position + amplitude * displacement;
    //vec3 newPosition = position + displacement * sin(time * 10.0 * (position.y + 3.0)/6.0) / 1000.0;
    vec3 newPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0 );

    vNormal = normalMatrix * normal ;
    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0) ;
    mvPosition = modelViewPosition.xyz;

}