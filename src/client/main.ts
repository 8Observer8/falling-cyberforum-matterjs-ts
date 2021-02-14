import { mat4, vec3 } from "gl-matrix";
import * as Matter from "matter-js";
import { loadAssets } from "./loaders";
import Locations from "./Locations";
import ObjectForGraphics from "./ObjectForGraphics";
import { createShaderProgram } from "./shaderProgram";
import { initVertexBuffers } from "./vertexBuffers";
import { createTexture } from "./textures";
import ObjectForPhysics from "./ObjectForPhysics";

let gl: WebGLRenderingContext;
let program: WebGLProgram;
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
const viewProjMatrix = mat4.create();
let currentTime: number, lastTime: number, deltaTime: number;
let letter_c: ObjectForGraphics;
let letter_y: ObjectForGraphics;
let letter_b: ObjectForGraphics;
let letter_e: ObjectForGraphics;
let letter_r1: ObjectForGraphics;
let letter_f: ObjectForGraphics;
let letter_o: ObjectForGraphics;
let letter_r2: ObjectForGraphics;
let letter_u: ObjectForGraphics;
let letter_m: ObjectForGraphics;
let ground1: ObjectForGraphics;
let ground2: ObjectForGraphics;
let ground3: ObjectForGraphics;
let ground4: ObjectForGraphics;
const worldHeight = 50;

const textFiles: { name: string, path: string, content: string }[] = [];
const models: { name: string, path: string, content: Document }[] = [];
const images: { name: string, path: string, content: HTMLImageElement }[] = [];

