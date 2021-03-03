// const img =  require('../../assets/battle-city-tank.jpg');

class GameObject {
    x: number;
    y: number;
    width!: number;
    height!: number;
    skin!: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    getX1() {
        return this.x + this.width - 1;
    }
    getY1() {
        return this.y + this.height - 1;
    }
}

export default GameObject;
