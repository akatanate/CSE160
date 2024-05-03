class Cube {
    constructor() {
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.textureNum = -2;
    }
  
    render() {
      var rgba = this.color;

      gl.uniform1i(u_whichTexture, this.textureNum);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // front 
      drawTriangle3DUV( [ 0, 0, 0,      1, 1, 0,     1, 0, 0 ], [ 1, 0,   0, 1,   1, 1] );
      drawTriangle3DUV( [ 0, 0, 0,      0, 1, 0,     1, 1, 0 ], [ 0, 0,   0, 1,   1, 1] );
  
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

      //UPDATE REST OF UV COORD****************************
        // top
        drawTriangle3DUV( [ 0, 1, 0,    0, 1,1,    1, 1, 1 ], [0,0,   0,1,    1, 1]);
        drawTriangle3D( [ 0, 1, 0,    1, 1, 1,    1, 1, 0 ] );

        // bottom
        drawTriangle3D( [ 0, 0, 0,    1, 0, 0,    1, 0, 1 ] );
        drawTriangle3D( [ 0, 0, 0,    1, 0, 1,    0, 0, 1 ] );

        // right
        drawTriangle3D( [ 1, 0, 0,    1, 0, 1,    1, 1, 1 ] );
        drawTriangle3D( [ 1, 0, 0,   1, 1, 1,    1, 1, 0 ] );

        //left
        drawTriangle3D( [0, 0, 0,    0, 1, 1,    0, 1, 0 ] );
        drawTriangle3D( [ 0, 0, 0,   0, 1, 0,    0, 0, 1] );

        //back
        drawTriangle3D( [1, 1, 1,    0, 1, 1,    0, 0, 1] );
        drawTriangle3D( [ 1, 1, 1,   0, 0, 1,    1, 0, 1 ] );
    }


    renderFast() {
      var rgba = this.color;

      // gl.uniform1i(u_whichTexture, this.textureNum);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      var allverts=[];

      // front 
      allverts=allverts.concat( [ 0, 0, 0,      1, 1, 0,     1, 0, 0 ] );
      allverts=allverts.concat( [ 0, 0, 0,      0, 1, 0,     1, 1, 0 ] );
      // drawTriangle3DUV( [ 0, 0, 0,      1, 1, 0,     1, 0, 0 ], [ 1, 0,   0, 1,   1, 1] );
      // drawTriangle3DUV( [ 0, 0, 0,      0, 1, 0,     1, 1, 0 ], [ 0, 0,   0, 1,   1, 1] );
  
      //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

      //UPDATE REST OF UV COORD****************************
        // top
        allverts=allverts.concat( [ 0, 1, 0,    0, 1, 1,    1, 1, 1 ] );
        allverts=allverts.concat( [ 0, 1, 0,    0, 1, 1,    1, 1, 0 ] );
        //drawTriangle3DUV( [ 0, 1, 0,    0, 1,1,    1, 1, 1 ], [0,0,   0,1,    1, 1]);
        //drawTriangle3D( [ 0, 1, 0,    1, 1, 1,    1, 1, 0 ] );

        // bottom
        allverts=allverts.concat( [ 0, 0, 0,    1, 0, 0,    1, 0, 1 ] );
        allverts=allverts.concat( [ 0, 0, 0,    1, 0, 1,    0, 0, 1 ] );
        // drawTriangle3D( [ 0, 0, 0,    1, 0, 0,    1, 0, 1 ] );
        // drawTriangle3D( [ 0, 0, 0,    1, 0, 1,    0, 0, 1 ] );

        // right
        allverts=allverts.concat( [ 1, 0, 0,    1, 0, 1,    1, 1, 1 ] );
        allverts=allverts.concat( [ 1, 0, 0,   1, 1, 1,    1, 1, 0 ] );
        // drawTriangle3D( [ 1, 0, 0,    1, 0, 1,    1, 1, 1 ] );
        // drawTriangle3D( [ 1, 0, 0,   1, 1, 1,    1, 1, 0 ] );

        //left
        allverts=allverts.concat( [0, 0, 0,    0, 1, 1,    0, 1, 0 ]  );
        allverts=allverts.concat( [ 0, 0, 0,   0, 1, 0,    0, 0, 1]  );
        // drawTriangle3D( [0, 0, 0,    0, 1, 1,    0, 1, 0 ] );
        // drawTriangle3D( [ 0, 0, 0,   0, 1, 0,    0, 0, 1] );

        //back
        allverts=allverts.concat( [1, 1, 1,    0, 1, 1,    0, 0, 1]   );
        allverts=allverts.concat( [ 1, 1, 1,   0, 0, 1,    1, 0, 1 ] );
        // drawTriangle3D( [1, 1, 1,    0, 1, 1,    0, 0, 1] );
        // drawTriangle3D( [ 1, 1, 1,   0, 0, 1,    1, 0, 1 ] );

        drawTriangle3D(allverts);
    }
  
  
  
  }
  
  