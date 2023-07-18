//#region UI Events
function onTogglePanel(e) {
    var panel = document.getElementById("side-panel");
    panel.classList.toggle("hidden");
}

function onWidthSlider(e) {
    const widthDisplay = document.getElementById('widthDisplay');
    const widthInput = document.getElementById('widthSlider');
    canvas.width = widthInput.value;
    widthDisplay.innerText = "Width: " + widthInput.value;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function onHeightSlider(e) {
    const heightDisplay = document.getElementById('heightDisplay');
    const heightInput = document.getElementById('heightSlider');
    canvas.height = heightInput.value;
    heightDisplay.innerText = "Height: " + heightInput.value;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

//#endregion

//#region WebGL Events

function onZoomSlider(e) {
    const zoomText = document.getElementById("zoomDisplay");
    const zoomInput = document.getElementById('zoomSlider');
    zoomInput.setAttribute("zoom", zoomInput.value);

    var zoomValue = parseFloat(document.getElementById("zoomSlider").getAttribute("zoom") ?? 0);
    if(zoomValue == NaN) zoomValue = 0;
    var zoom = Math.pow(10, zoomValue);

    zoomText.innerText = "Zoom: 10^" + zoomValue;
    
    zoomInput.setAttribute("min", zoomValue - 1);
    zoomInput.setAttribute("max", zoomValue + 1);

    
    const xSlider = document.getElementById("xOffsetSlider");
    const x = parseFloat(xSlider.getAttribute("x") ?? 0);
    xSlider.setAttribute("min", x - 1 / zoom);
    xSlider.setAttribute("max", x + 1 / zoom);
    
    
    const ySlider = document.getElementById("yOffsetSlider");
    const y = parseFloat(ySlider.getAttribute("y") ?? 0);
    ySlider.setAttribute("min", y - 1 / zoom);
    ySlider.setAttribute("max", y + 1 / zoom);
}

function onStepSlider(e) {
    const stepSlider = document.getElementById("stepsSlider");
    const stepDisplay = document.getElementById("stepsDisplay");
    stepDisplay.innerText = "Steps: " + stepSlider.value;
}

function onXSlider(e) {
    const xSlider = document.getElementById("xOffsetSlider");
    const xOffset = document.getElementById("xOffset");
    xSlider.setAttribute("x", parseFloat(xSlider.value));
    const x = parseFloat(xSlider.getAttribute("x"));
    xOffset.innerText = "X Offset: " + x;
    var zoomValue = document.getElementById("zoomSlider").getAttribute("zoom") ?? 0;
    if(zoomValue == NaN) zoom = 0;
    var zoom = Math.pow(10, parseFloat(zoomValue));

    xSlider.setAttribute("min", x - 1 / zoom);
    xSlider.setAttribute("max", x + 1 / zoom);
    
}

function onYSlider(e) {
    const ySlider = document.getElementById("yOffsetSlider");
    const yOffset = document.getElementById("yOffset");
    ySlider.setAttribute("y", parseFloat(ySlider.value));
    const y = parseFloat(ySlider.getAttribute("y"));
    yOffset.innerText = "Y Offset: " + y;
    var zoomValue = document.getElementById("zoomSlider").getAttribute("zoom") ?? 0;
    if(zoomValue == NaN) zoom = 0;
    var zoom = Math.pow(10, parseFloat(zoomValue));

    ySlider.setAttribute("min", y - 1 / zoom);
    ySlider.setAttribute("max", y + 1 / zoom);
}

//#endregion

//#region Webcam

function onToggleWebcam(e) {
    var webcam = document.getElementById("webcam");
    if (webcam.srcObject && webcam.srcObject.active) {
        // Stop all tracks
        webcam.srcObject.getTracks().forEach(track => track.stop());
    } else {
        // Start video stream if the browser supports it
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                webcam.srcObject = stream;
                webcam.play();
            }).catch(function (error) {
                console.log('Error accessing webcam: ', error);
            });
        } else {
            console.log('Webcam not supported by this browser.');
        }
    }
}

