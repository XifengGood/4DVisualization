import{Z as A,B as E,F as C,d as H,_ as M,$ as I,a0 as b,a1 as k,a2 as U,a3 as B,a4 as q,C as N,W as Q,P as X,S as O,c as W,K as G}from"./three.module-lM_mZEoP.js";import{G as V,O as j}from"./OrbitControls-B-_LD3jF.js";const K={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class _{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Z=new A(-1,1,1,-1,0,1);class Y extends E{constructor(){super(),this.setAttribute("position",new C([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new C([0,2,0,0,2,0],2))}}const $=new Y;class J{constructor(e){this._mesh=new H($,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Z)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class P extends _{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof M?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=I.clone(e.uniforms),this.material=new M({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new J(this.material)}render(e,t,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class R extends _{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,a){const r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let s,n;this.inverse?(s=0,n=1):(s=1,n=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,s,4294967295),i.buffers.stencil.setClear(n),i.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}}class ee extends _{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class te{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const a=e.getSize(new b);this._width=a.width,this._height=a.height,t=new k(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:U}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new P(K),this.copyPass.material.blending=B,this.clock=new q}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let a=!1;for(let r=0,i=this.passes.length;r<i;r++){const s=this.passes[r];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),s.needsSwap){if(a){const n=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(n.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(n.EQUAL,1,4294967295)}this.swapBuffers()}R!==void 0&&(s instanceof R?a=!0:s instanceof ee&&(a=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new b);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const a=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(a,r),this.renderTarget2.setSize(a,r);for(let i=0;i<this.passes.length;i++)this.passes[i].setSize(a,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ie extends _{constructor(e,t,a=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=a,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new N}render(e,t,a){const r=e.autoClear;e.autoClear=!1;let i,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor)),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=r}}const ae={vertexShader:`

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,fragmentShader:`
    
    struct Transform{
        vec4 translate;
    };
    uniform float radius;
    
    uniform Transform transform;

    #define MAX_STEPS 200
    #define SURFACE_DIST 0.01
    #define MAX_DISTANCE 100.0
    
    struct HyperSphere{
        vec4 center;
        float radius;
    };

    struct HyperPlane{
        vec4 normal;
        vec4 point;
    };

    float SDFHyperShpere(in HyperSphere hyperSphere,in vec4 p){
        return length(p - hyperSphere.center) - hyperSphere.radius;
    }

    float SDFHyperPlane(in HyperPlane hyperPlane,in vec4 p){
        return dot((p - hyperPlane.point), hyperPlane.normal);
    }

    float opUnion( float d1, float d2 ) {  return min(d1,d2); }

    float opSubtraction( float d1, float d2 ) { return max(d1,-d2); }

    float opIntersection( float d1, float d2 ) { return max(d1,d2); }

    float opSmoothUnion( float d1, float d2, float k ) 
    {
        float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
        return mix( d2, d1, h ) - k*h*(1.0-h);
    }

    float OpSDF(in float s_sdf, in float e_sdf, int op_t)
    {
        if(op_t == 0)
        {
            return opUnion(s_sdf,e_sdf);
        }
        else if(op_t == 1)
        {
            return opSubtraction(s_sdf,e_sdf);
        }
        else if(op_t == 2)
        {
            return opIntersection(s_sdf,e_sdf);
        }
        else if(op_t == 3)
        {
            return opSmoothUnion(s_sdf,e_sdf,1.0f);
        }
        return 0.0;
    }

    HyperSphere hyperSphere = HyperSphere(vec4(0,0,0,0),1.0);
    HyperPlane hyperPlane = HyperPlane(vec4(0.5,0.5,-0.5,0.5),vec4(-10,-10,-10,-10));

    struct Ray{
        vec4 origin;
        vec4 direction;
        float length;
        vec4 end;
    };
    struct DirLight {
        vec4 direction;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
    };
    struct Material{
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };
    uniform DirLight dirLight;
    uniform Material hyperSphereMaterial;
    uniform Material hyperPlaneMaterial;
    vec3 CalcDirLight(DirLight light, vec4 normal, vec4 viewDir,Material material);
    vec3 CalcDirLight(DirLight light,vec4 normal, vec4 viewDir,Material material){
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

    float getDistance(in vec4 p);
    vec4 calcNormal( in vec4 p ) // for function f(p)
    {
        const float eps = 0.0001; // or some other value
        const vec2 h = vec2(eps,0);
        return normalize( vec4( getDistance(p+h.xyyy) - getDistance(p-h.xyyy),
                                getDistance(p+h.yxyy) - getDistance(p-h.yxyy),
                                getDistance(p+h.yyxy) - getDistance(p-h.yyxy),
                                getDistance(p+h.yyyx) - getDistance(p-h.yyyx)) );
    }
    Material material;
    float getDistance(in vec4 p) {
        vec4 _p = (p - transform.translate) / radius;

        float dist_to_hyperSphere = SDFHyperShpere(hyperSphere, _p);
        float dist_to_hyperPlane = SDFHyperPlane(hyperPlane,p);

        float d = min(dist_to_hyperSphere, dist_to_hyperPlane);

        if(dist_to_hyperSphere<=dist_to_hyperPlane){
            material = hyperSphereMaterial;
        }else if(dist_to_hyperPlane<0.01){
            material = hyperPlaneMaterial;
        }

        return d;
    }

    vec4 rayMarch(in Ray ray) {
        for(int i = 0; i < MAX_STEPS; i++) {
            ray.end= ray.origin + ray.direction * ray.length;

            float ds = getDistance(ray.end);
            
            ray.length += ds;
            
            if(ds < SURFACE_DIST || ray.length > MAX_DISTANCE) break;
        }
        vec4 normal = calcNormal(ray.end);
        vec4 color;
        if(ray.length < MAX_DISTANCE){
            color.xyz = CalcDirLight(dirLight,normal,-ray.direction, material);
        }else{
            color.xyz = vec3(1.0,1.0,1.0);
        }
        color.a = 1.0 - clamp(ray.length, 0.0, MAX_DISTANCE) / MAX_DISTANCE;
        return color;
    }
    

    uniform vec2 viewport;
    uniform float fov;
    uniform vec4 cameraQuaternion;
    uniform float time;

    vec3 quaterion_rotate(vec3 v, vec4 q) {
        return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
    }
    void main() {
        
        vec2 screenPos =  gl_FragCoord.xy/viewport.xy * 2.0 - 1.0;
        float aspectRatio = viewport.x / viewport.y;
        float fovMult = fov / 90.0;
        
        screenPos.x *= aspectRatio;
        screenPos *= fovMult;
        
        vec3 dir = vec3( screenPos.xy, -1.0 );
        // Rotate the camera
        dir = quaterion_rotate(dir, cameraQuaternion);
        dir = normalize( dir );


        Ray ray = Ray(vec4(cameraPosition,0.0), vec4(dir,0.0), 0.0,vec4(cameraPosition,0.0));
        
        hyperPlane.point.w += sin(time/1000.0)*10.0;
        // hyperSphere.center.w += sin(time/1000.0)*1.2;
 
        // Run the rayMarch function
        vec4 color = rayMarch(ray);

        gl_FragColor = vec4(color.xyzw);
    }
    `},re={vertexShader:`

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,fragmentShader:`
    
    struct Transform{
        vec4 translate;
        mat4 rotation;
        vec4 scale;
    };
    
    uniform Transform transform;

    #define MAX_STEPS 200
    #define SURFACE_DIST 0.01
    #define MAX_DISTANCE 100.0
    
    struct Tesseract{
        vec4 center;
        vec4 bound;
    };

    struct HyperPlane{
        vec4 normal;
        vec4 point;
    };

    float SDFTesseract(in Tesseract tesseract,in vec4 p){
        vec4 d = abs(p - tesseract.center) - tesseract.bound;
        return length(max(d,0.0)) + min(max(max(max(d.x,d.y),d.z),d.w),0.0);
    }

    float SDFHyperPlane(in HyperPlane hyperPlane,in vec4 p){
        return dot((p - hyperPlane.point), hyperPlane.normal);
    }

    float opUnion( float d1, float d2 ) {  return min(d1,d2); }

    float opSubtraction( float d1, float d2 ) { return max(d1,-d2); }

    float opIntersection( float d1, float d2 ) { return max(d1,d2); }

    float opSmoothUnion( float d1, float d2, float k ) 
    {
        float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
        return mix( d2, d1, h ) - k*h*(1.0-h);
    }

    float OpSDF(in float s_sdf, in float e_sdf, int op_t)
    {
        if(op_t == 0)
        {
            return opUnion(s_sdf,e_sdf);
        }
        else if(op_t == 1)
        {
            return opSubtraction(s_sdf,e_sdf);
        }
        else if(op_t == 2)
        {
            return opIntersection(s_sdf,e_sdf);
        }
        else if(op_t == 3)
        {
            return opSmoothUnion(s_sdf,e_sdf,1.0f);
        }
        return 0.0;
    }

    uniform Tesseract tesseract;
    HyperPlane hyperPlane = HyperPlane(vec4(0.5,0.5,-0.5,0.5),vec4(-10,-10,-10,-10));

    struct Ray{
        vec4 origin;
        vec4 direction;
        float length;
        vec4 end;
    };
    struct DirLight {
        vec4 direction;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
    };
    struct Material{
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };
    uniform DirLight dirLight;
    uniform Material tesseractMaterial;
    uniform Material hyperPlaneMaterial;
    
    vec3 CalcDirLight(DirLight light, vec4 normal, vec4 viewDir,Material material);
    vec3 CalcDirLight(DirLight light,vec4 normal, vec4 viewDir,Material material){
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

    float getDistance(in vec4 p);
    vec4 calcNormal( in vec4 p ) // for function f(p)
    {
        const float eps = 0.0001; // or some other value
        const vec2 h = vec2(eps,0);
        return normalize( vec4( getDistance(p+h.xyyy) - getDistance(p-h.xyyy),
                                getDistance(p+h.yxyy) - getDistance(p-h.yxyy),
                                getDistance(p+h.yyxy) - getDistance(p-h.yyxy),
                                getDistance(p+h.yyyx) - getDistance(p-h.yyyx)) );
    }

    Material material;
    float getDistance(in vec4 p) {
        
        vec4 _p = transpose(transform.rotation) * (p - transform.translate) / transform.scale;


        float dist_to_tesseract = SDFTesseract(tesseract, _p);
        float dist_to_hyperPlane = SDFHyperPlane(hyperPlane,p);

        float d = min(dist_to_tesseract, dist_to_hyperPlane);

        if(dist_to_tesseract<=dist_to_hyperPlane){
            material = tesseractMaterial;
        }else if(dist_to_hyperPlane<0.01){
            material = hyperPlaneMaterial;
        }
        
        return d;
    }

    vec4 rayMarch(in Ray ray) {
        for(int i = 0; i < MAX_STEPS; i++) {
            ray.end= ray.origin + ray.direction * ray.length;

            float ds = getDistance(ray.end);
            
            ray.length += ds;
            
            if(ds < SURFACE_DIST || ray.length > MAX_DISTANCE) break;
        }
        vec4 normal = calcNormal(ray.end);
        vec4 color;
        if(ray.length < MAX_DISTANCE){
            color.xyz = CalcDirLight(dirLight,normal,-ray.direction, material);
        }else{
            color.xyz = vec3(1.0,1.0,1.0);
        }
        color.a = 1.0 - clamp(ray.length, 0.0, MAX_DISTANCE) / MAX_DISTANCE;
        return color;
    }
    

    uniform vec2 viewport;
    uniform float fov;
    uniform vec4 cameraQuaternion;
    uniform float time;

    vec3 quaterion_rotate(vec3 v, vec4 q) {
        return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
    }
    void main() {
        
        vec2 screenPos =  gl_FragCoord.xy/viewport.xy * 2.0 - 1.0;
        float aspectRatio = viewport.x / viewport.y;
        float fovMult = fov / 90.0;
        
        screenPos.x *= aspectRatio;
        screenPos *= fovMult;
        
        vec3 dir = vec3( screenPos.xy, -1.0 );
        // Rotate the camera
        dir = quaterion_rotate(dir, cameraQuaternion);
        dir = normalize( dir );


        Ray ray = Ray(vec4(cameraPosition,0.0), vec4(dir,0.0), 0.0,vec4(cameraPosition,0.0));

        
        hyperPlane.point.w += sin(time/1000.0)*10.0;
        
        vec4 color = rayMarch(ray);

        gl_FragColor = vec4(color.xyzw);
        
    }
    `},h=new V,F={Tesseract:function(o){const e={rotation:{xy:0,yz:0,xz:0,xw:0,yw:0,zw:0}},t=new P({...re,uniforms:{viewport:{value:[window.innerWidth*window.devicePixelRatio,window.innerHeight*window.devicePixelRatio]},cameraQuaternion:{value:c.quaternion},fov:{value:c.fov},time:{value:0},tesseract:{value:{center:[0,0,0,0],bound:[1,1,1,1]}},transform:{value:{translate:[0,0,4,0],rotation:W(),scale:[1,1,1,1]}},tesseractMaterial:{value:{ambient:[1,1,1],diffuse:[.6,.75,.3],specular:[1,1,1],shininess:32}},hyperPlaneMaterial:{value:{ambient:[0,0,0],diffuse:[1,.7,1],specular:[1,1,1],shininess:32}},dirLight:{value:{direction:[-1,-1,1,2],ambient:[.3,.3,.3],diffuse:[1,1,1],specular:[1,1,1]}}}});function a(){const z={xy:e.rotation.xy/180*Math.PI,yz:e.rotation.yz/180*Math.PI,xz:e.rotation.xz/180*Math.PI,xw:e.rotation.xw/180*Math.PI,yw:e.rotation.yw/180*Math.PI,zw:e.rotation.zw/180*Math.PI};t.uniforms.transform.value.rotation=G.rotation(z)}const r=h.addFolder("Tesseract"),i=r.addFolder("Transform"),s=i.addFolder("Position"),n=t.uniforms.transform.value.translate;s.add(n,"0",-5,5).name("x"),s.add(n,"1",-5,5).name("y"),s.add(n,"2",-5,5).name("z"),s.add(n,"3",-5,5).name("w");const l=i.addFolder("Rotation");l.add(e.rotation,"xy",-180,180).onChange(a),l.add(e.rotation,"yz",-180,180).onChange(a),l.add(e.rotation,"xz",-180,180).onChange(a),l.add(e.rotation,"xw",-180,180).onChange(a),l.add(e.rotation,"yw",-180,180).onChange(a),l.add(e.rotation,"zw",-180,180).onChange(a);const d=t.uniforms.transform.value.scale,f=i.addFolder("Scale");f.add(d,"0",.5,5).name("x"),f.add(d,"1",.5,5).name("y"),f.add(d,"2",.5,5).name("z"),f.add(d,"3",.5,5).name("w");const x=h.addFolder("DirectionalLight"),S=t.uniforms.dirLight.value,p=t.uniforms.dirLight.value.direction,m=h.addFolder("Direction");m.add(p,"0",-5,5).name("x"),m.add(p,"1",-5,5).name("y"),m.add(p,"2",-5,5).name("z"),m.add(p,"3",-5,5).name("w"),x.addColor(S,"ambient"),x.addColor(S,"diffuse"),x.addColor(S,"specular");const v=r.addFolder("Material"),y=t.uniforms.tesseractMaterial.value;return v.addColor(y,"ambient"),v.addColor(y,"diffuse"),v.addColor(y,"specular"),v.add(y,"shininess"),o.addPass(t),t},HyperSphere:function(o){const e=new P({...ae,uniforms:{viewport:{value:[window.innerWidth,window.innerHeight]},cameraQuaternion:{value:c.quaternion},fov:{value:c.fov},time:{value:0},transform:{value:{translate:[0,0,2,.5]}},radius:{value:1},hyperSphereMaterial:{value:{ambient:[1,1,1],diffuse:[.6,.75,.3],specular:[1,1,1],shininess:32}},hyperPlaneMaterial:{value:{ambient:[0,0,0],diffuse:[1,.7,1],specular:[1,1,1],shininess:32}},dirLight:{value:{direction:[-1,-1,1,2],ambient:[.05,.05,.05],diffuse:[1,1,1],specular:[.5,.5,.5]}}}}),t=h.addFolder("HyperSphere"),a=t.addFolder("Translate"),r=e.uniforms.transform.value.translate;a.add(r,"0",-10,10).name("x"),a.add(r,"1",-10,10).name("y"),a.add(r,"2",-10,10).name("z"),a.add(r,"3",-10,10).name("w"),t.add(e.uniforms.radius,"value",.5,5).name("Radius");const i=t.addFolder("Material"),s=h.addFolder("DirectionalLight"),n=e.uniforms.dirLight.value,l=e.uniforms.dirLight.value.direction,d=h.addFolder("Direction");d.add(l,"0",-5,5).name("x"),d.add(l,"1",-5,5).name("y"),d.add(l,"2",-5,5).name("z"),d.add(l,"3",-5,5).name("w"),s.addColor(n,"ambient"),s.addColor(n,"diffuse"),s.addColor(n,"specular");const f=e.uniforms.hyperSphereMaterial.value;return i.addColor(f,"ambient"),i.addColor(f,"diffuse"),i.addColor(f,"specular"),i.add(f,"shininess"),o.addPass(e),e}};function se(o){const e=window.location.hash.substring(1)||"Tesseract";if(F[e]!==void 0)return F[e](o)}const oe=document.querySelector("#ray-marching"),u=new Q({antialias:!0,canvas:oe});u.setPixelRatio(window.devicePixelRatio);u.setClearColor(0,1);const c=new X(90,window.innerWidth/window.innerHeight,.1,50),D=new j(c,u.domElement);c.position.set(0,0,0);D.target.set(0,0,4);D.enableZoom=!0;D.update();const ne=new O,w=new te(u);w.addPass(new ie(ne,c));const g=se(w),T=o=>{w.render(),g.uniforms.fov.value=c.fov,g.uniforms.cameraQuaternion.value=c.quaternion,g.uniforms.time.value=o,requestAnimationFrame(T)};requestAnimationFrame(T);const le=()=>{const o=window.innerWidth,e=window.innerHeight,t=window.devicePixelRatio;return{width:o*t,height:e*t,innerWidth:o,innerHeight:e,devicePixelRatio:t}},L=()=>{const{width:o,height:e,innerHeight:t,innerWidth:a}=le();u.setSize(a,t),w.setSize(a,t),c.aspect=a/t,c.updateProjectionMatrix(),g.uniforms.viewport.value=[o,e]};L();window.addEventListener("resize",L);
