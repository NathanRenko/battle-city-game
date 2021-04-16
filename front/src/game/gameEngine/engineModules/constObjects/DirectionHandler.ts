import Point from '../../../gameClasses/Point';

enum entityDirections {
    Up = 'up',
    Right = 'right',
    Down = 'down',
    Left = 'left',
}

enum directionKeys {
    ArrowDown = 'ArrowDown',
    ArrowUp = 'ArrowUp',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
}

const directionToAngle: { [index: string]: number } = {
    [entityDirections.Down]: 180,
    [entityDirections.Up]: 0,
    [entityDirections.Left]: 270,
    [entityDirections.Right]: 90,
};

const buttonsToDirections: { [index: string]: entityDirections } = {
    ArrowDown: entityDirections.Down,
    ArrowUp: entityDirections.Up,
    ArrowLeft: entityDirections.Left,
    ArrowRight: entityDirections.Right,
};

function getShift(button: string, playerSpeed: number, dt: number) {
    const shift = Math.round(playerSpeed * dt * 10);
    let moves = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
    const movement: { [index: string]: Point } = {
        ArrowDown: new Point(0, shift),
        ArrowUp: new Point(0, -shift),
        ArrowLeft: new Point(-shift, 0),
        ArrowRight: new Point(shift, 0),
    };
    return movement[button];
}

export { entityDirections, directionToAngle, buttonsToDirections };