//#endregion

//#region Keyboard Events
/**
    [0] = Key, 
    [1] = Key Action, 
    [2] = Control pressed, 
    [3] = Shift pressed, 
    [4] = Alt pressed, 
    [5] = Caps Lock pressed
*/
var iKeyboard = [0, 0, 0, 0, 0, 0];

const KEY_CONTROL = 17;
const KEY_SHIFT = 16;
const KEY_ALT = 18;
const KEY_CAPSLOCK = 20;

const KEY_ACTION_UP = 0;
const KEY_ACTION_DOWN = 1;

function onKeyDown(e) {
    iKeyboard[0] = e.keyCode;  // Key
    iKeyboard[1] = KEY_ACTION_DOWN;  // Key Action (1 for keydown)
    iKeyboard[2] = e.ctrlKey ? 1 : 0;  // Control pressed
    iKeyboard[3] = e.shiftKey ? 1 : 0;  // Shift pressed
    iKeyboard[4] = e.altKey ? 1 : 0;  // Alt pressed
    // Check for Caps Lock
    if (e.keyCode === KEY_CAPSLOCK) {
        // If the event was caused by the Caps Lock key, toggle the Caps Lock state in the array.
        iKeyboard[5] = iKeyboard[5] === 1 ? 0 : 1;
    }
}

function onKeyUp(e) {
    iKeyboard[0] = e.keyCode;  // Key
    iKeyboard[1] = KEY_ACTION_UP;  // Key Action (0 for keyup)
    // Check if Control, Shift or Alt keys have been released
    if (e.keyCode === KEY_CONTROL) iKeyboard[2] = 0;  // Control released
    if (e.keyCode === KEY_SHIFT) iKeyboard[3] = 0;  // Shift released
    if (e.keyCode === KEY_ALT) iKeyboard[4] = 0;  // Alt released
}
//#endregion

//#region Mouse Events

/**
[0] = X position, 
[1] = Y position, 
[2] = mouse click x position,
[3] = mouse click y position, 
[4] = left click, 
[5] = middle click, 
[6] = right click,  
[7] =  double click,
[8] = scroll horizontal,
[9] = scroll vertical
*/
var iMouse = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const MOUSE_BUTTON_LEFT = 0;
const MOUSE_BUTTON_MIDDLE = 1;
const MOUSE_BUTTON_RIGHT = 2;

const MOUSE_XPOS = 0;
const MOUSE_YPOS = 1;
const MOUSE_CLICK_XPOS = 2;
const MOUSE_CLICK_YPOS = 3;
const MOUSE_LEFT_BUTTON = 4;
const MOUSE_MIDDLE_BUTTON = 5;
const MOUSE_RIGHT_BUTTON = 6;
const MOUSE_DOUBLE_CLICK = 7;
const MOUSE_SCROLL_VER = 8;
const MOUSE_SCROLL_HOR = 9;

function onMouseMove(e) {
    var x = e.clientX;
    var y = e.clientY;
    iMouse[0] = x;
    iMouse[1] = y;

}

function onMouseDown(e) {
    var x = e.clientX;
    var y = e.clientY;
    iMouse[2] = x;
    iMouse[3] = y;
    iMouse[4] = e.button == MOUSE_BUTTON_LEFT ? 1 : 0;
    iMouse[5] = e.button == MOUSE_BUTTON_MIDDLE ? 1 : 0;
    iMouse[6] = e.button == MOUSE_BUTTON_RIGHT ? 1 : 0;
}

function onMouseUp(e) {
    var x = e.clientX;
    var y = e.clientY;
    iMouse[4] = e.button;
}


function onMouseWheel(e) {
    iMouse[MOUSE_SCROLL_HOR] = e.wheelDeltaX;
    iMouse[MOUSE_SCROLL_VER] = e.wheelDeltaY;
}
//#endregion