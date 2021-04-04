import React from 'react';
import ReactDOM from 'react-dom';
import MainMenu from '../../components/mainMenu/mainMenu';
import SwitchToMainMenu from '../../components/mainMenu/StateSwitcher';

const backToMainMenu = (message: string) => {
    ReactDOM.render(<SwitchToMainMenu message={message} />, document.getElementById('root'));
};

export default backToMainMenu;
