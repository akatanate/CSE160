// very basic vector lib 
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(V2) {
        return new Vector(this.x + V2.x, this.y + V2.y, this.z + V2.z);
    }

    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar, this.z / scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

}