import './gameField.css';
import React, { useState, useEffect } from 'react';
import GameEngine from '../../game/gameEngine/gameEngine';

function GameField() {
    let engine: GameEngine;
    useEffect(() => {
        engine = new GameEngine();
        engine.start();
    }, []);
    return <canvas width='600' height='400' className='gameField'></canvas>;
}

export default GameField;
