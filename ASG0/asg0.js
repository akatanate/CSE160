// Instantiate vectors for operations
var v1 = new Vector3([2.25, 2.25, 0]);
var v2 = new Vector3([2.25, 2.25, 0]);
var v3 = new Vector3([2.25, 2.25, 0]);

var v4 = new Vector3([2.25, 2.25, 0]);
var v5 = new Vector3([2.25, 2.25, 0]);


// sets vector color and draws it
function drawVector(v, color, ctx){
       ctx.strokeStyle = color;
    
       ctx.beginPath();
       ctx.moveTo(200, 200);
       ctx.lineTo(200 + v.elements[0] * 20, 200 - v.elements[1] * 20);
       ctx.stroke();
}

function handleDrawEvent(ctx){
  // clear canvas
  ctx.clearRect(0, 0, 400, 400);
  ctx.fillRect(0, 0, 400, 400);

  // get v1 values from canvas, and draw
  var v1_x = parseFloat(document.getElementById('v1_x').value);
  var v1_y = parseFloat(document.getElementById('v1_y').value);

  var v1_newVector = new Vector3([v1_x, v1_y, 1]);
  v1.set(v1_newVector);
  drawVector(v1, "red", ctx);

  // get v2 values from canvas, and draw
  var v2_x = parseFloat(document.getElementById('v2_x').value);
  var v2_y = parseFloat(document.getElementById('v2_y').value);

  var v2_newVector = new Vector3([v2_x, v2_y, 1]);
  v2.set(v2_newVector);
  drawVector(v2, "blue", ctx);
}

function handleDrawOperationEvent(ctx){
  //clear canvas
  ctx.clearRect(0, 0, 400, 400); 
  ctx.fillRect(0, 0, 400, 400);

  handleDrawEvent(ctx); //draw v1 and v2

  // Read the value of the selector and call the respective Vector3 function. 
  var par=document.getElementsByName('ops')[0]; // from stackoverflow (50-53)
  var index=par.selectedIndex;
  var option = par.options[index].text;
  var scal = parseFloat(document.getElementById('scalar').value);

  //read selector, and run appropriate actions
  if (option === "Add"){
    var v3 = v1.add(v2);
    drawVector(v3, "green", ctx);
  } else if(option === "Subtract"){
    var v3 = v1.sub(v2);
    drawVector(v3, "green", ctx);
  } 
  
  else if(option === "Divide"){
    var v3 = v1.div(scal);
    drawVector(v3, "green", ctx);

    var v4 = v2.div(scal);
    drawVector(v4, "green", ctx);
  }

  else if (option === "Multiply"){
    var v3 = v1.mul(scal);
    drawVector(v3, "green", ctx);

    var v4 = v2.mul(scal);
    drawVector(v4, "green", ctx);
  }

  else if (option === "Normalize"){
    var v4 = v1.normalize();
    var v5 = v2.normalize();

    drawVector(v4, "green", ctx);
    drawVector(v5, "green", ctx);
  }
  else if (option === "Magnitude"){
    console.log("Magnitude v1: ", v1.magnitude());
    console.log("Magnitude v1: ", v2.magnitude());
  }

  else if (option === "Angle Between"){
    angleBetween(v1, v2);
  }

  else if (option === "Area"){
    areaTriangle(v1, v2);
  }

  else{
    console.log("ELSE- not an option");
  }
}

// some of these look a little off, but pass tests still?
function angleBetween(v1, v2){
  var dot_prod = Vector3.dot(v1, v2);
  var mag1 = v1.magnitude();
  var mag2 = v2.magnitude();
  var cos_alpha = dot_prod / (mag1* mag2);

  var angle = Math.acos(cos_alpha) * (180 / Math.PI);
  console.log("Angle :", angle); 
}

function areaTriangle(v1,v2){
  var cross = Vector3.cross(v1, v2);
  var mag = cross.magnitude();
  console.log("Area of the triangle :", mag / 2);
}

function main() {
    // Retrieve <canvas> element                                 
    var canvas = document.getElementById('the_canvas');
    if (!canvas) {
      console.log('Failed to retrieve the <canvas> element');
      return;
    }

   // Get the rendering context for 2DCG                       
   var ctx = canvas.getContext('2d');

   // Draw a blue rectangle                                
   ctx.fillStyle = 'black';
   ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color
   
   // run functions when appopriate button is called 
   var draw = document.getElementById('draw_button'); 
   draw.onclick = function() {
      handleDrawEvent(ctx);
   };

   var op = document.getElementById('op_button');
   op.onclick = function() {
      handleDrawOperationEvent(ctx);
   };
}

