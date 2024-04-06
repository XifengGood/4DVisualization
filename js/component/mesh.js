import { vec2, vec3, vec4 } from "gl-matrix";
import { faceColor } from "../util/p5_draw";
export { Mesh3D, Mesh4D, Edge, Vertex3D, Vertex4D, Face };
class Vertex3D {
    position;
    color;
    normal;
    uv;
    constructor({ position = vec3.create(), color = vec4.fromValues(0, 0, 0, 1), normal = vec3.create(), uv = vec2.create() } = {}) {
        this.position = position;
        this.color = color;
        this.normal = normal;
        this.uv = uv;
    }
}
class Edge {
    indice;
    constructor(indice = [-1, -1]) {
        this.indice = indice;
    }
}
class Face {
    indice;
    color;
    constructor({ indice = Array(), color = faceColor } = {}) {
        this.indice = indice;
        this.color = color;
    }
}
class Mesh3D {
    vertice;
    edges;
    faces;
    constructor({ vertice = Array(), edges = Array(), faces = Array() } = {}) {
        this.vertice = vertice;
        this.edges = edges;
        this.faces = faces;
    }
}
class Vertex4D {
    position;
    color;
    normal;
    uv;
    constructor({ position = vec4.create(), color = vec4.fromValues(0, 0, 0, 1), normal = vec4.create(), uv = vec2.create(), } = {}) {
        this.position = position;
        this.color = color;
        this.normal = normal;
        this.uv = uv;
    }
}
class Mesh4D {
    vertice;
    edges;
    faces;
    constructor({ vertice = Array(), edges = Array(), faces = Array() } = {}) {
        this.vertice = vertice;
        this.edges = edges;
        this.faces = faces;
    }
}
