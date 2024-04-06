/* Just for convex polys. */
import p5 from "p5";
import { vec2, vec3, vec4, mat4 } from "gl-matrix";
import { Edge, Face, Mesh3D, Mesh4D, Vertex3D, Vertex4D } from "../component/mesh.js";
import { Model3D, Model4D } from "../component/model.js"
import { Camera3D, Camera4D, } from "../component/camera.js";
import { ToLeftTest } from "./utils";
import { vec_eq, vec_lerp, vec_sub, vec_cross } from "./base.js";

export { Poly, Point }
export { xColor, yColor, zColor, wColor, faceColor, edgeColor, edgeSize, vertexColor, vertexSize }

export { drawAxis, displayAxis, generateAxisModel, projectToScreen, render, renderFrame, renderFaces, renderEdges, renderVertice, drawPolyWithClip }
interface Brush {
    stroke: number[];
    isStroke: boolean;
    strokeWeight: number;
}
class Poly {
    points: vec4[];
    fillColor: number[];
    constructor(points: vec4[], fillColor: number[]) {
        this.points = points;
        this.fillColor = fillColor;
    }
}
const xColor = [255, 128, 128];
const yColor = [255, 207, 150];
const zColor = [205, 250, 219];
const wColor = [246, 253, 195];
const faceColor = [205, 250, 219, 224];
const edgeColor = [64];
const edgeSize = 2;
const vertexColor = [64];
const vertexSize = 6;
const axisColor = [128];
function drawAxis(p: p5, v: vec2, v0: vec2, axisName: string, color: number[], distance = 20) {
    const d = vec2.create();
    vec2.sub(d, v, v0);
    vec2.normalize(d, d);
    const offset = vec2.create();
    vec2.multiply(offset, d, vec2.fromValues(distance, distance));
    const axisPos = vec2.create();
    vec2.add(axisPos, v, offset);
    {
        p.push();
        p.stroke(axisColor);
        p.strokeWeight(2);
        p.line(v0[0], v0[1], v[0], v[1]);
        p.pop();
    }
    {
        p.push();
        p.rectMode(p.RADIUS)
        p.noStroke();
        p.fill(color);
        p.rect(axisPos[0], axisPos[1], 8, 10, 4);
        p.pop();
    }
    {
        p.push();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.text(axisName, axisPos[0], axisPos[1] + 2);
        p.pop();
    }
}
function displayAxis(p: p5, vertice: vec2[] | vec3[] | vec4[]) {
    const v0 = vertice[0];
    const vx = vertice[1];
    const vy = vertice[2];
    const vz = vertice[3];
    const vw = vertice[4];
    p.push();
    p.stroke(0);
    p.strokeWeight(6);
    p.point(v0[0], v0[1]);
    p.pop();

    if (vx != undefined) drawAxis(p, <vec2>vx, <vec2>v0, 'X', xColor);
    if (vy != undefined) drawAxis(p, <vec2>vy, <vec2>v0, 'Y', yColor);
    if (vz != undefined) drawAxis(p, <vec2>vz, <vec2>v0, 'Z', zColor);
    if (vw != undefined) drawAxis(p, <vec2>vw, <vec2>v0, 'W', wColor);
}
function generateAxisModel(x: number, y: number, z: number): Model3D;
function generateAxisModel(x: number, y: number, z: number, w: number): Model4D;
function generateAxisModel(x: number, y: number, z: number, w?: number): Model3D | Model4D {
    if (w == undefined) {
        const v0 = new Vertex3D({ position: vec3.fromValues(0, 0, 0) });
        const vx = new Vertex3D({ position: vec3.fromValues(x, 0, 0) });
        const vy = new Vertex3D({ position: vec3.fromValues(0, y, 0) });
        const vz = new Vertex3D({ position: vec3.fromValues(0, 0, z) });
        const xEdge = new Edge([0, 1]);
        const yEdge = new Edge([0, 2]);
        const zEdge = new Edge([0, 3]);
        const vertice = [v0, vx, vy, vz];
        const edges = [xEdge, yEdge, zEdge];
        return new Model3D({ mesh: new Mesh3D({ vertice: vertice, edges: edges }) });
    } else {
        const v0 = new Vertex4D({ position: vec4.fromValues(0, 0, 0, 0) });
        const vx = new Vertex4D({ position: vec4.fromValues(x, 0, 0, 0) });
        const vy = new Vertex4D({ position: vec4.fromValues(0, y, 0, 0) });
        const vz = new Vertex4D({ position: vec4.fromValues(0, 0, z, 0) });
        const vw = new Vertex4D({ position: vec4.fromValues(0, 0, 0, w) });
        const vertice = [v0, vx, vy, vz, vw];
        const xEdge = new Edge([0, 1]);
        const yEdge = new Edge([0, 2]);
        const zEdge = new Edge([0, 3]);
        const wEdge = new Edge([0, 4]);
        const edges = [xEdge, yEdge, zEdge, wEdge];
        return new Model4D({ mesh: new Mesh4D({ vertice: vertice, edges: edges }) });
    }
}
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    display(p: p5) {
        p.push();
        p.strokeWeight(6);
        p.point(this.x, this.y);
        p.pop();
    }
}

