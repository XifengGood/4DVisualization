import {
    BufferGeometry,
    Color,
    Group,
    Mesh,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Object3DEventMap,
    BufferAttribute,
    RawShaderMaterial,
    Camera,
    IUniform,
    Vector3,
} from 'three';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mat4, vec3, vec4 } from 'gl-matrix';

import { Camera4D, ProjectionType } from '../component/camera';
import { Transform4D } from '../component/transform';

import { vsSource, fsSource } from './shaders/PhoneShader4D';

class TesseractGeometry extends BufferGeometry {
    /**
        * Create a new instance of {@link TesseractGeometry}
        * @param length Length; that is, the length of the edges parallel to the X axis. Optional; Expects a `Float`. Default `1`
        * @param width Width; that is, the length of the edges parallel to the Y axis. Optional; Expects a `Float`. Default `1`
        * @param height Height; that is, the length of the edges parallel to the Z axis. Optional; Expects a `Float`. Default `1`
        * @param stack stack; that is, the length of the edges parallel to the W axis. Optional; Expects a `Float`. Default `1`
        */
    constructor(
        private length: number = 1,
        private width: number = 1,
        private height: number = 1,
        private stack: number = 1,
    ) {
        super();
        this.parameters = {
            length, width, height, stack
        }
        this.type = "TesseractGeometry";

        const vertice = Array<[number, number, number, number]>();
        for (let i = 0; i < 16; i++) {
            vertice.push(
                [
                    ((i & 1) * 2 - 1) / 2 * length,
                    ((i & 2) - 1) / 2 * width,
                    ((i & 4) / 2 - 1) / 2 * height,
                    ((i & 8) / 4 - 1) / 2 * stack,
                ]
            )
        }
        const normals: Array<number> = [];
        const uvs: Array<number> = [];

        const cells = [
            [0, 1, 2, 3, 4, 5, 6, 7],
            [12, 13, 14, 15, 8, 9, 10, 11],
            [0, 4, 2, 6, 8, 12, 10, 14],
            [5, 1, 7, 3, 13, 9, 15, 11],
            [4, 5, 6, 7, 12, 13, 14, 15],
            [1, 0, 3, 2, 9, 8, 11, 10],
            [2, 6, 3, 7, 10, 14, 11, 15],
            [1, 0, 5, 4, 9, 8, 13, 12],
        ]

        const positions: Array<number> = [];
        const triangles: Array<number> = [];
        const edges: Array<number> = [];

        const tetrahedrons = [
            [0, 1, 4, 2],
            [3, 1, 2, 7],
            [5, 1, 7, 4],
            [6, 2, 4, 7],
            [1, 2, 7, 4]
        ]

        const faces = [
            [1, 0, 2, 3],
            [0, 4, 6, 2],
            [4, 5, 7, 6],
            [5, 1, 3, 7],
            [3, 2, 6, 7],
            [0, 1, 5, 4]
        ];

        cells.forEach((c, cells) => {
            const n = vec4.create();
            const p0 = vertice[c[0]];
            const p1 = vertice[c[3]];
            const p2 = vertice[c[6]];
            const p3 = vertice[c[5]];
            const v1 = vec4.create();
            const v2 = vec4.create();
            const v3 = vec4.create();
            vec4.sub(v1, p1, p0);
            vec4.sub(v2, p2, p0);
            vec4.sub(v3, p3, p0);
            vec4.cross(n, v1, v2, v3);
            vec4.normalize(n, n);
            c.forEach(i => {
                positions.push(...vertice[i]);
                normals.push(...n);
                uvs.push(...[0, 0]);
            })
            faces.forEach((face, faces) => {
                const offset = cells * 8;
                const i0 = offset + face[0];
                const i1 = offset + face[1];
                const i2 = offset + face[2];
                const i3 = offset + face[3];
                triangles.push(...[i0, i1, i2]);
                triangles.push(...[i0, i2, i3]);
                edges.push(...[i0, i1]);
                edges.push(...[i1, i2]);
                edges.push(...[i2, i3]);
                edges.push(...[i3, i0]);
            })
        })

        const positionNumComponents = 4;
        const normalNumComponents = 4;
        const uvNumComponents = 2;
        this.setAttribute('aPosition', new BufferAttribute(new Float32Array(positions), positionNumComponents));
        this.setAttribute('aNormal', new BufferAttribute(new Float32Array(normals), normalNumComponents));
        this.setAttribute('aUv', new BufferAttribute(new Float32Array(uvs), uvNumComponents));

        this.setIndex(triangles);
    }


    /**
     * A Read-only _string_ to check if `this` object type.
     * @remarks Sub-classes will update this value.
     * @defaultValue `TesseractGeometry`
     */
    override readonly type: string | "TesseractGeometry";

