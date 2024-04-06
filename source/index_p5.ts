import p5, { Graphics } from "p5";
import { SimpleRotator } from "./util/simple-rotator.js";
import { initSwitches } from "./util/switch.js";
import { vec2, vec3, vec4, mat4, quat } from "gl-matrix";
import { Edge, Face, Mesh3D, Vertex3D } from "./component/mesh.js";
import { Model3D, Model4D } from "./component/model.js"
import { Camera3D, Camera4D, ProjectionType } from "./component/camera.js";

import { Point,drawPolyWithClip } from "./util/p5_draw.js";
import { generateCube, generateTesseract } from "./component/geometry.js"
import { xColor, yColor, faceColor, edgeColor } from "./util/p5_draw.js";
import { drawAxis, displayAxis, generateAxisModel, projectToScreen, render, renderFrame } from "./util/p5_draw.js";

import { Transform3D, Transform4D } from "./component/transform.js";


const zero_dimension = (p: p5) => {
    const canvas = document.querySelector("#zero-dimension")
    p.setup = function () {
        p.createCanvas(200, 50, p.P2D, <object>canvas);
        p.pixelDensity(p.displayDensity());
    }
    p.draw = function () {
        p.clear();
        p.translate(p.width / 2, p.height / 2)
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        p.strokeWeight(6);
        p.point(0, 0);
    }
}
const zero_dimension_p5 = new p5(zero_dimension);

const one_dimension = (p: p5) => {
    const canvas = document.querySelector("#one-dimension");
    const p0 = new Point(0, 0), p1 = new Point(0, 0);
    const xslider = p.select('#one-dimension-x-range');

    p.setup = function () {
        p.createCanvas(200, 50, p.P2D, <object>canvas);
        p.pixelDensity(p.displayDensity());
        p0.x = p1.x = 0;
        if (xslider) {
            xslider.elt.min = `${0}`;
            xslider.elt.max = `${p.width - 50}`;
            xslider.elt.value = `${0}`;
        }
    }
    p.draw = function () {
        p.clear();
        p.translate(10, p.height / 2)
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        drawAxis(p, vec2.fromValues(p.width - 40, 0), vec2.fromValues(0, 0), 'X', xColor);
        p1.x = <number>xslider!.value();
        p0.display(p);
        p1.display(p);
        drawLine(p0, p1);
    }
    function drawLine(p0: Point, p1: Point) {
        p.push();
        p.stroke(edgeColor);
        p.strokeWeight(2);
        p.line(p0.x, p0.y, p1.x, p1.y);
        p.pop();
    }

}
const one_dimension_p5 = new p5(one_dimension);

const two_dimension = (p: p5) => {
    const canvas = document.querySelector("#two-dimension");
    const p0 = new Point(0, 0), p1 = new Point(0, 0), p2 = new Point(0, 0), p3 = new Point(0, 0);
    const yslider = p.select('#two-dimension-y-range');
    if (yslider == null)
        throw new Error("Slider is null!");

    p.setup = function () {
        p.createCanvas(200, 200, p.P2D, <Element>canvas);
        p.pixelDensity(p.displayDensity());
        p1.x = p2.x = 100;
        yslider.elt.min = `${0}`;
        yslider.elt.max = `${100}`;
        yslider.elt.value = `${0}`;
    }
    p.draw = function () {
        p.clear();
        p.translate(10, p.height - 10)
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        drawAxis(p, vec2.fromValues(p.width - 40, 0), vec2.fromValues(0, 0), 'X', xColor);
        drawAxis(p, vec2.fromValues(0, 40 - p.height), vec2.fromValues(0, 0), 'Y', yColor);
        drawRect();
        p0.display(p);
        p1.display(p);
        p2.display(p);
        p3.display(p);
        p2.y = -yslider.value();
        p3.y = -yslider.value();
    }
    function drawRect() {
        p.push();
        p.stroke(edgeColor)
        p.strokeWeight(2);
        p.fill(faceColor);
        p.rectMode(p.RADIUS);
        const x = (p0.x + p1.x) / 2;
        const y = (p1.y + p2.y) / 2;
        const width = x - p0.x;
        const height = -(y - p0.y);
        p.rect(x, y, width, height);
        p.pop();
    }
}
const two_dimension_p5 = new p5(two_dimension);


