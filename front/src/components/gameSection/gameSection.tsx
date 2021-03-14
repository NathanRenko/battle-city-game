import GameField from "../gameField/gameField";
import GameInfo from "../gameInfo/gameInfo";
import './gameSection.css';

function GameSection() {
    return (<div className={'gameSectionContainer'}>
        <GameInfo></GameInfo>
        <GameField></GameField>
    </div>)
}

export default GameSection