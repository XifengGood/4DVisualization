import { vec3, vec4, mat4 } from "gl-matrix";
import { Transform3D, Transform4D } from "./transform";
import { toHomogeneous } from "./base";
import { Model3D } from "./model";
export { Camera3D, Camera4D, ProjectionType };
var ProjectionType;
(function (ProjectionType) {
    ProjectionType[ProjectionType["Orthographic"] = 0] = "Orthographic";
    ProjectionType[ProjectionType["Perspective"] = 1] = "Perspective";
    ProjectionType[ProjectionType["Frustum"] = 2] = "Frustum";
})(ProjectionType || (ProjectionType = {}));
function assertNever(x) {
    throw new Error("Unexpected object: " + x);
}
function isVec3(arg) {
    return Array.isArray(arg) && arg.length === 3 && typeof arg[0] === 'number' && typeof arg[1] === 'number' && typeof arg[2] === 'number';
}
function isVec4(arg) {
    return Array.isArray(arg) && arg.length === 4 && typeof arg[0] === 'number' && typeof arg[1] === 'number' && typeof arg[2] === 'number' && typeof arg[3] === 'number';
}
class Camera3D {
    transform;
    type;
    frustum;
    perspectiveParam;
    near;
    far;
    lookAtPoint;
    constructor({ transform = new Transform3D(), type = ProjectionType.Orthographic, frustum = { left: -1, right: 1, bottom: -1, top: 1 }, perspectiveParam = { fovy: (90 * Math.PI) / 180, aspect: 1 }, near = 0.1, far = 100, lookAtPoint = vec3.create() } = {}) {
        this.transform = transform;
        this.type = type;
        this.frustum = frustum;
        this.perspectiveParam = perspectiveParam;
        this.near = near;
        this.far = far;
        this.lookAtPoint = lookAtPoint;
    }
    worldToClip(worldPos) {
        let _isVec3 = false;
        if (_isVec3 = isVec3(worldPos) || isVec4(worldPos)) {
            let _worldPos = worldPos;
            if (_isVec3)
                _worldPos = toHomogeneous(_worldPos);
            const VPMatrix = this.getVPMatrix();
            const clipPos = vec4.create();
            vec4.transformMat4(clipPos, _worldPos, VPMatrix);
            const w = vec4.fromValues(clipPos[3], clipPos[3], clipPos[3], clipPos[3]);
            vec4.div(clipPos, clipPos, w);
            return clipPos;
        }
        else {
            if (worldPos.length === 0)
                return;
            _isVec3 = false;
            if (isVec3(worldPos[0])) {
                _isVec3 = true;
            }
            const clipPositions = Array();
            const worldPositions = Array();
            if (_isVec3) {
                worldPos.forEach(p => {
                    worldPositions.push(toHomogeneous(p));
                });
            }
            else {
                worldPos.forEach(p => {
                    worldPositions.push(p);
                });
            }
            const VPMatrix = this.getVPMatrix();
            worldPositions.forEach(p => {
                let _worldPos = p;
                const clipPos = vec4.create();
                vec4.transformMat4(clipPos, _worldPos, VPMatrix);
                const w = vec4.fromValues(clipPos[3], clipPos[3], clipPos[3], clipPos[3]);
                vec4.div(clipPos, clipPos, w);
                clipPositions.push(clipPos);
            });
            return clipPositions;
        }
    }
    worldToScreen(worldPos, screen) {
        const clipPos = this.worldToClip(worldPos);
        const screenPos = vec4.clone(clipPos);
        screenPos[0] = (clipPos[0] / 2 + 0.5) * screen.width;
        screenPos[1] = (-clipPos[1] / 2 + 0.5) * screen.height;
        return screenPos;
    }
    objectToClip(args) {
        if (args instanceof Model3D) {
            const model = args;
            const ModelMatrix = model.transform.getModelMatrix();
            const VPMatrix = this.getVPMatrix();
            const MVPMatrix = mat4.create();
            mat4.multiply(MVPMatrix, VPMatrix, ModelMatrix);
            const clipPositions = [];
            model.mesh.vertice.forEach(v => {
                const objectPos = toHomogeneous(v.position);
                const clips = vec4.create();
                vec4.transformMat4(clips, objectPos, MVPMatrix);
                const w = vec4.fromValues(clips[3], clips[3], clips[3], clips[3]);
                vec4.div(clips, clips, w);
                clipPositions.push(clips);
            });
            return clipPositions;
        }
        else {
            const VPMatrix = this.getVPMatrix();
            const clip3DPostions = args;
            const clipPositions = [];
            clip3DPostions.forEach(p => {
                const clips = vec4.create();
                vec4.transformMat4(clips, p, VPMatrix);
                const w = vec4.fromValues(clips[3], clips[3], clips[3], clips[3]);
                vec4.div(clips, clips, w);
                clipPositions.push(clips);
            });
            return clipPositions;
        }
    }
    getProjectionMatrix() {
        switch (this.type) {
            case ProjectionType.Orthographic: return this.getOrthographicMatrix();
            case ProjectionType.Perspective: return this.getPerspectiveMatrix();
            default: return assertNever(this.type);
        }
    }
    getOrthographicMatrix() {
        const projectionMatrix = mat4.create();
        return mat4.ortho(projectionMatrix, this.frustum.left, this.frustum.right, this.frustum.bottom, this.frustum.top, this.near, this.far);
    }
    getPerspectiveMatrix() {
        const projectionMatrix = mat4.create();
        return mat4.perspective(projectionMatrix, this.perspectiveParam.fovy, this.perspectiveParam.aspect, this.near, this.far);
    }
    getViewMatrix() {
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.transform.translate, this.lookAtPoint, vec3.fromValues(0, 1, 0));
        return viewMatrix;
    }
    getVPMatrix() {
        const viewMatrix = this.getViewMatrix();
        const projectionMatrix = this.getProjectionMatrix();
        const VPMatrix = mat4.create();
        mat4.multiply(VPMatrix, projectionMatrix, viewMatrix);
        return VPMatrix;
    }
    getForward() {
        const forward = vec3.create();
        vec3.sub(forward, this.lookAtPoint, this.transform.translate);
        vec3.normalize(forward, forward);
        return forward;
    }
    getUp() {
        const forward = this.getForward();
        const right = this.getRight();
        const up = vec3.create();
        vec3.cross(up, forward, right);
        return up;
    }
    getRight() {
        const forward = this.getForward();
        const right = vec3.create();
        vec3.cross(right, vec3.fromValues(0, 1, 0), forward);
        return right;
    }
}
class Camera4D {
    transform;
    type;
    frustum;
    perspectiveParam;
    inside;
    outside;
    lookAtPoint;
    constructor({ transform = new Transform4D(), type = ProjectionType.Orthographic, frustum = { left: -1, right: 1, bottom: -1, top: 1, back: -1, front: 1 }, perspectiveParam = { xField: 90, yField: 90, zField: 90, }, inside = 0.1, outside = 100, lookAtPoint = vec4.create() } = {}) {
        this.transform = transform;
        this.type = type;
        this.frustum = frustum;
        this.perspectiveParam = perspectiveParam;
        this.inside = inside;
        this.outside = outside;
        this.lookAtPoint = lookAtPoint;
    }
    worldToCamera(worldPos) {
        const cameraPos = vec4.create();
        vec4.sub(cameraPos, worldPos, this.transform.translate);
        return cameraPos;
    }
    cameraToView(cameraPos) {
        const viewMatrix = this.getViewMatrix4DWithoutTranslate();
        const viewPos = vec4.create();
        vec4.transformMat4(viewPos, cameraPos, viewMatrix);
        return viewPos;
    }
    viewToClip(viewPos) {
        const projectInfo = this.getProjectionMatrix4D();
        const projectionMatrix4D = projectInfo.projectionMatrix4D;
        const projectParam = projectInfo.projectParam;
        const _clipPos = vec4.create();
        vec4.transformMat4(_clipPos, viewPos, projectionMatrix4D);
        vec4.add(_clipPos, _clipPos, projectParam.translate);
        const d = vec4.dot(viewPos, projectParam.m5x1_5x4) + projectParam.m5x5;
        const clipPos = vec4.create();
        vec4.divide(clipPos, _clipPos, vec4.fromValues(d, d, d, d));
        return clipPos;
    }
    objectToClip(args, objectPos) {
        if (args instanceof Transform4D) {
            const transform = args;
            const worldPos = transform.transform(objectPos);
            const cameraPos4D = this.worldToCamera(worldPos);
            const viewPos4D = this.cameraToView(cameraPos4D);
            const clipPos4D = this.viewToClip(viewPos4D);
            return clipPos4D;
        }
        else {
            const model = args;
            const RSMatrix = model.transform.getRotationScaleMatrix();
            const offset = vec4.create();
            vec4.sub(offset, model.transform.translate, this.transform.translate);
            const viewMatrix = this.getViewMatrix4DWithoutTranslate();
            const projectInfo = this.getProjectionMatrix4D();
            const projectionMatrix4D = projectInfo.projectionMatrix4D;
            const projectParam = projectInfo.projectParam;
            const clipPositions = [];
            model.mesh.vertice.forEach(v => {
                const cameraPos = vec4.create();
                vec4.transformMat4(cameraPos, v.position, RSMatrix);
                vec4.add(cameraPos, cameraPos, offset);
                const viewPos = vec4.create();
                vec4.transformMat4(viewPos, cameraPos, viewMatrix);
                const _clipPos = vec4.create();
                vec4.transformMat4(_clipPos, viewPos, projectionMatrix4D);
                vec4.add(_clipPos, _clipPos, projectParam.translate);
                const d = vec4.dot(viewPos, projectParam.m5x1_5x4) + projectParam.m5x5;
                const clipPos = vec4.create();
                vec4.divide(clipPos, _clipPos, vec4.fromValues(d, d, d, d));
                clipPositions.push(clipPos);
            });
            return clipPositions;
        }
    }
    getOutSide() {
        const outside = vec4.create();
        const lookAtPoint = this.lookAtPoint;
        const position = this.transform.translate;
        return vec4.sub(outside, lookAtPoint, position);
    }
    getViewMatrix4DWithoutTranslate() {
        const outside = vec4.create();
        const forward = vec4.fromValues(0, 0, 1, 0);
        const up = vec4.fromValues(0, 1, 0, 0);
        const right = vec4.create();
        const lookAtPoint = this.lookAtPoint;
        const position = this.transform.translate;
        vec4.sub(outside, lookAtPoint, position);
        vec4.normalize(outside, outside);
        vec4.cross(right, up, forward, outside);
        vec4.normalize(right, right);
        vec4.cross(up, forward, outside, right);
        vec4.normalize(up, up);
        vec4.cross(forward, outside, right, up);
        vec4.normalize(forward, forward);
        const viewMatrix4D = mat4.fromValues(right[0], up[0], forward[0], outside[0], right[1], up[1], forward[1], outside[1], right[2], up[2], forward[2], outside[2], right[3], up[3], forward[3], outside[3]);
        return viewMatrix4D;
    }
    getProjectionMatrix4D() {
        switch (this.type) {
            case ProjectionType.Orthographic: return this.getOrthographicMatrix4D();
            case ProjectionType.Frustum: return this.getFrustumMatrix4D();
            case ProjectionType.Perspective: return this.getPerspectiveMatrix4D();
            default: return assertNever(this.type);
        }
    }
    getOrthographicMatrix4D() {
        const left = this.frustum.left;
        const right = this.frustum.right;
        const bottom = this.frustum.bottom;
        const top = this.frustum.top;
        const back = this.frustum.back;
        const front = this.frustum.right;
        const inside = this.inside;
        const outside = this.outside;
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const bf = 1 / (back - front);
        const nf = 1 / (inside - outside);
        const x = (left + right) * lr;
        const y = (bottom + top) * bt;
        const z = (back + front) * bf;
        const w = (inside + outside) * nf;
        const projectionMatrix = mat4.fromValues(-2 * lr, 0, 0, 0, 0, -2 * bt, 0, 0, 0, 0, -2 * bf, 0, 0, 0, 0, -2 * nf);
        const translate = vec4.fromValues(x, y, z, w);
        const m5x4 = vec4.create();
        const m5x5 = 1;
        const projectionInfo = {
            projectionMatrix4D: projectionMatrix,
            projectParam: {
                translate: translate,
                m5x1_5x4: m5x4,
                m5x5: m5x5
            }
        };
        return projectionInfo;
    }
    getFrustumMatrix4D() {
        const left = this.frustum.left;
        const right = this.frustum.right;
        const bottom = this.frustum.bottom;
        const top = this.frustum.top;
        const back = this.frustum.back;
        const front = this.frustum.right;
        const inside = this.inside;
        const outside = this.outside;
        const rl = 1 / (right - left);
        const tb = 1 / (top - bottom);
        const fb = 1 / (front - back);
        const fn = 1 / (outside - inside);
        const x = 0;
        const y = 0;
        const z = 0;
        const w = -2 * inside * outside * fn;
        const projectionMatrix = mat4.fromValues(2 * inside * rl, 0, 0, 0, 0, 2 * inside * tb, 0, 0, 0, 0, 2 * inside * fb, 0, -(left + right) * rl, -(bottom + top) * tb, -(back + front) * fb, (outside + inside) * fn);
        const translate = vec4.fromValues(x, y, z, w);
        const m5x4 = vec4.fromValues(0, 0, 0, 1);
        const m5x5 = 0;
        const projectionInfo = {
            projectionMatrix4D: projectionMatrix,
            projectParam: {
                translate: translate,
                m5x1_5x4: m5x4,
                m5x5: m5x5
            }
        };
        return projectionInfo;
    }
    getPerspectiveMatrix4D() {
        const xAngle = this.perspectiveParam.xField * Math.PI / 180;
        const zoomX = 1.0 / Math.tan(xAngle / 2);
        const yAngle = this.perspectiveParam.yField * Math.PI / 180;
        const zoomY = 1.0 / Math.tan(yAngle / 2);
        const zAngle = this.perspectiveParam.zField * Math.PI / 180;
        const zoomZ = 1.0 / Math.tan(zAngle / 2);
        const inside = this.inside;
        const outside = this.outside;
        const fn = 1 / (outside - inside);
        const x = 0;
        const y = 0;
        const z = 0;
        const w = -2 * inside * outside * fn;
        const projectionMatrix = mat4.fromValues(zoomX, 0, 0, 0, 0, zoomY, 0, 0, 0, 0, zoomZ, 0, 0, 0, 0, (outside + inside) * fn);
        const translate = vec4.fromValues(x, y, z, w);
        const m5x4 = vec4.fromValues(0, 0, 0, 1);
        const m5x5 = 0;
        const projectionInfo = {
            projectionMatrix4D: projectionMatrix,
            projectParam: {
                translate: translate,
                m5x1_5x4: m5x4,
                m5x5: m5x5
            }
        };
        return projectionInfo;
    }
}
