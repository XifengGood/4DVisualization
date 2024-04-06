import { Color, DirectionalLight, DoubleSide, Group, LineSegments, LineBasicMaterial, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, Vector3, WireframeGeometry, WebGLRenderer, } from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { intersect3Dplane } from '../component/base';
import { Model4D } from '../component/model';
import { generateHyperSphere, generateTesseract } from '../component/geometry';
import { vec4 } from 'gl-matrix';
const guis = {
    Tesseract: function (model4D, mesh) {
        const data = {
            length: 1, width: 1, height: 1, stack: 1
        };
        function generateGeometry() {
            model4D.mesh = generateTesseract(data).mesh;
            updateIntersectGeometry(model4D, mesh);
        }
        const folder = gui.addFolder('Tesseract');
        folder.add(data, 'length', 0.5, 5).onChange(generateGeometry);
        folder.add(data, 'width', 0.5, 5).onChange(generateGeometry);
        folder.add(data, 'length', 0.5, 5).onChange(generateGeometry);
        folder.add(data, 'stack', 0.5, 5).onChange(generateGeometry);
        generateGeometry();
        const transform = {
            translate: { x: 0, y: 0, z: 0, w: 0 },
            rotate: { xy: 0, yz: 0, xz: 0, xw: 0, yw: 0, zw: 0 },
            scale: { x: 1, y: 1, z: 1, w: 1 },
        };
        function updateGeometry() {
            const translate = transform.translate;
            vec4.set(model4D.transform.translate, translate.x, translate.y, translate.z, translate.w);
            const scale = transform.scale;
            vec4.set(model4D.transform.scale, scale.x, scale.y, scale.z, scale.w);
            const rotate = transform.rotate;
            const rotate4D = model4D.transform.rotation4D;
            rotate4D.xy = rotate.xy * Math.PI / 180;
            rotate4D.yz = rotate.yz * Math.PI / 180;
            rotate4D.xz = rotate.xz * Math.PI / 180;
            rotate4D.xw = rotate.xw * Math.PI / 180;
            rotate4D.yw = rotate.yw * Math.PI / 180;
            rotate4D.zw = rotate.zw * Math.PI / 180;
            updateIntersectGeometry(model4D, mesh);
        }
        const transformFolder = folder.addFolder('Transform');
        const translateFolder = transformFolder.addFolder('translate');
        const translate = transform.translate;
        translateFolder.add(translate, 'x', -1, 1).onChange(updateGeometry);
        translateFolder.add(translate, 'y', -1, 1).onChange(updateGeometry);
        translateFolder.add(translate, 'z', -1, 1).onChange(updateGeometry);
        translateFolder.add(translate, 'w', -1, 1).onChange(updateGeometry);
        const rotateFolder = transformFolder.addFolder('rotate');
        const rotate = transform.rotate;
        rotateFolder.add(rotate, 'xy', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'yz', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'xz', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'xw', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'yw', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'zw', -180, 180).onChange(updateGeometry);
        const scaleFolder = transformFolder.addFolder('scale');
        const scale = transform.scale;
        scaleFolder.add(scale, 'x', 0.5, 5).onChange(updateGeometry);
        scaleFolder.add(scale, 'y', 0.5, 5).onChange(updateGeometry);
        scaleFolder.add(scale, 'z', 0.5, 5).onChange(updateGeometry);
        scaleFolder.add(scale, 'w', 0.5, 5).onChange(updateGeometry);
    },
    HyperSphere: function (model4D, mesh) {
        const data = {
            radius_x: 1, radius_y: 1, radius_z: 1, radius_w: 1
        };
        function generateGeometry() {
            model4D.mesh = generateHyperSphere(data).mesh;
            updateIntersectGeometry(model4D, mesh);
        }
        const folder = gui.addFolder('Tesseract');
        folder.add(data, 'radius_x', 0.5, 5).onChange(generateGeometry);
        folder.add(data, 'radius_y', 0.5, 5).onChange(generateGeometry);
        folder.add(data, 'radius_z', 0.5, 5).onChange(generateGeometry);
        folder.add(data, 'radius_w', 0.5, 5).onChange(generateGeometry);
        generateGeometry();
        const transform = {
            translate: { x: 0, y: 0, z: 0, w: 0 },
            rotate: { xy: 0, yz: 0, xz: 0, xw: 0, yw: 0, zw: 0 },
            scale: { x: 1, y: 1, z: 1, w: 1 },
        };
        function updateGeometry() {
            const translate = transform.translate;
            vec4.set(model4D.transform.translate, translate.x, translate.y, translate.z, translate.w);
            const scale = transform.scale;
            vec4.set(model4D.transform.scale, scale.x, scale.y, scale.z, scale.w);
            const rotate = transform.rotate;
            const rotate4D = model4D.transform.rotation4D;
            rotate4D.xy = rotate.xy * Math.PI / 180;
            rotate4D.yz = rotate.yz * Math.PI / 180;
            rotate4D.xz = rotate.xz * Math.PI / 180;
            rotate4D.xw = rotate.xw * Math.PI / 180;
            rotate4D.yw = rotate.yw * Math.PI / 180;
            rotate4D.zw = rotate.zw * Math.PI / 180;
            updateIntersectGeometry(model4D, mesh);
        }
        const transformFolder = folder.addFolder('Transform');
        const translateFolder = transformFolder.addFolder('translate');
        const translate = transform.translate;
        translateFolder.add(translate, 'x', -1, 1).onChange(updateGeometry);
        translateFolder.add(translate, 'y', -1, 1).onChange(updateGeometry);
        translateFolder.add(translate, 'z', -1, 1).onChange(updateGeometry);
        translateFolder.add(translate, 'w', -1, 1).onChange(updateGeometry);
        const rotateFolder = transformFolder.addFolder('rotate');
        const rotate = transform.rotate;
        rotateFolder.add(rotate, 'xy', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'yz', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'xz', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'xw', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'yw', -180, 180).onChange(updateGeometry);
        rotateFolder.add(rotate, 'zw', -180, 180).onChange(updateGeometry);
        const scaleFolder = transformFolder.addFolder('scale');
        const scale = transform.scale;
        scaleFolder.add(scale, 'x', 0.5, 5).onChange(updateGeometry);
        scaleFolder.add(scale, 'y', 0.5, 5).onChange(updateGeometry);
        scaleFolder.add(scale, 'z', 0.5, 5).onChange(updateGeometry);
        scaleFolder.add(scale, 'w', 0.5, 5).onChange(updateGeometry);
    }
};
function chooseFromHash(model4D, mesh) {
    const selectedGeometry = window.location.hash.substring(1) || 'TorusGeometry';
    if (guis[selectedGeometry] !== undefined) {
        guis[selectedGeometry](model4D, mesh);
    }
}
const selectedGeometry = window.location.hash.substring(1);
if (guis[selectedGeometry] !== undefined) {
    document.getElementById('newWindow').href += '#' + selectedGeometry;
}
const gui = new GUI();
const scene = new Scene();
scene.background = new Color(0x444444);
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.z = 3;
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = false;
const lights = [];
lights[0] = new DirectionalLight(0xffffff, 3);
lights[1] = new DirectionalLight(0xffffff, 3);
lights[2] = new DirectionalLight(0xffffff, 3);
lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);
scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);
const group = new Group();
const hyperGeometry = new Model4D();
const geometry = getIntersectGeometry(hyperGeometry);
const lineMaterial = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
const meshMaterial = new MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: DoubleSide, flatShading: true });
group.add(new LineSegments(geometry, lineMaterial));
group.add(new Mesh(geometry, meshMaterial));
chooseFromHash(hyperGeometry, group);
scene.add(group);
function render() {
    requestAnimationFrame(render);
    group.rotation.x += 0.005;
    group.rotation.y += 0.005;
    renderer.render(scene, camera);
}
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
render();
function getIntersectGeometry(model4D) {
    const worldPositions = model4D.transform.transform(model4D.mesh.vertice);
    const edges = [];
    model4D.mesh.edges.forEach(e => {
        edges.push([e.indice[0], e.indice[1]]);
    });
    const intersectionPoints = intersect3Dplane(worldPositions, edges);
    const points = [];
    intersectionPoints.forEach(p => {
        points.push(new Vector3(p[0], p[1], p[2]));
    });
    const geometry = new ConvexGeometry(points);
    return geometry;
}
function updateIntersectGeometry(model4D, mesh) {
    const geometry = getIntersectGeometry(model4D);
    mesh.children[0].geometry.dispose();
    mesh.children[1].geometry.dispose();
    mesh.children[0].geometry = new WireframeGeometry(geometry);
    mesh.children[1].geometry = geometry;
}