const three_dimension = (p: p5) => {
    const canvas = document.querySelector("#three-dimension");
    const zslider = p.select('#three-dimension-z-range');
    if (zslider == null) throw new Error("Slider is null");
    let axisScreenPositions: vec2[] | vec3[] | vec4[];
    let camera: Camera3D;
    let cube: Model3D;
    p.setup = function () {
        p.createCanvas(600, 600, p.P2D, canvas!);
        p.pixelDensity(p.displayDensity());
        //init zslider
        {
            zslider.elt.min = `${0}`;
            zslider.elt.max = `${1}`;
            zslider.elt.value = `${0}`;
            zslider.elt.step = `${0.01}`;
        }
        // init 3D camera
        {
            camera = new Camera3D({
                transform: new Transform3D({ translate: vec3.fromValues(1, 1.3, 1) }),
                type: ProjectionType.Orthographic,
                frustum: { left: -1.1, right: 1.1, bottom: -1.1, top: 1.1 },
                lookAtPoint: vec3.fromValues(0, 0.3, 0)
            });
        }
        // build axis mesh
        {
            const axisModel = generateAxisModel(1.3, 1.3, 1.3);
            axisScreenPositions = projectToScreen(axisModel, p, camera);
        }
        //init cube mesh
        {
            cube = generateCube();
            cube.mesh.vertice.forEach(v => {
                const p = v.position;
                vec3.add(p, p, vec3.fromValues(0.5, 0.5, 0.5));
            })
        }
    }
    p.draw = function () {
        p.clear();
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        displayAxis(p, axisScreenPositions);
        displayCube(cube);
    }

    function displayCube(cube: Model3D) {
        const z = zslider!.value();
        for (let i = 4; i < 8; i++) {
            const v = cube.mesh.vertice[i].position;
            v[2] = <number>z;
        }
        render(cube, p, camera);
    }

}
const three_dimension_p5 = new p5(three_dimension);


const four_dimension = (p: p5) => {

    const canvas = document.querySelector("#four-dimension");
    const wslider = p.select('#four-dimension-w-range');
    let axisScreenPositions: vec2[] | vec3[] | vec4[];
    let camera4D: Camera4D;
    let camera3D: Camera3D;
    let rotator: SimpleRotator;
    let axisModel: Model4D;
    let tesseract: Model4D;
    p.setup = () => {
        p.createCanvas(600, 600, p.P2D, canvas!);
        p.pixelDensity(p.displayDensity());
        wslider!.elt.min = `${-0.5}`;
        wslider!.elt.max = `${0.5}`;
        wslider!.elt.value = `${-0.5}`;
        wslider!.elt.step = `${0.01}`;
        //init 4D camera
        {
            camera4D = new Camera4D(
                {
                    transform: new Transform4D({ translate: vec4.fromValues(1, 1, 1, 1) }),
                    type: ProjectionType.Orthographic,
                    frustum: { left: -1.5, right: 1.5, bottom: -1.5, top: 1.5, back: -1.5, front: 1.5 }
                }
            );
        }
        //init 3D camera
        {
            camera3D = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(1, 1, 1) }),
                    type: ProjectionType.Orthographic,
                    frustum: { left: -1, right: 1, bottom: -1, top: 1 }
                }
            );
        }
        // init axis mesh
        {
            axisModel = generateAxisModel(1.3, 1.3, 1.3, 1.3);
            axisScreenPositions = projectToScreen(axisModel, p, camera3D, camera4D);
        }
        // init tessract mesh
        {
            tesseract = generateTesseract();
        }

        rotator = new SimpleRotator(canvas!, () => { }, 1, -140, 0);
        camera3D.getViewMatrix = rotator.getViewMatrix;

    }
    p.draw = () => {
        p.clear();
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        updateAxisMesh(axisModel);
        displayAxis(p, axisScreenPositions);
        displayTessract(tesseract);
    }
    function updateAxisMesh(axisModel: Model4D) {
        axisScreenPositions = projectToScreen(axisModel, p, camera3D, camera4D);
    }


    function displayTessract(tesseract: Model4D) {
        // update w
        const w = wslider!.value();
        for (let i = 8; i < tesseract.mesh.vertice.length; i++) {
            const v = tesseract.mesh.vertice[i].position;
            v[3] = <number>w;
        }

        renderFrame(tesseract, p, camera3D, camera4D);

    }
}
const four_dimension_p5 = new p5(four_dimension);


