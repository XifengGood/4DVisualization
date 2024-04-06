var Q=Object.defineProperty;var X=(o,a,t)=>a in o?Q(o,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[a]=t;var D=(o,a,t)=>(X(o,typeof a!="symbol"?a+"":a,t),t);import{S as Y,C as tt,P as et,W as at,V as it,G as ot,f as nt,R as rt,c as P,j as C,k as st,d as lt,B as dt,l as S,o as ct,n as ut,p as j,t as mt,q as ft}from"./three.module-lM_mZEoP.js";import{g as ht,O as vt}from"./OrbitControls-B-_LD3jF.js";import{a as gt,P as pt}from"./camera-K6jr2IUQ.js";import{i as U}from"./mesh-DYwoPhri.js";const wt=`
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
`,Pt=`

precision mediump float;
varying vec4 vColor;
varying vec4 vNormal;
varying vec2 vUv;
void main() {
    gl_FragColor = vColor;
}
`;class H extends dt{constructor(t=1,s=1,e=1,l=1){super();D(this,"length");D(this,"width");D(this,"height");D(this,"stack");D(this,"type");D(this,"parameters");this.length=t,this.width=s,this.height=e,this.stack=l,this.parameters={length:t,width:s,height:e,stack:l},this.type="TesseractGeometry";const i=Array();for(let u=0;u<16;u++)i.push([((u&1)*2-1)/2*t,((u&2)-1)/2*s,((u&4)/2-1)/2*e,((u&8)/4-1)/2*l]);const c=[],d=[],w=[[0,1,2,3,4,5,6,7],[12,13,14,15,8,9,10,11],[0,4,2,6,8,12,10,14],[5,1,7,3,13,9,15,11],[4,5,6,7,12,13,14,15],[1,0,3,2,9,8,11,10],[2,6,3,7,10,14,11,15],[1,0,5,4,9,8,13,12]],n=[],r=[],v=[[1,0,2,3],[0,4,6,2],[4,5,7,6],[5,1,3,7],[3,2,6,7],[0,1,5,4]];w.forEach((u,L)=>{const h=C(),p=i[u[0]],M=i[u[3]],y=i[u[6]],$=i[u[5]],_=C(),R=C(),q=C();S(_,M,p),S(R,y,p),S(q,$,p),ct(h,_,R,q),ut(h,h),u.forEach(b=>{n.push(...i[b]),c.push(...h),d.push(0,0)}),v.forEach((b,bt)=>{const T=L*8,A=T+b[0],J=T+b[1],V=T+b[2],K=T+b[3];r.push(A,J,V),r.push(A,V,K)})});const g=4,m=4,f=2;this.setAttribute("aPosition",new j(new Float32Array(n),g)),this.setAttribute("aNormal",new j(new Float32Array(c),m)),this.setAttribute("aUv",new j(new Float32Array(d),f)),this.setIndex(r)}}function xt(o,a){o.children[0].geometry.dispose(),o.children[0].geometry=a}const I={Tesseract:function(o,a){const t={length:1,width:1,height:1,stack:1};function s(){xt(a,new H(t.length,t.width,t.height,t.stack))}const e=O.addFolder("Tesseract");e.add(t,"length",.5,5).onChange(s),e.add(t,"width",.5,5).onChange(s),e.add(t,"length",.5,5).onChange(s),e.add(t,"stack",.5,5).onChange(s),s();const l={rotate:{xy:0,yz:0,xz:0,xw:0,yw:0,zw:0}};function i(){const m=l.rotate,f=o.rotation4D;f.xy=m.xy*Math.PI/180,f.yz=m.yz*Math.PI/180,f.xz=m.xz*Math.PI/180,f.xw=m.xw*Math.PI/180,f.yw=m.yw*Math.PI/180,f.zw=m.zw*Math.PI/180}const c=e.addFolder("Transform"),d=c.addFolder("position"),w=o.translate;d.add(w,"0",-1,1).name("x"),d.add(w,"1",-1,1).name("y"),d.add(w,"2",-1,1).name("z"),d.add(w,"3",-1,1).name("w");const n=c.addFolder("rotate"),r=l.rotate;n.add(r,"xy",-180,180).onChange(i),n.add(r,"yz",-180,180).onChange(i),n.add(r,"xz",-180,180).onChange(i),n.add(r,"xw",-180,180).onChange(i),n.add(r,"yw",-180,180).onChange(i),n.add(r,"zw",-180,180).onChange(i);const v=c.addFolder("scale"),g=o.scale;v.add(g,"0",.5,5).name("x"),v.add(g,"1",.5,5).name("y"),v.add(g,"2",.5,5).name("z"),v.add(g,"3",.5,5).name("w")}};function Dt(o,a){const t=window.location.hash.substring(1)||"TorusGeometry";I[t]!==void 0&&I[t](o,a)}const k=window.location.hash.substring(1);I[k]!==void 0&&(document.getElementById("newWindow").href+="#"+k);const O=new ht,W=new Y;W.background=new tt(4473924);const x=new et(90,window.innerWidth/window.innerHeight,.1,50);x.position.x=1;x.position.y=1;x.position.z=1;const F=new at({antialias:!0});F.setPixelRatio(window.devicePixelRatio);F.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(F.domElement);const E=new vt(x,F.domElement);E.enableZoom=!0;E.target=new it(0,0,0);const N=new ot,B=new U,Ct=new H,z=new gt({transform:new U({translate:nt(2,2,2,2)}),type:pt.Perspective,inside:1,outside:30});function Lt(o,a,t,s){const e=o.uniforms,l=a.getRotationScaleMatrix();e.uNormalMatrix4D.value=mt(P(),ft(P(),l)),e.uRotateScale4D.value=l,e.uTranslate4D.value=a.translate,e.uCameraPositon4D.value=t.transform.translate,e.uViewMatrixWithoutTranslateCamera4D.value=t.getViewMatrix4DWithoutTranslate();const i=t.getProjectionMatrix4D(),c=i.projectionMatrix4D,d=i.projectParam.translate,w=i.projectParam.m5x1_5x4,n=i.projectParam.m5x5;e.uProjectionMatrixWithoutTranslate4D.value=c,e.uProjectionTranslate.value=d,e.uM5x1_5x4.value=w,e.uM5x5.value=n,e.uViewMatrix.value=s.matrixWorldInverse,e.uProjectMatrix.value=s.projectionMatrix,e.uCameraPos.value=t.transform.translate}const G=new rt({uniforms:{uNormalMatrix4D:{value:P()},uRotateScale4D:{value:P()},uTranslate4D:{value:P()},uCameraPositon4D:{value:P()},uViewMatrixWithoutTranslateCamera4D:{value:P()},uProjectionMatrixWithoutTranslate4D:{value:P()},uProjectionTranslate:{value:C()},uM5x1_5x4:{value:C()},uM5x5:{value:1},uViewMatrix:{value:P()},uProjectMatrix:{value:P()},uCameraPos:{value:C()},material:{value:{ambient:[0,0,0],diffuse:[.6,.75,.3],specular:[1,1,1],shininess:32}},dirLight:{value:{direction:[-2,-1,1,2],ambient:[.05,.05,.05],diffuse:[.4,.4,.4],specular:[.5,.5,.5]}},pointLights:{value:[{position:[0,0,0,3],ambient:[.5,.5,.5],diffuse:[.8,.8,.8],specular:[1,1,1],constant:1,linear:.09,quadratic:.032},{position:[0,0,3,0],ambient:[.5,.5,.5],diffuse:[.8,.8,.8],specular:[1,1,1],constant:1,linear:.09,quadratic:.032},{position:[0,3,0,0],ambient:[.5,.5,.5],diffuse:[.8,.8,.8],specular:[1,1,1],constant:1,linear:.09,quadratic:.032},{position:[3,0,0,0],ambient:[.5,.5,.5],diffuse:[.8,.8,.8],specular:[1,1,1],constant:1,linear:.09,quadratic:.032}]},spotLight:{value:{position:st(z.transform.translate),direction:z.getOutSide(),ambient:[0,0,0],diffuse:[1,1,1],specular:[1,1,1],constant:1,linear:.09,quadratic:.032,cutOff:Math.cos(12.5*Math.PI/180),outerCutOff:Math.cos(15.5*Math.PI/180)}}},vertexShader:wt,fragmentShader:Pt});N.add(new lt(Ct,G));yt(O,z);Dt(B,N);Mt(O,G);W.add(N);function Z(){Lt(G,B,z,x),F.render(W,x),requestAnimationFrame(Z)}window.addEventListener("resize",function(){x.aspect=window.innerWidth/window.innerHeight,x.updateProjectionMatrix(),F.setSize(window.innerWidth,window.innerHeight)},!1);Z();function Mt(o,a){const t=o.addFolder("Material"),s=a.uniforms.material.value;t.addColor(s,"ambient"),t.addColor(s,"diffuse"),t.addColor(s,"specular"),t.add(s,"shininess",1,64);const e=o.addFolder("Light"),l=e.addFolder("DirectionalLight"),i=l.addFolder("Direction"),c=a.uniforms.dirLight.value,d=c.direction;i.add(d,"0",-5,5).name("x"),i.add(d,"1",-5,5).name("y"),i.add(d,"2",-5,5).name("z"),i.add(d,"3",-5,5).name("w"),l.addColor(c,"ambient"),l.addColor(c,"diffuse"),l.addColor(c,"specular");const w=e.addFolder("PointLight");for(let L=0;L<a.uniforms.pointLights.value.length;L++){const h=a.uniforms.pointLights.value[L],p=w.addFolder("PointLight "+L.toString()),M=p.addFolder("Position"),y=h.position;M.add(y,"0",-5,5).name("x"),M.add(y,"1",-5,5).name("y"),M.add(y,"2",-5,5).name("z"),M.add(y,"3",-5,5).name("w"),p.addColor(h,"ambient"),p.addColor(h,"diffuse"),p.addColor(h,"specular"),p.add(h,"constant",0,1),p.add(h,"linear",0,1),p.add(h,"quadratic",0,1)}const n=e.addFolder("SpotLight"),r=a.uniforms.spotLight.value,v=n.addFolder("Position"),g=r.position;v.add(g,"0",-5,5).name("x"),v.add(g,"1",-5,5).name("y"),v.add(g,"2",-5,5).name("z"),v.add(g,"3",-5,5).name("w");const m=n.addFolder("Direction"),f=r.direction;m.add(f,"0",-5,5).name("x"),m.add(f,"1",-5,5).name("y"),m.add(f,"2",-5,5).name("z"),m.add(f,"3",-5,5).name("w"),n.addColor(r,"ambient"),n.addColor(r,"diffuse"),n.addColor(r,"specular"),n.add(r,"constant",0,1),n.add(r,"linear",0,1),n.add(r,"quadratic",0,1);const u={cutOff:12.5,outerCutOff:15.5};n.add(u,"cutOff",0,180).onChange(()=>{r.cutOff=u.cutOff*Math.PI/180}),n.add(u,"outerCutOff",0,180).onChange(()=>{r.outerCutOff=u.outerCutOff*Math.PI/180})}function yt(o,a){const t=o.addFolder("Camera4D"),s=a.transform,e=t.addFolder("Transform"),l=e.addFolder("Position"),i=s.translate;l.add(i,"0",-5,5).name("x"),l.add(i,"1",-5,5).name("y"),l.add(i,"2",-5,5).name("z"),l.add(i,"3",-5,5).name("w");const c=a.lookAtPoint,d=e.addFolder("LookAtPoint");d.add(c,"0",-5,5).name("x"),d.add(c,"1",-5,5).name("y"),d.add(c,"2",-5,5).name("z"),d.add(c,"3",-5,5).name("w"),t.add(a,"inside",0,10),t.add(a,"outside",0,100)}
