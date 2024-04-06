import { vec2 } from "gl-matrix";

export { ToLeftTest }
function ToLeftTest(p: vec2, q: vec2, r: vec2) {
    return (
        p[0] * q[1] - p[1] * q[0] +
        q[0] * r[1] - q[1] * r[0] +
        r[0] * p[1] - r[1] * p[0]
    ) > 0;
}
function InTriangleTest(p: vec2, q: vec2, r: vec2, s: vec2) {
    if (!ToLeftTest(p, q, s)) return false;
    if (!ToLeftTest(q, r, s)) return false;
    if (!ToLeftTest(r, p, s)) return false;
    return true;
}
function InCircle(center: vec2, radius: number, pos: vec2) {
    return SqrtDist(center, pos) < radius * radius;
}
function SqrtDist(pos1: vec2, pos2: vec2) {
    return Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2);
}