const cube_ortho = (p: p5) => {
    const canvas = document.querySelector("#three-dimension-ortho");

    let axisModel: Model3D;
    let camera: Camera3D;
    let screenCamera: Camera3D;
    let cube: Model3D;
    let screen: Model3D;
    let cubeShadow: Model3D;
    let cubeRotation: quat;
    let scenePg: Graphics;
    let shadowPg: Graphics;
    p.setup = function () {
        p.createCanvas(700, 400, p.P2D, canvas!);
        scenePg = p.createGraphics(400, 400);
        shadowPg = p.createGraphics(300, 400);
        p.pixelDensity(p.displayDensity());
        // init 3D camera
        {
            camera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(1.5, 2, 1) }),
                    type: ProjectionType.Orthographic,
                    frustum: { left: -2.5, right: 2.5, bottom: -2.5, top: 2.5 },
                    lookAtPoint: vec3.fromValues(0, 1.5, 0)
                }
            )
        }

        // build axis mesh
        {
            axisModel = generateAxisModel(3.2, 3.2, 2.5);
        }
        //init cube mesh
        {
            cube = generateCube();
            vec3.set(cube.transform.translate, 1.5, 1.5, 2);
            cubeRotation = cube.transform.rotation;
            cubeShadow = new Model3D({ transform: cube.transform, mesh: new Mesh3D(cube.mesh) });
            cubeShadow.mesh.vertice = new Array<Vertex3D>();
            cubeShadow.transform = new Transform3D();
        }

        //init screen
        {
            const vertice = [
                new Vertex3D({ position: vec3.fromValues(0, 0, 0) }),
                new Vertex3D({ position: vec3.fromValues(0, 1, 0) }),
                new Vertex3D({ position: vec3.fromValues(1, 1, 0) }),
                new Vertex3D({ position: vec3.fromValues(1, 0, 0) })
            ];
            const faces = [new Face({ indice: [0, 1, 2, 3], color: [128, 128, 128, 64] })];
            screen = new Model3D({ transform: new Transform3D({ scale: vec3.fromValues(3, 3, 3) }), mesh: new Mesh3D({ vertice: vertice, faces: faces }) });

        }

        // init screen Camera
        {
            screenCamera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(1.5, 1.5, 1) }),
                    type: ProjectionType.Orthographic,
                    frustum: { left: -2.1, right: 2.1, bottom: -2.8, top: 2.8 },
                    lookAtPoint: vec3.fromValues(1.5, 1.5, 0)
                }
            )
        }
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        scenePg.strokeCap(p.ROUND);
        scenePg.strokeJoin(p.ROUND);
        shadowPg.strokeCap(p.ROUND);
        shadowPg.strokeJoin(p.ROUND);
    }

    p.draw = function () {
        p.clear();

        scenePg.clear();
        shadowPg.clear();


        displayAxis(scenePg, projectToScreen(axisModel, scenePg, camera));

        orthoProjectToPlane(cube, cubeShadow);
        render(screen, scenePg, camera, { isStroke: false, stroke: [0], strokeWeight: 2 });
        render(cubeShadow, scenePg, camera);
        render(cube, scenePg, camera);


        displayAxis(shadowPg, projectToScreen(axisModel, shadowPg, screenCamera));
        render(screen, shadowPg, screenCamera, { isStroke: false, stroke: [0], strokeWeight: 2 });
        render(cubeShadow, shadowPg, screenCamera);

        p.image(scenePg, 0, 0);
        p.image(shadowPg, 375, 0);
    }

    p.mouseDragged = (e: MouseEvent) => {
        if (e.target != canvas) return;
        const yaw = (p.mouseX - p.pmouseX) * 0.1 * Math.PI / 180;
        const pitch = (p.mouseY - p.pmouseY) * 0.1 * Math.PI / 180;
        const up = camera.getUp();
        const right = camera.getRight();
        const yawQuat = quat.create()
        quat.setAxisAngle(yawQuat, up, yaw);
        const pitchQuat = quat.create()
        quat.setAxisAngle(pitchQuat, right, -pitch);
        quat.multiply(cubeRotation, yawQuat, cubeRotation);
        quat.multiply(cubeRotation, pitchQuat, cubeRotation);
    }

    function orthoProjectToPlane(cube: Model3D, cubeShadow: Model3D) {

        cubeShadow.mesh.vertice.splice(0);
        const worldPosition = cube.transform.transform(cube.mesh.vertice);
        worldPosition.forEach(p => {
            cubeShadow.mesh.vertice.push(new Vertex3D({ position: vec3.fromValues(p[0], p[1], 0) }));
        })

    }

}
const cube_ortho_p5 = new p5(cube_ortho);


