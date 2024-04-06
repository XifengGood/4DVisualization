import { UniformDataType } from "../shader/shader";
export { MeshRenderer4D, MeshRenderer3D };
;
class MeshRenderer4D {
    model;
    shader;
    attributionBuffer;
    edgeIndiceBuffer;
    triangleIndiceBuffer;
    constructor(model, shader) {
        this.model = model;
        this.shader = shader;
    }
    initAttributeBuffers() {
        const gl = this.shader.gl;
        const positions = Array();
        const colors = Array();
        const normals = Array();
        const uvs = Array();
        this.model.mesh.vertice.forEach(v => {
            positions.push(v.position[0]);
            positions.push(v.position[1]);
            positions.push(v.position[2]);
            positions.push(v.position[3]);
            colors.push(v.color[0]);
            colors.push(v.color[1]);
            colors.push(v.color[2]);
            colors.push(v.color[3]);
            normals.push(v.normal[0]);
            normals.push(v.normal[1]);
            normals.push(v.normal[2]);
            normals.push(v.normal[3]);
            uvs.push(v.uv[0]);
            uvs.push(v.uv[1]);
        });
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        const attributionBuffer = {
            positionBuffer: positionBuffer,
            colorBuffer: colorBuffer,
            normalBuffer: normalBuffer,
            uvBuffer: uvBuffer,
        };
        return this.attributionBuffer = attributionBuffer;
    }
    initEdgeIndiceBuffer() {
        const gl = this.shader.gl;
        const indice = Array();
        this.model.mesh.edges.forEach(e => {
            indice.push(e.indice[0]);
            indice.push(e.indice[1]);
        });
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indice), gl.STATIC_DRAW);
        const edgeIndiceBuffer = {
            indexBuffer: indexBuffer,
            count: indice.length,
        };
        return this.edgeIndiceBuffer = edgeIndiceBuffer;
    }
    initTriangleIndiceBuffer() {
        const gl = this.shader.gl;
        const indice = Array();
        this.model.mesh.faces.forEach(f => {
            for (let i = 0; i + 2 < f.indice.length; i++) {
                indice.push(f.indice[0]);
                indice.push(f.indice[i + 1]);
                indice.push(f.indice[i + 2]);
            }
        });
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indice), gl.STATIC_DRAW);
        const triangleIndiceBuffer = {
            indexBuffer: indexBuffer,
            count: indice.length,
        };
        return this.triangleIndiceBuffer = triangleIndiceBuffer;
    }
    updateColorBuffer() {
        const gl = this.shader.gl;
        const colors = Array();
        this.model.mesh.vertice.forEach(v => {
            colors.push(v.color[0]);
            colors.push(v.color[1]);
            colors.push(v.color[2]);
            colors.push(v.color[3]);
        });
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        this.attributionBuffer.colorBuffer = colorBuffer;
    }
    draw() {
    }
    drawEdge() {
        if (!this.attributionBuffer)
            this.initAttributeBuffers();
        const buffer = this.attributionBuffer;
        const gl = this.shader.gl;
        this.setAttributions(this.attributionBuffer);
        this.setModelUniforms();
        if (!this.edgeIndiceBuffer)
            this.initEdgeIndiceBuffer();
        ;
        const indiceBuffer = this.edgeIndiceBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer.indexBuffer);
        // drawElements
        gl.drawElements(gl.LINES, indiceBuffer.count, gl.UNSIGNED_SHORT, 0);
    }
    drawTriangle() {
        if (!this.attributionBuffer)
            this.initAttributeBuffers();
        const buffer = this.attributionBuffer;
        const gl = this.shader.gl;
        this.setAttributions(this.attributionBuffer);
        this.setModelUniforms();
        if (!this.triangleIndiceBuffer)
            this.initTriangleIndiceBuffer();
        ;
        const triangleIndiceBuffer = this.triangleIndiceBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndiceBuffer.indexBuffer);
        // drawElements
        gl.drawElements(gl.TRIANGLES, triangleIndiceBuffer.count, gl.UNSIGNED_SHORT, 0);
    }
    setModelUniforms() {
        const uniformsData = Array();
        uniformsData.push({
            name: "uRotateScale4D",
            value: this.model.transform.getRotationScaleMatrix(),
            type: UniformDataType.mat4
        });
        uniformsData.push({
            name: "uTranslate4D",
            value: this.model.transform.translate,
            type: UniformDataType.vec4
        });
        this.shader.setUniforms(uniformsData);
    }
    setAttributions(attributeBuffer) {
        const gl = this.shader.gl;
        const positionLocation = this.shader.getAttributeLocation("aPosition");
        const colorLocation = this.shader.getAttributeLocation("aColor");
        const normalLocation = this.shader.getAttributeLocation("aNormal");
        const uvLocation = this.shader.getAttributeLocation("aUv");
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer.positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer.colorBuffer);
        gl.enableVertexAttribArray(colorLocation);
        gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer.normalBuffer);
        gl.enableVertexAttribArray(normalLocation);
        gl.vertexAttribPointer(normalLocation, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer.uvBuffer);
        gl.enableVertexAttribArray(uvLocation);
        gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);
    }
}
class MeshRenderer3D {
    model;
    shader;
    attributionBuffer;
    edgeIndiceBuffer;
    triangleIndiceBuffer;
    constructor(model, shader) {
        this.model = model;
        this.shader = shader;
    }
    initAttributeBuffers() {
        const gl = this.shader.gl;
        const positions = Array();
        const colors = Array();
        const normals = Array();
        const uvs = Array();
        this.model.mesh.vertice.forEach(v => {
            positions.push(v.position[0]);
            positions.push(v.position[1]);
            positions.push(v.position[2]);
            colors.push(v.color[0]);
            colors.push(v.color[1]);
            colors.push(v.color[2]);
            colors.push(v.color[3]);
            normals.push(v.normal[0]);
            normals.push(v.normal[1]);
            normals.push(v.normal[2]);
            uvs.push(v.uv[0]);
            uvs.push(v.uv[1]);
        });
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        const attributionBuffer = {
            positionBuffer: positionBuffer,
            colorBuffer: colorBuffer,
            normalBuffer: normalBuffer,
            uvBuffer: uvBuffer
        };
        return this.attributionBuffer = attributionBuffer;
    }
    updateAttributeBuffers() {
        if (!this.attributionBuffer)
            return this.initAttributeBuffers();
        const gl = this.shader.gl;
        const positions = Array();
        const colors = Array();
        const normals = Array();
        const uvs = Array();
        this.model.mesh.vertice.forEach(v => {
            positions.push(v.position[0]);
            positions.push(v.position[1]);
            positions.push(v.position[2]);
            colors.push(v.color[0]);
            colors.push(v.color[1]);
            colors.push(v.color[2]);
            colors.push(v.color[3]);
            normals.push(v.normal[0]);
            normals.push(v.normal[1]);
            normals.push(v.normal[2]);
            uvs.push(v.uv[0]);
            uvs.push(v.uv[1]);
        });
        const positionBuffer = this.attributionBuffer.positionBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        const colorBuffer = this.attributionBuffer.colorBuffer;
        ;
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        const normalBuffer = this.attributionBuffer.normalBuffer;
        ;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        const uvBuffer = this.attributionBuffer.uvBuffer;
        ;
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    }
    initEdgeIndiceBuffer() {
        const gl = this.shader.gl;
        const indice = Array();
        this.model.mesh.edges.forEach(e => {
            indice.push(e.indice[0]);
            indice.push(e.indice[1]);
        });
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indice), gl.STATIC_DRAW);
        const edgeIndiceBuffer = {
            indexBuffer: indexBuffer,
            count: indice.length,
        };
        return this.edgeIndiceBuffer = edgeIndiceBuffer;
    }
    updateEdgeIndiceBuffer() {
        if (!this.edgeIndiceBuffer)
            return this.initEdgeIndiceBuffer();
        ;
        const gl = this.shader.gl;
        const indice = Array();
        this.model.mesh.edges.forEach(e => {
            indice.push(e.indice[0]);
            indice.push(e.indice[1]);
        });
        const indexBuffer = this.edgeIndiceBuffer.indexBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indice), gl.STATIC_DRAW);
        this.edgeIndiceBuffer.count = indice.length;
    }
    initTriangleIndiceBuffer() {
        const gl = this.shader.gl;
        const indice = Array();
        this.model.mesh.faces.forEach(f => {
            for (let i = 0; i + 2 < f.indice.length; i++) {
                indice.push(f.indice[0]);
                indice.push(f.indice[i + 1]);
                indice.push(f.indice[i + 2]);
            }
        });
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indice), gl.STATIC_DRAW);
        const triangleIndiceBuffer = {
            indexBuffer: indexBuffer,
            count: indice.length,
        };
        return this.triangleIndiceBuffer = triangleIndiceBuffer;
    }
    updateTriangleIndiceBuffer() {
        if (!this.triangleIndiceBuffer)
            return this.initTriangleIndiceBuffer();
        ;
        const gl = this.shader.gl;
        const indice = Array();
        this.model.mesh.faces.forEach(f => {
            for (let i = 0; i + 2 < f.indice.length; i++) {
                indice.push(f.indice[0]);
                indice.push(f.indice[i + 1]);
                indice.push(f.indice[i + 2]);
            }
        });
        const indexBuffer = this.triangleIndiceBuffer.indexBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indice), gl.STATIC_DRAW);
        this.triangleIndiceBuffer.count = indice.length;
    }
    drawEdge() {
        const gl = this.shader.gl;
        if (!this.attributionBuffer)
            this.initAttributeBuffers();
        this.setAttributions(this.attributionBuffer);
        if (!this.edgeIndiceBuffer)
            this.initEdgeIndiceBuffer();
        ;
        const indiceBuffer = this.edgeIndiceBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer.indexBuffer);
        // drawElements
        gl.drawElements(gl.LINES, indiceBuffer.count, gl.UNSIGNED_SHORT, 0);
    }
    drawTriangle() {
        const gl = this.shader.gl;
        if (!this.attributionBuffer)
            this.initAttributeBuffers();
        this.setAttributions(this.attributionBuffer);
        if (!this.triangleIndiceBuffer)
            this.initTriangleIndiceBuffer();
        ;
        const triangleIndiceBuffer = this.triangleIndiceBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndiceBuffer.indexBuffer);
        // drawElements
        gl.drawElements(gl.TRIANGLES, triangleIndiceBuffer.count, gl.UNSIGNED_SHORT, 0);
    }
    setAttributions(attributeBuffer) {
        const gl = this.shader.gl;
        const positionLocation = this.shader.getAttributeLocation("aPosition");
        const colorLocation = this.shader.getAttributeLocation("aColor");
        const normalLocation = this.shader.getAttributeLocation("aNormal");
        const uvLocation = this.shader.getAttributeLocation("aUv");
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer.positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer.colorBuffer);
        gl.enableVertexAttribArray(colorLocation);
        gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer.normalBuffer);
        gl.enableVertexAttribArray(normalLocation);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer.uvBuffer);
        gl.enableVertexAttribArray(uvLocation);
        gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);
    }
}
