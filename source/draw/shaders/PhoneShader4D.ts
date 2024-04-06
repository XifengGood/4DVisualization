export { vsSource, fsSource }
const vsSource = /* glsl */`
precision mediump float;
attribute vec4 aPosition;
attribute vec4 aNormal;
attribute vec2 aUv;

uniform mat4 uNormalMatrix4D;

uniform mat4 uRotateScale4D;
uniform vec4 uTranslate4D;
uniform vec4 uCameraPositon4D;
uniform mat4 uViewMatrixWithoutTranslateCamera4D;
uniform mat4 uProjectionMatrixWithoutTranslate4D;
uniform vec4 uProjectionTranslate;
uniform vec4 uM5x1_5x4;
uniform float uM5x5;

uniform mat4 uVPMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectMatrix;

varying vec4 vColor;
varying vec4 vNormal;
varying vec2 vUv;

struct DirLight {
    vec4 direction;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
struct PointLight {
    vec4 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};
struct SpotLight {
    vec4 position;
    vec4 direction;
    float cutOff;
    float outerCutOff;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};

struct Material{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};


#define NR_POINT_LIGHTS 4
uniform DirLight dirLight;
uniform PointLight pointLights[NR_POINT_LIGHTS];
uniform SpotLight spotLight;
uniform Material material;

// function prototypes
vec3 CalcDirLight(DirLight light, vec4 normal, vec4 viewDir);
vec3 CalcPointLight(PointLight light, vec4 normal, vec4 fragPos, vec4 viewDir);
vec3 CalcSpotLight(SpotLight light, vec4 normal, vec4 fragPos, vec4 viewDir);


void main(void){
    vec4 viewPos4D = uViewMatrixWithoutTranslateCamera4D * (uRotateScale4D * aPosition + uTranslate4D - uCameraPositon4D);
    vec4 _clipPos4D = uProjectionMatrixWithoutTranslate4D * viewPos4D + uProjectionTranslate;
    float d = dot(uM5x1_5x4 , viewPos4D) + uM5x5;
    vec4 clipPos4D = _clipPos4D / d;

    gl_Position = uProjectMatrix * uViewMatrix * clipPos4D;

    // 计算光照
    vNormal = uNormalMatrix4D * aNormal;
    vUv = aUv;
    vec4 vWorldPos = uRotateScale4D * aPosition + uTranslate4D;  

    vec4 norm = normalize(vNormal);
    vec4 viewDir = normalize(uCameraPositon4D - vWorldPos);
    vec3 result = CalcDirLight(dirLight,norm,viewDir);
    for(int i=0;i<NR_POINT_LIGHTS;i++)
        result += CalcPointLight(pointLights[i],norm,vWorldPos,viewDir);
    result += CalcSpotLight(spotLight,norm,vWorldPos,viewDir);

    vColor = vec4(result,1.0);
          
}
vec3 CalcDirLight(DirLight light,vec4 normal,vec4 viewDir){
    vec4 lightDir = normalize(-light.direction);
    // 漫反射着色
    float diff = max(dot(normal, lightDir), 0.0);
    // 镜面光着色
    vec4 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // 合并结果
    vec3 ambient  = light.ambient  * material.ambient;
    vec3 diffuse  = light.diffuse  * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;
    return (ambient + diffuse + specular);
}

vec3 CalcPointLight(PointLight light, vec4 normal, vec4 fragPos, vec4 viewDir)
{
    vec4 lightDir = normalize(light.position - fragPos);
    // 漫反射着色
    float diff = max(dot(normal, lightDir), 0.0);
    // 镜面光着色
    vec4 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // 衰减
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // 合并结果
    vec3 ambient  = light.ambient  * material.ambient;
    vec3 diffuse  = light.diffuse  * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}

vec3 CalcSpotLight(SpotLight light,vec4 normal, vec4 fragPos, vec4 viewDir){
    vec4 lightDir = normalize(light.position - fragPos);
    // 漫反射着色
    float diff = max(dot(normal, lightDir), 0.0);
    // 镜面光着色
    vec4 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // 聚光灯强度
    float theta = dot(lightDir, normalize(-light.direction)); 
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
    // 合并结果
    vec3 ambient  = light.ambient  * material.ambient;
    vec3 diffuse  = light.diffuse  * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;
    ambient *= attenuation * intensity;
    diffuse *= attenuation * intensity;
    specular *= attenuation * intensity;
    return (ambient + diffuse + specular);
}
`

// base fragment shader source
const fsSource = /* glsl */`

precision mediump float;
varying vec4 vColor;
varying vec4 vNormal;
varying vec2 vUv;
void main() {
    gl_FragColor = vColor;
}
`;