function init(): void
{
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    gl = canvas.getContext("webgl");

    gl.clearColor(0.15, 0.15, 0.15, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const vertShaderSrc = textFiles.filter(asset => { return asset.name === "vertShaderSrc" })[0].content;
    const fragShaderSrc = textFiles.filter(asset => { return asset.name === "fragShaderSrc" })[0].content;
    program = createShaderProgram(gl, vertShaderSrc, fragShaderSrc);

    const locations = new Locations();
    locations.aPositionLocation = gl.getAttribLocation(program, "aPosition");
    locations.aTextureCoordLocation = gl.getAttribLocation(program, "aTexCoord");
    locations.uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");

    const letterImage = images.filter(asset => { return asset.name == "lettersTexture" })[0].content;
    const letterTexture = createTexture(gl, letterImage);

    const size = 2;
    const y1 = 10;
    const y2 = 5;

    const engine = Matter.Engine.create();

    const groundFriction = 0.5;
    const groundRestitution = 0.8;

    const ground1Body = Matter.Bodies.rectangle(-14, 0, 20, 2,
        { isStatic: true, angle: -20 * Math.PI / 180 });
    ground1Body.friction = groundFriction;
    ground1Body.restitution = groundRestitution;

    const ground2Body = Matter.Bodies.rectangle(14, 0, 20, 2,
        { isStatic: true, angle: 20 * Math.PI / 180 });
    ground2Body.friction = groundFriction;
    ground2Body.restitution = groundRestitution;

    const ground3Body = Matter.Bodies.rectangle(-8, -10, 20, 2,
        { isStatic: true, angle: -20 * Math.PI / 180 });
    ground3Body.friction = groundFriction;
    ground3Body.restitution = groundRestitution;

    const ground4Body = Matter.Bodies.rectangle(8, -10, 20, 2,
        { isStatic: true, angle: 20 * Math.PI / 180 });
    ground4Body.friction = groundFriction;
    ground4Body.restitution = groundRestitution;

    const letterFriction = 0.5;
    const letterRestitution = 0.8;

    engine.world.gravity.y = -0.2;

    const cBody = Matter.Bodies.circle(-10, y1, size);
    cBody.friction = letterFriction;
    cBody.restitution = letterRestitution;

    const yBody = Matter.Bodies.circle(-5, y1, size);
    yBody.friction = letterFriction;
    yBody.restitution = letterRestitution;

    const bBody = Matter.Bodies.circle(0, y1, size);
    yBody.friction = letterFriction;
    yBody.restitution = letterRestitution;

    const eBody = Matter.Bodies.circle(5, y1, size);
    eBody.friction = letterFriction;
    eBody.restitution = letterRestitution;

    const r1Body = Matter.Bodies.circle(10, y1, size);
    r1Body.friction = letterFriction;
    r1Body.restitution = letterRestitution;

    const fBody = Matter.Bodies.circle(-10, y2, size);
    fBody.friction = letterFriction;
    fBody.restitution = letterRestitution;

    const oBody = Matter.Bodies.circle(-5, y2, size);
    oBody.friction = letterFriction;
    oBody.restitution = letterRestitution;

    const r2Body = Matter.Bodies.circle(0, y2, size);
    r2Body.friction = letterFriction;
    r2Body.restitution = letterRestitution;

    const uBody = Matter.Bodies.circle(5, y2, size);
    uBody.friction = letterFriction;
    uBody.restitution = letterRestitution;

    const mBody = Matter.Bodies.circle(10, y2, size);
    mBody.friction = letterFriction;
    mBody.restitution = letterRestitution;

    Matter.World.add(engine.world, [ground1Body, ground2Body, ground3Body, ground4Body,
        cBody, yBody, bBody, eBody, r1Body, fBody, oBody, r2Body, uBody, mBody]);

    let letterXML = models.filter(asset => { return asset.name === "letter_c" })[0].content;
    let letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_c = new ObjectForPhysics(cBody, letterVertexBuffers, locations, letterTexture);

    letterXML = models.filter(asset => { return asset.name === "letter_y" })[0].content;
    letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_y = new ObjectForPhysics(yBody, letterVertexBuffers, locations, letterTexture);

    letterXML = models.filter(asset => { return asset.name === "letter_b" })[0].content;
    letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_b = new ObjectForPhysics(bBody, letterVertexBuffers, locations, letterTexture);

    letterXML = models.filter(asset => { return asset.name === "letter_e" })[0].content;
    letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_e = new ObjectForPhysics(eBody, letterVertexBuffers, locations, letterTexture);

    letterXML = models.filter(asset => { return asset.name === "letter_r1" })[0].content;
    letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_r1 = new ObjectForPhysics(r1Body, letterVertexBuffers, locations, letterTexture);

    letterXML = models.filter(asset => { return asset.name === "letter_f" })[0].content;
    letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_f = new ObjectForPhysics(fBody, letterVertexBuffers, locations, letterTexture);

    letterXML = models.filter(asset => { return asset.name === "letter_o" })[0].content;
    letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_o = new ObjectForPhysics(oBody, letterVertexBuffers, locations, letterTexture);

    letterXML = models.filter(asset => { return asset.name === "letter_r2" })[0].content;
    letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_r2 = new ObjectForPhysics(r2Body, letterVertexBuffers, locations, letterTexture);

    letterXML = models.filter(asset => { return asset.name === "letter_u" })[0].content;
    letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_u = new ObjectForPhysics(uBody, letterVertexBuffers, locations, letterTexture);

    letterXML = models.filter(asset => { return asset.name === "letter_m" })[0].content;
    letterVertexBuffers = initVertexBuffers(gl, letterXML);
    letter_m = new ObjectForPhysics(mBody, letterVertexBuffers, locations, letterTexture);

    // letter_c.position = [-10, y1, 0];
    letter_c.scale = [size, size, 1];
    // letter_y.position = [-5, y1, 0];
    letter_y.scale = [size, size, 1];
    // letter_b.position = [0, y1, 0];
    letter_b.scale = [size, size, 1];
    // letter_e.position = [5, y1, 0];
    letter_e.scale = [size, size, 1];
    // letter_r1.position = [10, y1, 0];
    letter_r1.scale = [size, size, 1];
    // letter_f.position = [-10, y2, 0];
    letter_f.scale = [size, size, 1];
    // letter_o.position = [-5, y2, 0];
    letter_o.scale = [size, size, 1];
    // letter_r2.position = [0, y2, 0];
    letter_r2.scale = [size, size, 1];
    // letter_u.position = [5, y2, 0];
    letter_u.scale = [size, size, 1];
    // letter_m.position = [10, y2, 0];
    letter_m.scale = [size, size, 1];

    const groundXML = models.filter(asset => { return asset.name === "ground" })[0].content;
    const groundVertexBuffers = initVertexBuffers(gl, groundXML);

    ground1 = new ObjectForPhysics(ground1Body, groundVertexBuffers, locations, letterTexture);
    // ground1.position = [-12, 0, 0];
    ground1.scale = [10, 2, 1];
    // ground1.angle = -20;

    ground2 = new ObjectForPhysics(ground2Body, groundVertexBuffers, locations, letterTexture);
    // ground2.position = [12, 0, 0];
    ground2.scale = [10, 2, 1];
    // ground2.angle = 20 * Math.PI / 180;

    ground3 = new ObjectForPhysics(ground3Body, groundVertexBuffers, locations, letterTexture);
    // ground3.position = [-8, -10, 0];
    ground3.scale = [10, 2, 1];
    // ground3.angle = -20 * Math.PI / 180;

    ground4 = new ObjectForPhysics(ground4Body, groundVertexBuffers, locations, letterTexture);
    // ground4.position = [8, -10, 0];
    ground4.scale = [10, 2, 1];
    // ground4.angle = 20 * Math.PI / 180;

    mat4.lookAt(
        viewProjMatrix,
        vec3.fromValues(0, 0, 100),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 1, 0));

    let firstClick = true;

    canvas.onclick = (event) =>
    {
        if (firstClick && event.button == 0)
        {
            Matter.Engine.run(engine);
            firstClick = false;
        }
    };

    window.onresize = () =>
    {
        const w = (gl.canvas as HTMLCanvasElement).clientWidth;
        const h = (gl.canvas as HTMLCanvasElement).clientHeight;
        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        const aspect = w / h;
        const worldWidth = aspect * worldHeight;
        mat4.ortho(projectionMatrix,
            -worldWidth / 2, worldWidth / 2,
            -worldHeight / 2, worldHeight / 2, 50, -50);
        lastTime = Date.now();
        draw();
    };
    window.onresize(null);
}

