precision mediump float;

// uniform
uniform vec3 color;
uniform sampler2D map;
uniform sampler2D land;
uniform sampler2D textureImg;
uniform bool isText;


// from vs
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec4 mColor = texture2D(map, vUv);
    vec4 lColor = texture2D(land, vUv);
    vec4 tcolor = texture2D(textureImg, vUv);
    vec4 white = vec4(0.5, 0.5, 0.5, 0.0);
    if(isText == false){
        gl_FragColor = white - lColor;
    }
    else{
        gl_FragColor = tcolor * mColor;
    }
    //gl_FragColor.a = gl_FragColor.a * 0.5;
}