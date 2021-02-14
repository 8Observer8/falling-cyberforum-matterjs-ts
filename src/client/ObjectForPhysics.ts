import { mat4 } from "gl-matrix";
import * as Matter from "matter-js";
import Locations from "./Locations";
import ObjectForGraphics from "./ObjectForGraphics";
import VertexBuffersCollection from "./VertexBuffersCollection";

export default class ObjectForPhysics extends ObjectForGraphics
{
    private _body: Matter.Body

    public constructor(body: Matter.Body, vertexBuffers: VertexBuffersCollection, locations: Locations, texture: WebGLTexture)
    {
        super(vertexBuffers, locations, texture);
        this._body = body;
    }

    public draw(gl: WebGLRenderingContext, program: WebGLProgram, viewProjMatrix: mat4): void
    {
        this.position[0] = this._body.position.x;
        this.position[1] = this._body.position.y;
        this.angle = this._body.angle;

        super.draw(gl, program, viewProjMatrix);
    }
}
