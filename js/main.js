//#region Global Variables
var canvas;
var gl;
var vertexshader;
var pixelshader;
var program;
/**
    [0] = Time in milliseconds when started, 
    [1] = Time in milliseconds since started, 
    [2] = Current Frame
    [3] = Frame Delta Time
*/
var iTime = [
    new Date().getMilliseconds(), 
    0, 
    0,
    0,
];

//#region Main functions

function updateTime() {
    iTime = [
        iTime[0], 
        new Date().getMilliseconds() - iTime[0], 
        iTime[2] + 1,
        new Date().getMilliseconds() - iTime[0] - iTime[1],
    ];
}

function loop(event) {
    updateTime();

    const width = document.getElementById("shader").getAttribute("width");
    const height = document.getElementById("shader").getAttribute("height");

    const xSlider = document.getElementById('xOffsetSlider');
    const ySlider = document.getElementById('yOffsetSlider');
    const zoomSlider = document.getElementById('zoomSlider');
    const stepSlider = document.getElementById('stepsSlider');


    const xOffset = parseFloat(xSlider.getAttribute("x") ?? 0);
    const yOffset = parseFloat(ySlider.getAttribute("y") ?? 0);
    const zoom = Math.pow(10, parseFloat(zoomSlider.getAttribute("zoom") ?? 0));
    const steps = parseInt(stepSlider.value);

    //send iKeyboard to shader
    const iKeyboardLocation = gl.getUniformLocation(program, "iKeyboard");
    gl.uniform1iv(iKeyboardLocation, iKeyboard);


    //send iMouse to shader
    const iMouseLocation = gl.getUniformLocation(program, "iMouse")
    gl.uniform1iv(iMouseLocation, iMouse)

    //Send iTime to shader
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    gl.uniform1iv(iTimeLocation, iTime);

    //Send a vec4 to the shader
    gl.uniform2i(gl.getUniformLocation(program, "viewSize"), width, height);
    gl.uniform2f(gl.getUniformLocation(program, "offset"), xOffset, yOffset);
    gl.uniform1f(gl.getUniformLocation(program, "zoom"), zoom);
    gl.uniform1i(gl.getUniformLocation(program, "steps"), steps);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(loop);
}

async function init(event) {
    event.preventDefault();
    canvas = document.getElementById('shader');
    
    gl = canvas.getContext('webgl2', { antialias: false });
    
    //The vertexShader gets initialized
    vertexshader = gl.createShader(gl.VERTEX_SHADER);
    
    //Fetch the shader source from the file at shaders/vert.glsl
    var vertShaderText = document.getElementById("vert-shader").innerText;
    gl.shaderSource(vertexshader, vertShaderText.replace(/^\s+|\s+$/g, ''));
    gl.compileShader(vertexshader);
    
    
    //The fragshader gets initialized
    var fragshader = gl.createShader(gl.FRAGMENT_SHADER);
    
    var fragShaderText = document.getElementById("frag-shader").innerText;
    gl.shaderSource(fragshader, fragShaderText.replace(/^\s+|\s+$/g, ''));
    gl.compileShader(fragshader);
    
    //wait until the shaders are compiled
    //The program gets initialized
    program = gl.createProgram();
    gl.attachShader(program, vertexshader);
    gl.attachShader(program, fragshader);
    
    //The program gets used
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(gl.getError());
        console.log(gl.getShaderInfoLog(fragshader));
        console.log(gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);
    
    
    // Add a dummy VAO
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    
    // Add a dummy VBO
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
    })();
    
    requestAnimationFrame(loop);
}
//#endregion