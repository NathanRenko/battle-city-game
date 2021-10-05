import React from 'react'
import Modal from 'react-modal'

import { useGameLocalStore } from '../../stores/store'
import GameField from '../gameField/gameField'
import GameInfo from '../gameInfo/gameInfo'
import './gameSection.css'

Modal.setAppElement('#root')
function GameSection() {
    const store = useGameLocalStore()
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
    }
    const [modalIsOpen, setIsOpen] = React.useState(false)
    const [gameResult, setGameResult] = React.useState('')
    store.openModal = (message: string) => {
        setGameResult(message)
        setIsOpen(true)
    }
    const backToMainMenu = () => {
        store.setStage('menu')
    }
    return (
        <div className={'gameSectionContainer'}>
            <div className={'modalContainer'}>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setIsOpen(false)}
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
            <GameInfo/>
            <GameField/>
        </div>
    )
}

export default GameSection
