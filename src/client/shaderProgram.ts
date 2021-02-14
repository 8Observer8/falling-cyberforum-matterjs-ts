
export function createShaderProgram(
    gl: WebGLRenderingContext, vertShaderSrc: string, fragShaderSrc: string): WebGLProgram
{
    let ok: boolean;

    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertShaderSrc);
    gl.compileShader(vShader);
    ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS) as boolean;
    if (!ok)
    {
        console.log("Failed to compile the vertex shader:");
        console.log(vertShaderSrc);
    }

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragShaderSrc);
    gl.compileShader(fShader);
    ok = gl.getShaderParameter(fShader, gl.COMPILE_STATUS);
    if (!ok)
    {
        console.log("Failed to compile the fragment shader:");
        console.log(fragShaderSrc);
    }

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    return program;
}
