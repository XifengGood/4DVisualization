export { ToLeftTest };
function ToLeftTest(p, q, r) {
    return (p[0] * q[1] - p[1] * q[0] +
        q[0] * r[1] - q[1] * r[0] +
        r[0] * p[1] - r[1] * p[0]) > 0;
}
function InTriangleTest(p, q, r, s) {
    if (!ToLeftTest(p, q, s))
        return false;
    if (!ToLeftTest(q, r, s))
        return false;
    if (!ToLeftTest(r, p, s))
        return false;
    return true;
}
function InCircle(center, radius, pos) {
    return SqrtDist(center, pos) < radius * radius;
}
function SqrtDist(pos1, pos2) {
    return Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2);
}
