import GameField from '../gameField/gameField';
import GameInfo from '../gameInfo/gameInfo';
import Modal from 'react-modal';
import React from 'react';
import './gameSection.css';
import Store from '../../game/gameEngine/store';
import ReactDOM from 'react-dom';
import MainMenu from '../mainMenu/mainMenu';

Modal.setAppElement('#root');
function GameSection() {
    let subtitle = 1;
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            backgroundColor: '#393636',
        },
    };
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [gameResult, setGameResult] = React.useState('');
    function openModal(message: string) {
        setGameResult(message);
        setIsOpen(true);
    }
    Store.openModal = openModal;
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }
    const backToMainMenu = () => {
        ReactDOM.render(<MainMenu></MainMenu>, document.getElementById('root'));
    };
    function closeModal() {
        setIsOpen(false);
    }
    return (
        <div className={'gameSectionContainer'}>
            <div className={'modalContainer'}>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    contentLabel='Example Modal'
                    style={customStyles}
                >
                    <div className={'flexContainer'}>
                        <p className={'gameResult'}>{gameResult}</p>
                        <button className='playButton' onClick={backToMainMenu}>
                            Главное меню
                        </button>
                    </div>
                </Modal>
            </div>

            <GameInfo></GameInfo>
            <GameField></GameField>
        </div>
    );
}

export default GameSection;
