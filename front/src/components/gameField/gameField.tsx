import "./gameField.css";
import { useEffect } from "react";
import GameEngine from "../../game/gameEngine/gameEngine";

function GameField() {
  let engine: GameEngine;
  useEffect(() => {
    engine = new GameEngine();
    engine.start();
  }, []);
  return <canvas width="1000" height="600" className="gameField"></canvas>;
}

export default GameField;
