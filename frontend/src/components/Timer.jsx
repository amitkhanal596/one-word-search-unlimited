import React, { useState, useEffect, useRef } from "react";

function Timer({ start, endGame, onPause, pausedTime}) {
    const [seconds, setSeconds] = useState(pausedTime || 0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (start && !endGame) {  // ✅ Start only when `start` is true
            intervalRef.current = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        }

        return () => clearInterval(intervalRef.current);
    }, [start]);

    useEffect(() => {
        if (endGame) {
            clearInterval(intervalRef.current);
            onPause(seconds);
        }
    }, [endGame, onPause, seconds]);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return (
        <>
            <h4>Timer: {formattedMinutes}:{formattedSeconds}</h4>
        </>
    );
}

export default Timer;
