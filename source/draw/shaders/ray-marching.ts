// ProTip: install glsl-literal to your vsCode to get syntax highlighting for glsl strings

export const RayMarchingShader = {

    vertexShader: /* glsl */`
    varying vec2 vUv;
    varying vec3 wPos;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vPosition = position;
        wPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,

    fragmentShader: /* glsl */`
    // Your code here
    uniform vec2 resolution;
    uniform vec3 cPos;
    uniform vec4 cameraQuaternion;
    uniform float fov;
    uniform float time;
    uniform mat4 tesseractRotation;
    
    #define MAX_STEPS 200
    #define SURFACE_DIST 0.01
    #define MAX_DISTANCE 100.0
    
    struct HyperSphere{
        vec4 center;
        float radius;
    };

    struct Tesseract{
        vec4 center;
        vec4 bounding;
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

    float SDFTesseract(in Tesseract tesseract,in vec4 p){
        vec4 d = abs(p - tesseract.center) - tesseract.bounding;
        return length(max(d,0.0)) + min(max(max(max(d.x,d.y),d.z),d.w),0.0);
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

    HyperSphere hyperSphere = HyperSphere(vec4(-4,0,4,0),1.0);
    HyperPlane hyperPlane = HyperPlane(vec4(0.5,0.5,-0.5,0.5),vec4(-10,-10,-10,-10));
    Tesseract tesseract = Tesseract(vec4(4,0,4,0),vec4(1.0));
    
    float getDistance(vec4 p) {

        float dist_to_hyperSphere = SDFHyperShpere(hyperSphere, p);
        
        float dist_to_hyperPlane = SDFHyperPlane(hyperPlane,p);

        vec4 _p = transpose(tesseractRotation) * p;
        float dist_to_tesseract = SDFTesseract(tesseract,_p);
      
        float d = min(min(dist_to_hyperSphere, dist_to_hyperPlane),dist_to_tesseract);
        return d;
    }

    float rayMarch(vec4 ro, vec4 rd) {
        float d0 = 0.0;
        for(int i = 0; i < MAX_STEPS; i++) {
            // Calculate the ray's current position
            vec4 p = ro + d0 * rd;
            // Get the distance from p to the closest object in the scene
            float ds = getDistance(p);
            // Move the ray
            d0 += ds;
            // Evaluate if we need to break the loop
            if(ds < SURFACE_DIST || d0 > MAX_DISTANCE) break;
        }
        // Return the ray distance
        return clamp(d0, 0.0, MAX_DISTANCE);
    }

    vec3 quaterion_rotate(vec3 v, vec4 q) {
        return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
    }
      
    void main() {
        float aspectRatio = resolution.x / resolution.y;
        vec4 cameraOrigin = vec4(cPos, 0.0);
      
        float fovMult = fov / 90.0;
        
        vec2 screenPos = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution;
        // Place the vector along the x-axis using the aspectRatio
        screenPos.x *= aspectRatio;
        // Move the vector using the field of view to match the ThreeCamera
        screenPos *= fovMult;
        vec3 ray = vec3( screenPos.xy, -1.0 );
        // Rotate the camera
        ray = quaterion_rotate(ray, cameraQuaternion);
        ray = normalize( ray );

        vec4 ray4D = vec4(ray, 0.0);
        
        // hyperSphere.center.w += sin(time/1000.0);
        // tesseract.center.xyzw += sin(time/1000.0)*5.0;
        // hyperPlane.point.xyzw += sin(time/1000.0)*10.0;
        // Run the rayMarch function
        float d = rayMarch(cameraOrigin, ray4D);
        
        float normal_d = d / MAX_DISTANCE;
      
        gl_FragColor = vec4(vec3(normal_d), 1.0);
    }
    `
};