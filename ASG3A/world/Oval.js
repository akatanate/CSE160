class Oval {
        constructor() {
            this.type = 'oval';
            this.color = [1.0, 1.0, 1.0, 1.0];
            this.matrix = new Matrix4();

            this.segments = 10; 
        }
    
        render() {
            var rgba = this.color;
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
            
            // draw the sides (cirumference)
            for (let i = 0; i < this.segments; i++) {
                let theta1 = (i / this.segments) * 2 * Math.PI;
                let theta2 = ((i + 1) / this.segments) * 2 * Math.PI;
    
                let x1 = 0.5 * Math.cos(theta1);
                let y1 = 0.5 * Math.sin(theta1);
                let x2 = 0.5 * Math.cos(theta2);
                let y2 = 0.5 * Math.sin(theta2);
    
                drawTriangle3D([x1, y1, 0, x2, y2, 0, x1, y1, 1]);
                drawTriangle3D([x2, y2, 0, x2, y2, 1, x1, y1, 1]);
            }

            // draw the front and back (circles to cover top and back of oval)
            for (let i = 0; i < this.segments; i++) {
                let theta1 = (i / this.segments) * 2 * Math.PI;
                let theta2 = ((i + 1) / this.segments) * 2 * Math.PI;
    
                let x1 = 0.5 * Math.cos(theta1);
                let y1 = 0.5 * Math.sin(theta1);
                let x2 = 0.5 * Math.cos(theta2);
                let y2 = 0.5 * Math.sin(theta2);
    
                // Draw bottom and top
                drawTriangle3D([0, 0, 1, x1, y1, 1, x2, y2, 1]);
                drawTriangle3D([0, 0, 0, x2, y2, 0, x1, y1, 0]);
            }
        }
    }
    