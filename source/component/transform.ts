import { vec3, vec4, mat4, quat } from "gl-matrix";
export { Transform3D }


class Transform3D {
    translate;
    rotation;
    scale;
    constructor({
        translate = vec3.create(),
        rotation = quat.create(),
        scale = vec3.fromValues(1, 1, 1)
    } = {}
    ) {
        this.translate = translate;
        this.rotation = rotation;
        this.scale = scale;
    }
    public getModelMatrix(): mat4 {
        let modelMatrix = mat4.create();
        mat4.fromRotationTranslationScale(modelMatrix, this.rotation, this.translate, this.scale);
        return modelMatrix;
    }

    transform(position: vec3): vec4;
    transform(positions: vec3[]): vec4[];
    transform(vertex: Vertex3D): vec4;
    transform(vertice: Vertex3D[]): vec4[];
    transform(args: vec3 | vec3[] | Vertex3D | Vertex3D[]): vec4 | vec4[] {
        function isVec3(arg: vec3 | vec3[] | Vertex3D | Vertex3D[]): arg is vec3 {
            return Array.isArray(arg) && arg.length === 3 && typeof arg[0] === 'number' && typeof arg[1] === 'number' && typeof arg[2] === 'number';
        }

        if (args instanceof Vertex3D) {
            const pos = args.position;
            const _pos = toHomogeneous(pos);
            const res = vec4.create();
            vec4.transformMat4(res, _pos, this.getModelMatrix());
            return res;
        } else if (isVec3(args)) {
            const pos = args;
            const _pos = toHomogeneous(pos);
            const res = vec4.create();
            vec4.transformMat4(res, _pos, this.getModelMatrix());
            return res;
        } else {
            if (args.length === 0) return [];
            else if (args[0] instanceof Vertex3D) {
                const vertice = <Vertex3D[]>args;
                const modelMatrix = this.getModelMatrix();
                const res: vec4[] = [];
                vertice.forEach(vertex => {
                    const _pos = toHomogeneous(vertex.position);
                    const _res = vec4.create();
                    vec4.transformMat4(_res, _pos, modelMatrix);
                    res.push(_res);
                })
                return res;
            } else {
                const positions = <vec3[]>args;
                const modelMatrix = this.getModelMatrix();
                const res: vec4[] = [];
                positions.forEach(pos => {
                    const _pos = toHomogeneous(pos);
                    const _res = vec4.create();
                    vec4.transformMat4(_res, _pos, modelMatrix);
                    res.push(_res);
                })
                return res;
            }

        }
    }
}

import { Rotate4DMatrix, toHomogeneous } from "./base";
import { Vertex3D, Vertex4D } from "./mesh";
export { Transform4D }
class Transform4D {
    translate;
    rotation4D;
    scale;
    constructor({
        translate = vec4.create(),
        rotation4D = new Rotation4D(),
        scale = vec4.fromValues(1, 1, 1, 1)
    } = {}
    ) {
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
    transform(pos: vec4): vec4;
    transform(pos: Vertex4D): vec4;
    transform(pos: vec4[]): vec4;
    transform(pos: Vertex4D[]): vec4[];
    transform(arg: vec4 | vec4[] | Vertex4D | Vertex4D[]): vec4 | vec4[] {

        function isVec4(arg: vec4 | vec4[] | Vertex4D | Vertex4D[]): arg is vec4 {
            return Array.isArray(arg) && arg.length === 3 && typeof arg[0] === 'number' && typeof arg[1] === 'number' && typeof arg[2] === 'number';
        }
        function isVertex4DArray(arg: vec4 | vec4[] | Vertex4D | Vertex4D[]): arg is Vertex4D[] {
            return Array.isArray(arg) && (arg.length === 0 || arg[0] instanceof Vertex4D)
        }

        if (arg instanceof Vertex4D) {
            const pos = arg.position;

            const RSMatrix = this.getRotationScaleMatrix();
            const res = vec4.create();
            vec4.transformMat4(res, pos, RSMatrix);
            vec4.add(res, res, this.translate);
            return res;
        } else if (isVec4(arg)) {
            const pos = arg;

            const RSMatrix = this.getRotationScaleMatrix();
            const res = vec4.create();
            vec4.transformMat4(res, pos, RSMatrix);
            vec4.add(res, res, this.translate);
            return res;
        } else {
            if (arg.length === 0) return [];
            if (isVertex4DArray(arg)) {
                const worldPositions: vec4[] = [];
                const RSMatrix = this.getRotationScaleMatrix();
                arg.forEach(v => {
                    const objectPos = v.position;
                    const worldPos = vec4.create();
                    vec4.transformMat4(worldPos, objectPos, RSMatrix);
                    vec4.add(worldPos, worldPos, this.translate);
                    worldPositions.push(worldPos);
                })
                return worldPositions;
            }else{
                const worldPositions: vec4[] = [];
                const RSMatrix = this.getRotationScaleMatrix();
                arg.forEach(p => {
                    const objectPos = p;
                    const worldPos = vec4.create();
                    vec4.transformMat4(worldPos, objectPos, RSMatrix);
                    vec4.add(worldPos, worldPos, this.translate);
                    worldPositions.push(worldPos);
                })
                return worldPositions;
            }
        }

    }
}
class Rotation4D {
    constructor(
        public xy = 0,
        public yz = 0,
        public xz = 0,
        public xw = 0,
        public yw = 0,
        public zw = 0
    ) { }
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