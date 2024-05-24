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

    subtract(V2) {
        return new Vector(this.x - V2.x, this.y - V2.y, this.z - V2.z);
    }

    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar, this.z / scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }


    cross(V2) {
        const x = this.y * V2.z - this.z * V2.y;
        const y = this.z * V2.x - this.x * V2.z;
        const z = this.x * V2.y - this.y * V2.x;
        return new Vector(x, y, z);
    }

}