precision mediump float;

// uniform
uniform sampler2D texture;
uniform vec2 resolution;
uniform float time;

// from vs
varying vec2 vUv;
#define num -50.0

// vignette(monochrome)
const float redScale   = 0.298912; // 赤のスケール値
const float greenScale = 0.586611; // 緑のスケール値
const float blueScale  = 0.114478; // 青のスケール値
const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);


float random(vec2 p){
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}


void main() {
    //テクセルの取得
    vec4 destColor = texture2D(texture, vUv);


    // モノクロ・ビネット
    float mono = dot(destColor.rgb, monochromeScale);
    // -1.0〜1.0のスケールにする
    vec2 st = vUv * 2.0 - 1.0;
    float vignette = length(st);
    vignette = clamp(1.0 - vignette, 0.0, 1.0);
    destColor = mix(destColor, vec4(vec3(mono * vignette), 1.0), 0.5);


    // ボーダー・砂嵐
    vec2 p = (gl_FragCoord.xy / (resolution.xy));
    float span = 0.01;
    float linewidth = 0.01;
    float top = fract(time);
    float bottom = fract(time) + linewidth;
    vec4 border = vec4(0.0, 0.0, 0.0, 1.0);

    if(sin(time/10.0)>0.2){
        for(float i = 1.0; i > num; i--){
            top -= i * span;
            top = fract(top);
            bottom -= i *span;
            bottom = fract(bottom);
            if(p.y > top && p.y < bottom){
            border = vec4(0.0, abs(sin(time)), 0.0, 1.0);
            }
        }
    }
//    if(sin(time*time/100.0)>0.9){
//        for(float i = 1.0; i < num; i++){
//            top += i * span;
//            top = fract(top);
//            bottom += i *span;
//            bottom = fract(bottom);
//            if(p.y > top && p.y < bottom){
//            border = vec4(0.0, abs(sin(time)), 0.0, 1.0);
//            }
//        }
//    }
    else{
        border = vec4(0.0, 0.0, 0.0, 1.0);
    }

    // きれいなボーダーにしないために、ランダムな色を載せる
    float c = random(p + vec2(time));
    vec3 col = mix(vec3(c), border.xyz, 0.6);
    vec4 borderColor = vec4(col, 1.0);

    //描画色の決定
    gl_FragColor = mix(destColor, borderColor, 0.1);

}

