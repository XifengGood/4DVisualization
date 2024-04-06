import { WebGLRenderer, PerspectiveCamera, Scene } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { Rotate4DMatrix } from '../component/base';
import { RayMarchingHyperSphereShader } from './shaders/ray-marching-hyperSphere';
import { mat4 } from 'gl-matrix';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min';
import { RayMarchingTesseractShader } from './shaders/ray-marching-Tesseract';
const gui = new GUI();
const guis = {
    Tesseract: function (composer) {
        const transform = {
            rotation: {
                xy: 0,
                yz: 0,
                xz: 0,
                xw: 0,
                yw: 0,
                zw: 0,
            }
        };
        const rayMarchingPass = new ShaderPass({
            ...RayMarchingTesseractShader,
            uniforms: {
                viewport: { value: [window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio] },
                cameraQuaternion: { value: camera.quaternion },
                fov: { value: camera.fov },
                time: { value: 0 },
                tesseract: {
                    value: {
                        center: [0, 0, 0, 0],
                        bound: [1, 1, 1, 1]
                    }
                },
                transform: {
                    value: {
                        translate: [0, 0, 4, 0],
                        rotation: mat4.create(),
                        scale: [1, 1, 1, 1],
                    }
                },
                tesseractMaterial: {
                    value: {
                        ambient: [1, 1, 1],
                        diffuse: [0.6, 0.75, 0.3],
                        specular: [1, 1, 1],
                        shininess: 32.0,
                    }
                },
                hyperPlaneMaterial: {
                    value: {
                        ambient: [0, 0, 0],
                        diffuse: [1, 0.7, 1],
                        specular: [1.0, 1, 1],
                        shininess: 32.0,
                    }
                },
                dirLight: {
                    value: {
                        direction: [-1, -1, 1, 2],
                        ambient: [0.3, 0.3, 0.3],
                        diffuse: [1, 1, 1],
                        specular: [1, 1, 1]
                    }
                },
            }
        });
        function updateRotation() {
            const rotation = {
                xy: transform.rotation.xy / 180 * Math.PI,
                yz: transform.rotation.yz / 180 * Math.PI,
                xz: transform.rotation.xz / 180 * Math.PI,
                xw: transform.rotation.xw / 180 * Math.PI,
                yw: transform.rotation.yw / 180 * Math.PI,
                zw: transform.rotation.zw / 180 * Math.PI,
            };
            rayMarchingPass.uniforms.transform.value.rotation = Rotate4DMatrix.rotation(rotation);
        }
        const tesseractFolder = gui.addFolder("Tesseract");
        const transformFolder = tesseractFolder.addFolder("Transform");
        const positionFolder = transformFolder.addFolder("Position");
        const position = rayMarchingPass.uniforms.transform.value.translate;
        positionFolder.add(position, '0', -5, 5).name("x");
        positionFolder.add(position, '1', -5, 5).name("y");
        positionFolder.add(position, '2', -5, 5).name("z");
        positionFolder.add(position, '3', -5, 5).name("w");
        const rotationFolder = transformFolder.addFolder("Rotation");
        rotationFolder.add(transform.rotation, 'xy', -180, 180).onChange(updateRotation);
        rotationFolder.add(transform.rotation, 'yz', -180, 180).onChange(updateRotation);
        rotationFolder.add(transform.rotation, 'xz', -180, 180).onChange(updateRotation);
        rotationFolder.add(transform.rotation, 'xw', -180, 180).onChange(updateRotation);
        rotationFolder.add(transform.rotation, 'yw', -180, 180).onChange(updateRotation);
        rotationFolder.add(transform.rotation, 'zw', -180, 180).onChange(updateRotation);
        const scale = rayMarchingPass.uniforms.transform.value.scale;
        const scaleFolder = transformFolder.addFolder("Scale");
        scaleFolder.add(scale, '0', 0.5, 5).name('x');
        scaleFolder.add(scale, '1', 0.5, 5).name('y');
        scaleFolder.add(scale, '2', 0.5, 5).name('z');
        scaleFolder.add(scale, '3', 0.5, 5).name('w');
        const dirLightFolder = gui.addFolder("DirectionalLight");
        const dirLight = rayMarchingPass.uniforms.dirLight.value;
        const dirLightDirection = rayMarchingPass.uniforms.dirLight.value.direction;
        const dirLightDirectionFolder = gui.addFolder("Direction");
        dirLightDirectionFolder.add(dirLightDirection, '0', -5, 5).name("x");
        dirLightDirectionFolder.add(dirLightDirection, '1', -5, 5).name("y");
        dirLightDirectionFolder.add(dirLightDirection, '2', -5, 5).name("z");
        dirLightDirectionFolder.add(dirLightDirection, '3', -5, 5).name("w");
        dirLightFolder.addColor(dirLight, "ambient");
        dirLightFolder.addColor(dirLight, "diffuse");
        dirLightFolder.addColor(dirLight, "specular");
        const tesseractMaterialFolder = tesseractFolder.addFolder("Material");
        const tesseractMaterial = rayMarchingPass.uniforms.tesseractMaterial.value;
        tesseractMaterialFolder.addColor(tesseractMaterial, "ambient");
        tesseractMaterialFolder.addColor(tesseractMaterial, "diffuse");
        tesseractMaterialFolder.addColor(tesseractMaterial, "specular");
        tesseractMaterialFolder.add(tesseractMaterial, "shininess");
        composer.addPass(rayMarchingPass);
        return rayMarchingPass;
    },
    HyperSphere: function (composer) {
        const rayMarchingPass = new ShaderPass({
            ...RayMarchingHyperSphereShader,
            uniforms: {
                viewport: { value: [window.innerWidth, window.innerHeight] },
                cameraQuaternion: { value: camera.quaternion },
                fov: { value: camera.fov },
                time: { value: 0 },
                transform: {
                    value: { translate: [0, 0, 2, 0.5] },
                },
                radius: { value: 1 },
                hyperSphereMaterial: {
                    value: {
                        ambient: [1, 1, 1],
                        diffuse: [0.6, 0.75, 0.3],
                        specular: [1, 1, 1],
                        shininess: 32.0,
                    }
                },
                hyperPlaneMaterial: {
                    value: {
                        ambient: [0, 0, 0],
                        diffuse: [1, 0.7, 1],
                        specular: [1.0, 1, 1],
                        shininess: 32.0,
                    }
                },
                dirLight: {
                    value: {
                        direction: [-1, -1, 1, 2],
                        ambient: [0.05, 0.05, 0.05],
                        diffuse: [1, 1, 1],
                        specular: [0.5, 0.5, 0.5]
                    }
                },
            }
        });
        const hyperShpereFolder = gui.addFolder("HyperSphere");
        const translateFolder = hyperShpereFolder.addFolder("Translate");
        const translate = rayMarchingPass.uniforms.transform.value.translate;
        translateFolder.add(translate, '0', -10, 10).name("x");
        translateFolder.add(translate, '1', -10, 10).name("y");
        translateFolder.add(translate, '2', -10, 10).name("z");
        translateFolder.add(translate, '3', -10, 10).name("w");
        hyperShpereFolder.add(rayMarchingPass.uniforms.radius, "value", 0.5, 5).name('Radius');
        const hyperSphereMaterialFolder = hyperShpereFolder.addFolder("Material");
        const dirLightFolder = gui.addFolder("DirectionalLight");
        const dirLight = rayMarchingPass.uniforms.dirLight.value;
        const dirLightDirection = rayMarchingPass.uniforms.dirLight.value.direction;
        const dirLightDirectionFolder = gui.addFolder("Direction");
        dirLightDirectionFolder.add(dirLightDirection, '0', -5, 5).name("x");
        dirLightDirectionFolder.add(dirLightDirection, '1', -5, 5).name("y");
        dirLightDirectionFolder.add(dirLightDirection, '2', -5, 5).name("z");
        dirLightDirectionFolder.add(dirLightDirection, '3', -5, 5).name("w");
        dirLightFolder.addColor(dirLight, "ambient");
        dirLightFolder.addColor(dirLight, "diffuse");
        dirLightFolder.addColor(dirLight, "specular");
        const hyperSphereMaterial = rayMarchingPass.uniforms.hyperSphereMaterial.value;
        hyperSphereMaterialFolder.addColor(hyperSphereMaterial, "ambient");
        hyperSphereMaterialFolder.addColor(hyperSphereMaterial, "diffuse");
        hyperSphereMaterialFolder.addColor(hyperSphereMaterial, "specular");
        hyperSphereMaterialFolder.add(hyperSphereMaterial, "shininess");
        composer.addPass(rayMarchingPass);
        return rayMarchingPass;
    }
};
function chooseFromHash(composer) {
    const selectedGeometry = window.location.hash.substring(1) || 'Tesseract';
    if (guis[selectedGeometry] !== undefined) {
        return guis[selectedGeometry](composer);
    }
}
// renderer
const canvas = document.querySelector("#ray-marching");
const renderer = new WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
// camera and orbit controls
const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 50);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 0);
controls.target.set(0, 0, 4);
controls.enableZoom = true;
controls.update();
//composer
const scene = new Scene();
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const shaderPass = chooseFromHash(composer);
// render loop
const render = (time) => {
    composer.render();
    shaderPass.uniforms.fov.value = camera.fov;
    shaderPass.uniforms.cameraQuaternion.value = camera.quaternion;
    shaderPass.uniforms.time.value = time;
    requestAnimationFrame(render);
};
requestAnimationFrame(render);
const getDeviceSize = () => {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio;
    return {
        width: innerWidth * devicePixelRatio,
        height: innerHeight * devicePixelRatio,
        innerWidth,
        innerHeight,
        devicePixelRatio
    };
};
// resize
const windowResizeHanlder = () => {
    const { width, height, innerHeight, innerWidth } = getDeviceSize();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    shaderPass.uniforms.viewport.value = [width, height];
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);
