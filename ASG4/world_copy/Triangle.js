class Triangle{
  constructor(){
    this.type='triangle';
    this.position = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 5.0;
  }

  render(){
    /*if (robot_go == true){
      
      drawTriangle([-.1, 0, 0, .1, .1, 0]);

      drawTriangle([-.5, 0, 0, .3, .3, 0]);

      // drawTriangle([.5, -.5, 0, .5, -.5, 0]);
    } */

    // else{
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;

      // Pass the position of a point to a_Position variable
      // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);                       
      
      gl.uniform1f(u_Size, size);
      // Draw a point
      // gl.drawArrays(gl.POINTS, 0, 1);
      var d = this.size/200.0; //delta

          if (robot_go == true){          
            console.log("ROBOT TRIANGL-----------", this.position);
            drawTriangle(this.position); 
          }
          else{
            drawTriangle( [ xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d] );
          }
    }


    // drawTriangle( [ xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d] );
  // }

}

function drawTriangle(vertices){
    var n = 3; //number of vertices
    console.log("vertices", vertices);

    //create buffer object
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }

    //bind the buffer object to the target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    /*var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }*/

    //assign the buffer object to a_position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    //return n;
}  

var g_vertexBuffer = null;
function initTriangle3D(){
    var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
      console.log('Failed to create the buffer object');
      return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //assign the buffer object to a_position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  //enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
}
  
function drawTriangle3D(vertices){
  var n = vertices.length / 3; //number of vertices
  // console.log("vertices", vertices);

  if(g_vertexBuffer==null){
    initTriangle3D();
  }

  //create buffer object

  //bind the buffer object to the target

  //write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  /*var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
      console.log('Failed to get the storage location of a_Position');
      return -1;
  }*/

  gl.drawArrays(gl.TRIANGLES, 0, n);
  //return n;
}  
  
function drawTriangle3DUV(vertices, uv){
  var n = 3; //number of vertices

  //create buffer object****************************************************
  var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
      console.log('Failed to create the buffer object');
      return -1;
  }
  //bind the buffer object to the target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  //write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  //assign the buffer object to a_position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  //enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);


  //create UV buffer object****************************************************

  var uvBuffer = gl.createBuffer();
  if(!uvBuffer){
      console.log('Failed to create the buffer object');
      return -1;
  }
  //bind the buffer object to the target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  //write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  //assign the buffer object to a_position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  //enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);



  gl.drawArrays(gl.TRIANGLES, 0, n);

  g_vertexBuffer=null;
  //return n;
}  
 
function drawTriangle3DUV(vertices, uv) {
  var n = vertices.length; // The number of vertices

  // Create a buffer object for verts
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);


  // Create a buffer object for UV
  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);
  
  gl.drawArrays(gl.TRIANGLES, 0, n/3);

  g_vertexBuffer = null;
} 

function drawTriangle3DUVNormal(vertices, uv, normals){
  var n = vertices.length/3; 

  var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
     console.log('Failed to create the buffer object');
     return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var uvBuffer = gl.createBuffer();
  if(!uvBuffer){
     console.log('Failed to create the buffer object');
     return -1;
  }
  //
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_UV variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_UV variable
  gl.enableVertexAttribArray(a_UV);

  // NORMAL BUFFER ADDED -------------------------------- --------------------------------
  var normalBuffer = gl.createBuffer();
  if(!normalBuffer){
     console.log('Failed to create the buffer object');
     return -1;
  }
  //
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_UV variable
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Normal variable
  gl.enableVertexAttribArray(a_Normal);

  gl.drawArrays(gl.TRIANGLES, 0, n);
  g_vertexBuffer=null;
}