// const img =  require('../../assets/battle-city-tank.jpg');

class GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    // skin: string;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // this.skin = img;
    }
    getX1() {
        return this.x + this.width - 1;
    }
    getY1() {
        return this.y + this.height - 1;
    }
}

export default GameObject;
