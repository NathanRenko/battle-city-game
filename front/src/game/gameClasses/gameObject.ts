class GameObject {
    x: number;
    y: number;
    size!: number;
    skin!: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getX1() {
        return this.x + this.size - 1;
    }

    getY1() {
        return this.y + this.size - 1;
    }
}

export default GameObject;