const tesseract_ortho = (p: p5) => {

    const canvas = document.querySelector("#four-dimension-ortho");
    let axisScreenPositions: vec2[] | vec3[] | vec4[];
    let camera4D: Camera4D;
    let camera3D: Camera3D;
    let rotator: SimpleRotator;
    let axisModel: Model4D;
    let tesseract: Model4D;
    p.setup = () => {
        p.createCanvas(600, 600, p.P2D, canvas!);
        p.pixelDensity(p.displayDensity());
        //init 4D camera
        {
            camera4D = new Camera4D(
                {
                    transform: new Transform4D({ translate: vec4.fromValues(1, 1, 1, 1) }),
                    type: ProjectionType.Orthographic,
                    frustum: { left: -1.5, right: 1.5, bottom: -1.5, top: 1.5, back: -1.5, front: 1.5 }
                }
            );
        }
        //init 3D camera
        {
            camera3D = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(1, 1, 1) }),
                    type: ProjectionType.Orthographic,
                    frustum: { left: -1, right: 1, bottom: -1, top: 1 }
                }
            );
        }
        // init axis mesh
        {
            axisModel = generateAxisModel(1.3, 1.3, 1.3, 1.3);
            axisScreenPositions = projectToScreen(axisModel, p, camera3D, camera4D);
        }
        // init tessract mesh
        {
            tesseract = generateTesseract();
        }

        rotator = new SimpleRotator(canvas!, () => { }, 1, -140, 0);
        camera3D.getViewMatrix = rotator.getViewMatrix;

    }
    p.draw = () => {
        p.clear();
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        updateAxisMesh(axisModel);
        displayAxis(p, axisScreenPositions);
        displayTessract(tesseract);
    }
    function updateAxisMesh(axisModel: Model4D) {
        axisScreenPositions = projectToScreen(axisModel, p, camera3D, camera4D);
    }


    function displayTessract(tesseract: Model4D) {

        renderFrame(tesseract, p, camera3D, camera4D);

    }
}
const tesseract_ortho_p5 = new p5(tesseract_ortho);


