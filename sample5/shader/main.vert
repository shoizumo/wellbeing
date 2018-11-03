precision mediump float;

//uniform型変数
uniform float amplitude;

//attribute型変数（頂点データ）の宣言
attribute float displacement;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

//バーテックスシェーダーからフラグメントシェーダーへの転送する変数
varying vec3 vNormal;
varying vec2 vUv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main(){
//頂点座標を更新
    vec3 newPosition = position +  displacement * normal;
    //視点座標系の頂点座標
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

    //頂点法線ベクトル
    //vNormal = normal;
    //テクスチャ座標の更新
    //vUv = (0.5 + amplitude) * uv + vec2(amplitude);
    vUv = uv;
}