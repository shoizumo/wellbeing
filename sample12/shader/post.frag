/*
 * Original shader from: https://www.shadertoy.com/view/XtcfDM
 */

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;


float N21(vec2 p) {
    p = fract(p * vec2(2.15, 8.3));
    p += dot(p, p + 2.5);
    return fract(p.x * p.y);
}

vec2 N22(vec2 p) {
    float n = N21(p);
    return vec2(n, N21(p + n));
}

vec2 getPos(vec2 id, vec2 offset) {
    vec2 n = N22(id + offset);
    float x = cos(time * n.x);
    float y = sin(time * n.y);
    return vec2(x, y) * 0.4 + offset;
}

float distanceToLine(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
    return length(pa - t * ba);
}

float getLine(vec2 p, vec2 a, vec2 b) {
    float distance = distanceToLine(p, a, b);
    float dx = 15./resolution.y;
    return smoothstep(dx, 0., distance) * smoothstep(1.2, 0.3, length(a - b));
}

float layer(vec2 st) {
    float m = 0.;
    vec2 gv = fract(st) - 0.5;
    vec2 id = floor(st);
    // m = gv.x > 0.48 || gv.y > 0.48 ? 1. : 0.;
    vec2 pointPos = getPos(id, vec2(0., 0.));
    m += smoothstep(0.05, 0.03, length(gv - pointPos));
    
    float dx=15./resolution.y;

    vec2 p[6];
    p[0] = getPos(id, vec2(-1., -1.));
    p[1] = getPos(id, vec2(-1.,  0.));
    p[2] = getPos(id, vec2(-1.,  1.));
    p[3] = getPos(id, vec2( 0., -1.));
    p[4] = getPos(id, vec2( 0.,  0.));
    p[5] = getPos(id, vec2( 0.,  1.));

    for (int j = 0; j <=6 ; j++) {
        m += getLine(gv, p[4], p[j]);
        vec2 temp = (gv - p[j]) * 100.;
        m += 1./dot(temp, temp) * (sin(10. * time + fract(p[j].x) * 20.) * 0.5 + 0.5);

    }
    
    m += getLine(gv, p[1], p[3]);
    m += getLine(gv, p[1], p[5]);

    // m += smoothstep(0.05, 0.04, length(st - vec2(0., 0.)));
    return m;
}

void main()
{

    //テクセルの取得
    vec4 destColor = texture2D(texture, vUv);


    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    float m = 0.;

    for (float i = 0.; i < 1.0 ; i += 0.25) {
        // speed
        float depth = fract(i + time * 0.02);
        //m += layer(uv * mix(10., 0.5, depth) + i * 20.) * smoothstep(0., 0.2, depth) * smoothstep(1., 0.8, depth);
        // number of star
        m += layer(uv * mix(30., 0.05, depth) + i * 20.) * smoothstep(0., 0.5, depth) * smoothstep(1., 0.8, depth);
    }
    
    //vec3 baseColor = sin(vec3(3.45, 6.56, 8.78) * time * 0.2) * 0.5 + 0.5;
    vec3 baseColor = abs(sin(vec3(1.0) * time * 0.2)) * 0.5;
    //vec3 baseColor = vec3(0.5);

    // gradient
    //vec3 col = (m - uv.y) * baseColor;
    vec3 col = m * baseColor;

    //vec4 color = mix(destColor, vec4(col, 1.0), 0.6);
    float mixRatio;
    if(destColor.b < 0.1){
        mixRatio = 1.0;
    }else{
        mixRatio = 0.0;
    }
    vec4 color = mix(destColor, vec4(col, 1.0), mixRatio);

    gl_FragColor = vec4(color);

}
