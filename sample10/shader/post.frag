precision mediump float;

// uniform
uniform sampler2D texture;

// from vs
varying vec2 vUv;

void main(){
    vec4 destColor = texture2D(texture, vUv);
    gl_FragColor = vec4(destColor);
}