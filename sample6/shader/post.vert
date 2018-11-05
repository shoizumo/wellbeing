precision mediump float;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main(){
    //視点座標系の頂点座標
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //テクスチャ座標をそのままフラグメントシェーダープログラムへ
    vUv = uv;
}