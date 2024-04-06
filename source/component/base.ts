import { mat4, vec3, vec4 } from "gl-matrix";
import { vec_add, vec_dot, vec_scale, vec_sub } from "../util/base";

export { Rotate4DMatrix, toHomogeneous, intersect3Dplane }

class Rotate4DMatrix {
    static rotateXY(angle: number) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        return mat;
    }
    static rotateYZ(angle: number) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        );
        return mat;
    }
    static rotateXZ(angle: number) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        );
        return mat;
    }
    // rotate w
    static rotateXW(angle: number) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(
            c, 0, 0, -s,
            0, 1, 0, 0,
            0, 0, 1, 0,
            s, 0, 0, c
        );
        return mat;
    }
    static rotateYW(angle: number) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(
            1, 0, 0, 0,
            0, c, 0, -s,
            0, 0, 1, 0,
            0, s, 0, c
        );
        return mat;
    }
    static rotateZW(angle: number) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, c, -s,
            0, 0, s, c
        );
        return mat;
    }

    static rotation({ xy = 0, yz = 0, xz = 0, xw = 0, yw = 0, zw = 0 } = {}) {
        const xyRotateMatrix = Rotate4DMatrix.rotateXY(xy);
        const xzRotateMatrix = Rotate4DMatrix.rotateXZ(xz);
        const yzRotateMatrix = Rotate4DMatrix.rotateYZ(yz);
        const xwRotateMatrix = Rotate4DMatrix.rotateXW(xw);
        const ywRotateMatrix = Rotate4DMatrix.rotateYW(yw);
        const zwRotateMatrix = Rotate4DMatrix.rotateZW(zw);
        const rotateMatrix = mat4.create();
        mat4.mul(rotateMatrix, xyRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, yzRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, xzRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, xwRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, ywRotateMatrix, rotateMatrix);
        mat4.mul(rotateMatrix, zwRotateMatrix, rotateMatrix);
        return rotateMatrix;
    }
}

function toHomogeneous(pos: vec3): vec4 {
    const _pos = vec4.create();
    vec4.set(_pos, pos[0], pos[1], pos[2], 1);
    return _pos;
}

function intersect3Dplane(vertice: Array<vec4>, edges: Array<[number, number]>) {
    const v: Array<vec4> = [];
    edges.forEach(e => {
        let v0 = vertice[e[0]];
        let v1 = vertice[e[1]];

        const points = lineSegmentIntersectFacet<vec4>({ a: v0, b: v1 }, { p: [0, 0, 0, 0], normal: [0, 0, 0, 1] });

        if (points.length > 0) {
            points.forEach(p => {
                v.push(p);
            })
        }
    })
    return v;
}


function lineSegmentIntersectFacet<T>(lineSegment: { a: T, b: T }, f: { p: T, normal: T }) {
    const direction = vec_sub(lineSegment.b, lineSegment.a);

    const denominator = vec_dot(direction, f.normal);
    const numerato = (vec_dot(f.p, f.normal) - vec_dot(lineSegment.a, f.normal));
    if (denominator == 0) {
        if (numerato == 0) {
            return [lineSegment.a, lineSegment.b];
        } else {
            return [];
        }
    };

    const t = numerato / denominator;
    if (t > 1 || t < 0) return [];
    const point = vec_add(lineSegment.a, vec_scale(direction, t));
    return [point];
}