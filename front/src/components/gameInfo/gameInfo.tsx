import './gameInfo.css';

function GameInfo() {
    return (
        <div className={'infoContainer'}>
            <label>ХП вашей базы</label>
            <span className='infoPanel' id={'hp'}></span>
            <label>ХП вражеской базы</label>
            <span className='infoPanel' id={'enemyBaseHp'}></span>
            <label>ХП вашего танка</label>
            <span className='infoPanel' id={'tankHp'}></span>
        </div>
    );
}

export default GameInfo;
