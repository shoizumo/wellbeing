precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;
const float PI = 3.14159265358979323;


// bright star function
float r1(float x){
    return fract(1e4*sin((x)*541.17));
}

vec2 rv1(vec2 x){
    return fract(1e4*sin((x)*541.17));
}

vec2 rv2(vec2 x){
    return fract(1e4*sin((x)*541.17)  + time * 0.0005);
}


vec2 sr1(float x){
    return (rv1(vec2(x,x+.1)) *2.-1.);
}

vec2 sr2(float x){
    return (rv2(vec2(x,x+.1)) *2.-1.);
}

float flare(vec2 U) {
    vec2 A = sin(vec2(0, 1.57) + time);
    U = abs( U * mat2(A, -A.y, A.x) ) * mat2(2,0,1,1.7);
    return .1/max(U.x,U.y);
}

vec4 stars(vec2 U) {
    vec2 R = resolution.xy;
    U =  (U+U - R) / R.y;
    vec4 O = vec4(-.3);
    for (float i=0.; i<119.; i++)
        O += flare (vec2((U - sr1(i)*R/R.y).x, (U - sr2(i)*R/R.y).y))
            * r1(i+.2)
            * (1.+sin(time+r1(i+.3)*6.))*.1;
    return O;    // location, scale, time
}

// cloud function
// Tweaked from http://glsl.heroku.com/e#4982.0
float hash( float n ) {
    return fract(sin(n)*43758.5453);
}

float noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    float res = mix(mix(hash(n+0.0), hash(n+1.0),f.x), mix(hash(n+57.0), hash(n+58.0),f.x),f.y);
    return res;
}

float noise2(vec2 p) {
    float f = 0.0;
    f += 0.50000*noise(p*10.0);
    f += 0.25000*noise(p*20.0);
    f += 0.12500*noise(p*40.0);
    f += 0.06250*noise(p*80.0);
    f *= f;
    return f;
}

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main( void ) {

    vec4 destColor = texture2D(texture, vUv);

    // bright star
    vec2 pos = gl_FragCoord.xy;
    vec4 starCol = stars(pos) / 2.0;
//    vec4 starCol = stars(pos) / abs(sin(time));

    // cloud
    pos.x -= resolution.x * sin(time * .1) * 0.05;
    pos.y -= resolution.y * time * 0.01;

    float f  = noise2(pos/resolution);
    vec3 color = vec3(f*.15, f*.45, f)*.7;
    color += starCol.rgb;

//    // small star
//    vec2 P = gl_FragCoord.xy - resolution.xy;
//    float dist = length(P) / resolution.y;
////    vec2 coord = vec2(pow(dist, 0.1), atan(P.x, P.y) / (PI*2.0));
//    vec2 coord = vec2(dist, atan(P.x, P.y) / (PI*2.0));
//
//    float a = pow((1.0-dist),20.0);
//    float t = time*-.035;
//    float r = coord.x - (t*0.0025);
//    float c = fract(a+coord.y + 0.0*.543);
//    vec2  p = vec2(r, c*.5)*5000.0;
//    vec2 uv = fract(p)*2.0-1.0;
//    float m = clamp((rand(floor(p))-.9)*10.0, 0.0, 1.0);
//    color +=  clamp((1.0-length(uv*2.0))*m*dist, 0.0, 1.0);


    float mixRatio;
    if(destColor.b == 0.0){
        mixRatio = 0.5;
    }else{
        mixRatio = 0.01;
    }

    gl_FragColor = vec4(mix(destColor, vec4(color, 1.0), mixRatio));
//    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);

}

