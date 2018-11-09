precision mediump float;

// uniform
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform sampler2D textureImg;
uniform float time;

// attribute
//attribute vec2 texCoord;
attribute vec3 position;
attribute vec2 uv;

// vs to fs
varying vec2 vUv;

float random(vec2 p){
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

void main(){
    vec4 samplerColor = texture2D(textureImg, vUv);

//    float x = sin(time) / 2.0;
//    float y = sin(time * 2.0) / 2.0;
//    float z = sin(time * 4.0) / 2.0;

    float x = random(vec2(time) + vec2(position.x)) * 2.0;
    float y = random(vec2(time) + vec2(position.y)) * 2.0;
    float z = random(vec2(time) + vec2(position.z)) * 2.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(x, y, z), 1.0);
    vUv = uv;
}