const three_dimension_perspect_cube_face = (p: p5) => {
    const canvas = document.querySelector("#three-dimension-perspect-cube-face");
    const switches = document.querySelector("#three-dimension-perspect-cube-face-switches");
    let axisModel: Model3D;
    let camera: Camera3D;
    let lookCamera: Camera3D;
    let screenCamera: Camera3D;
    let cube: Model3D;
    let screen: Model3D;
    let cubeShadow: Model3D;
    let cubeRotation: quat;
    let scenePg: Graphics;
    let shadowPg: Graphics;

    const selectColor = faceColor;
    const unselectColor = [255, 255, 255, 128];

    function SetSwitches(switches: Element) {
        initSwitches(switches);
        switches.addEventListener('onChangeSelect', (e) => {
            let _e = <CustomEvent<{
                lastIndex: string;
                currentIndex: string;
            }>>e;
            const lastIndex = parseInt(_e.detail.lastIndex);
            const currentIndex = parseInt(_e.detail.currentIndex);
            const faces = cube.mesh.faces;
            if (lastIndex != 0) {
                faces[lastIndex - 1].color = unselectColor;
            }
            if (currentIndex != 0) {
                faces[currentIndex - 1].color = selectColor;
            }
        })
    }
    p.setup = function () {

        p.createCanvas(700, 400, p.P2D, canvas!);
        scenePg = p.createGraphics(400, 400);
        shadowPg = p.createGraphics(300, 400);
        p.pixelDensity(p.displayDensity());
        // init 3D camera
        {
            camera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(6, 4, 4) }),
                    type: ProjectionType.Perspective,
                    perspectiveParam: { fovy: Math.PI * 50 / 180, aspect: scenePg.width / scenePg.height },
                    lookAtPoint: vec3.fromValues(0, 1, 0)
                }
            )
        }
        // init look camera
        {
            lookCamera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(1.5, 1.5, 4) }),
                    type: ProjectionType.Perspective,
                    perspectiveParam: { fovy: Math.PI * 60 / 180, aspect: scenePg.width / scenePg.height },
                    lookAtPoint: vec3.fromValues(1.5, 1.5, 0)
                }
            )
        }

        // build axis mesh
        {
            axisModel = generateAxisModel(3.2, 3.2, 3.2);
        }
        //init cube mesh
        {
            cube = generateCube();
            cube.mesh.faces.forEach(f => {
                f.color = unselectColor;
            })
            vec3.set(cube.transform.translate, 1.5, 1.5, 2);
            cubeRotation = cube.transform.rotation;
            cubeShadow = new Model3D({ transform: new Transform3D({ translate: vec3.fromValues(1.5, 1.5, 0), scale: vec3.fromValues(1.5, 1.5, 1) }), mesh: new Mesh3D(cube.mesh) });

            cubeShadow.mesh.vertice = new Array<Vertex3D>();
        }

        //init screenMesh
        {
            const vertice = [
                new Vertex3D({ position: vec3.fromValues(0, 0, 0) }),
                new Vertex3D({ position: vec3.fromValues(0, 1, 0) }),
                new Vertex3D({ position: vec3.fromValues(1, 1, 0) }),
                new Vertex3D({ position: vec3.fromValues(1, 0, 0) })
            ];
            const faces = [new Face({ indice: [0, 1, 2, 3], color: [128, 128, 128, 64] })];
            screen = new Model3D({ transform: new Transform3D({ scale: vec3.fromValues(3, 3, 3) }), mesh: new Mesh3D({ vertice: vertice, faces: faces }) });

        }

        // init screen Camera
        {
            screenCamera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(1.5, 1.5, 1) }),
                    type: ProjectionType.Orthographic,
                    frustum: { left: -2.1, right: 2.1, bottom: -2.8, top: 2.8 },
                    lookAtPoint: vec3.fromValues(1.5, 1.5, 0)
                }
            )
        }

        SetSwitches(switches!);

        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        scenePg.strokeCap(p.ROUND);
        scenePg.strokeJoin(p.ROUND);
        shadowPg.strokeCap(p.ROUND);
        shadowPg.strokeJoin(p.ROUND);
    }


    p.draw = function () {
        p.clear();

        scenePg.clear();
        shadowPg.clear();


        displayAxis(scenePg, projectToScreen(axisModel, scenePg, camera));

        perspectProjectToPlane(scenePg, lookCamera, cube, cubeShadow);
        render(screen, scenePg, camera, { isStroke: false, stroke: [0], strokeWeight: 2 });
        render(cubeShadow, scenePg, camera);
        render(cube, scenePg, camera);

        displayAxis(shadowPg, projectToScreen(axisModel, shadowPg, screenCamera));
        render(screen, shadowPg, screenCamera, { isStroke: false, stroke: [0], strokeWeight: 2 });
        render(cubeShadow, shadowPg, screenCamera);


        p.image(scenePg, 0, 0);
        p.image(shadowPg, 375, 0);
    }
    p.mouseDragged = (e: MouseEvent) => {
        if (e.target != canvas) return;
        const yaw = (p.mouseX - p.pmouseX) * 0.1 * Math.PI / 180;
        const pitch = (p.mouseY - p.pmouseY) * 0.1 * Math.PI / 180;
        const up = camera.getUp();
        const right = camera.getRight();
        const yawQuat = quat.create()
        quat.setAxisAngle(yawQuat, up, yaw);
        const pitchQuat = quat.create()
        quat.setAxisAngle(pitchQuat, right, -pitch);
        quat.multiply(cubeRotation, yawQuat, cubeRotation);
        quat.multiply(cubeRotation, pitchQuat, cubeRotation);
    }

    function perspectProjectToPlane(p: p5, camera: Camera3D, cube: Model3D, cubeShadow: Model3D) {
        cubeShadow.mesh.vertice.splice(0);
        const worldPositions = cube.transform.transform(cube.mesh.vertice);
        const clipPositions = camera.worldToClip(worldPositions);
        clipPositions.forEach(p => {
            p[2] = 0;
            p[3] = 1;
            cubeShadow.mesh.vertice.push(new Vertex3D({ position: vec3.fromValues(p[0], p[1], 0) }));
        })
    }

}

