precision mediump float;

// uniform
uniform sampler2D texture;
uniform vec2 resolution;
uniform float time;

// from vs
varying vec2 vUv;

// vignette(monochrome)
const float redScale   = 0.298912; // 赤のスケール値
const float greenScale = 0.586611; // 緑のスケール値
const float blueScale  = 0.114478; // 青のスケール値
const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);


void main(void) {
    //テクセルの取得
    vec4 destColor = texture2D(texture, vUv);
    float mono = dot(destColor.rgb, monochromeScale);
    // -1.0〜1.0のスケールにする
    vec2 st = vUv * 2.0 - 1.0;
    float vignette = length(st);
    vignette = clamp(1.0 - vignette, 0.0, 1.0);
    destColor = mix(destColor, vec4(vec3(mono * vignette), 1.0), 0.5);



    vec2 position = (gl_FragCoord.xy / resolution.xy);
    float t = (time) * (position.y);
    float wave = sin(t * t * t * 10.0) ;
    vec4 sourceColor = vec4(wave, position.y+wave, wave, 1.0);

    //描画色の決定
    gl_FragColor = mix(destColor, sourceColor, 0.01);

}


//// vignette(monochrome)
//const float redScale   = 0.298912; // 赤のスケール値
//const float greenScale = 0.586611; // 緑のスケール値
//const float blueScale  = 0.114478; // 青のスケール値
//const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);

//void main(void) {
//    //テクセルの取得
//    vec4 destColor = texture2D(texture, vUv);
//    float mono = dot(destColor.rgb, monochromeScale);
//
//    // -1.0〜1.0のスケールにする
//    vec2 st = vUv * 2.0 - 1.0;
//    float vignette = length(st);
//    vignette = clamp(1.0 - vignette, 0.0, 1.0);
//
//    //描画色の決定
//    gl_FragColor = mix(destColor, vec4(vec3(mono * vignette), 1.0), 0.8);
//
//}