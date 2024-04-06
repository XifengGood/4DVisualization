import { mat4, vec4 } from "gl-matrix";
import { vec_add, vec_dot, vec_scale, vec_sub } from "../util/base";
export { Rotate4DMatrix, toHomogeneous, intersect3Dplane, Rotate4DMatrixString };
class Rotate4DMatrix {
    static rotateXY(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return mat;
    }
    static rotateYZ(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
        return mat;
    }
    static rotateXZ(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
        return mat;
    }
    // rotate w
    static rotateXW(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(c, 0, 0, -s, 0, 1, 0, 0, 0, 0, 1, 0, s, 0, 0, c);
        return mat;
    }
    static rotateYW(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(1, 0, 0, 0, 0, c, 0, -s, 0, 0, 1, 0, 0, s, 0, c);
        return mat;
    }
    static rotateZW(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, c, -s, 0, 0, s, c);
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
function toHomogeneous(pos) {
    const _pos = vec4.create();
    vec4.set(_pos, pos[0], pos[1], pos[2], 1);
    return _pos;
}
function intersect3Dplane(vertice, edges) {
    const v = [];
    edges.forEach(e => {
        let v0 = vertice[e[0]];
        let v1 = vertice[e[1]];
        const points = lineSegmentIntersectFacet({ a: v0, b: v1 }, { p: [0, 0, 0, 0], normal: [0, 0, 0, 1] });
        if (points.length > 0) {
            points.forEach(p => {
                v.push(p);
            });
        }
    });
    return v;
}
function lineSegmentIntersectFacet(lineSegment, f) {
    const direction = vec_sub(lineSegment.b, lineSegment.a);
    const denominator = vec_dot(direction, f.normal);
    const numerato = (vec_dot(f.p, f.normal) - vec_dot(lineSegment.a, f.normal));
    if (denominator == 0) {
        if (numerato == 0) {
            return [lineSegment.a, lineSegment.b];
        }
        else {
            return [];
        }
    }
    ;
    const t = numerato / denominator;
    if (t > 1 || t < 0)
        return [];
    const point = vec_add(lineSegment.a, vec_scale(direction, t));
    return [point];
}
class Rotate4DMatrixString {
    static rotateXY() {
        let mat = new StringMat4("c1", "s1", "0", "0", "-s1", "c1", "0", "0", "0", "0", "1", "0", "0", "0", "0", "1");
        return mat;
    }
    static rotateYZ() {
        let mat = new StringMat4("1", "0", "0", "0", "0", "c2", "s2", "0", "0", "-s2", "c2", "0", "0", "0", "0", "1");
        return mat;
    }
    static rotateXZ() {
        let mat = new StringMat4("c3", "0", "-s3", "0", "0", "1", "0", "0", "s3", "0", "c3", "0", "0", "0", "0", "1");
        return mat;
    }
    // rotate w
    static rotateXW() {
        let mat = new StringMat4("c4", "0", "0", "-s4", "0", "1", "0", "0", "0", "0", "1", "0", "s4", "0", "0", "c4");
        return mat;
    }
    static rotateYW() {
        let mat = new StringMat4("1", "0", "0", "0", "0", "c5", "0", "-s5", "0", "0", "1", "0", "0", "s5", "0", "c5");
        return mat;
    }
    static rotateZW() {
        let mat = new StringMat4("1", "0", "0", "0", "0", "1", "0", "0", "0", "0", "c6", "-s6", "0", "0", "s6", "c6");
        return mat;
    }
    static rotation() {
        const xyRotateMatrix = Rotate4DMatrixString.rotateXY();
        const xzRotateMatrix = Rotate4DMatrixString.rotateXZ();
        const yzRotateMatrix = Rotate4DMatrixString.rotateYZ();
        const xwRotateMatrix = Rotate4DMatrixString.rotateXW();
        const ywRotateMatrix = Rotate4DMatrixString.rotateYW();
        const zwRotateMatrix = Rotate4DMatrixString.rotateZW();
        const rotateMatrix = new StringMat4("1", "0", "0", "0", "0", "1", "0", "0", "0", "0", "1", "0", "0", "0", "0", "1");
        ;
        StringMat4.multiply(rotateMatrix, xyRotateMatrix, rotateMatrix);
        StringMat4.multiply(rotateMatrix, xyRotateMatrix, rotateMatrix);
        StringMat4.multiply(rotateMatrix, yzRotateMatrix, rotateMatrix);
        StringMat4.multiply(rotateMatrix, xzRotateMatrix, rotateMatrix);
        StringMat4.multiply(rotateMatrix, xwRotateMatrix, rotateMatrix);
        StringMat4.multiply(rotateMatrix, ywRotateMatrix, rotateMatrix);
        StringMat4.multiply(rotateMatrix, zwRotateMatrix, rotateMatrix);
        console.log(rotateMatrix);
        return rotateMatrix;
    }
}
class StringMat4 {
    m00;
    m01;
    m02;
    m03;
    m10;
    m11;
    m12;
    m13;
    m20;
    m21;
    m22;
    m23;
    m30;
    m31;
    m32;
    m33;
    constructor(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        this.m00 = m00;
        this.m01 = m01;
        this.m02 = m02;
        this.m03 = m03;
        this.m10 = m10;
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m20 = m20;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m30 = m30;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
    }
    static multiply(out, a, b) {
        let a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03;
        let a10 = a.m10, a11 = a.m11, a12 = a.m12, a13 = a.m13;
        let a20 = a.m20, a21 = a.m21, a22 = a.m22, a23 = a.m23;
        let a30 = a.m30, a31 = a.m31, a32 = a.m32, a33 = a.m33;
        let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
        out.m00 = sA(sA(sA(sM(b0, a00), sM(b1, a10)), sM(b2, a20)), sM(b3, a30));
        out.m01 = sA(sA(sA(sM(b0, a01), sM(b1, a11)), sM(b2, a21)), sM(b3, a31));
        out.m02 = sA(sA(sA(sM(b0, a02), sM(b1, a12)), sM(b2, a22)), sM(b3, a32));
        out.m03 = sA(sA(sA(sM(b0, a03), sM(b1, a13)), sM(b2, a23)), sM(b3, a33));
        b0 = b.m10,
            b1 = b.m11,
            b2 = b.m12,
            b3 = b.m13;
        out.m10 = sA(sA(sA(sM(b0, a00), sM(b1, a10)), sM(b2, a20)), sM(b3, a30));
        out.m11 = sA(sA(sA(sM(b0, a01), sM(b1, a11)), sM(b2, a21)), sM(b3, a31));
        out.m12 = sA(sA(sA(sM(b0, a02), sM(b1, a12)), sM(b2, a22)), sM(b3, a32));
        out.m13 = sA(sA(sA(sM(b0, a03), sM(b1, a13)), sM(b2, a23)), sM(b3, a33));
        b0 = b.m20,
            b1 = b.m21,
            b2 = b.m22,
            b3 = b.m23;
        out.m20 = sA(sA(sA(sM(b0, a00), sM(b1, a10)), sM(b2, a20)), sM(b3, a30));
        out.m21 = sA(sA(sA(sM(b0, a01), sM(b1, a11)), sM(b2, a21)), sM(b3, a31));
        out.m22 = sA(sA(sA(sM(b0, a02), sM(b1, a12)), sM(b2, a22)), sM(b3, a32));
        out.m23 = sA(sA(sA(sM(b0, a03), sM(b1, a13)), sM(b2, a23)), sM(b3, a33));
        b0 = b.m30,
            b1 = b.m31,
            b2 = b.m32,
            b3 = b.m33;
        out.m30 = sA(sA(sA(sM(b0, a00), sM(b1, a10)), sM(b2, a20)), sM(b3, a30));
        out.m31 = sA(sA(sA(sM(b0, a01), sM(b1, a11)), sM(b2, a21)), sM(b3, a31));
        out.m32 = sA(sA(sA(sM(b0, a02), sM(b1, a12)), sM(b2, a22)), sM(b3, a32));
        out.m33 = sA(sA(sA(sM(b0, a03), sM(b1, a13)), sM(b2, a23)), sM(b3, a33));
    }
}
function sM(a, b) {
    if (a == "0" || b == "0")
        return "0";
    if (a == '1')
        return b;
    if (b == '1')
        return a;
    else
        return a + "*" + b;
}
function sA(a, b) {
    if (a == "0")
        return b;
    if (b == "0")
        return a;
    else
        return "(" + a + "+" + b + ")";
}