function projectToScreen(model: Model3D, screen: p5, camera: Camera3D): vec4[];
function projectToScreen(model: Model4D, screen: p5, camera3D: Camera3D, camera4D: Camera4D): vec4[];
function projectToScreen(model: Model3D | Model4D, screen: p5, camera3D: Camera3D, camera4D?: Camera4D): vec4[] {
    let clipPositions: vec4[];
    if (camera4D) {
        const clip3DPosition = camera4D.objectToClip(<Model4D>model);
        clipPositions = camera3D.objectToClip(clip3DPosition);
    } else {
        clipPositions = camera3D.objectToClip(<Model3D>model);
    }

    const screenPositions: vec4[] = [];
    clipPositions.forEach(p => {
        const screenPos = vec4.clone(p);
        screenPos[0] = (p[0] / 2 + 0.5) * screen.width;
        screenPos[1] = (-p[1] / 2 + 0.5) * screen.height;
        screenPositions.push(screenPos);
    })
    return screenPositions;
}

function generatePolys(points: vec4[], faces: Face[]) {
    const polys: Poly[] = [];
    faces.forEach(f => {
        const _poly = new Poly([], f.color);
        f.indice.forEach(i => {
            _poly.points.push(points[i]);
        })
        polys.push(_poly);
    })
    return polys;
}
function render(model: Model3D, screen: p5, camera: Camera3D, brush?: Brush): void;
function render(model: Model4D, screen: p5, camera3D: Camera3D, camera4D: Camera4D, brush?: Brush): void;
function render(model: Model3D | Model4D, screen: p5, camera3D: Camera3D, camera4D?: Camera4D | Brush, brush?: Brush) {

    if (brush) {
        const screenPositions = projectToScreen(<Model4D>model, screen, camera3D, <Camera4D>camera4D);
        const polys = generatePolys(screenPositions, model.mesh.faces);
        drawPoly(screen, polys, brush);
    } else {
        const screenPositions = projectToScreen(<Model3D>model, screen, camera3D);
        const polys = generatePolys(screenPositions, model.mesh.faces);
        const _brush = <Brush>camera4D;
        drawPoly(screen, polys, _brush);
    }
}
function renderFrame(model: Model3D | Model4D, screen: p5, camera3D: Camera3D, camera4D?: Camera4D) {
    let screenPositions: vec4[];
    if (camera4D) {
        screenPositions = projectToScreen(<Model4D>model, screen, camera3D, camera4D);
    } else {
        screenPositions = projectToScreen(<Model3D>model, screen, camera3D);
    }
    renderVertice(screen, screenPositions);
    renderEdges(screen, screenPositions, model.mesh.edges);
}

function renderFaces(p: p5, screenPositions: vec4[], faces: Face[], brush?: Brush) {
    const polys = generatePolys(screenPositions, faces);
    drawPoly(p, polys, brush);
}
function renderVertice(p: p5, screenPositions: vec4[], brush?: Brush) {
    p.push();
    if (brush && brush.isStroke) {
        p.stroke(brush.stroke);
        p.strokeWeight(brush.strokeWeight);
    } else {
        p.stroke(vertexColor);
        p.strokeWeight(vertexSize);
    }

    const vertice = screenPositions;
    vertice.forEach(v => {
        p.point(v[0], v[1]);
    })
    p.pop();
}

function renderEdges(p: p5, screenPositions: vec4[], edges: Edge[], brush?: Brush) {
    p.push();
    if (brush && brush.isStroke) {
        p.stroke(brush.stroke);
        p.strokeWeight(brush.strokeWeight);
    } else {
        p.stroke(edgeColor);
        p.strokeWeight(2);
    }
    const vertice = screenPositions;
    edges.forEach(e => {
        const v0 = vertice[e.indice[0]];
        const v1 = vertice[e.indice[1]];
        p.line(v0[0], v0[1], v1[0], v1[1]);
    })
    p.pop();
}

function convex_hull(points: vec4[]) {
    if (points.length < 4)
        return points;

    var r = [];


    var left = 0;
    for (var i = 1; i < points.length; i++) {
        if (points[i][0] < points[left][0])
            left = i;
    }

    var end = left;

    var iter = 0;
    while (1) {
        r.push(points[end]);

        var c = (end + 1) % points.length;

        for (var i = 0; i < points.length; i++) {
            var cur = vec_sub(points[i], points[end]);
            var bes = vec_sub(points[c], points[end]);
            var d = vec_cross([cur[0], cur[1], 0],
                [bes[0], bes[1], 0]);

            if (d[2] > 0)
                c = i;
        }

        end = c;

        if (end == left)
            break;

        iter++;

        if (iter > points.length) {
            break;

        }
    }

    return r;
}

