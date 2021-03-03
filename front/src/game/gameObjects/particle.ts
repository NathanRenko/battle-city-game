import GameObject from '../gameClasses/gameObject';

class Particle extends GameObject {
    animationStep = ['./assets/hit1.png', './assets/hit2.png', './assets/hit3.png'];
    width = 32;
    height = 32;
    skin = this.animationStep[0];
    timeCreation = 0;
    animationOver = false;
    constructor(x: number, y: number) {
        super(x, y);
    }
    changeStep(dt: number) {
        this.timeCreation += dt * 9;
        if (this.timeCreation > 2) {
            this.animationOver = true;
        } else {
            this.skin = this.animationStep[Math.round(this.timeCreation)];
        }
    }
}

export default Particle;
