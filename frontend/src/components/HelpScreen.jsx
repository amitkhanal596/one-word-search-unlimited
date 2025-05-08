import React from 'react';
import "../styles/HelpScreen.css";

function HelpScreen( {onClose} ){

    return (
        <div className='help-screen-container'>
            <div className='help-box'>
                <h1>How to Play</h1>
                <br></br>
                <img src="/HowToPlay.png" width={256}/>
                <br></br>
                <br></br>
                <p>There is one 5 letter word on the screen. <br></br>
                    Find the 5 letter word by selecting the tiles in the order of the word.<br></br>
                    The word may be horizontal, vertical, or diagonal.
                </p>
                <br></br>
                <button className='start-button' onClick={onClose}>Start Playing</button>
            </div>
        </div>
    );
}

export default HelpScreen;