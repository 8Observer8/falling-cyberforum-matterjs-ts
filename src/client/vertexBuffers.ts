import VertexBuffersCollection from "./VertexBuffersCollection";

export function initVertexBuffers(gl: WebGLRenderingContext, xmlModel: Document) : VertexBuffersCollection
{
    let dataIndexArrray, dataVertPosArray, dataNormalArray, dataTexCoordArray;
    let amountOfAttributes;
    
    const meshChildren = xmlModel.getElementsByTagName("mesh")[0].children;
    for (let i = 0; i < meshChildren.length; i++)
    {
        // console.log(meshChildren[i].getElementsByTagName("float_array")[0].getAttribute("id"));
        const id = meshChildren[i].getAttribute("id");
        if (id !== null && id.match(/-mesh-positions/)) // id.endsWith("-mesh-positions") - lib: es2015
        {
            dataVertPosArray = meshChildren[i].getElementsByTagName("float_array")[0]
                .childNodes[0].nodeValue.trim().split(" ").map(value => { return parseFloat(value); });
        }
        else if (id !== null && id.match(/-mesh-normals/))
        {
            dataNormalArray = meshChildren[i].getElementsByTagName("float_array")[0]
                .childNodes[0].nodeValue.trim().split(" ").map(value => { return parseFloat(value); });
        }
        else if (id !== null && id.match(/-mesh-map-0/))
        {
            dataTexCoordArray = meshChildren[i].getElementsByTagName("float_array")[0]
                .childNodes[0].nodeValue.trim().split(" ").map(value => { return parseFloat(value); });
        }
        else if (meshChildren[i].tagName == "triangles" || meshChildren[i].tagName == "polylist")
        {
            amountOfAttributes = meshChildren[i].getElementsByTagName("input").length;

            dataIndexArrray = meshChildren[i].getElementsByTagName("p")[0]
                .childNodes[0].nodeValue.trim().split(" ").map(value => { return parseInt(value); });
        }
    }

    // console.log("amountOfAttributes = " + amountOfAttributes);
    // console.log("dataIndexArrray = " + dataIndexArrray);
    // console.log("dataVertPosArray = " + dataVertPosArray);
    // console.log("dataNormalArray = " + dataNormalArray);
    // console.log("dataTexCoordArray = " + dataTexCoordArray);

    const v: number[] = []
    const n: number[] = []
    const t: number[] = [];
    let vertPosIndex, normalIndex, texCoordIndex;

    for (let i = 0; i < dataIndexArrray.length; i += amountOfAttributes)
    {
        vertPosIndex = dataIndexArrray[i + 0];

        v.push(dataVertPosArray[vertPosIndex * 3 + 0]);
        v.push(dataVertPosArray[vertPosIndex * 3 + 1]);
        v.push(dataVertPosArray[vertPosIndex * 3 + 2]);

        normalIndex = dataIndexArrray[i + 1];
        n.push(dataNormalArray[normalIndex * 3 + 0]);
        n.push(dataNormalArray[normalIndex * 3 + 1]);
        n.push(dataNormalArray[normalIndex * 3 + 2]);

        texCoordIndex = dataIndexArrray[i + 2];
        t.push(dataTexCoordArray[texCoordIndex * 2 + 0]);
        t.push(dataTexCoordArray[texCoordIndex * 2 + 1]);
    }

    const vertPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(n), gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(t), gl.STATIC_DRAW);

    const vertexBuffers = new VertexBuffersCollection();
    vertexBuffers.vertexPosBuffer = vertPosBuffer;
    vertexBuffers.textureCoordBuffer = texCoordBuffer;
    vertexBuffers.amountOfVertices = v.length / 3;

    return vertexBuffers;
}
