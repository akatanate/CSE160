// blockyAnimal.js
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main(){
        gl_Position =  u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
    }`

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
let g_greenAngle = 0;

let g_yellowAnimation = false;
let g_magentaAnimation = false;
let g_greenAnimation = false;


//set up actions for HTML UI elements
function addActionsForHtmlUI(){
    document.getElementById('animationYellowOnButton').addEventListener('mousemove', function() { g_yellowAnimation = true } );
    document.getElementById('animationYellowOffButton').addEventListener('mousemove', function() { g_yellowAnimation = false} );

    document.getElementById('animationMagentaOnButton').addEventListener('mousemove', function() { g_magentaAnimation = true } );
    document.getElementById('animationMagentaOffButton').addEventListener('mousemove', function() { g_magentaAnimation = false} );

    document.getElementById('animationGreenOnButton').addEventListener('mousemove', function() { g_greenAnimation = true } );
    document.getElementById('animationGreenOffButton').addEventListener('mousemove', function() { g_greenAnimation = false} );

    //size slider events
    document.getElementById('greenSlide').addEventListener('mousemove', function() { g_greenAngle = this.value; renderAllShapes();} );
    document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes();} );
    document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes();} );
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); } );


       // Special 'poke' animation triggered by shift-click event
       document.addEventListener('click', function() {
        if (event.shiftKey ) {
            // Toggle the g_greenAnimation state
    
            g_greenAnimation = true;
        }
    });
  }


function main() {

    setupWebGL();

    connectVariablesToGSL();

    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev){ if(ev.buttons == 1) { click(ev) } };

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.5, 1.0);

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // renderAllShapes();

    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){
  g_seconds = performance.now()/1000.0-g_startTime;
  // console.log(g_seconds);

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}

var g_shapesList = [];

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

function updateAnimationAngles(){
  if(g_yellowAnimation){
    g_yellowAngle = (15*Math.sin(3*g_seconds));
  }
  if(g_magentaAnimation){
    g_magentaAngle = (15*Math.sin(3*g_seconds));
  }
  if(g_greenAnimation){
    g_greenAngle = (15*Math.sin(3*g_seconds));
  }
}

function renderAllShapes(){
  // Check the time at the start of this function
  var startTime = performance.now();

  var globalRotMat=new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
  gl.clear(gl.COLOR_BUFFER_BIT);

  // body 
  var body = new Cube();
  body.color = [1.0, 0.7, 0.0, 1.0];
  body.matrix.translate(-.35, -.5, 0.0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.scale(.75, .45, .5);
  bodyCoordinatesMat = new Matrix4(body.matrix)
  body.render();

  var bodyPlate = new Cube();
  bodyPlate.color = [0.8, 0.8, 0.8, 1.0];
  bodyPlate.matrix =  bodyCoordinatesMat;
  bodyPlate.matrix.rotate(0, 90, 90, 90);
  bodyPlate.matrix.translate(0, 0.7, -.1);
  bodyPlate.matrix.scale(1, .3, .1);
  bodyPlateCoordinatesMat = new Matrix4(bodyPlate.matrix);
  bodyPlate.render();

  var bodyPlateL = new Cube();
  bodyPlateL.color = [0.0, 0.0, 0.0, 1.0];
  bodyPlateL.matrix =  bodyPlateCoordinatesMat;
  bodyPlateL.matrix.rotate(0, 90, 90, 90);
  bodyPlateL.matrix.translate(0.5, 0, -.1);
  bodyPlateL.matrix.scale(.2, 1, .1);
  bodyPlateL.render();

  var bodyPlateR = new Cube();
  bodyPlateR.color = [0.6, 0.6, 0.6, 1.0];
  bodyPlateR.matrix =  bodyPlateCoordinatesMat;
  bodyPlateR.matrix.rotate(0, 90, 90, 90);
  bodyPlateR.matrix.translate(-0.7, 0, -.1);
  bodyPlateR.matrix.scale(.85, 1, .1);
  bodyPlateR.render();


  // right arm
  var lArm = new Cube();
  lArm.color =  [0.9, 0.6, 0.0, 1.0]; //NEON GREEN
  lArm.matrix.setTranslate(-.45, -.25, -.22);
  lArm.matrix.rotate(-5, 1.3, 0, 0); // Rotate around the y-axis
  // lArm.matrix.rotate(-g_greenAngle, 0, 0, 1);

  var lArmCoordinatesMat = new Matrix4(lArm.matrix);
  lArm.matrix.scale(0.1, .1, .55);
  // lArm.matrix.setTranslate(0, 0, 0);
  lArm.render();


  var lFinger3 = new Cube();
  lFinger3.color =  [0.5, 0.3, 0.2, 1.0];

  lFinger3.matrix = lArmCoordinatesMat;
  lFinger3.matrix.translate(0, 0.03, -.12);
  lFinger3.matrix.rotate(-35, 0, 0, 1);
  //rFinger1.matrix.rotate(-5, 0, 1, 0); // Rotate around the y-axis
  //rFinger1.matrix.rotate(-g_greenAngle, 0, 0, 1);
  var fingerMat = new Matrix4(lFinger3.matrix);
  lFinger3.matrix.scale(0.03, .08, 0.1);
  lFinger3.matrix.rotate(-g_greenAngle, 0, 0, 1);

  lFinger3.render();

  var lFinger4 = new Cube();
  lFinger4.color =  [0.5, 0.3, 0.2, 1.0];
  lFinger4.matrix = lArmCoordinatesMat;

  lFinger4.matrix.translate(2, 0.3, -.09);
  lFinger4.matrix.scale(.6, .6, 1);
  lFinger4.matrix.rotate(-g_greenAngle, 0, 0, 1);
  lFinger4.render();

  


 
  // Plant + Shoe -------------------------------------------------------------
  var shoeBottom = new Cube();
  shoeBottom.color =  [0.7, 0.5, 0.3, 1.0];
  shoeBottom.matrix = fingerMat;
  shoeBottom.matrix.translate(0, 0.05, 0);
  shoeBottom.matrix.rotate(-5, 0, 1, 0); // Rotate around the y-axis
  shoeBottom.matrix.rotate(-g_greenAngle, 0, 0, 1);
  var shoeBottomCoordinatesMat = new Matrix4(shoeBottom.matrix);
  shoeBottom.matrix.scale(0.15, .1, .1);
  shoeBottom.render();

  var shoeTop = new Cube();
  shoeTop.color = [0.7, 0.5, 0.3, 1.0]
  shoeTop.matrix = shoeBottomCoordinatesMat;
  shoeTop.matrix.translate(0, .1, 0);
  // shoeTop.matrix.translate(-.25, -.1, -.5);
  // shoeTop.matrix.rotate(-5, 0, 1, 0); // Rotate around the y-axis
  // shoeTop.matrix.rotate(-g_greenAngle, 0, 0, 1);
  var shoeTopCoordinatesMat = new Matrix4(shoeTop.matrix);
  shoeTop.matrix.scale(0.07, .1, .1);
  shoeTop.render();


  var plantStem = new Cube();
  plantStem.color =  [0.1, 0.5, 0.1, 1.0];
  plantStem.matrix = shoeTopCoordinatesMat;
  plantStem.matrix.translate(0.03, 0.1, .03);
  // plantStem.matrix.rotate(-5, 0, 1, 0); // Rotate around the y-axis
  // plantStem.matrix.rotate(-g_greenAngle, 0, 0, 1);
  var plantStemLCoordinatesMat = new Matrix4(plantStem.matrix);
  plantStem.matrix.scale(0.02, .2, .03);
  plantStem.render();

  var plantStemL = new Cube();
  plantStemL.color =  [0.4, 0.9, 0.4, 1.0];
  plantStemL.matrix = plantStemLCoordinatesMat;
  plantStemL.matrix.translate(-0.05, 0.1, .01);
  // plantStemL.matrix.rotate(-5, 0, 1, 0); // Rotate around the y-axis
  // plantStemL.matrix.rotate(-g_greenAngle, 0, 0, 1);
  plantStemL.matrix.scale(0.12, .05, .015);
  plantStemL.render();
  // --------------------------------------------------------------------------------------------------------------------------

  // left arm
  var rArm = new Cube();
  rArm.color =  [0.9, 0.6, 0.0, 1.0];
  rArm.matrix.translate(0.4, -.25, -.22);
  rArm.matrix.rotate(-5, 1.3, 0, 0);
  rArm.matrix.scale(0.1, .1, .55);
  var rArmCoordinatesMat = new Matrix4(rArm.matrix);
  rArm.render();

  var rFinger1 = new Cube();
  rFinger1.color =  [0.5, 0.3, 0.2, 1.0];
  rFinger1.matrix = rArmCoordinatesMat;
  rFinger1.matrix.translate(0, .1, -.12);
  //rFinger1.matrix.rotate(-5, 0, 1, 0); // Rotate around the y-axis
  //rFinger1.matrix.rotate(-g_greenAngle, 0, 0, 1);
  rFinger1.matrix.scale(0.3, .4, 1);
  rFinger1.render();

  var rFinger2 = new Cube();
  rFinger2.color =  [0.5, 0.3, 0.2, 1.0];
  rFinger2.matrix = rArmCoordinatesMat;
  rFinger2.matrix.translate(2, .16, -.09);
  rFinger2.matrix.rotate(35, 0, 0, 1);

  // Finger2.matrix.rotate(-20, 5, 20, 20);
  //rFinger1.matrix.rotate(-5, 0, 1, 0); // Rotate around the y-axis
  //rFinger1.matrix.rotate(-g_greenAngle, 0, 0, 1);
  rFinger2.matrix.scale(1, 2, .2);
  rFinger2.render();

  
  


  // left leg
  var lLeg = new Oval();
  lLeg.color =  [0.0, 0.0, 0.0, 1.0];
  lLeg.matrix.translate(-.40, -.5, 0.0);
  lLeg.matrix.rotate(-5, 1, 0, 0);
  lLeg.matrix.scale(0.1, .4, .5);
  lLeg.render();

  // right leg
  /*var rLeg = new Trapezoid();
  rLeg.color =  [0.0, 0.0, 0.0, 1.0];
  rLeg.matrix.translate(0.4, -.6, 0.0);
  rLeg.matrix.rotate(-5, 1, 0, 0);
  rLeg.matrix.scale(0.1, .3, .5);
  // var rLegCoordinatesMat =  new Matrix4(rLeg.matrix);
  rLeg.render();*/
  var rLeg = new Oval();
  rLeg.color =  [0.0, 0.0, 0.0, 1.0];
  rLeg.matrix.translate(0.45, -.5, 0.0);
  rLeg.matrix.rotate(-5, 1, 0, 0);
  rLeg.matrix.scale(0.1, .4, .5);
  // var rLegCoordinatesMat =  new Matrix4(rLeg.matrix);
  rLeg.render();

  // neck
  var leftArm = new Cube();
  leftArm.color = [0.6, 0.6, 0.6, 1.0];
  leftArm.matrix.setTranslate(0, -.5, .2);
  leftArm.matrix.rotate(-5, 1, 0, 0);
  leftArm.matrix.rotate(-g_yellowAngle, 1, 0, 0);
  // yellow
  var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.1, .23, .1);
  leftArm.matrix.translate(-.5, 2, 0);
  leftArm.render();

  // head
  var box = new Cube();
  box.color = [0.8, 0.8, 0.8, 1.0];
  box.matrix =  yellowCoordinatesMat;
  box.matrix.translate(0, 0.65, -0.1);
  box.matrix.rotate(-g_magentaAngle, 1, 0, 0);
  box.matrix.scale(.65, .3, .3);
  box.matrix.translate(-.5, 0, -0.001);
  var headCoordinatesMat = new Matrix4(box.matrix);
  box.render();

    // tophead
    var boxTop = new Cube();
    boxTop.color = [0.6, 0.6, 0.6, 1.0];
    boxTop.matrix =  headCoordinatesMat;
    boxTop.matrix.translate(0.01, 1, 0);
    boxTop.matrix.scale(1, .07, 1);
    boxTop.render();

    // right
    var boxTopR = new Cube();
    boxTopR.color = [0.6, 0.6, 0.6, 1.0];
    boxTopR.matrix = headCoordinatesMat;
    boxTopR.matrix.translate(1, -14, 0);
    boxTopR.matrix.scale(.05, 13, 1);
    boxTopR.render();

        // right
        var boxTopL = new Cube();
        boxTopL.color = [0.6, 0.6, 0.6, 1.0];
        boxTopL.matrix = headCoordinatesMat;
        boxTopL.matrix.translate(-21.4, 0, 0);
        boxTopL.matrix.scale(1, 1, 1);
        boxTopL.render();

   // left eye----------------------------------------------------------------
   var lEye = new Cube();
   lEye.color =  [0, 0, 0, 1.0];
   lEye.matrix = yellowCoordinatesMat;
   lEye.matrix.scale(.4, .6, .3);
   lEye.matrix.translate(.25, .25, -0.1);
   lEye.render();
    
      // left eye
        var lEyeBig = new Cube();
        lEyeBig.color =  [1.0, 1.0, 1.0, 1.0];

        lEyeBig.matrix = yellowCoordinatesMat;
        // rEye.matrix.translate(0.25, 0.25, 0);
        lEyeBig.matrix.scale(.4 , .4 , .3);
        lEyeBig.matrix.translate(0.3, 1, -0.1);
        lEyeBig.render();

        // left eye
        var lEyeSmall = new Cube();
        lEyeSmall.color =  [1.0, 1.0, 1.0, 1.0];
    
        lEyeSmall.matrix = yellowCoordinatesMat;
        // rEye.matrix.translate(0.25, 0.25, 0);
        lEyeSmall.matrix.scale(.6 , .5 , .3);
        lEyeSmall.matrix.translate(1.8, -1.6, -0.1);
        lEyeSmall.render();

    // right eye----------------------------------------------------------------
    var rEye = new Cube();
    rEye.color =  [0, 0, 0, 1.0];
    rEye.matrix = yellowCoordinatesMat;
    rEye.matrix.scale(3.5, 5, .3);
    rEye.matrix.translate(.8, -.1, -0.1); //should only change this
    rEye.render();
     
      var rEyeBig = new Cube();
      rEyeBig.color =  [1.0, 1.0, 1.0, 1.0];

      rEyeBig.matrix = yellowCoordinatesMat;
      // rEye.matrix.translate(0.25, 0.25, 0);
      rEyeBig.matrix.scale(.4 , .4 , .3);
      rEyeBig.matrix.translate(0.3, 1, -0.1);
      rEyeBig.render();

      // left eye
      var rEyeSmall = new Cube();
      rEyeSmall.color =  [1.0, 1.0, 1.0, 1.0];

      rEyeSmall.matrix = yellowCoordinatesMat;
      // rEye.matrix.translate(0.25, 0.25, 0);
      rEyeSmall.matrix.scale(.6 , .5 , .3);
      rEyeSmall.matrix.translate(1.8, -1.6, -0.1);
      rEyeSmall.render();

    
       // left eye
         /*var lEyeBig = new Cube();
         lEyeBig.color =  [1.0, 1.0, 1.0, 1.0];
 
         lEyeBig.matrix = yellowCoordinatesMat;
         // rEye.matrix.translate(0.25, 0.25, 0);
         lEyeBig.matrix.scale(.4 , .4 , .3);
         lEyeBig.matrix.translate(0.3, 1, -0.1);
         lEyeBig.render();
 
         // left eye
         var lEyeSmall = new Cube();
         lEyeSmall.color =  [1.0, 1.0, 1.0, 1.0];
     
         lEyeSmall.matrix = yellowCoordinatesMat;
         // rEye.matrix.translate(0.25, 0.25, 0);
         lEyeSmall.matrix.scale(.6 , .5 , .3);
         lEyeSmall.matrix.translate(1.8, -1, -0.1);
         lEyeSmall.render();*/
    

    // right eye----------------------------------------------------------------


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