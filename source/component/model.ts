import { Mesh3D, Mesh4D } from "./mesh";
import { Transform3D, Transform4D } from "./transform";
export { Model3D, Model4D }
class Model3D {
    transform;
    mesh;
    constructor({
        transform = new Transform3D(),
        mesh = new Mesh3D()
    } = {}
    ) {
        this.transform = transform;
        this.mesh = mesh;
    }
}

class Model4D {
    transform;
    mesh;
    constructor({
        transform = new Transform4D(),
        mesh = new Mesh4D()
    } = {}
    ) {
        this.transform = transform;
        this.mesh = mesh;
    }
}