const three_dimension_perspect_cube_face_p5 = new p5(three_dimension_perspect_cube_face);

const three_dimension_perspect_cube_rotate_a_round = (p: p5) => {
    const canvas = document.querySelector("#three-dimension-perspect-cube-rotate-a-round");
    const angleSlider = p.select('#cube-rotate-angle-range');
    let axisModel: Model3D;
    let camera: Camera3D;
    let lookCamera: Camera3D;
    let screenCamera: Camera3D;
    let cube: Model3D;
    let screen: Model3D;
    let cubeShadow: Model3D;
    let cubeRotation: quat;
    let scenePg: Graphics;
    let shadowPg: Graphics;

    const selectColor = faceColor;
    const unselectColor = [255, 255, 255, 128];

    p.setup = function () {

        p.createCanvas(700, 400, p.P2D, canvas!);
        scenePg = p.createGraphics(400, 400);
        shadowPg = p.createGraphics(300, 400);
        p.pixelDensity(p.displayDensity());
        // init 3D camera
        {
            camera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(6, 4, 4) }),
                    type: ProjectionType.Perspective,
                    perspectiveParam: { fovy: Math.PI * 50 / 180, aspect: scenePg.width / scenePg.height },
                    lookAtPoint: vec3.fromValues(0, 1, 0)
                }
            )
        }
        // init look camera
        {
            lookCamera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(1.5, 1.5, 4) }),
                    type: ProjectionType.Perspective,
                    perspectiveParam: { fovy: Math.PI * 60 / 180, aspect: scenePg.width / scenePg.height },
                    lookAtPoint: vec3.fromValues(1.5, 1.5, 0)
                }
            )
        }

        // build axis mesh
        {
            axisModel = generateAxisModel(3.2, 3.2, 3.2);
        }
        //init cube mesh
        {
            cube = generateCube();
            cube.mesh.faces.forEach(f => {
                f.color = unselectColor;
            })
            cube.mesh.faces[0].color = selectColor;
            vec3.set(cube.transform.translate, 1.5, 1.5, 2);
            cubeRotation = cube.transform.rotation;
            cubeShadow = new Model3D({ transform: new Transform3D({ translate: vec3.fromValues(1.5, 1.5, 0), scale: vec3.fromValues(1.5, 1.5, 1) }), mesh: new Mesh3D(cube.mesh) });

            cubeShadow.mesh.vertice = new Array<Vertex3D>();
        }

        //init screenMesh
        {
            const vertice = [
                new Vertex3D({ position: vec3.fromValues(0, 0, 0) }),
                new Vertex3D({ position: vec3.fromValues(0, 1, 0) }),
                new Vertex3D({ position: vec3.fromValues(1, 1, 0) }),
                new Vertex3D({ position: vec3.fromValues(1, 0, 0) })
            ];
            const faces = [new Face({ indice: [0, 1, 2, 3], color: [128, 128, 128, 64] })];
            screen = new Model3D({ transform: new Transform3D({ scale: vec3.fromValues(3, 3, 3) }), mesh: new Mesh3D({ vertice: vertice, faces: faces }) });

        }

        // init screen Camera
        {
            screenCamera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(1.5, 1.5, 1) }),
                    type: ProjectionType.Orthographic,
                    frustum: { left: -2.1, right: 2.1, bottom: -2.8, top: 2.8 },
                    lookAtPoint: vec3.fromValues(1.5, 1.5, 0)
                }
            )
        }


        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        scenePg.strokeCap(p.ROUND);
        scenePg.strokeJoin(p.ROUND);
        shadowPg.strokeCap(p.ROUND);
        shadowPg.strokeJoin(p.ROUND);
    }


    p.draw = function () {
        p.clear();

        scenePg.clear();
        shadowPg.clear();

        updateAngle(cubeRotation);

        displayAxis(scenePg, projectToScreen(axisModel, scenePg, camera));

        perspectProjectToPlane(scenePg, lookCamera, cube, cubeShadow);
        render(screen, scenePg, camera, { isStroke: false, stroke: [0], strokeWeight: 2 });
        render(cubeShadow, scenePg, camera);
        render(cube, scenePg, camera);

        displayAxis(shadowPg, projectToScreen(axisModel, shadowPg, screenCamera));
        render(screen, shadowPg, screenCamera, { isStroke: false, stroke: [0], strokeWeight: 2 });
        render(cubeShadow, shadowPg, screenCamera);


        p.image(scenePg, 0, 0);
        p.image(shadowPg, 375, 0);
    }
    p.mouseDragged = (e: MouseEvent) => {
        if (e.target != canvas) return;
        const yaw = (p.mouseX - p.pmouseX) * 0.1 * Math.PI / 180;
        const pitch = (p.mouseY - p.pmouseY) * 0.1 * Math.PI / 180;
        const up = camera.getUp();
        const right = camera.getRight();
        const yawQuat = quat.create()
        quat.setAxisAngle(yawQuat, up, yaw);
        const pitchQuat = quat.create()
        quat.setAxisAngle(pitchQuat, right, -pitch);
        quat.multiply(cubeRotation, yawQuat, cubeRotation);
        quat.multiply(cubeRotation, pitchQuat, cubeRotation);
    }

    function perspectProjectToPlane(p: p5, camera: Camera3D, cube: Model3D, cubeShadow: Model3D) {
        cubeShadow.mesh.vertice.splice(0);
        const worldPositions = cube.transform.transform(cube.mesh.vertice);
        const clipPositions = camera.worldToClip(worldPositions);
        clipPositions.forEach(p => {
            p[2] = 0;
            p[3] = 1;
            cubeShadow.mesh.vertice.push(new Vertex3D({ position: vec3.fromValues(p[0], p[1], 0) }));
        })
    }

    function updateAngle(cubeRotation: quat) {
        const yaw = <number>angleSlider!.value() * Math.PI / 180.0;
        quat.setAxisAngle(cubeRotation, vec3.fromValues(0, 1, 0), yaw);
    }


}
const three_dimension_perspect_cube_rotate_a_round_p5 = new p5(three_dimension_perspect_cube_rotate_a_round);


