import { vec3, vec4 } from "gl-matrix";
import { Edge, Face, Mesh3D, Mesh4D, Vertex3D, Vertex4D } from "./mesh";
import { Model3D, Model4D } from "./model";
import { quickHull } from "@derschmale/tympanum";
export { generateTesseract, generateCube, generateTesseractHardEdge, generateHyperSphere, TesseractHull };
function generateTesseract({ length = 1, width = 1, height = 1, stack = 1 } = {}) {
    const vertice = Array();
    for (let i = 0; i < 16; i++) {
        vertice.push(new Vertex4D({
            position: vec4.fromValues(((i & 1) * 2 - 1) / 2 * length, ((i & 2) - 1) / 2 * width, ((i & 4) / 2 - 1) / 2 * height, ((i & 8) / 4 - 1) / 2 * stack)
        }));
    }
    const edges = Array();
    for (let i = 0; i < 16; i++) {
        for (let j = i; j < 16; j++) {
            let xor = i ^ j;
            if (xor == 1 || xor == 2 || xor == 4 || xor == 8) {
                edges.push(new Edge([i, j]));
            }
        }
    }
    const cell = [
        [0, 1, 2, 3, 4, 5, 6, 7],
        [12, 13, 14, 15, 8, 9, 10, 11],
        [0, 4, 2, 6, 8, 12, 10, 14],
        [5, 1, 7, 3, 13, 9, 15, 11],
        [4, 5, 6, 7, 12, 13, 14, 15],
        [1, 0, 3, 2, 9, 8, 11, 10],
        [2, 6, 3, 7, 10, 14, 11, 15],
        [1, 0, 5, 4, 9, 8, 13, 12]
    ];
    const faces = [];
    // consist of a rect face per four vertice
    const faceTopo = [
        [1, 0, 2, 3],
        [0, 4, 6, 2],
        [4, 5, 7, 6],
        [5, 1, 3, 7],
        [3, 2, 6, 7],
        [0, 1, 5, 4]
    ];
    cell.forEach(c => {
        faceTopo.forEach(topo => {
            const _face = new Face();
            topo.forEach(i => {
                _face.indice.push(c[i]);
            });
            faces.push(_face);
        });
    });
    return new Model4D({ mesh: new Mesh4D({ vertice, edges, faces }) });
}
function generateCube() {
    const vertice = Array();
    for (let i = 0; i < 8; i++) {
        vertice.push(new Vertex3D({
            position: vec3.fromValues(((i & 1) * 2 - 1) / 2, ((i & 2) - 1) / 2, ((i & 4) / 2 - 1) / 2)
        }));
    }
    const edges = Array();
    for (let i = 0; i < 8; i++) {
        for (let j = i; j < 8; j++) {
            let xor = i ^ j;
            if (xor == 1 || xor == 2 || xor == 4) {
                edges.push(new Edge([i, j]));
            }
        }
    }
    const faces = [
        new Face({ indice: [0, 1, 3, 2] }),
        new Face({ indice: [0, 2, 6, 4] }),
        new Face({ indice: [0, 4, 5, 1] }),
        new Face({ indice: [2, 3, 7, 6] }),
        new Face({ indice: [1, 5, 7, 3] }),
        new Face({ indice: [4, 6, 7, 5] })
    ];
    return new Model3D({ mesh: new Mesh3D({ vertice: vertice, edges: edges, faces: faces }) });
}
function generateTesseractHardEdge(colors) {
    const _vertice = Array();
    for (let i = 0; i < 16; i++) {
        _vertice.push(vec4.fromValues(((i & 1) * 2 - 1) / 2, ((i & 2) - 1) / 2, ((i & 4) / 2 - 1) / 2, ((i & 8) / 4 - 1) / 2));
    }
    const cell = [
        [0, 1, 2, 3, 4, 5, 6, 7],
        [12, 13, 14, 15, 8, 9, 10, 11],
        [0, 4, 2, 6, 8, 12, 10, 14],
        [5, 1, 7, 3, 13, 9, 15, 11],
        [4, 5, 6, 7, 12, 13, 14, 15],
        [1, 0, 3, 2, 9, 8, 11, 10],
        [2, 6, 3, 7, 10, 14, 11, 15],
        [1, 0, 5, 4, 9, 8, 13, 12],
    ];
    const vertice = Array();
    if (colors)
        cell.forEach((c, index) => {
            c.forEach(i => {
                vertice.push(new Vertex4D({ position: _vertice[i], color: colors[index] }));
            });
        });
    else
        cell.forEach((c, index) => {
            c.forEach(i => {
                vertice.push(new Vertex4D({ position: _vertice[i] }));
            });
        });
    const faces = [];
    // consist of a rect face per four vertice
    const faceTopo = [
        [1, 0, 2, 3],
        [0, 4, 6, 2],
        [4, 5, 7, 6],
        [5, 1, 3, 7],
        [3, 2, 6, 7],
        [0, 1, 5, 4]
    ];
    cell.forEach((c, index) => {
        faceTopo.forEach(topo => {
            const _face = new Face();
            const offset = index * 8;
            topo.forEach(i => {
                _face.indice.push(i + offset);
            });
            faces.push(_face);
        });
    });
    const edges = Array();
    faces.forEach(f => {
        for (let i = 0; i + 1 < f.indice.length; i++) {
            edges.push(new Edge([f.indice[i], f.indice[i + 1]]));
        }
        if (f.indice.length > 2)
            edges.push(new Edge([f.indice[f.indice.length - 1], f.indice[0]]));
    });
    return new Model4D({ mesh: new Mesh4D({ vertice, edges, faces }) });
}
function generateHyperSphere({ radius_x = 1, radius_y = 1, radius_z = 1, radius_w = 1 } = {}) {
    const points = [];
    for (let i = 0; i < 500; ++i) {
        const x = randomNormalDistribution(0, 1);
        const y = randomNormalDistribution(0, 1);
        const z = randomNormalDistribution(0, 1);
        const w = randomNormalDistribution(0, 1);
        const p = vec4.fromValues(x, y, z, w);
        vec4.normalize(p, p);
        p[0] *= radius_x;
        p[1] *= radius_y;
        p[2] *= radius_z;
        p[3] *= radius_w;
        points.push(p);
    }
    const hull = quickHull(points);
    const vertice = [];
    points.forEach(p => {
        vertice.push(new Vertex4D({ position: p }));
    });
    const edges = [];
    hull.forEach(h => {
        edges.push(new Edge([h.verts[0], h.verts[1]]));
        edges.push(new Edge([h.verts[1], h.verts[2]]));
        edges.push(new Edge([h.verts[2], h.verts[3]]));
        edges.push(new Edge([h.verts[3], h.verts[0]]));
    });
    return new Model4D({ mesh: new Mesh4D({ vertice, edges }) });
}
function TesseractHull() {
    const vertice = Array();
    for (let i = 0; i < 16; i++) {
        vertice.push(vec4.fromValues(((i & 1) * 2 - 1) / 2, ((i & 2) - 1) / 2, ((i & 4) / 2 - 1) / 2, ((i & 8) / 4 - 1) / 2));
    }
    const hull = quickHull(vertice);
    console.log(hull);
}
// 生成服从正态分布的随机数
function randomNormalDistribution(mean, deviation) {
    const u = Math.random(); // 0 到 1 之间的随机数
    const v = Math.random(); // 0 到 1 之间的随机数
    const w = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); // Box-Muller 转换
    const normal = mean + deviation * w; // 正态分布随机数
    return normal;
}
