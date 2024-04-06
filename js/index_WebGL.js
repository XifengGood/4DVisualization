import { SimpleRotator } from "./util/simple-rotator.js";
import { initSwitches } from "./util/switch.js";
import { mat4, vec3, vec4 } from "gl-matrix";
import { Camera3D, Camera4D, ProjectionType } from "./component/camera.js";
import { Transform3D, Transform4D } from "./component/transform.js";
import { Shader, vsSource, fsSource, UniformDataType, vsSource3d, fsSource3d } from "./shader/shader.js";
import { Model3D } from "./component/model.js";
import { MeshRenderer3D, MeshRenderer4D } from "./component/meshRender.js";
import { generateTesseract, generateCube, generateTesseractHardEdge } from "./component/geometry.js";
import * as THREE from 'three';
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull';
import { Edge, Face, Vertex3D } from "./component/mesh.js";
import { intersect3Dplane } from "./component/base.js";
// 从这里开始
function main() {
    const canvas = document.querySelector("#tesseract");
    const gl = canvas.getContext("webgl2");
    const rotator = new SimpleRotator(canvas, () => { }, 2);
    // 确认 WebGL 支持性
    if (!gl) {
        alert("无法初始化 WebGL, 你的浏览器、操作系统或硬件等可能不支持 WebGL。");
        return;
    }
    const camera4D = new Camera4D({
        transform: new Transform4D({ translate: vec4.fromValues(0, 0, 0, 2.7) }),
        type: ProjectionType.Perspective,
        inside: 1,
        outside: 5
    });
    const camera3D = new Camera3D({
        transform: new Transform3D({ translate: vec3.fromValues(0, 0, 2) }),
        type: ProjectionType.Perspective,
        perspectiveParam: { fovy: (90 * Math.PI) / 180, aspect: canvas.width / canvas.height }
    });
    camera3D.getViewMatrix = rotator.getViewMatrix;
    const baseShader = new Shader(gl, vsSource, fsSource);
    const tesseractModel = generateTesseract();
    const tesseract = new MeshRenderer4D(tesseractModel, baseShader);
    const opaque_objects = [
        { name: "tesseract_edges", meshRenderer: tesseract },
    ];
    function render() {
        draw_opaque_objects(gl, opaque_objects, camera4D, camera3D);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();
function main_tessract_unfold() {
    const canvas = document.querySelector("#tesseract-unfold");
    const gl = canvas.getContext("webgl2");
    const rotator = new SimpleRotator(canvas, () => { }, 4);
    // 确认 WebGL 支持性
    if (!gl) {
        alert("无法初始化 WebGL, 你的浏览器、操作系统或硬件等可能不支持 WebGL。");
        return;
    }
    const camera3D = new Camera3D({
        transform: new Transform3D({ translate: vec3.fromValues(0, 0, 1) }),
        type: ProjectionType.Perspective,
    });
    camera3D.getViewMatrix = rotator.getViewMatrix;
    const baseShader3D = new Shader(gl, vsSource3d, fsSource3d);
    const cube = generateCube();
    const cubeMeshRender = new MeshRenderer3D(cube, baseShader3D);
    const transforms = [
        new Transform3D(),
        new Transform3D({ translate: vec3.fromValues(1, 0, 0) }),
        new Transform3D({ translate: vec3.fromValues(-1, 0, 0) }),
        new Transform3D({ translate: vec3.fromValues(0, 1, 0) }),
        new Transform3D({ translate: vec3.fromValues(0, -1, 0) }),
        new Transform3D({ translate: vec3.fromValues(0, -2, 0) }),
        new Transform3D({ translate: vec3.fromValues(0, 0, 1) }),
        new Transform3D({ translate: vec3.fromValues(0, 0, -1) }),
    ];
    const opaque_objects = [
        { name: "tesseract_edges", meshRenderer: cubeMeshRender },
    ];
    function render() {
        draw_opaque_objects_3D(gl, opaque_objects, camera3D);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    function draw_opaque_objects_3D(gl, objects, camera3D) {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        let lastShader;
        const VPMatrix = camera3D.getVPMatrix();
        objects.forEach(object => {
            const shader = object.meshRenderer.shader;
            if (lastShader == undefined || lastShader != shader) {
                shader.use();
                //update camera uniforms
                lastShader = shader;
            }
            drawGPUInstance(transforms, VPMatrix, object.meshRenderer);
        });
    }
    function drawGPUInstance(transforms, VPMatrix, meshRenderer) {
        transforms.forEach(transform => {
            const ModelMatrix = transform.getModelMatrix();
            const MVPMatrix = mat4.create();
            mat4.multiply(MVPMatrix, VPMatrix, ModelMatrix);
            setUniforms(meshRenderer.shader, MVPMatrix);
            meshRenderer.drawEdge();
        });
    }
    function setUniforms(shader, MVPMatrix) {
        const uniformsData = Array();
        uniformsData.push({
            name: "uMVPMatrix",
            value: MVPMatrix,
            type: UniformDataType.mat4
        });
        shader.setUniforms(uniformsData);
    }
}
main_tessract_unfold();
function main_tessract_eight_cells() {
    const canvas = document.querySelector("#tesseract-eight-cells");
    const gl = canvas.getContext("webgl2");
    const rotator = new SimpleRotator(canvas, () => { }, 2);
    const switches = document.querySelector("#tesseract-eight-cell-switches");
    initSwitches(switches);
    // 确认 WebGL 支持性
    if (!gl) {
        alert("无法初始化 WebGL, 你的浏览器、操作系统或硬件等可能不支持 WebGL。");
        return;
    }
    const camera4D = new Camera4D({
        transform: new Transform4D({ translate: vec4.fromValues(0, 0, 0, -2.7) }),
        type: ProjectionType.Perspective,
        inside: 1,
        outside: 5
    });
    const camera3D = new Camera3D({
        transform: new Transform3D({ translate: vec3.fromValues(0, 0, 1) }),
        type: ProjectionType.Perspective,
    });
    camera3D.getViewMatrix = rotator.getViewMatrix;
    const unselectColor = [1, 1, 1, 0.05];
    const selectColor = [0.1, 1, 0.1, 0.7];
    const colors = [
        unselectColor,
        unselectColor,
        unselectColor,
        unselectColor,
        unselectColor,
        unselectColor,
        unselectColor,
        unselectColor
    ];
    const tesseract = generateTesseractHardEdge(colors);
    const baseShader = new Shader(gl, vsSource, fsSource);
    const tesseractRenderer = new MeshRenderer4D(tesseract, baseShader);
    const tesseractEdge = generateTesseract();
    const tesseractEdgeRenderer = new MeshRenderer4D(tesseractEdge, baseShader);
    switches.addEventListener('onChangeSelect', (_e) => {
        const e = _e;
        const lastIndex = parseInt(e.detail.lastIndex);
        const currentIndex = parseInt(e.detail.currentIndex);
        if (lastIndex != 0) {
            const startIndex = (lastIndex - 1) * 8;
            for (let i = startIndex; i < startIndex + 8; i++) {
                tesseract.mesh.vertice[i].color = unselectColor;
            }
        }
        if (currentIndex != 0) {
            // faces[currentIndex - 1].color = selectColor;
            const startIndex = (currentIndex - 1) * 8;
            for (let i = startIndex; i < startIndex + 8; i++) {
                tesseract.mesh.vertice[i].color = selectColor;
            }
        }
        tesseractRenderer.updateColorBuffer();
    });
    const opaque_objects = [
        { name: "tesseract_edges", meshRenderer: tesseractEdgeRenderer },
    ];
    const transparent_objects = [
        { name: "tesseract_faces", meshRenderer: tesseractRenderer }
    ];
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        draw_opaque_objects(gl, opaque_objects, camera4D, camera3D);
        draw_transparent_objects(gl, transparent_objects, camera4D, camera3D);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main_tessract_eight_cells();
function main_tessract_rotate_a_round() {
    const canvas = document.querySelector("#tesseract-rotate-a-round");
    const gl = canvas.getContext("webgl2");
    const slider = document.querySelector('#yw-angle-slider');
    // 确认 WebGL 支持性
    if (!gl) {
        alert("无法初始化 WebGL, 你的浏览器、操作系统或硬件等可能不支持 WebGL。");
        return;
    }
    const camera4D = new Camera4D({
        transform: new Transform4D({ translate: vec4.fromValues(0, 0, 0, -2.7) }),
        type: ProjectionType.Perspective,
        inside: 1,
        outside: 5
    });
    const camera3D = new Camera3D({
        transform: new Transform3D({ translate: vec3.fromValues(3, 3, -4) }),
        type: ProjectionType.Perspective,
        perspectiveParam: { fovy: (30 * Math.PI) / 180, aspect: 1 },
    });
    const unselectColor = [1, 1, 1, 0.05];
    const selectColor = [0.1, 1, 0.1, 0.7];
    const colors = [
        selectColor,
        unselectColor,
        unselectColor,
        unselectColor,
        unselectColor,
        unselectColor,
        unselectColor,
        unselectColor
    ];
    const tesseract = generateTesseractHardEdge(colors);
    const baseShader = new Shader(gl, vsSource, fsSource);
    const tesseractRenderer = new MeshRenderer4D(tesseract, baseShader);
    const tesseractEdge = generateTesseract();
    tesseractEdge.transform = tesseract.transform;
    const tesseractEdgeRenderer = new MeshRenderer4D(tesseractEdge, baseShader);
    const opaque_objects = [
        { name: "tesseract_edges", meshRenderer: tesseractEdgeRenderer },
    ];
    const transparent_objects = [
        { name: "tesseract_faces", meshRenderer: tesseractRenderer }
    ];
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        tesseract.transform.rotation4D.yw = parseInt(slider.value) * Math.PI / 180;
        draw_opaque_objects(gl, opaque_objects, camera4D, camera3D);
        draw_transparent_objects(gl, transparent_objects, camera4D, camera3D);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main_tessract_rotate_a_round();
function main_tessract_intersection() {
    const canvas = document.querySelector("#tesseract-intersection");
    const gl = canvas.getContext("webgl2");
    const wSlider = document.querySelector('#tesseract-intersection-w-slider');
    const xwSlider = document.querySelector('#tesseract-intersection-xw-slider');
    const ywSlider = document.querySelector('#tesseract-intersection-yw-slider');
    const zwSlider = document.querySelector('#tesseract-intersection-zw-slider');
    const rotator = new SimpleRotator(canvas, () => { }, 4);
    const camera3D = new Camera3D({
        transform: new Transform3D({ translate: vec3.fromValues(1, 1, -4) }),
        type: ProjectionType.Perspective,
        perspectiveParam: { fovy: (30 * Math.PI) / 180, aspect: 1 },
    });
    camera3D.getViewMatrix = rotator.getViewMatrix;
    const shader = new Shader(gl, vsSource3d, fsSource3d);
    const tesseract = generateTesseract();
    const tesseract_3d_shadow_edge = new Model3D();
    const tesseract_3d_shadow_triangle = new Model3D({ transform: tesseract_3d_shadow_edge.transform });
    const meshRendererEdge = new MeshRenderer3D(tesseract_3d_shadow_edge, shader);
    const meshRendererTriangle = new MeshRenderer3D(tesseract_3d_shadow_triangle, shader);
    const opaque_objects = [
        { name: "tesseract_3d_shadow_edges", meshRenderer: meshRendererEdge },
    ];
    const transparent_objects = [
        { name: "tesseract_3d_shadow_faces", meshRenderer: meshRendererTriangle }
    ];
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        {
            tesseract.transform.translate[3] = parseFloat(wSlider.value);
            tesseract.transform.rotation4D.xw = parseInt(xwSlider.value) * Math.PI / 180;
            tesseract.transform.rotation4D.yw = parseInt(ywSlider.value) * Math.PI / 180;
            tesseract.transform.rotation4D.zw = parseInt(zwSlider.value) * Math.PI / 180;
            updateIntersectMesh(tesseract, tesseract_3d_shadow_edge.mesh, tesseract_3d_shadow_triangle.mesh);
            meshRendererEdge.updateAttributeBuffers();
            meshRendererEdge.updateEdgeIndiceBuffer();
            meshRendererTriangle.updateAttributeBuffers();
            meshRendererTriangle.updateTriangleIndiceBuffer();
        }
        draw_opaque_objects_3D(gl, opaque_objects, camera3D);
        draw_transparent_objects_3D(gl, transparent_objects, camera3D);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    function setUniforms(shader, MVPMatrix) {
        const uniformsData = Array();
        uniformsData.push({
            name: "uMVPMatrix",
            value: MVPMatrix,
            type: UniformDataType.mat4
        });
        shader.setUniforms(uniformsData);
    }
    function draw_opaque_objects_3D(gl, objects, camera3D) {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        let lastShader;
        const VPMatrix = camera3D.getVPMatrix();
        objects.forEach(object => {
            const shader = object.meshRenderer.shader;
            const transform = object.meshRenderer.model.transform;
            const ModelMatrix = transform.getModelMatrix();
            const MVPMatrix = mat4.create();
            mat4.multiply(MVPMatrix, VPMatrix, ModelMatrix);
            if (lastShader == undefined || lastShader != shader) {
                shader.use();
                //update camera uniforms
                setUniforms(shader, MVPMatrix);
                lastShader = shader;
            }
            object.meshRenderer.drawEdge();
        });
    }
    function draw_transparent_objects_3D(gl, objects, camera3D) {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(false);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        let lastShader;
        const VPMatrix = camera3D.getVPMatrix();
        objects.forEach(object => {
            const shader = object.meshRenderer.shader;
            const transform = object.meshRenderer.model.transform;
            const ModelMatrix = transform.getModelMatrix();
            const MVPMatrix = mat4.create();
            mat4.multiply(MVPMatrix, VPMatrix, ModelMatrix);
            if (lastShader == undefined || lastShader != shader) {
                shader.use();
                //update camera uniforms
                setUniforms(shader, MVPMatrix);
                lastShader = shader;
            }
            object.meshRenderer.drawTriangle();
        });
    }
}
main_tessract_intersection();
function intersect(worldPos, edges) {
    const intersectionPoints = intersect3Dplane(worldPos, edges);
    const points = [];
    intersectionPoints.forEach(v => {
        points.push(new THREE.Vector3(v[0], v[1], v[2]));
    });
    const convexHull = new ConvexHull();
    convexHull.setFromPoints(points);
    return convexHull;
}
function updateIntersectMesh(model4D, mesh3D_edge, mesh3D_triangle) {
    const worldPositions = model4D.transform.transform(model4D.mesh.vertice);
    const _edges = [];
    model4D.mesh.edges.forEach(e => {
        _edges.push([e.indice[0], e.indice[1]]);
    });
    const convexHull = intersect(worldPositions, _edges);
    const faceColor = [1, 1, 1, 0.5];
    const edgeColor = [0, 0, 0, 1];
    const verticeEdge = [];
    const verticeTriangle = [];
    const edges = [];
    const triangles = [];
    convexHull.faces.forEach((f, i) => {
        const first = f.edge;
        const second = first.next;
        const third = second.next;
        const v0 = first.vertex.point;
        const v1 = second.vertex.point;
        const v2 = third.vertex.point;
        verticeEdge.push(new Vertex3D({ position: [v0.x, v0.y, v0.z], color: edgeColor }));
        verticeEdge.push(new Vertex3D({ position: [v1.x, v1.y, v1.z], color: edgeColor }));
        verticeEdge.push(new Vertex3D({ position: [v2.x, v2.y, v2.z], color: edgeColor }));
        verticeTriangle.push(new Vertex3D({ position: [v0.x, v0.y, v0.z], color: faceColor }));
        verticeTriangle.push(new Vertex3D({ position: [v1.x, v1.y, v1.z], color: faceColor }));
        verticeTriangle.push(new Vertex3D({ position: [v2.x, v2.y, v2.z], color: faceColor }));
        const start = i * 3;
        edges.push(new Edge([start, start + 1]));
        edges.push(new Edge([start + 1, start + 2]));
        edges.push(new Edge([start + 2, start]));
        triangles.push(new Face({ indice: [start, start + 1, start + 2] }));
    });
    mesh3D_edge.vertice = verticeEdge;
    mesh3D_edge.edges = edges;
    mesh3D_edge.faces = triangles;
    mesh3D_triangle.vertice = verticeTriangle;
    mesh3D_triangle.edges = edges;
    mesh3D_triangle.faces = triangles;
}
function draw_opaque_objects(gl, objects, camera4D, camera3D) {
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    let lastShader;
    objects.forEach(object => {
        const shader = object.meshRenderer.shader;
        if (lastShader == undefined || lastShader != shader) {
            shader.use();
            //update camera uniforms
            setCameraUniforms(shader, camera4D, camera3D);
            lastShader = shader;
        }
        object.meshRenderer.drawEdge();
    });
}
function draw_transparent_objects(gl, objects, camera4D, camera3D) {
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    let lastShader;
    objects.forEach(object => {
        const shader = object.meshRenderer.shader;
        if (lastShader == undefined || lastShader != shader) {
            shader.use();
            //update camera uniforms
            setCameraUniforms(shader, camera4D, camera3D);
            lastShader = shader;
        }
        object.meshRenderer.drawTriangle();
    });
}
function setCameraUniforms(shader, camera4D, camera3D) {
    const uniformsData = Array();
    uniformsData.push({
        name: "uCameraPositon4D",
        value: camera4D.transform.translate,
        type: UniformDataType.vec4
    });
    uniformsData.push({
        name: "uViewMatrixWithoutTranslateCamera4D",
        value: camera4D.getViewMatrix4DWithoutTranslate(),
        type: UniformDataType.mat4
    });
    const projectionInfo = camera4D.getProjectionMatrix4D();
    const projectionMatrix4D = projectionInfo.projectionMatrix4D;
    const projectionTranslate = projectionInfo.projectParam.translate;
    const m5x1_5x4 = projectionInfo.projectParam.m5x1_5x4;
    const m5x5 = projectionInfo.projectParam.m5x5;
    uniformsData.push({
        name: "uProjectionMatrixWithoutTranslate4D",
        value: projectionMatrix4D,
        type: UniformDataType.mat4
    });
    uniformsData.push({
        name: "uProjectionTranslate",
        value: projectionTranslate,
        type: UniformDataType.vec4
    });
    uniformsData.push({
        name: "uM5x1_5x4",
        value: m5x1_5x4,
        type: UniformDataType.vec4
    });
    uniformsData.push({
        name: "uM5x5",
        value: m5x5,
        type: UniformDataType.number
    });
    uniformsData.push({
        name: "uVPMatrix",
        value: camera3D.getVPMatrix(),
        type: UniformDataType.mat4
    });
    shader.setUniforms(uniformsData);
}
