import './mainMenu.css';
import ReactDOM from 'react-dom';
import GameSection from '../gameSection/gameSection';

function MainMenu() {
    const startGame = () => {
        ReactDOM.render(
            <GameSection></GameSection>,
            document.getElementById('root')
        );
    };
    return (
        <div className='mainMenuContainer'>
            <label htmlFor=''>
                Enter you're name:
                <input className='nameInput' type='text' />
            </label>
            <button className='playButton' onClick={startGame}>
                Start Game
            </button>
        </div>
    );
}

export default MainMenu;