function draw(): void
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    mat4.mul(viewProjMatrix, projectionMatrix, viewMatrix);

    currentTime = Date.now();
    deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    letter_c.draw(gl, program, viewProjMatrix);
    letter_y.draw(gl, program, viewProjMatrix);
    letter_b.draw(gl, program, viewProjMatrix);
    letter_e.draw(gl, program, viewProjMatrix);
    letter_r1.draw(gl, program, viewProjMatrix);
    letter_f.draw(gl, program, viewProjMatrix);
    letter_o.draw(gl, program, viewProjMatrix);
    letter_r2.draw(gl, program, viewProjMatrix);
    letter_u.draw(gl, program, viewProjMatrix);
    letter_m.draw(gl, program, viewProjMatrix);

    ground1.draw(gl, program, viewProjMatrix);
    ground2.draw(gl, program, viewProjMatrix);
    ground3.draw(gl, program, viewProjMatrix);
    ground4.draw(gl, program, viewProjMatrix);

    requestAnimationFrame(() => draw());
}

function main(): void
{
    textFiles.push({ name: "vertShaderSrc", path: "assets/shaders/texturedShader.vert", content: "" });
    textFiles.push({ name: "fragShaderSrc", path: "assets/shaders/texturedShader.frag", content: "" });
    images.push({ name: "lettersTexture", path: "assets/models/letters.png", content: null });
    models.push({ name: "letter_c", path: "assets/models/letter_c.dae", content: null });
    models.push({ name: "letter_y", path: "assets/models/letter_y.dae", content: null });
    models.push({ name: "letter_b", path: "assets/models/letter_b.dae", content: null });
    models.push({ name: "letter_e", path: "assets/models/letter_e.dae", content: null });
    models.push({ name: "letter_r1", path: "assets/models/letter_r1.dae", content: null });
    models.push({ name: "letter_f", path: "assets/models/letter_f.dae", content: null });
    models.push({ name: "letter_o", path: "assets/models/letter_o.dae", content: null });
    models.push({ name: "letter_r2", path: "assets/models/letter_r2.dae", content: null });
    models.push({ name: "letter_u", path: "assets/models/letter_u.dae", content: null });
    models.push({ name: "letter_m", path: "assets/models/letter_m.dae", content: null });
    models.push({ name: "ground", path: "assets/models/ground.dae", content: null });

    loadAssets(textFiles, models, images, () =>
    {
        init();
    });
}

// Debug
main();

// Release
// window.onload = () => main();
