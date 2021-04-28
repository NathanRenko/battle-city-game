import Store from '../../game/gameEngine/store';
import './gameInfo.css';

function GameInfo() {
    if (Store.isSinglePlayer) {
        return (
            <div className={'infoContainer'}>
                <label>Осталось возрождений:</label>
                <span className='infoPanel' id={'respawnCount'}></span>
                <label>Осталось врагов:</label>
                <span className='infoPanel' id={'enemyCount'}></span>
            </div>
        );
    } else {
        return (
            <div className={'infoContainer'}>
                <label>Осталось возрождений:</label>
                <span className='infoPanel' id={'respawnCount'}></span>
                <label>Возрождений у оппонента:</label>
                <span className='infoPanel' id={'opponentRespawnCount'}></span>
                <label>Имя оппонента:</label>
                <span className='infoPanel' id={'opponentName'}></span>
            </div>
        );
    }
}

export default GameInfo;
