import { vec2, vec3, vec4 } from "gl-matrix";
import { Transform3D, Transform4D } from "./transform";
import { faceColor } from "../util/p5_draw";
export { Mesh3D, Mesh4D, Edge, Vertex3D, Vertex4D, Face }

class Vertex3D {
    position;
    color;
    normal;
    uv;
    constructor({
        position = vec3.create(),
        color = vec4.fromValues(0, 0, 0, 1),
        normal = vec3.create(),
        uv = vec2.create()
    } = {}
    ) {
        this.position = position;
        this.color = color;
        this.normal = normal;
        this.uv = uv;
    }
}
class Edge {
    constructor(
        public indice: [number, number] = [-1, -1]
    ) { }
}
class Face {
    indice: number[];
    color: number[];
    constructor({
        indice = Array<number>(),
        color = faceColor
    } = {}
    ) {
        this.indice = indice;
        this.color = color;
    }
}
class Mesh3D {
    vertice: Vertex3D[];
    edges: Edge[];
    faces: Face[];
    constructor({
        vertice = Array<Vertex3D>(),
        edges = Array<Edge>(),
        faces = Array<Face>()
    } = {}
    ) {
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
    constructor({
        position = vec4.create(),
        color = vec4.fromValues(0, 0, 0, 1),
        normal = vec4.create(),
        uv = vec2.create(),
    } = {}
    ) {
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
    constructor({
        vertice = Array<Vertex4D>(),
        edges = Array<Edge>(),
        faces = Array<Face>()
    } = {}
    ) {
        this.vertice = vertice;
        this.edges = edges;
        this.faces = faces;
    }
}