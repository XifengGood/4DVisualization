export { Shader, vsSource, fsSource, vsSource3d, fsSource3d, UniformDataType };
// base vertex shader source
const vsSource = `
precision mediump float;
attribute vec4 aPosition;
attribute vec4 aColor;
attribute vec4 aNormal;
attribute vec2 aUv;

uniform mat4 uRotateScale4D;
uniform vec4 uTranslate4D;
uniform vec4 uCameraPositon4D;
uniform mat4 uViewMatrixWithoutTranslateCamera4D;
uniform mat4 uProjectionMatrixWithoutTranslate4D;
uniform vec4 uProjectionTranslate;
uniform vec4 uM5x1_5x4;
uniform float uM5x5;

uniform mat4 uVPMatrix;

varying vec4 vColor;
varying vec4 vNormal;
varying vec2 vUv;

void main(void){
    vec4 viewPos4D = uViewMatrixWithoutTranslateCamera4D * (uRotateScale4D * aPosition + uTranslate4D - uCameraPositon4D);
    vec4 _clipPos4D = uProjectionMatrixWithoutTranslate4D * viewPos4D + uProjectionTranslate;
    float d = dot(uM5x1_5x4 , viewPos4D) + uM5x5;
    vec4 clipPos4D = _clipPos4D / d;

    gl_Position = uVPMatrix * clipPos4D;

    vColor = aColor;
    vColor.a *= smoothstep(-1.0, 1.0, 1.0 - clipPos4D.w);
    vNormal = aNormal;
    vUv = aUv;
}
`;
// base fragment shader source
const fsSource = `
precision mediump float;
varying vec4 vColor;
varying vec4 vNormal;
varying vec2 vUv;

void main() {
    gl_FragColor = vColor;
}
`;
// base vertex shader source
const vsSource3d = `
precision mediump float;
attribute vec3 aPosition;
attribute vec4 aColor;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 uMVPMatrix;

varying vec4 vColor;
varying vec3 vNormal;
varying vec2 vUv;

void main(void){
    gl_Position = uMVPMatrix * vec4(aPosition, 1.0);

    vColor = aColor;
    vNormal = aNormal;
    vUv = aUv;
}
`;
// base fragment shader source
const fsSource3d = `
precision mediump float;
varying vec4 vColor;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    gl_FragColor = vColor;
}
`;
var UniformDataType;
(function (UniformDataType) {
    UniformDataType[UniformDataType["number"] = 0] = "number";
    UniformDataType[UniformDataType["vec2"] = 1] = "vec2";
    UniformDataType[UniformDataType["vec3"] = 2] = "vec3";
    UniformDataType[UniformDataType["vec4"] = 3] = "vec4";
    UniformDataType[UniformDataType["mat4"] = 4] = "mat4";
})(UniformDataType || (UniformDataType = {}));
;
class Shader {
    gl;
    shader;
    uniformLocation;
    attributeLocation;
    constructor(gl, vsSource, fsSource) {
        this.gl = gl;
        this.shader = initShaderProgram(gl, vsSource, fsSource);
        this.uniformLocation = new Map();
        this.attributeLocation = new Map();
    }
    use() {
        this.gl.useProgram(this.shader);
    }
    getAttributeLocation(name) {
        let location = this.attributeLocation.get(name);
        if (location != undefined && location != -1)
            return location;
        location = this.gl.getAttribLocation(this.shader, name);
        if (location != undefined && location != -1) {
            this.attributeLocation.set(name, location);
            return location;
        }
        throw new Error("don't exist this attribution: " + name);
    }
    setUniform(data) {
        const name = data.name;
        switch (data.type) {
            case UniformDataType.number: {
                let location = this.uniformLocation.get(name);
                if (location) {
                    this.gl.uniform1f(location, data.value);
                }
                else {
                    location = this.gl.getUniformLocation(this.shader, name);
                    if (!location)
                        throw new Error("can't get this uniformLocation:" + name);
                    this.uniformLocation.set(name, location);
                }
                break;
            }
            case UniformDataType.vec2: {
                let location = this.uniformLocation.get(name);
                if (location) {
                    this.gl.uniform2fv(location, data.value);
                }
                else {
                    location = this.gl.getUniformLocation(this.shader, name);
                    if (!location)
                        throw new Error("can't get this uniformLocation:" + name);
                    this.uniformLocation.set(name, location);
                }
                break;
            }
            case UniformDataType.vec3: {
                let location = this.uniformLocation.get(name);
                if (location) {
                    this.gl.uniform3fv(location, data.value);
                }
                else {
                    location = this.gl.getUniformLocation(this.shader, name);
                    if (!location)
                        throw new Error("can't get this uniformLocation:" + name);
                    this.uniformLocation.set(name, location);
                }
                break;
            }
            case UniformDataType.vec4: {
                let location = this.uniformLocation.get(name);
                if (location) {
                    this.gl.uniform4fv(location, data.value);
                }
                else {
                    location = this.gl.getUniformLocation(this.shader, name);
                    if (!location)
                        throw new Error("can't get this uniformLocation:" + name);
                    this.uniformLocation.set(name, location);
                }
                break;
            }
            case UniformDataType.mat4: {
                let location = this.uniformLocation.get(name);
                if (location) {
                    this.gl.uniformMatrix4fv(location, false, data.value);
                }
                else {
                    location = this.gl.getUniformLocation(this.shader, name);
                    if (!location)
                        throw new Error("can't get this uniformLocation:" + name);
                    this.uniformLocation.set(name, location);
                }
                break;
            }
        }
    }
    setUniforms(multilData) {
        multilData.forEach(data => {
            this.setUniform(data);
        });
    }
}
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program: " +
            gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