const cube_intersection = (p: p5) => {
    const canvas = document.querySelector("#cube-intersection");
    const zSlider = p.select('#cube-intersection-z-slider');
    let axisModel: Model3D;
    let camera: Camera3D;

    let screenCamera: Camera3D;
    let cube: Model3D;
    let screenModel: Model3D;

    let cubeRotation: quat;

    let scenePg: Graphics;
    let shadowPg: Graphics;
    const selectColor = faceColor;
    const unselectColor = faceColor;
    p.setup = function () {
        //init zSlider
        {
            zSlider!.elt.min = `${-1}`;
            zSlider!.elt.max = `${1}`;
            zSlider!.elt.value = `${0}`;
            zSlider!.elt.step = `${0.01}`;
        }
        p.createCanvas(700, 400, p.P2D, canvas!);
        scenePg = p.createGraphics(400, 400);
        shadowPg = p.createGraphics(300, 400);
        p.pixelDensity(p.displayDensity());
        // init 3D camera
        {
            camera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(6, 4, 4) }),
                    type: ProjectionType.Perspective,
                    perspectiveParam: { fovy: Math.PI * 50 / 180, aspect: scenePg.width / scenePg.height },
                    lookAtPoint: vec3.fromValues(0, 1, 0)
                }
            )
        }


        // build axis mesh
        {
            axisModel = generateAxisModel(3.2, 3.2, 3.2);

        }
        //init cube mesh
        {
            cube = generateCube();
            cube.mesh.faces.forEach(f => {
                f.color = unselectColor;
            })
            cube.mesh.faces[0].color = selectColor;
            vec3.set(cube.transform.translate, 1.5, 1.5, 2);
            cubeRotation = cube.transform.rotation;

        }

        //init screenMesh
        {
            const vertice = [
                new Vertex3D({ position: vec3.fromValues(0, 0, 0) }),
                new Vertex3D({ position: vec3.fromValues(0, 1, 0) }),
                new Vertex3D({ position: vec3.fromValues(1, 1, 0) }),
                new Vertex3D({ position: vec3.fromValues(1, 0, 0) })
            ];
            const faces = [new Face({ indice: [0, 1, 2, 3], color: [128, 128, 128, 64] })];
            screenModel = new Model3D({ transform: new Transform3D({ scale: vec3.fromValues(3, 3, 3) }), mesh: new Mesh3D({ vertice: vertice, faces: faces }) });
        }

        // init screen Camera
        {
            screenCamera = new Camera3D(
                {
                    transform: new Transform3D({ translate: vec3.fromValues(1.5, 1.5, 1) }),
                    type: ProjectionType.Orthographic,
                    frustum: { left: -2.1, right: 2.1, bottom: -2.8, top: 2.8 },
                    lookAtPoint: vec3.fromValues(1.5, 1.5, 0)
                }
            )
        }

        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        scenePg.strokeCap(p.ROUND);
        scenePg.strokeJoin(p.ROUND);
        shadowPg.strokeCap(p.ROUND);
        shadowPg.strokeJoin(p.ROUND);
    }


    p.draw = function () {
        p.clear();

        scenePg.clear();
        shadowPg.clear();
        updateZ(cube.transform);


        displayAxis(scenePg, projectToScreen(axisModel, scenePg, camera));

        displayAxis(shadowPg, projectToScreen(axisModel, shadowPg, screenCamera));

        // render(screenModel, scenePg, camera, { isStroke: false, stroke: [0], strokeWeight: 2 });
        render(screenModel, shadowPg, screenCamera, { isStroke: false, stroke: [0], strokeWeight: 2 });

        drawPolyWithClip(scenePg, camera, shadowPg, screenCamera, cube);

        p.image(scenePg, 0, 0);
        p.image(shadowPg, 375, 0);
    }
    function updateZ(transform: Transform3D) {
        transform.translate[2] = <number>zSlider!.value();
    }


    p.mouseDragged = (e: MouseEvent) => {
        if (e.target != canvas) return;
        const yaw = (p.mouseX - p.pmouseX) * 0.1 * Math.PI / 180;
        const pitch = (p.mouseY - p.pmouseY) * 0.1 * Math.PI / 180;
        const up = camera.getUp();
        const right = camera.getRight();
        const yawQuat = quat.create()
        quat.setAxisAngle(yawQuat, up, yaw);
        const pitchQuat = quat.create()
        quat.setAxisAngle(pitchQuat, right, -pitch);
        quat.multiply(cubeRotation, yawQuat, cubeRotation);
        quat.multiply(cubeRotation, pitchQuat, cubeRotation);
    }

}
const cube_intersection_p5 = new p5(cube_intersection);