    /**
     * An object with a property for each of the constructor parameters.
     * @remarks Any modification after instantiation does not change the geometry.
     */
    readonly parameters: {
        readonly length: number;
        readonly width: number;
        readonly height: number;
        readonly stack: number;
    };
}

function updateGroupGeometry(mesh: Group, geometry: BufferGeometry) {
    (<Mesh>mesh.children[0]).geometry.dispose();
    (<Mesh>mesh.children[0]).geometry = geometry;
}

interface Map<T> {
    [key: string]: T;
}

const guis: Map<(transform4D: Transform4D, mesh: Group<Object3DEventMap>) => void> = {
    Tesseract: function (transform4D: Transform4D, mesh: Group) {
        const data = {
            length: 1, width: 1, height: 1, stack: 1
        }

        function generateGeometry() {
            updateGroupGeometry(mesh, new TesseractGeometry(data.length, data.width, data.height, data.stack));
        }
        const folder = gui.addFolder('Tesseract');

        folder.add(data, 'length', 0.5, 5).onChange(generateGeometry);
        folder.add(data, 'width', 0.5, 5).onChange(generateGeometry);
        folder.add(data, 'length', 0.5, 5).onChange(generateGeometry);
        folder.add(data, 'stack', 0.5, 5).onChange(generateGeometry);

        generateGeometry();

        const transform = {
            rotate: { xy: 0, yz: 0, xz: 0, xw: 0, yw: 0, zw: 0 }
        }

        function updateGeometry() {

            const rotate = transform.rotate;
            const rotate4D = transform4D.rotation4D;
            rotate4D.xy = rotate.xy * Math.PI / 180;
            rotate4D.yz = rotate.yz * Math.PI / 180;
            rotate4D.xz = rotate.xz * Math.PI / 180;
            rotate4D.xw = rotate.xw * Math.PI / 180;
            rotate4D.yw = rotate.yw * Math.PI / 180;
            rotate4D.zw = rotate.zw * Math.PI / 180;

        }

        const transformFolder = folder.addFolder('Transform');
        const positionFolder = transformFolder.addFolder('position');
        const position = transform4D.translate;
        positionFolder.add(position, '0', -1, 1).name("x");
        positionFolder.add(position, '1', -1, 1).name("y");
        positionFolder.add(position, '2', -1, 1).name("z");
        positionFolder.add(position, '3', -1, 1).name("w");
        const rotateFolder = transformFolder.addFolder('rotate');
        const rotate = transform.rotate;
        rotateFolder.add(rotate, 'xy', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'yz', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'xz', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'xw', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'yw', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'zw', -180, 180).onChange(updateGeometry);
        const scaleFolder = transformFolder.addFolder('scale');
        const scale = transform4D.scale;
        scaleFolder.add(scale, '0', 0.5, 5).name("x");
        scaleFolder.add(scale, '1', 0.5, 5).name("y");
        scaleFolder.add(scale, '2', 0.5, 5).name("z");
        scaleFolder.add(scale, '3', 0.5, 5).name("w");
    }
};

function chooseFromHash(transform4D: Transform4D, mesh: Group) {

    const selectedGeometry = window.location.hash.substring(1) || 'TorusGeometry';

    if (guis[selectedGeometry] !== undefined) {

        guis[selectedGeometry](transform4D, mesh);

    }

}


const selectedGeometry = window.location.hash.substring(1);

if (guis[selectedGeometry] !== undefined) {

    (<HTMLLinkElement>document.getElementById('newWindow')).href += '#' + selectedGeometry;

}

const gui = new GUI();

const scene = new Scene();
scene.background = new Color(0x444444);

const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = true;
orbit.target = new Vector3(0, 0, 0);

const group = new Group();

const transform = new Transform4D();
const geometry = new TesseractGeometry();

const camera4D = new Camera4D(
    {
        transform: new Transform4D({ translate: vec4.fromValues(2, 2, 2, 2) }),
        type: ProjectionType.Perspective,
        inside: 1,
        outside: 30
    }
);

function setCameraUniforms(material: RawShaderMaterial, transform4D: Transform4D, camera4D: Camera4D, camera: Camera) {

    const uniforms = material.uniforms;

    const rotateScaleMatrix4D = transform4D.getRotationScaleMatrix();
    uniforms.uNormalMatrix4D.value = mat4.transpose(mat4.create(), mat4.invert(mat4.create(), rotateScaleMatrix4D));
    uniforms.uRotateScale4D.value = rotateScaleMatrix4D;
    uniforms.uTranslate4D.value = transform4D.translate;

    uniforms.uCameraPositon4D.value = camera4D.transform.translate;
    uniforms.uViewMatrixWithoutTranslateCamera4D.value = camera4D.getViewMatrix4DWithoutTranslate();

    const projectionInfo = camera4D.getProjectionMatrix4D();
    const projectionMatrix4D = projectionInfo.projectionMatrix4D;
    const projectionTranslate = projectionInfo.projectParam.translate;
    const m5x1_5x4 = projectionInfo.projectParam.m5x1_5x4;
    const m5x5 = projectionInfo.projectParam.m5x5;
    uniforms.uProjectionMatrixWithoutTranslate4D.value = projectionMatrix4D;
    uniforms.uProjectionTranslate.value = projectionTranslate;
    uniforms.uM5x1_5x4.value = m5x1_5x4;
    uniforms.uM5x5.value = m5x5;

    uniforms.uViewMatrix.value = camera.matrixWorldInverse;
    uniforms.uProjectMatrix.value = camera.projectionMatrix;

    uniforms.uCameraPos.value = camera4D.transform.translate;

}

