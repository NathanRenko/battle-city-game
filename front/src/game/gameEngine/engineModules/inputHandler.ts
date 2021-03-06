class InputHandler {
    keys: { ArrowUp: boolean; ArrowDown: boolean; ArrowLeft: boolean; ArrowRight: boolean; ' ': boolean };
    constructor() {
        this.keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, ' ': false };
        document.addEventListener('keydown', (e) => this.setKey(e, true));
        document.addEventListener('keyup', (e) => this.setKey(e, false));
    }
    setKey(event: KeyboardEvent, status: boolean) {
        let key = event.key;
        console.log(key);
        if (key in this.keys) {
            //@ts-ignore
            this.keys[key] = status;
        }
    }
    isDown(key: string): boolean {
        //@ts-ignore
        return this.keys[key];
    }
}

export default InputHandler;
