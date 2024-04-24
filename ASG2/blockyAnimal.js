

// HelloPoint1.js
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main(){
        gl_Position =  u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }`

    // Coordinates
    // Set the point size

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
    }`

    //Set the color

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrixl
let u_GlobalRotateMatrix;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    //gl = getWedGLContext(canvas);

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    } 

    // Get the storage location of a_Position variable
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Fail to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor variable
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Fail to get the storage location of u_FragColor');
        return;
    }


    // Get the storage location of u_FragColor variable
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Fail to get the storage location of u_ModelMatrix');
        return;
    }

       // Get the storage location of u_FragColor variable
       u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
       if (!u_GlobalRotateMatrix) {
           console.log('Fail to get the storage location of u_GlobalRotateMatrix');
           return;
       }

     var identityM = new Matrix4();
     gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; //white starting
let g_selectedSize = 5;
let g_selectedType=POINT;
let circle_seg = 10;

let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;


//set up actions for HTML UI elements
function addActionsForHtmlUI(){

  
  $(document).ready(function() {
    $(document).mousemove(function(event) {
      $("#cat").stop().animate({left: event.pageX, top: event.pageY}, 200); // Adjust the duration (200 milliseconds)
    });
  });

  // credit to this article I found online: https://kidscodecs.com/cursor-follow-javascript/
  
  
  

    //button events (shape type)
    /*document.getElementById('green').onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; };
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
    document.getElementById('clear').onclick = function() { g_shapesList=[]; renderAllShapes(); };

    document.getElementById('pointButton').onclick = function() { g_selectedType=POINT; };
    document.getElementById('triButton').onclick = function() { g_selectedType=TRIANGLE; };
    document.getElementById('circleButton').onclick = function() { g_selectedType=CIRCLE; };
*/
    /*var cir_seg = parseFloat(document.getElementById('seg').value);
    if (cir_seg == NaN) {
      circle_seg = 10;
    }
    
    console.log("html action:", circle_seg);*/


    /*document.getElementById('transSlide').addEventListener('input', function() {
      g_selectedColor[3] = parseFloat(this.value) / 100;
    });
    


    //Slider events
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; } );
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; } );
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; } );
    */

    //size slider events
    document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes();} );
    document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes();} );




    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); } );
}


function main() {

    setupWebGL();
    connectVariablesToGSL();
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev){ if(ev.buttons == 1) { click(ev) } };

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);
    renderAllShapes();
}




var g_shapesList = [];

// var g_points = []; // The array for a mouse press
// var g_colors = []; // The array to store the color of a point
// var g_sizes = []; // The array tp stpre the size of a point

function click(ev) {
  //extract the event click and return it in WebGL coordinates
  // let can see in local vars, or just type in the var in console to see same thing
  [x, y] = convertCoordinatesEventToGL(ev);

  // create and store the new point
  let point;
  if (g_selectedType==POINT){
    point = new Point();
  } else if(g_selectedType==TRIANGLE){
    point = new Triangle();
  }
  else{
    point = new Circle(circle_seg);
  }
  

  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // Store the color to the g_colors array
  // g_colors.push(g_selectedColor.slice());

    //store the size to the g sizes array
    // g_sizes.push(g_selectedSize);

  // Store the color to g_colors array
  /*if(x >= 0.0 && y >= 0.0) { // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]); // Red
  } else if(x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]); // Green
  } else { // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]); // White
  }*/

  //Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
  
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2)

    return([x, y]);
}



function renderAllShapes(){
  // Check the time at the start of this function
  var startTime = performance.now();

  var globalRotMat=new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
  gl.clear(gl.COLOR_BUFFER_BIT);

  var body = new Cube();
  body.color = [1.0, 0.0,0.0,1.0];
  body.matrix.translate(-.25, -.75, 0.0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.scale(0.5, .3, .5);
  body.render();

  var leftArm = new Cube();
  leftArm.color = [1, 1, 0, 1];
  leftArm.matrix.setTranslate(0, -.5, 0.0);
  leftArm.matrix.rotate(-5, 1, 0, 1);
  leftArm.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, .7, .5);
  leftArm.matrix.translate(-.5, 0, 0);
  leftArm.render();

  var box = new Cube();
  box.color = [1, 0, 1, 1];
  box.matrix =  yellowCoordinatesMat;
  box.matrix.translate(0, 0.65, 0);
  box.matrix.rotate(g_magentaAngle, 0, 0, 1);
  box.matrix.scale(.3, .3, .3);
  box.matrix.translate(-.5, 0, -0.001);

  /*box.matrix.rotate(-30, 1, 0, 0);
  box.matrix.scale(.2, .4, .2);*/
  box.render();

  //check time at end of function, show on pg
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");

}



// set the text of a HTML element
function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}