function drawPolyWithClip(p: p5, camera: Camera3D, _p: p5, _camera: Camera3D, cube: Model3D) {
    const polys: Poly[] = [];

    const vertice = cube.transform.transform(cube.mesh.vertice);

    cube.mesh.faces.forEach(face => {
        const _poly = new Poly([], face.color);
        face.indice.forEach(i => {
            _poly.points.push(vertice[i]);
        })
        polys.push(_poly);
    })

    const int_points = [];
    const back_polys = [];
    const front_polys = [];


    for (let i = 0; i < polys.length; i++) {
        let back_points = clip_poly(polys[i], false);
        for (let j = 0; j < back_points.length; j++) {
            if (back_points[j][2] == 0) {
                int_points.push(vec4.clone(back_points[j]));
            }
        }

        back_polys[i] = new Poly(back_points, polys[i].fillColor);

        let front_points = clip_poly(polys[i], true);

        front_polys[i] = new Poly(front_points, polys[i].fillColor);
    }


    function projectPolyToScreen(polys: Poly[], VPMatrix: mat4, p: p5) {
        polys.forEach(poly => {
            poly.points.forEach(v => {
                const clips = vec4.create();
                vec4.transformMat4(clips, v, VPMatrix);
                const w = vec4.fromValues(clips[3], clips[3], clips[3], clips[3]);
                vec4.div(v, clips, w);
                v[0] = (v[0] / 2 + 0.5) * p.width;
                v[1] = (-v[1] / 2 + 0.5) * p.height;
            })
        })
    }

    let VPMatrix = camera.getVPMatrix();

    projectPolyToScreen(back_polys, VPMatrix, p);
    drawPoly(p, back_polys);

    const plane_polys = [
        new Poly(
            [
                [0, 0, 0, 1],
                [0, 3, 0, 1],
                [3, 3, 0, 1],
                [3, 0, 0, 1],
            ], [128, 128, 128, 64]
        )
    ]
    projectPolyToScreen(plane_polys, VPMatrix, p);
    drawPoly(p, plane_polys, { isStroke: false, stroke: [0], strokeWeight: 2 });
    projectPolyToScreen(front_polys, VPMatrix, p);
    drawPoly(p, front_polys);


    let _VPMatrix = _camera.getVPMatrix();
    int_points.forEach(v => {
        const clips = vec4.create();
        vec4.transformMat4(clips, v, _VPMatrix);
        const w = vec4.fromValues(clips[3], clips[3], clips[3], clips[3]);
        vec4.div(v, clips, w);
        v[0] = (v[0] / 2 + 0.5) * _p.width;
        v[1] = (-v[1] / 2 + 0.5) * _p.height;
    })

    drawPoly(_p, [new Poly(convex_hull(int_points), faceColor)]);
}
function drawPoly(p: p5, polys: Poly[], brush?: Brush) {
    p.push();
    p.blendMode(p.BLEND);
    if (brush) {
        if (brush.isStroke) {
            p.stroke(brush.stroke);
            p.strokeWeight(brush.strokeWeight);
        } else {
            p.noStroke();
        }
    } else {
        p.stroke(edgeColor);
        p.strokeWeight(2);
    }
    const back_polys: Poly[] = [];
    const front_polys: Poly[] = [];
    polys.forEach(poly => {
        if (poly.points.length < 3) return;
        const p0 = vec2.fromValues(poly.points[0][0], poly.points[0][1]);
        const p1 = vec2.fromValues(poly.points[1][0], poly.points[1][1]);
        const p2 = vec2.fromValues(poly.points[2][0], poly.points[2][1]);

        if (!ToLeftTest(p0, p1, p2)) {
            back_polys.push(poly);
        } else {
            front_polys.push(poly);
        }

    })

    back_polys.forEach(poly => {
        p.beginShape();
        p.fill(poly.fillColor);
        poly.points.forEach(v => {
            p.vertex(v[0], v[1]);
        })
        p.endShape(p.CLOSE);
    })
    front_polys.forEach(poly => {
        p.beginShape();
        p.fill(poly.fillColor);
        poly.points.forEach(v => {
            p.vertex(v[0], v[1]);
        })
        p.endShape(p.CLOSE);
    })
    p.pop();
}
function clip_poly(poly: Poly, sign: boolean) {
    const clip_z = 0;
    const clipped_poly = [];
    function is_in(p: vec3 | vec4) {
        return sign ? (p[2] >= clip_z) : (p[2] < clip_z);
    }

    let prev = vec4.clone(poly.points[poly.points.length - 1]);
    for (let j = 0; j < poly.points.length; j++) {
        let curr = vec4.clone(poly.points[j]);

        if (!vec_eq(curr, prev)) {
            if (is_in(curr)) {
                if (!is_in(prev)) {
                    let dz = curr[2] - prev[2];
                    let t = (clip_z - prev[2]) / dz;
                    let p = vec_lerp(prev, curr, t);
                    p[2] = 0;
                    clipped_poly.push(p);
                }

                clipped_poly.push(curr);
            } else if (is_in(prev)) {
                let dz = curr[2] - prev[2];
                let t = (clip_z - prev[2]) / dz;
                let p = vec_lerp(prev, curr, t);
                p[2] = 0;
                clipped_poly.push(p);
            }
        }

        prev = curr;
    }

    return clipped_poly;
}