import { vec3, vec4, mat4, quat } from "gl-matrix";
export { Transform3D };
class Transform3D {
    translate;
    rotation;
    scale;
    constructor({ translate = vec3.create(), rotation = quat.create(), scale = vec3.fromValues(1, 1, 1) } = {}) {
        this.translate = translate;
        this.rotation = rotation;
        this.scale = scale;
    }
    getModelMatrix() {
        let modelMatrix = mat4.create();
        mat4.fromRotationTranslationScale(modelMatrix, this.rotation, this.translate, this.scale);
        return modelMatrix;
    }
    transform(args) {
        function isVec3(arg) {
            return Array.isArray(arg) && arg.length === 3 && typeof arg[0] === 'number' && typeof arg[1] === 'number' && typeof arg[2] === 'number';
        }
        if (args instanceof Vertex3D) {
            const pos = args.position;
            const _pos = toHomogeneous(pos);
            const res = vec4.create();
            vec4.transformMat4(res, _pos, this.getModelMatrix());
            return res;
        }
        else if (isVec3(args)) {
            const pos = args;
            const _pos = toHomogeneous(pos);
            const res = vec4.create();
            vec4.transformMat4(res, _pos, this.getModelMatrix());
            return res;
        }
        else {
            if (args.length === 0)
                return [];
            else if (args[0] instanceof Vertex3D) {
                const vertice = args;
                const modelMatrix = this.getModelMatrix();
                const res = [];
                vertice.forEach(vertex => {
                    const _pos = toHomogeneous(vertex.position);
                    const _res = vec4.create();
                    vec4.transformMat4(_res, _pos, modelMatrix);
                    res.push(_res);
                });
                return res;
            }
            else {
                const positions = args;
                const modelMatrix = this.getModelMatrix();
                const res = [];
                positions.forEach(pos => {
                    const _pos = toHomogeneous(pos);
                    const _res = vec4.create();
                    vec4.transformMat4(_res, _pos, modelMatrix);
                    res.push(_res);
                });
                return res;
            }
        }
    }
}
import { Rotate4DMatrix, toHomogeneous } from "./base";
import { Vertex3D, Vertex4D } from "./mesh";
export { Transform4D };
class Transform4D {
    translate;
    rotation4D;
    scale;
    constructor({ translate = vec4.create(), rotation4D = new Rotation4D(), scale = vec4.fromValues(1, 1, 1, 1) } = {}) {
        this.translate = translate;
        this.rotation4D = rotation4D;
        this.scale = scale;
    }
    getRotationScaleMatrix() {
        const RSMatrix = this.rotation4D.getRotationMatrix();
        RSMatrix[0] = RSMatrix[0] * this.scale[0];
        RSMatrix[5] = RSMatrix[5] * this.scale[1];
        RSMatrix[10] = RSMatrix[10] * this.scale[2];
        RSMatrix[15] = RSMatrix[15] * this.scale[3];
        return RSMatrix;
    }
    transform(arg) {
        function isVec4(arg) {
            return Array.isArray(arg) && arg.length === 3 && typeof arg[0] === 'number' && typeof arg[1] === 'number' && typeof arg[2] === 'number';
        }
        function isVertex4DArray(arg) {
            return Array.isArray(arg) && (arg.length === 0 || arg[0] instanceof Vertex4D);
        }
        if (arg instanceof Vertex4D) {
            const pos = arg.position;
            const RSMatrix = this.getRotationScaleMatrix();
            const res = vec4.create();
            vec4.transformMat4(res, pos, RSMatrix);
            vec4.add(res, res, this.translate);
            return res;
        }
        else if (isVec4(arg)) {
            const pos = arg;
            const RSMatrix = this.getRotationScaleMatrix();
            const res = vec4.create();
            vec4.transformMat4(res, pos, RSMatrix);
            vec4.add(res, res, this.translate);
            return res;
        }
        else {
            if (arg.length === 0)
                return [];
            if (isVertex4DArray(arg)) {
                const worldPositions = [];
                const RSMatrix = this.getRotationScaleMatrix();
                arg.forEach(v => {
                    const objectPos = v.position;
                    const worldPos = vec4.create();
                    vec4.transformMat4(worldPos, objectPos, RSMatrix);
                    vec4.add(worldPos, worldPos, this.translate);
                    worldPositions.push(worldPos);
                });
                return worldPositions;
            }
            else {
                const worldPositions = [];
                const RSMatrix = this.getRotationScaleMatrix();
                arg.forEach(p => {
                    const objectPos = p;
                    const worldPos = vec4.create();
                    vec4.transformMat4(worldPos, objectPos, RSMatrix);
                    vec4.add(worldPos, worldPos, this.translate);
                    worldPositions.push(worldPos);
                });
                return worldPositions;
            }
        }
    }
}
class Rotation4D {
    xy;
    yz;
    xz;
    xw;
    yw;
    zw;
    constructor(xy = 0, yz = 0, xz = 0, xw = 0, yw = 0, zw = 0) {
        this.xy = xy;
        this.yz = yz;
        this.xz = xz;
        this.xw = xw;
        this.yw = yw;
        this.zw = zw;
    }
    getRotationMatrix() {
        const xyRotateMatrix = Rotate4DMatrix.rotateXY(this.xy);
        const yzRotateMatrix = Rotate4DMatrix.rotateYZ(this.yz);
        const xzRotateMatrix = Rotate4DMatrix.rotateXZ(this.xz);
        const xwRotateMatrix = Rotate4DMatrix.rotateXW(this.xw);
        const ywRotateMatrix = Rotate4DMatrix.rotateYW(this.yw);
        const zwRotateMatrix = Rotate4DMatrix.rotateZW(this.zw);
        const rotateMatrix = mat4.create();
        mat4.mul(rotateMatrix, xyRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, xzRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, yzRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, xwRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, ywRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, zwRotateMatrix, rotateMatrix);
        return rotateMatrix;
    }
}
