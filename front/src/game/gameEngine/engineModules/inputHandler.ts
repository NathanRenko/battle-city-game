class InputHandler {
    movementKeys: { ArrowUp: boolean; ArrowDown: boolean; ArrowLeft: boolean; ArrowRight: boolean };
    shootStatus: boolean;
    shootButton = ' ';
    inputs: string[];
    constructor() {
        this.movementKeys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
        this.shootStatus = false;
        this.inputs = [];
        document.addEventListener('keydown', (e) => this.setKey(e, true));
        document.addEventListener('keyup', (e) => this.setKey(e, false));
    }

    private setKey(event: KeyboardEvent, isKeyDown: boolean) {
        const key = event.key;
        if (key in this.movementKeys) {
            if (!this.inputs.includes(key) && isKeyDown) {
                this.inputs.push(key);
            } else if (!isKeyDown) {
                this.inputs.splice(this.inputs.indexOf(key), 1);
            }
        } else if (key === this.shootButton) {
            this.shootStatus = isKeyDown;
        }
    }

    isDown(key: string): boolean {
        if (key === this.shootButton) {
            return this.shootStatus;
        }
        if (key in this.movementKeys) {
            return this.inputs[this.inputs.length - 1] === key;
        }
        return false;
    }
}

export default InputHandler;
