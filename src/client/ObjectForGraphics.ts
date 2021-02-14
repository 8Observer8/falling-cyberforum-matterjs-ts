import { mat4, vec3 } from "gl-matrix";
import Locations from "./Locations";
import VertexBuffersCollection from "./VertexBuffersCollection";

export default class ObjectForGraphics
{
    public position = [0, 0, 0];
    public angle = 0;
    public scale = [1, 1, 1];

    private mvpMatrix = mat4.create();
    private modelMatrix = mat4.create();

    private vertexPosBuffer: WebGLBuffer;
    private textureCoordBuffer: WebGLBuffer;
    private amountOfVertices: number;
    private texture: WebGLTexture;

    public aPositionLocation: number;
    public aTextureCoordLocation: number;

    public uMvpMatrixLocation: WebGLUniformLocation;

    constructor(vertexBuffers: VertexBuffersCollection, locations: Locations, texture: WebGLTexture)
    {
        this.vertexPosBuffer = vertexBuffers.vertexPosBuffer;
        this.textureCoordBuffer = vertexBuffers.textureCoordBuffer;
        this.amountOfVertices = vertexBuffers.amountOfVertices;

        this.aPositionLocation = locations.aPositionLocation;
        this.aTextureCoordLocation = locations.aTextureCoordLocation;
        this.uMvpMatrixLocation = locations.uMvpMatrixLocation;

        this.texture = texture;
    }

    public draw(gl: WebGLRenderingContext, program: WebGLProgram, viewProjMatrix: mat4): void
    {
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.vertexAttribPointer(this.aPositionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.aPositionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.vertexAttribPointer(this.aTextureCoordLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.aTextureCoordLocation);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        mat4.fromTranslation(this.modelMatrix, vec3.fromValues(this.position[0], this.position[1], this.position[2]));
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.angle, [0, 0, 1]);
        mat4.scale(this.modelMatrix, this.modelMatrix, vec3.fromValues(this.scale[0], this.scale[1], this.scale[2]));

        mat4.mul(this.mvpMatrix, viewProjMatrix, this.modelMatrix);
        gl.uniformMatrix4fv(this.uMvpMatrixLocation, false, this.mvpMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, this.amountOfVertices);
    }
}
