// ProTip: install glsl-literal to your vsCode to get syntax highlighting for glsl strings
export const RayMarchingHyperSphereShader = {
    vertexShader: /* glsl */ `

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,
    fragmentShader: /* glsl */ `
    
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

    HyperSphere hyperSphere = HyperSphere(vec4(0,0,4,0),1.0);
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

    float getDistance(in Ray ray,out vec4 color) {
        vec4 p = ray.end;

        float dist_to_hyperSphere = SDFHyperShpere(hyperSphere, p);
        float dist_to_hyperPlane = SDFHyperPlane(hyperPlane,p);

        float d = min(dist_to_hyperSphere, dist_to_hyperPlane);

        if(dist_to_hyperSphere<=dist_to_hyperPlane){
            vec4 normal = normalize( p - hyperSphere.center );
            color = vec4(CalcDirLight(dirLight,normal,-ray.direction, hyperSphereMaterial), 1.0);
        }else if(dist_to_hyperPlane<0.1){
            color = vec4(CalcDirLight(dirLight,hyperPlane.normal,-ray.direction, hyperPlaneMaterial), 1.0);
        }else{
            color = vec4(0,0,0,1);
        }
      
        return d;
    }

    float rayMarch(in Ray ray,out vec4 color) {
        for(int i = 0; i < MAX_STEPS; i++) {
            ray.end= ray.origin + ray.direction * ray.length;

            float ds = getDistance(ray,color);
            
            ray.length += ds;
            
            if(ds < SURFACE_DIST || ray.length > MAX_DISTANCE) break;
        }
        // Return the ray distance
        return clamp(ray.length, 0.0, MAX_DISTANCE);
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

        hyperSphere.center = transform.translate;
        hyperSphere.radius = radius;
        hyperPlane.point.w += sin(time/1000.0)*10.0;
        // hyperSphere.center.w += sin(time/1000.0)*1.2;
 
        // Run the rayMarch function
        vec4 color = vec4(0);
        float d = rayMarch(ray,color);
        
        float normal_d = d / MAX_DISTANCE;
                
        // gl_FragColor = vec4(vec3(normal_d),1.0);
        gl_FragColor = vec4(color.xyz,1.0 - normal_d);
        // gl_FragColor = vec4(color.xyzw);
    }
    `
};