const material = new RawShaderMaterial({
    uniforms: {
        uNormalMatrix4D: { value: mat4.create() },
        uRotateScale4D: { value: mat4.create() },
        uTranslate4D: { value: mat4.create() },
        uCameraPositon4D: { value: mat4.create() },
        uViewMatrixWithoutTranslateCamera4D: { value: mat4.create() },
        uProjectionMatrixWithoutTranslate4D: { value: mat4.create() },
        uProjectionTranslate: { value: vec4.create() },
        uM5x1_5x4: { value: vec4.create() },
        uM5x5: { value: 1 },
        uViewMatrix: { value: mat4.create() },
        uProjectMatrix: { value: mat4.create() },


        uCameraPos: { value: vec4.create() },

        material: {
            value: {
                ambient: [0, 0, 0],
                diffuse: [0.6, 0.75, 0.3],
                specular: [1.0, 1, 1],
                shininess: 32.0,
            }
        },
        dirLight: {
            value: {
                direction: [-2, -1, 1, 2],

                ambient: [0.05, 0.05, 0.05],
                diffuse: [0.4, 0.4, 0.4],
                specular: [0.5, 0.5, 0.5]
            }
        },
        pointLights: {
            value: [
                {
                    position: [0, 0, 0, 3],

                    ambient: [0.5, 0.5, 0.5],
                    diffuse: [0.8, 0.8, 0.8],
                    specular: [1.0, 1.0, 1.0],

                    constant: 1.0,
                    linear: 0.09,
                    quadratic: 0.032,
                },
                {
                    position: [0, 0, 3, 0],

                    ambient: [0.5, 0.5, 0.5],
                    diffuse: [0.8, 0.8, 0.8],
                    specular: [1.0, 1.0, 1.0],

                    constant: 1.0,
                    linear: 0.09,
                    quadratic: 0.032,
                },
                {
                    position: [0, 3, 0, 0],

                    ambient: [0.5, 0.5, 0.5],
                    diffuse: [0.8, 0.8, 0.8],
                    specular: [1.0, 1.0, 1.0],

                    constant: 1.0,
                    linear: 0.09,
                    quadratic: 0.032,
                },
                {
                    position: [3,0,0,0],

                    ambient: [0.5, 0.5, 0.5],
                    diffuse: [0.8, 0.8, 0.8],
                    specular: [1.0, 1.0, 1.0],

                    constant: 1.0,
                    linear: 0.09,
                    quadratic: 0.032,
                },
            ]
        },
        spotLight: {
            value: {
                position: vec4.clone(camera4D.transform.translate),
                direction: camera4D.getOutSide(),
                ambient: [0.0, 0.0, 0.0],
                diffuse: [1.0, 1.0, 1.0],
                specular: [1.0, 1.0, 1.0],
                constant: 1.0,
                linear: 0.09,
                quadratic: 0.032,
                cutOff: Math.cos(12.5 * Math.PI / 180),
                outerCutOff: Math.cos(15.5 * Math.PI / 180)
            }
        }
    },
    vertexShader: vsSource,
    fragmentShader: fsSource
})
group.add(new Mesh(geometry, material));

initCameraGUI(gui, camera4D);
chooseFromHash(transform, group);
initMaterialGUI(gui, material);

scene.add(group);



