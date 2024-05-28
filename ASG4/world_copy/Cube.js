class Cube {
    constructor() {
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.normalMatrix = new Matrix4();
      this.textureNum = 0;
      this.vertices = [
        0,0,0, 1,1,0, 1,0,0,
        0,0,0, 0,1,0, 1,1,0,
        0,1,0, 0,1,1, 1,1,1,
        0,1,0, 1,1,1, 1,1,0,
        0,1,0, 0,1,1, 1,1,1,
        0,1,0, 1,1,1, 1,1,0,
        1,0,0, 1,1,1, 1,1,0,
        1,0,0, 1,0,1, 1,1,1,
        0,0,0, 0,1,1, 0,1,0,
        0,0,0, 0,0,1, 0,1,1,
        0,0,1, 1,1,1, 0,1,1,
        0,0,1, 1,0,1, 1,1,1
    ];
    this.UVVertices  = [
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1
  ];

    }
  
    render() {
      var rgba = this.color;

      //console.log("Before: texttue var in render: which + num", u_whichTexture, this.textureNum)
      gl.uniform1i(u_whichTexture, this.textureNum);
      //console.log("After: texttue var in render: which + num", u_whichTexture, this.textureNum)

  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);



// front
        drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0],[0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0],[0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);
  
// Top
        drawTriangle3DUVNormal([1,1,0, 1,1,1, 0,1,0],[1,0, 1,1, 0,0], [0,1,0, 0,1,0, 0,1,0]);
        drawTriangle3DUVNormal([0,1,1, 1,1,1, 0,1,0],[0,1, 1,1, 0,0], [0,1,0, 0,1,0, 0,1,0]);
  
// Right
        drawTriangle3DUVNormal([1,0,0, 1,1,0, 1,1,1],[0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
        drawTriangle3DUVNormal([1,0,0, 1,0,1, 1,1,1],[0,0, 1,0, 1,1], [1,0,0, 1,0,0, 1,0,0]);
  
// Left
        drawTriangle3DUVNormal([0,0,0, 0,0,1, 0,1,1],[1,0, 0,0, 0,1], [-1,0,0, -1,0,0, -1,0,0]);
        drawTriangle3DUVNormal([0,0,0, 0,1,0, 0,1,1],[1,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0]);
  
// Bottom
        drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0],[0,1, 1,0, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
        drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1],[0,1, 0,0, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);
  
// Back
        drawTriangle3DUVNormal([1,0,1, 0,0,1, 0,1,1],[0,0, 1,0, 1,1], [0,0,1, 0,0,1, 0,0,1]);
        drawTriangle3DUVNormal([1,0,1, 1,1,1, 0,1,1],[0,1, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    }
  
    renderFast() {
      var rgba = this.color;

     gl.uniform1i(u_whichTexture, this.textureNum);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      var allverts = [];
      // Front 
      allverts = allverts.concat([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0 ]);
      allverts = allverts.concat([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0 ]);
      // Back
      allverts = allverts.concat([0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0 ]);
      allverts = allverts.concat([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0 ]);
      // Top
      allverts = allverts.concat([0.0,1.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0 ]);
      allverts = allverts.concat([0.0,1.0,1.0, 0.0,1.0,0.0, 1.0,1.0,1.0 ]);
      // Bottom
      allverts = allverts.concat([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0 ]);
      allverts = allverts.concat([1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0 ]);
      // Left
      allverts = allverts.concat([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0 ]);
      allverts = allverts.concat([0.0,1.0,1.0, 0.0,0.0,0.0, 0.0,0.0,1.0 ]);
      // Right
      allverts = allverts.concat([1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0 ]);
      allverts = allverts.concat([1.0,1.0,1.0, 1.0,0.0,0.0, 1.0,0.0,1.0 ]);

      drawTriangle3D(allverts);
   
    }
    
    renderfaster(){
      var rgba = this.color;                                   
      
      // Pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);
      // Pass the color of point to u_FragColor
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);  
      // Pass the matrix to u_ModelMatrix attribute 
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      
      drawTriangle3DUV(this.vertices, this.UVVertices);
    }

  }
  
  