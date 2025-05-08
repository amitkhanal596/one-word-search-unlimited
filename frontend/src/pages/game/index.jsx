import "../../styles/App.css";
import Header from "../../components/Header.jsx";
import GameBoard from "../../components/GameBoard.jsx";
import Timer from "../../components/Timer.jsx";
import EndGameScreen from "../../components/EndGameScreen.jsx";
import React, { useState, useEffect } from "react";
import HelpScreen from "../../components/HelpScreen.jsx";
import Menu from "../../components/Menu.jsx";

function Game() {
    const generateRandomDate = () => {
        const firstDate = new Date("2024-02-21");
        const today = new Date();
        const firstDateMS = firstDate.getTime();
        const todayMS = today.getTime();
        const difference = (todayMS - firstDateMS) / (24 * 60 * 60 * 1000);
        let pastDays = Math.floor(Math.random() * difference);
        today.setDate(today.getDate() - pastDays);
        return today.toISOString().split("T")[0];
    };

    const [randomDate] = useState(generateRandomDate);
    const [gameData, setGameData] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState("#3b82f6");
    const [isFading, setIsFading] = useState(false);
    const [endGame, setEndGame] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [showHelpScreen, setShowHelpScreen] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/api/puzzle/${randomDate}`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch");
                return response.json();
            })
            .then((data) => {
                setGameData(data);
                setWordCount(data.words.length);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [randomDate]);

    useEffect(() => {
        if (!localStorage.getItem("hasVisited")) {
            setShowHelpScreen(true);
        }
    }, []);

    const toggleHelpScreen = () => {
        setShowHelpScreen((prev) => !prev);
        localStorage.setItem("hasVisited", "true");
    };

    const changeBackground = (color) => {
        setIsFading(false);
        setBackgroundColor(color);
        setTimeout(() => {
            setIsFading(true);
            setBackgroundColor("#3b82f6");
        }, 200);
    };

    const handleCorrectWord = () => {
        if (!gameStarted) setGameStarted(true);
        setWordCount((prevCount) => prevCount - 1);
        changeBackground("#0e9933");

        if (wordCount - 1 === 0) {
            setEndGame(true);
        }
    };

    return (
        <div
            className={`app-container ${isFading ? "fade" : ""}`}
            style={{ backgroundColor }}
        >
            {showHelpScreen && <HelpScreen onClose={toggleHelpScreen} />}
            <Menu className="menu" />
            <button className="help-button" onClick={toggleHelpScreen}>
                ❓
            </button>
            {!showHelpScreen && (
                <>
                    <Header
                        puzzleNumber={
                            gameData ? gameData["number"] : "Loading..."
                        }
                    />

                    {gameData && (
                        <>
                            <GameBoard
                                boardData={gameData["board"]}
                                wordData={gameData["words"]}
                                onCorrectWord={handleCorrectWord}
                                onIncorrectWord={() =>
                                    changeBackground("#990e20")
                                }
                                endGame={() => setEndGame(true)}
                            />
                            {/* Words Remaining Display */}
                            <h3 className="words-remaining">
                                Words Remaining: {wordCount}
                            </h3>
                        </>
                    )}

                    <Timer
                        start={gameStarted}
                        endGame={endGame}
                        onPause={setCurrentTime}
                        pausedTime={currentTime}
                    />

                    {endGame && currentTime !== null && (
                        <EndGameScreen endGame={endGame} time={currentTime} puzzleId={gameData?.number} />
                    )}
                </>
            )}
        </div>
    );
}

export default Game;
