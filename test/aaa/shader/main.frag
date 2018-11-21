precision mediump float;


uniform vec3 color;
// uniform sampler2D texture;
uniform sampler2D map;

//バーテックスシェーダーから転送された変数
varying vec3 vNormal;
varying vec2 vUv;

void main() {
//    //簡易光線ベクトル
//    vec3 light = vec3(1.0, 1.0, 1.0);
//    light = normalize(light);
//
//    //光源と法線ベクトルとの内積値
//    float dProd = dot(vNormal, light) * 0.5 + 0.5;
//
//    //テクセルを取得
//    vec4 tcolor = texture2D(texture, vUv);
//
//    gl_FragColor = dProd * tcolor * vec4( color , 1.0 );

    gl_FragColor = texture2D(map, vUv);
}