const entityDirections = {
    Up: 'up',
    Right: 'right',
    Down: 'down',
    Left: 'left',
};

const directionToAngle: { [index: string]: number } = {
    [entityDirections.Down]: 180,
    [entityDirections.Up]: 0,
    [entityDirections.Left]: 270,
    [entityDirections.Right]: 90,
};

const buttonsToDirections: { [index: string]: string } = {
    ArrowDown: entityDirections.Down,
    ArrowUp: entityDirections.Up,
    ArrowLeft: entityDirections.Left,
    ArrowRight: entityDirections.Right,
};

export { entityDirections, directionToAngle, buttonsToDirections };
