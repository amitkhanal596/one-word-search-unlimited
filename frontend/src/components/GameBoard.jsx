import { useState, useEffect } from 'react';
import Tile from "./Tile";
import "../styles/GameBoard.css";

function GameBoard({ boardData, wordData, onCorrectWord, onIncorrectWord }) {
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [currentBoard, setCurrentBoard] = useState([...boardData]);
    const [currentWord, setCurrentWord] = useState("");
    const [currentWordArray, setCurrentWordArray] = useState([...wordData]);
    const [wordToRemove, setWordToRemove] = useState(null);

    const handleTileClick = (rowIndex, colIndex, letter) => {
        const tileKey = `${colIndex}-${rowIndex} ${letter}`;

        setSelectedTiles((prevSelected) => {
            if (prevSelected.includes(tileKey)) {
                return prevSelected.filter((key) => key !== tileKey);
            }
            const newSelected = [...prevSelected, tileKey];
            updateCurrentWord(newSelected);
            return newSelected;
        });
    };

    const updateCurrentWord = (selectedTiles) => {
        const newWord = selectedTiles.map(item => item[item.length - 1]).join('');
        setCurrentWord(newWord);
        if (newWord.length === 5) {
            checkAndRemoveWord(newWord, selectedTiles);
            setCurrentWord("");
            setSelectedTiles([]);
        } 
    };

    const areTilesAligned = (tiles) => {
        const coords = tiles.map(tile => {
            const [colRow] = tile.split(" "); // e.g., "2-3"
            const [col, row] = colRow.split("-").map(Number);
            return { col, row };
        });
    
        const dCol = coords[1].col - coords[0].col;
        const dRow = coords[1].row - coords[0].row;
    
        // All steps should follow the same delta direction
        for (let i = 1; i < coords.length; i++) {
            const currDCol = coords[i].col - coords[i - 1].col;
            const currDRow = coords[i].row - coords[i - 1].row;
    
            if (currDCol !== dCol || currDRow !== dRow) {
                return false;
            }
        }
    
        return true;
    };
    

    const checkAndRemoveWord = (currentWord, selectedTiles) => {
        const lastWord = currentWordArray[currentWordArray.length - 1];

        if (currentWord === lastWord && areTilesAligned(selectedTiles)) {
            const newBoard = [...currentBoard];

            selectedTiles.forEach((letter) => (
                newBoard[Math.abs(parseInt(letter[0]))][Math.abs(parseInt(letter[2]-4))] = null
            ));

            setCurrentBoard(newBoard.map(col => col.filter(element => element !== null)));

            setWordToRemove(lastWord);
        } else {
            onIncorrectWord();
            setSelectedTiles([]);
        }
    };

    useEffect(() => {
        if (wordToRemove) {
            setCurrentWordArray((prevArray) => prevArray.filter((word) => word !== wordToRemove));
            onCorrectWord();
            setWordToRemove(null);
        }
    }, [wordToRemove, onCorrectWord]);

    return (
        <div className="game-board">
            {currentBoard.map((col, colIndex) => (
                <div key={colIndex} className="column">
                    {col.slice(0, 5).toReversed().map((letter, rowIndex) => (
                        <Tile
                            coordinate={`${colIndex}-${rowIndex}`}
                            key={`${colIndex}-${rowIndex}`}
                            letter={letter} 
                            onClick={() => handleTileClick(rowIndex, colIndex, letter)}
                            isSelected={selectedTiles.includes(`${colIndex}-${rowIndex} ${letter}`)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default GameBoard;
