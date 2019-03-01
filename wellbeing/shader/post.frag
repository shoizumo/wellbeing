precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;


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
            * r1(i+.2) /// 2.0
            * (1.+sin(time+r1(i+.3)*6.))*.1;
    return O;    // location, scale, time
}

// cloud function
vec3 permute(vec3 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cloud(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float rand (in vec2 uv) {
    return fract(sin(dot(uv, vec2(12.4124, 48.4124))) * 48512.41241);
}
float noise (in vec2 uv) {
    vec2 b = floor(uv);
    const vec2 O = vec2(0., 1.);
    return mix(mix(rand(b), rand(b+O.yx), .5), mix(rand(b+O), rand(b+O.yy), .5), .5);
}



void main( void ) {

    vec4 destColor = texture2D(texture, vUv);

    // cloud
    vec2 cloudPos = gl_FragCoord.xy;
    cloudPos.x -= resolution.x * -time * .01;
    cloudPos.y -= resolution.y * sin(time * .1) * 0.05;

    float f1  = cloud(cloudPos/resolution) / 2.0;
    float f2  = cloud(cloudPos/resolution * vec2(2.0, 2.0)) / 2.0;
    float f3  = cloud(cloudPos/resolution * vec2(4.0, 4.0)) / 2.0;
    f1 = f1 + f2;

    vec3 blueCloud = vec3(f1*.15, f1*.45, f1)*.5;
    vec3 greenCloud = vec3(f3*.45, f3, f3*.15)*.3;
    vec3 color = blueCloud + greenCloud;

    // star
    vec2 starPos = gl_FragCoord.xy;
    starPos.x -= resolution.x * -time * .0005;
    starPos.y -= resolution.y * -time * .0001;
    vec4 starCol = stars(starPos) / 2.0;


    vec2 uv = gl_FragCoord.xy/resolution.xy*vec2(100.0, 100.0);
    float smallStarCol = 0.;
    float fl, s;
    for (int layer = 0; layer < 2; layer++) {
        fl = float(layer);
        s = (400.-fl*20.);
        smallStarCol += step(.1, pow(noise(mod(vec2(uv.x*s, uv.y*s - time * 0.5 + fl * 100.), resolution.x)),18.)) * (fl/float(2));
    }

    color += starCol.rgb + smallStarCol;
    float mixRatio;
    if(destColor.b == 0.0){
        mixRatio = 0.5;
    }else{
        mixRatio = 0.01;
    }

    gl_FragColor = vec4(mix(destColor, vec4(color, 1.0), mixRatio));
//    gl_FragColor = vec4(vec3(smallStarCol), 1.0);

}

