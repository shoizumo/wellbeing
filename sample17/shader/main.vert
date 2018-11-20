precision mediump float;

// uniform
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float amplitude;
uniform float size;
uniform float time;
uniform sampler2D bumpTex;
uniform sampler2D landTex;
uniform sampler2D earthTex;



// attribute
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
//attribute vec3 displacement;
//attribute vec4 color;
attribute vec2 texCoord;


// vs to fs
varying vec2 vUv;
varying vec3 mvPosition;
varying vec3 vNormal;



void main(){
    vec4 bumpColor = texture2D(bumpTex, uv);
    vec4 landColor = texture2D(landTex, uv);
    vec4 earthColor = texture2D(earthTex, vUv);
    float bump = bumpColor.r * 0.1;// + bumpColor.r * 0.5;
    //bump = bump * abs(sin(time));
    bump = 0.0;


    vec3 newPosition = position +  normal * vec3(bump);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

    vNormal = normalMatrix * normal ;
    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0) ;
    mvPosition = modelViewPosition.xyz;

    vUv = uv;

}