class Figure {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    getX1() {
        return this.x + this.width;
    }
    getY1() {
        return this.y + this.height;
    }
}

export default Figure;
