precision mediump float;

// uniform
uniform sampler2D bumpTex;
uniform sampler2D landTex;
uniform sampler2D earthTex;
uniform mat4 viewMatrix;

// from vs
varying vec3 mvPosition;
varying vec3 vNormal;
varying vec2 vUv;



void main() {
    vec4 bumpColor = texture2D(bumpTex, vUv);
    vec4 landColor = texture2D(landTex, vUv);
    vec4 earthColor = texture2D(earthTex, vUv);

//    vec3 color = landColor.xyz / 3.0;
//    vec3 diffuse = color * lightColor * max(dotNL, 0.0);
//
//    vec3 C = - normalize(mvPosition);
//    vec3 R = reflect(-L, N);
//    //反射ベクトルとカメラ方向ベクトルとの内積
//    float dotRC = dot(R, C);
//    //鏡面色の決定
//    vec3 specular = lightColor * pow(max(dotRC, 0.0), 10.0);
//
//    vec4 destColor = vec4(diffuse + specular, 1.0);
//    //destColor = vec4(diffuse, 1.0);
//    destColor.rgb += color.rgb * 0.1;
//
////    if(landColor.r > 0.5){
////        destColor.a = 0.1;
////    }

    gl_FragColor = earthColor;



//    if(isText == false){
//        gl_FragColor = white - lColor;
//    }
//    else{
//        gl_FragColor = tcolor * mColor;
//    }

    //gl_FragColor.a = gl_FragColor.a * 0.5;
}