const cube_unfold = (p: p5) => {
    const canvas = document.querySelector('#cube-unfold');
    let cube = {
        vertice: Array<Array<number>>(),
        indice: Array<Array<number>>()
    };
    p.setup = () => {
        p.createCanvas(600, 700, canvas!);
        p.pixelDensity(p.displayDensity());
        const vertice = [
            [-75, 75], [-225, 75], [-225, -75], [-75, -75],
            [75, 75], [75, 225], [-75, 225],
            [-75, -225], [75, -225], [75, -75],
            [-75, -375], [75, -375],
            [225, -75], [225, 75]
        ]
        const indice = [
            [0, 3, 9, 4],
            [0, 1, 2, 3],
            [3, 7, 8, 9],
            [7, 10, 11, 8],
            [9, 12, 13, 4],
            [0, 4, 5, 6]
        ]
        cube.vertice = vertice;
        cube.indice = indice;
    }
    p.draw = () => {
        p.clear();
        drawFaces(p, cube);
    }
    function drawFaces(p: p5, cube: {
        vertice: Array<Array<number>>,
        indice: Array<Array<number>>
    }) {
        const vertice = cube.vertice;
        p.push();
        p.translate(p.width / 2, p.height / 2 - 75);
        p.scale(1, -1);
        p.strokeWeight(2);
        p.stroke(edgeColor);
        p.fill(faceColor);
        cube.indice.forEach((indice) => {
            p.beginShape();
            indice.forEach(index => {
                const vertex = vertice[index];
                p.vertex(vertex[0], vertex[1]);
            })
            p.endShape(p.CLOSE);
        })
        p.pop();
    }
}
const cube_unfold_p5 = new p5(cube_unfold);