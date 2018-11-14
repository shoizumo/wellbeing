precision mediump float;

// uniform
uniform vec3 color;
uniform sampler2D map;
uniform sampler2D land;
uniform sampler2D textureImg;
uniform bool isText;
uniform mat4 viewMatrix;

// from vs
varying vec3 mvPosition;
varying vec3 vNormal;
varying vec2 vUv;

vec3 lightPosition = vec3(-200.0, 50.0, -0.0);
vec3 lightColor = vec3(1.0, 0.0, 0.0);


void main() {
    vec4 mColor = texture2D(map, vUv);
    vec4 lColor = texture2D(land, vUv);
    vec4 tcolor = texture2D(textureImg, vUv);
    //vec4 white = vec4(0.5, 0.5, 0.5, 0.0);

    vec4 viewLightPosition = viewMatrix * vec4( lightPosition, 0.0);
    vec3 N = normalize(vNormal);               //法線ベクトル
    vec3 L = normalize(viewLightPosition.xyz); //光線ベクトル
    //法線ベクトルと光線ベクトルの内積
    float dotNL = dot(N, L);
    //拡散色の決定
    vec3 color = vec4(tcolor * mColor).xyz;
    color = lColor.xyz;
    vec3 diffuse = color * lightColor * max(dotNL, 0.0);

    vec3 C = - normalize(mvPosition );
    vec3 R = reflect(-L, N);
    //反射ベクトルとカメラ方向ベクトルとの内積
    float dotRC = dot(R, C);
    //鏡面色の決定
    vec3 specular = lightColor * pow(max(dotRC, 0.0), 2.0);

    vec4 destColor = vec4(diffuse + specular, 1.0);
    destColor = vec4(diffuse, 1.0);
    destColor.rgb += color.rgb * 0.1;

    gl_FragColor = destColor;

//    if(isText == false){
//        gl_FragColor = white - lColor;
//    }
//    else{
//        gl_FragColor = tcolor * mColor;
//    }

    //gl_FragColor.a = gl_FragColor.a * 0.5;
}

