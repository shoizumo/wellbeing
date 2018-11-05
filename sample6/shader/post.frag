precision mediump float;

uniform sampler2D texture;
varying vec2 vUv;

void main( void ) {
    //テクセルの取得
    vec4 texel = texture2D( texture, vUv );

    //反転色の計算
    vec3 color = vec3( 1.0 ) - texel.rgb;

    //描画色の決定
    gl_FragColor = vec4( color, 1.0 );

}