function render() {

    setCameraUniforms(material, transform, camera4D, camera);

    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

window.addEventListener('resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}, false);

render();

function initMaterialGUI(gui: GUI, material: RawShaderMaterial) {
    const materialFolder = gui.addFolder("Material");
    const _material = material.uniforms.material.value;
    materialFolder.addColor(_material, "ambient");
    materialFolder.addColor(_material, "diffuse");
    materialFolder.addColor(_material, "specular");
    materialFolder.add(_material, "shininess", 1, 64);

    const lightFolder = gui.addFolder("Light");
    const dirLightFolder = lightFolder.addFolder("DirectionalLight");
    const lightDirectonFolder = dirLightFolder.addFolder("Direction");
    const dirLight = material.uniforms.dirLight.value;
    const dirLightDirection = dirLight.direction;
    lightDirectonFolder.add(dirLightDirection, "0", -5, 5).name("x");
    lightDirectonFolder.add(dirLightDirection, "1", -5, 5).name("y");
    lightDirectonFolder.add(dirLightDirection, "2", -5, 5).name("z");
    lightDirectonFolder.add(dirLightDirection, "3", -5, 5).name("w");
    dirLightFolder.addColor(dirLight, "ambient");
    dirLightFolder.addColor(dirLight, "diffuse");
    dirLightFolder.addColor(dirLight, "specular");

    const pointLightsFolder = lightFolder.addFolder("PointLight");
    for (let i = 0; i < (<any>material.uniforms.pointLights.value).length; i++) {
        const pointLight = (<any>material.uniforms.pointLights.value)[i];
        const pointLightFolder = pointLightsFolder.addFolder("PointLight " + i.toString());
        const pointLightPositionFolder = pointLightFolder.addFolder("Position");
        const position = pointLight.position;
        pointLightPositionFolder.add(position, "0", -5, 5).name("x");
        pointLightPositionFolder.add(position, "1", -5, 5).name("y");
        pointLightPositionFolder.add(position, "2", -5, 5).name("z");
        pointLightPositionFolder.add(position, "3", -5, 5).name("w");
        pointLightFolder.addColor(pointLight, "ambient");
        pointLightFolder.addColor(pointLight, "diffuse");
        pointLightFolder.addColor(pointLight, "specular");
        pointLightFolder.add(pointLight, "constant", 0, 1);
        pointLightFolder.add(pointLight, "linear", 0, 1);
        pointLightFolder.add(pointLight, "quadratic", 0, 1);

    }
    const spotLightFolder = lightFolder.addFolder("SpotLight");
    const spotLight = material.uniforms.spotLight.value;

    const spotLightPositionFolder = spotLightFolder.addFolder("Position");
    const spotLightPos = spotLight.position;
    spotLightPositionFolder.add(spotLightPos, '0', -5, 5).name("x");
    spotLightPositionFolder.add(spotLightPos, '1', -5, 5).name("y");
    spotLightPositionFolder.add(spotLightPos, '2', -5, 5).name("z");
    spotLightPositionFolder.add(spotLightPos, '3', -5, 5).name("w");

    const spotLightDirectionFolder = spotLightFolder.addFolder("Direction");
    const spotLightDir = spotLight.direction;
    spotLightDirectionFolder.add(spotLightDir, '0', -5, 5).name("x");
    spotLightDirectionFolder.add(spotLightDir, '1', -5, 5).name("y");
    spotLightDirectionFolder.add(spotLightDir, '2', -5, 5).name("z");
    spotLightDirectionFolder.add(spotLightDir, '3', -5, 5).name("w");

    spotLightFolder.addColor(spotLight, "ambient");
    spotLightFolder.addColor(spotLight, "diffuse");
    spotLightFolder.addColor(spotLight, "specular");
    spotLightFolder.add(spotLight, "constant", 0, 1);
    spotLightFolder.add(spotLight, "linear", 0, 1);
    spotLightFolder.add(spotLight, "quadratic", 0, 1);

    const cutInfo = {
        cutOff: 12.5,
        outerCutOff: 15.5
    }
    spotLightFolder.add(cutInfo, "cutOff", 0, 180).onChange(() => { spotLight.cutOff = cutInfo.cutOff * Math.PI / 180 });
    spotLightFolder.add(cutInfo, "outerCutOff", 0, 180).onChange(() => { spotLight.outerCutOff = cutInfo.outerCutOff * Math.PI / 180 });

}

function initCameraGUI(gui: GUI, camera4D: Camera4D) {
    const folder = gui.addFolder("Camera4D");
    const transform = camera4D.transform;

    const transformFolder = folder.addFolder("Transform");
    const positionFolder = transformFolder.addFolder("Position");
    const position = transform.translate;
    positionFolder.add(position, '0', -5, 5).name('x');
    positionFolder.add(position, '1', -5, 5).name('y');
    positionFolder.add(position, '2', -5, 5).name('z');
    positionFolder.add(position, '3', -5, 5).name('w');

    const lookAtPoint = camera4D.lookAtPoint;
    const lookAtPointFolder = transformFolder.addFolder("LookAtPoint");
    lookAtPointFolder.add(lookAtPoint, '0', -5, 5).name('x');
    lookAtPointFolder.add(lookAtPoint, '1', -5, 5).name('y');
    lookAtPointFolder.add(lookAtPoint, '2', -5, 5).name('z');
    lookAtPointFolder.add(lookAtPoint, '3', -5, 5).name('w');

    folder.add(camera4D, "inside", 0, 10);
    folder.add(camera4D, "outside", 0, 100);

} 