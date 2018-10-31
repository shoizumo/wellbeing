precision mediump float;

attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main(){
    //gl_Position = vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}