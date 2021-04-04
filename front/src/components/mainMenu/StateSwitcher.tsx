import "./mainMenu.css";
import ReactDOM from "react-dom";
import MainMenu from "./mainMenu";
import { ReactPropTypes, useState, useEffect } from "react";
import io from "socket.io-client";
import Store from "../../game/gameEngine/store";

function SwitchToMainMenu(props: any) {
  const backToMainMenu = () => {
    ReactDOM.render(<MainMenu></MainMenu>, document.getElementById("root"));
  };
  return (
    <div className="mainMenuContainer">
      <p>{props.message}</p>
      <button className="playButton" onClick={backToMainMenu}>
        Back to Main Menu
      </button>
    </div>
  );
}

export default SwitchToMainMenu;
