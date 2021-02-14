attribute vec4 aPosition;
attribute vec2 aTexCoord;
uniform mat4 uMvpMatrix;
varying vec2 vTexCoord;

void main()
{
    gl_Position = uMvpMatrix * aPosition;
    vTexCoord = aTexCoord;
}
