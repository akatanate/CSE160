// Vertex shader program

var VSHADER_SOURCE =`
   precision mediump float;
   attribute vec4 a_Position;
   attribute vec2 a_UV;
   attribute vec3 a_Normal;
   varying vec2 v_UV;
   varying vec3 v_Normal;
   varying vec4 v_VertPos;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_NormalMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_ProjectionMatrix;
   void main() {
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
      v_UV = a_UV;
      v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1)));
      v_VertPos = u_ModelMatrix * a_Position;
   }`

    
// Fragment shader program
    var FSHADER_SOURCE = `
        precision mediump float;
        varying vec2 v_UV;
        varying vec3 v_Normal;
        uniform vec4 u_FragColor;
        uniform sampler2D u_Sampler0;
        uniform sampler2D u_Sampler1;
        uniform sampler2D u_Sampler2;
        uniform int u_whichTexture;
        uniform vec3 u_lightPos;
        uniform vec3 u_cameraPos;
        varying vec4 v_VertPos;
        uniform bool u_lightOn;

    
    
        void main() {
          if(u_whichTexture == -3){
            gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); // normal
         } else if(u_whichTexture == -2){
            gl_FragColor = u_FragColor;                  // color
         } else if (u_whichTexture == -1){
            gl_FragColor = vec4(v_UV, 1.0, 1.0);         // UV debug color
         } else if(u_whichTexture == 0){
            gl_FragColor = texture2D(u_Sampler0, v_UV);  // texture0
         } else if(u_whichTexture == 1){
            gl_FragColor = texture2D(u_Sampler1, v_UV);  // texture1
         } else if(u_whichTexture == 2){
          gl_FragColor = texture2D(u_Sampler2, v_UV);  // texture2
       } 
         else {
            gl_FragColor = vec4(1,.2,.2,1);              // Error -> Red
         }
   
         vec3 lightVector = u_lightPos-vec3(v_VertPos);
         float r = length(lightVector);
   
         // Red/Green Distance Visualization
         // if(r<1.0){
         //    gl_FragColor = vec4(1,0,0,1);
         // } else if (r<2.0){
         //    gl_FragColor = vec4(0,1,0,1);
         // }
   
         // Light Falloff Visualization 1/r^2
         // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);
   
         // N dot L
         vec3 L = normalize(lightVector);
         vec3 N = normalize(v_Normal);
         float nDotL = max(dot(N,L), 0.0);
   
         // Reflection
         vec3 R = reflect(L,N);
   
         // eye
         vec3 E = normalize(u_cameraPos-vec3(v_VertPos));
   
         // Specular
         float specular = pow(max(dot(E, R), 0.0), 64.0) * 0.8;

          // vec3(1.0, 1.0, 0.0) * 
         vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
          vec3 ambient = vec3(gl_FragColor) * 0.3;

          if (u_lightOn) {
              gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
          } else {
              gl_FragColor = vec4(diffuse + ambient, 1.0);
          }

         

        }
    `;
    
    // Global Variables
    let canvas;
    let gl;
    let a_Position;
    let a_UV;
    
    let u_FragColor;
    let u_Size;
    
    let u_ModelMatrix;
    let u_ProjectionMatrix; //diff
    let u_ViewMatrix; //diff
    let u_GlobalRotateMatrix;
    let u_NormalMatrix;
    
    let u_Sampler0;
    let u_Sampler1;
    let u_Sampler2;
    let u_whichTexture;
    let u_lightPos;
    let u_cameraPos;
    let u_lightOn;
    let a_Normal;
    
    function setupWebGL(){
        // Retrieve <canvas> element
        canvas = document.getElementById('webgl');
    
        // gl = getWebGLContext(canvas);
    
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

        var u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
        if (!u_cameraPos) {
            console.log('Fail to get the storage location of u_cameraPos');
            return;
        }

        // Get the storage location of a_Position variable
        a_UV = gl.getAttribLocation(gl.program, 'a_UV');
        if (a_UV < 0) {
            console.log('Fail to get the storage location of a_UV');
            return;
        }

        a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
        if (a_Normal < 0) {
            console.log('Fail to get the storage location of a_Normal');
            return;
        }
    
        u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
        if (!u_whichTexture) {
         console.log('Fail to get the storage location of u_whichTexture');
         return;
        }
    
        // Get the storage location of u_FragColor variable
        u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
        if (!u_FragColor) {
            console.log('Fail to get the storage location of u_FragColor');
            return;
        }

        u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
        if (!u_lightPos) {
            console.log('Fail to get the storage location of u_lightPos');
            return;
        }


        u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
        if (!u_lightOn) {
            console.log('Fail to get the storage location of u_lightOn');
            return;
        }

        u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
        if (!u_NormalMatrix) {
            console.log('Failed to get u_NormalMatrix');
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
    
        u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
        if (!u_ViewMatrix) {
          console.log('Fail to get the storage location of u_ViewMatrix');
          return;
        }
    
        u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
        if (!u_ProjectionMatrix) {
          console.log('Fail to get the storage location of u_ProjectionMatrix');
          return;
        }
    
           // Get the storage location of the u_Sampler
       u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
       if (!u_Sampler0) {
        console.log('Fail to get the storage location of u_Sampler0');
        return;
       }
    
       u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
       if (!u_Sampler1) {
        console.log('Fail to get the storage location of u_Sampler1');
        return;
       }
    
       u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
       if (!u_Sampler2) {
        console.log('Fail to get the storage location of u_Sampler2');
        return;
       }
 
         var identityM = new Matrix4();
         gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    
        //gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
        //gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
    }
    
    function initTextures(){                                  
      var image1 = new Image(); // Create the first image object
      var image2 = new Image(); // Create the second image object
      var image3 = new Image(); 
    
      if (!image1 || !image2 || !image3 ) {
          console.log('Fail to create the image objects');
          return false;
      }
    
      // Register the event handlers to be called on loading images
      image1.onload = function() { sendTextureToTEXTURE0(image1); };
      image2.onload = function() { sendTextureToTEXTURE1(image2); };
      image3.onload = function() { sendTextureToTEXTURE2(image3); };
    
      // Tell the browser to load images
      image1.src = 'dusk_1.jpeg';
      image2.src = 'dirt.jpeg'; // Provide the path to your second texture image
      image3.src = 'red.jpeg';
    
      return true;
    }
    
     function sendTextureToTEXTURE0(image1){     
      var texture0 = gl.createTexture(); // Create a texture object
      if (!texture0) {
        console.log('Fail to creaye texture object');
        return false;
      }
    
       gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
       // Enable the texture unit 0
       gl.activeTexture(gl.TEXTURE0);
       // Bind the texture object to the target
       gl.bindTexture(gl.TEXTURE_2D, texture0);
    
       // Set the texture parameters
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
       // Set the texture image
       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
    
       // Set the texture unit 0 to the sampler
       gl.uniform1i(u_Sampler0, 0);
    
       // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    
       console.log('finished loadTexture');
     }
    
     function sendTextureToTEXTURE1(image2){     
      var texture1 = gl.createTexture(); // Create a texture object
      if (!texture1) {
        console.log('Fail to creaye texture object');
        return false;
      }
    
       gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
       // Enable the texture unit 0
       gl.activeTexture(gl.TEXTURE1);
       // Bind the texture object to the target
       gl.bindTexture(gl.TEXTURE_2D, texture1);
    
       // Set the texture parameters
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
       // Set the texture image
       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);
    
       // Set the texture unit 0 to the sampler
       gl.uniform1i(u_Sampler1, 1);
    
       // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    
       console.log('finished loadTexture1');
     }
    
     function sendTextureToTEXTURE2(image3){     
      var texture2 = gl.createTexture(); // Create a texture object
      if (!texture2) {
        console.log('Fail to creaye texture object');
        return false;
      }
    
       gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
       // Enable the texture unit 0
       gl.activeTexture(gl.TEXTURE2);
       // Bind the texture object to the target
       gl.bindTexture(gl.TEXTURE_2D, texture2);
    
       // Set the texture parameters
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
       // Set the texture image
       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);
    
       // Set the texture unit 0 to the sampler
       gl.uniform1i(u_Sampler2, 2);
    
       // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    
       console.log('finished loadTexture3');
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
    
    let g_globalAngle = 140;
    let vertical_globalAngle = 0;
    
    let g_yellowAngle = 0;
    let g_magentaAngle = 0;
    let g_greenAngle = 0;
    
    
    let g_yellowAnimation = false;
    let g_magentaAnimation = false;

    let g_normalOn=false;
    let g_lightOn=true;
    let g_lightPos=[0, 1, -2];
    



        
    //set up actions for HTML UI elements
    function addActionsForHtmlUI(){
        document.getElementById('normalOn').onclick = function() { g_normalOn=true; } ;
        document.getElementById('normalOff').onclick = function() { g_normalOn=false; } ;
      
        document.getElementById('lightOn').onclick = function() { g_lightOn=true; } ;
        document.getElementById('lightOff').onclick = function() { g_lightOn=false; } ;
      

        document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if(ev.buttons == 1){ g_lightPos[0] = this.value/100; renderAllShapes();}});
        document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if(ev.buttons == 1){ g_lightPos[1] = this.value/100; renderAllShapes();}});
        document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if(ev.buttons == 1){ g_lightPos[2] = this.value/100; renderAllShapes();}});

        //document.getElementById('redSlider').oninput = updateLightColor;
       //document.getElementById('greenSlider').oninput = updateLightColor;
        //document.getElementById('blueSlider').oninput = updateLightColor;


   

      /*document.addEventListener('click', function() {
        var music = document.getElementById("wallESong");
        music.play();
      });*/
        /*document.getElementById('animationYellowOnButton').addEventListener('mousemove', function() { g_yellowAnimation = true } );
        document.getElementById('animationYellowOffButton').addEventListener('mousemove', function() { g_yellowAnimation = false} );
    
        document.getElementById('animationMagentaOnButton').addEventListener('mousemove', function() { g_magentaAnimation = true } );
        document.getElementById('animationMagentaOffButton').addEventListener('mousemove', function() { g_magentaAnimation = false} );
    */
        //size slider events
        //document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes();} );
        //document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes();} );
        document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); } );
    
        
        /*canvas.addEventListener('mousemove', function(event){
          var frame = canvas.getBoundingClientRect();
      
          const x_pos = event.clientX - frame.left;
          const y_pos = event.clientY - frame.top;
    
          const x_normalized = x_pos / canvas.width;
          const y_normalized = y_pos / canvas.height;
    
          g_globalAngle = x_normalized * 360;
    
          const verticalMovement = y_normalized - 0.5;
          vertical_globalAngle = verticalMovement * 90;
          renderAllShapes();
        });*/

      }
    
    
    function main() {
    
        setupWebGL();
    
        connectVariablesToGSL();
    
        addActionsForHtmlUI();
    
        document.onkeydown = keydown;
    
        initTextures();
        // Set the color for clearing <canvas>
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
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
      // Extract the event click and return it in WebGL coordinates
      const [x, y] = convertCoordinatesEventToGL(ev);
    
      // Calculate the grid position of the click
      const gridX = Math.floor((x + 1) * g_map[0].length / 2);
      const gridY = Math.floor((y + 1) * g_map.length / 2);
    
      // Check if the grid position is within the map boundaries
      if (gridX >= 0 && gridX < g_map[0].length && gridY >= 0 && gridY < g_map.length) {
        // Check if the clicked position is empty
        if (g_map[gridY][gridX] === 0) {
          // Add a block to the map at the clicked position
          g_map[gridY][gridX] = 1; // Assuming 1 represents a block
    
          // Draw every shape that is supposed to be in the canvas
          renderAllShapes();
        }
      }
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
        g_yellowAngle = (45*Math.sin(g_seconds));
      }
      if(g_magentaAnimation){
        g_magentaAngle = (45*Math.sin(3*g_seconds));
      }

      // g_lightPos[0] = 2.3*Math.cos(g_seconds);

      if(!document.getElementById('lightSlideX').classList.contains('active')) {
        g_lightPos[0] = 2.3 * Math.cos(g_seconds);
      }
    }
    
    var g_camera = new Camera();
    
    function keydown(ev){
      if (ev.keyCode == 68){ // 'D' key or right arrow
        g_camera.right();
      } else if (ev.keyCode == 65){ // 'A' key or left arrow
        g_camera.left(); 
      } else if (ev.keyCode == 87){ // 'W' key or up arrow
        g_camera.forward();
      } else if (ev.keyCode == 83){ // 'S' key or down arrow
        g_camera.back();
      } else if (ev.keyCode == 69 || ev.keyCode == 37){ // Q key or left arrow
        g_globalAngle += 5; 
      } else if (ev.keyCode == 81 || ev.keyCode == 39){ // E key or right arrow
        g_globalAngle -= 5; 
      } else if (ev.keyCode == 38){ // Up arrow
        g_camera.upward();
      } else if (ev.keyCode == 40){ // Down arrow
        g_camera.down();
      }
    }
    
    var g_map=[
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 1],
      [1, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 1],
      [1, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 2, 1, 2, 0, 1],
      [1, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 1],
      [1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 1],
      [1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 6, 1],
      [1, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 7, 7, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
     
    function drawMap(){
      // var c = new Cube();
      for(x=0; x<32; x++){
          for(y=0;y<32;y++){
              if(g_map[x][y] % 2 == 0){   
                  for(z=0; z<g_map[x][y]; z++){
                      var block = new Cube();
                      block.textureNum = 3;
                      block.matrix.translate(y-4, z-.75, x-4);
                      block.renderfaster();
                  }              
              }
              if(g_map[x][y] % 3 == 0){
                  for(z=0; z<g_map[x][y]; z++){
                      var block = new Cube();
                      block.textureNum = 1;
                      block.matrix.translate(y-4, z-.75, x-4);
                      block.renderfaster();
                  }      
              }   
              else{
                for(z=0; z<g_map[x][y]; z++){
                    var block = new Cube();
                    block.textureNum = 0;
                    block.matrix.translate(y-4, z-.75, x-4);
                    block.renderfaster();
                }      
            }   
    
          }
      }
    }
   
    function renderAllShapes(){
      // Check the time at the start of this function
      var startTime = performance.now();
    
      var projMat=new Matrix4();
      projMat.setPerspective(90, 1 * canvas.width/canvas.height, .1, 100);
      gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
    
      var viewMat=new Matrix4();
      //viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]); //eye, at, up
      viewMat.setLookAt(
        g_camera.eye.x, g_camera.eye.y, g_camera.eye.z,
        g_camera.at.x, g_camera.at.y, g_camera.at.z,
        g_camera.up.x, g_camera.up.y, g_camera.up.z,
      );
      gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
    
      var globalRotMat=new Matrix4().rotate(g_globalAngle, vertical_globalAngle , 1, 0);
      gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
      // Clear <canvas>
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
      gl.clear(gl.COLOR_BUFFER_BIT);
    
      // drawMap();
    
      // DRAW the floor
      /*var floor = new Cube();
      floor.color = [1.0, 0.0, 0.0, 1.0];
      floor.textureNum = 1;
      //console.log(body.textureNum);
    
    
      floor.matrix.translate(-0, -.75, -0);
      floor.matrix.scale(35, .01, 35);
      floor.matrix.translate(-.15, 0, -.15);
      floor.render();*/
    
      /*floor.matrix.translate(0,-.75,0);
      floor.matrix.scale(20, 0, 20);
      floor.matrix.translate(-.5, 0, -.5);
      floor.render(); */

      //pass light position to GLSL (DEFINE u_ligjht)
      gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
      
      gl.uniform3f(u_cameraPos, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);

      gl.uniform1i(u_lightOn, g_lightOn);

      //drwa the light
      var light=new Cube();
      light.color= [2, 2, 0, 1];
      light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
      light.matrix.scale(-.1, -.1, -.1);
      light.matrix.translate(-.5, -.5, -.5);
      light.renderfast();

      var body1 = new Cube();
      body1.color = [1.0, 0.0,0.0,1.0];
      if(g_normalOn == true){
          body.textureNum = -3;
        }
     
      body1.matrix.scale(10, 0, 10);

      //body1.render();
    
        // DRAW the sky
        var sky = new Cube();
        sky.color = [1.0, 0.0, 0.0, 1.0];
        sky.matrix.translate(-1,0,-1);
        if(g_normalOn == true){
          sky.textureNum = -3;
        }
        sky.matrix.scale(-10, -10, -10);
        sky.matrix.translate(-.5, -.5, -.5);
        // sky.normalMatrix.setInverseOf(sky.matrix).transpose();
        sky.render(); 


        if(g_normalOn == true){
          body.textureNum = -3;
        }
    
      var box = new Cube();
      box.color = [1.0, 0.0,0.0,1.0];
      box.textureNum = -2; // color
      if(g_normalOn == true){
        box.textureNum = -3;
      }
      box.matrix.translate(1, 1, 0.0);
      box.matrix.rotate(-5, 1, 0, 0);
      box.matrix.scale(0.5, .3, .5);
      box.normalMatrix.setInverseOf(box.matrix).transpose();

      box.render();

      var sphere = new Sphere();
      if(g_normalOn) sphere.textureNum = -3;
      sphere.matrix.scale(1, 1, 1);
      sphere.matrix.translate(0, -2, 0);
      // sphere.normalMatrix.setInverseOf(sphere.matrix).transpose();

      sphere.render();

      //----------------------------------------------------------
      var body = new Cube();
      body.color = [1.0, 0.7, 0.0, 1.0];
      body.matrix.translate(-.35, -.5, 0.0);
      body.matrix.rotate(-5, 1, 0, 0);
      body.matrix.scale(.75, .45, .5);
      bodyCoordinatesMat = new Matrix4(body.matrix)
      body.normalMatrix.setInverseOf(body.matrix).transpose();
      body.render();
      
      var bodyPlate = new Cube();
      bodyPlate.color = [0.8, 0.8, 0.8, 1.0];
      bodyPlate.matrix =  bodyCoordinatesMat;
      bodyPlate.matrix.rotate(0, 90, 90, 90);
      bodyPlate.matrix.translate(0, 0.7, -.1);
      bodyPlate.matrix.scale(1, .3, .1);
      bodyPlateCoordinatesMat = new Matrix4(bodyPlate.matrix);
      bodyPlate.normalMatrix.setInverseOf(bodyPlate.matrix).transpose();
      bodyPlate.render();
    
      var bodyPlateL = new Cube();
      bodyPlateL.color = [0.0, 0.0, 0.0, 1.0];
      bodyPlateL.matrix =  bodyPlateCoordinatesMat;
      bodyPlateL.matrix.rotate(0, 90, 90, 90);
      bodyPlateL.matrix.translate(0.5, 0, -.1);
      bodyPlateL.matrix.scale(.2, 1, .1);
      bodyPlateL.normalMatrix.setInverseOf(bodyPlateL.matrix).transpose();
      bodyPlateL.render();
    
      var bodyPlateR = new Cube();
      bodyPlateR.color = [0.6, 0.6, 0.6, 1.0];
      bodyPlateR.matrix =  bodyPlateCoordinatesMat;
      bodyPlateR.matrix.rotate(0, 90, 90, 90);
      bodyPlateR.matrix.translate(-0.7, 0, -.1);
      bodyPlateR.matrix.scale(.85, 1, .1);
      bodyPlateR.normalMatrix.setInverseOf(bodyPlateR.matrix).transpose();
      bodyPlateR.render();
    
      // right arm
      var lArm = new Cube();
      lArm.color =  [0.9, 0.6, 0.0, 1.0]; //NEON GREEN
      lArm.matrix.setTranslate(-.45, -.25, -.22);
      lArm.matrix.rotate(-5, 1.3, 0, 0); // Rotate around the y-axis
      var lArmCoordinatesMat = new Matrix4(lArm.matrix);
      lArm.matrix.scale(0.1, .1, .55);
      lArm.normalMatrix.setInverseOf(lArm.matrix).transpose();
      lArm.render();
    
      var lFinger3 = new Cube();
      lFinger3.color =  [0.5, 0.3, 0.2, 1.0];
      lFinger3.matrix = lArmCoordinatesMat;
      lFinger3.matrix.translate(0, 0.03, -.12);
      lFinger3.matrix.rotate(-35, 0, 0, 1);
      var fingerMat = new Matrix4(lFinger3.matrix);
      lFinger3.matrix.scale(0.03, .08, 0.1);
      lFinger3.matrix.rotate(-g_greenAngle, 0, 0, 1);
      lFinger3.normalMatrix.setInverseOf(lFinger3.matrix).transpose();
      lFinger3.render();
    
      var lFinger4 = new Cube();
      lFinger4.color =  [0.5, 0.3, 0.2, 1.0];
      lFinger4.matrix = lArmCoordinatesMat;
      lFinger4.matrix.translate(2, 0.3, -.09);
      lFinger4.matrix.scale(.6, .6, 1);
      lFinger4.matrix.rotate(-g_greenAngle, 0, 0, 1);
      lFinger4.normalMatrix.setInverseOf(lFinger4.matrix).transpose();
      lFinger4.render();
     
      // --------------------------------------------------------------------------------------------------------------------------
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // left arm
      var rArm = new Cube();
      rArm.color =  [0.9, 0.6, 0.0, 1.0];
      rArm.matrix.translate(0.4, -.25, -.22);
      rArm.matrix.rotate(-5, 1.3, 0, 0);
      rArm.matrix.scale(0.1, .1, .55);
      var rArmCoordinatesMat = new Matrix4(rArm.matrix);
      rArm.normalMatrix.setInverseOf(lArm.matrix).transpose();
      rArm.render();
    
      var rFinger1 = new Cube();
      rFinger1.color =  [0.5, 0.3, 0.2, 1.0];
      rFinger1.matrix = rArmCoordinatesMat;
      rFinger1.matrix.translate(0, .1, -.12);
      rFinger1.matrix.scale(0.3, .4, 1);
      rFinger1.normalMatrix.setInverseOf(rFinger1.matrix).transpose();
      rFinger1.render();
    
      var rFinger2 = new Cube();
      rFinger2.color =  [0.5, 0.3, 0.2, 1.0];
      rFinger2.matrix = rArmCoordinatesMat;
      rFinger2.matrix.translate(2, .16, -.09);
      rFinger2.matrix.rotate(35, 0, 0, 1);
      rFinger2.matrix.scale(1, 2, .2);
      rFinger2.normalMatrix.setInverseOf(rFinger2.matrix).transpose();
      rFinger2.render();
    
      // left leg
      var lLeg = new Oval();
      lLeg.color =  [0.0, 0.0, 0.0, 1.0];
      lLeg.matrix.translate(-.40, -.5, 0.0);
      lLeg.matrix.rotate(-5, 1, 0, 0);
      lLeg.matrix.scale(0.1, .4, .5);
      //lLeg.normalMatrix.setInverseOf(lLeg.matrix).transpose();
      lLeg.render();
    
      // right leg
      var rLeg = new Oval();
      rLeg.color =  [0.0, 0.0, 0.0, 1.0];
      rLeg.matrix.translate(0.45, -.5, 0.0);
      rLeg.matrix.rotate(-5, 1, 0, 0);
      rLeg.matrix.scale(0.1, .4, .5);
      //rLeg.normalMatrix.setInverseOf(rLeg.matrix).transpose();
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
      leftArm.normalMatrix.setInverseOf(leftArm.matrix).transpose();
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
      box.normalMatrix.setInverseOf(box.matrix).transpose();
      box.render();
    
        // tophead
        var boxTop = new Cube();
        boxTop.color = [0.6, 0.6, 0.6, 1.0];
        boxTop.matrix =  headCoordinatesMat;
        boxTop.matrix.translate(0.01, 1, 0);
        boxTop.matrix.scale(1, .07, 1);
        boxTop.normalMatrix.setInverseOf(boxTop.matrix).transpose();
        boxTop.render();
    
        // right
        var boxTopR = new Cube();
        boxTopR.color = [0.6, 0.6, 0.6, 1.0];
        boxTopR.matrix = headCoordinatesMat;
        boxTopR.matrix.translate(1, -14, 0);
        boxTopR.matrix.scale(.05, 13, 1);
        boxTopR.normalMatrix.setInverseOf(boxTopR.matrix).transpose();
        boxTopR.render();
    
            // right
            var boxTopL = new Cube();
            boxTopL.color = [0.6, 0.6, 0.6, 1.0];
            boxTopL.matrix = headCoordinatesMat;
            boxTopL.matrix.translate(-21.4, 0, 0);
            boxTopL.matrix.scale(1, 1, 1);
            boxTopL.normalMatrix.setInverseOf(boxTopL.matrix).transpose();
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
  
      //----------------------------------------------------------
    
      //check time at end of function, show on pg
      var duration = performance.now() - startTime;
      sendTextToHTML("numdot: ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
    
    }
    
    // set the text of a HTML element
    function sendTextToHTML(text, htmlID){
        var htmlElm = document.getElementById(htmlID);
        if(!htmlElm){
            // console.log("Failed to get " + htmlID + " from HTML");
            return;
        }
        htmlElm.innerHTML = text;
    }