import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../helper/supabaseClient';
import '../styles/EndGameScreen.css';

function EndGameScreen({ endGame, time, puzzleId }) {
    const [saved, setSaved] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const hasSavedRef = useRef(false); // Prevents multiple inserts

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    const handleReload = () => {
        window.location.reload();
    };

    const calculateStars = (seconds) => {
        if (seconds < 60) return 5;
        if (seconds < 120) return 4;
        if (seconds < 180) return 3;
        if (seconds < 240) return 2;
        return 1;
    };

    useEffect(() => {
        const checkLoginAndSave = async () => {
            console.log("🔁 useEffect triggered:", { endGame, puzzleId, time });

            // Guard: skip if already saved, not ended, or no puzzle ID
            if (hasSavedRef.current || !endGame || puzzleId == null || time === 0) {
                console.log("⏩ Save skipped:", {
                    alreadySaved: hasSavedRef.current,
                    endGame,
                    puzzleId,
                    time
                });
                return;
            }
            
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error("❌ Error getting session:", sessionError.message);
                return;
            }

            const user = session?.user;
            if (!user) {
                console.warn("⚠ No user found, skipping save.");
                return;
            }

            setLoggedIn(true);
            hasSavedRef.current = true; // ✅ Prevent future inserts

            const stars = calculateStars(time);

            console.log("💾 Saving puzzle result:", {
                user_id: user.id,
                puzzle_id: puzzleId,
                time_taken: time,
                stars
            });

            const { error } = await supabase
                .from("puzzle_results")
                .insert([{
                    user_id: user.id,
                    puzzle_id: puzzleId,
                    time_taken: time,
                    stars
                }]);

            if (error) {
                console.error("❌ Failed to save:", error.message);
            } else {
                console.log("✅ Puzzle result saved.");
                setSaved(true);
            }
        };

        checkLoginAndSave();
    }, [endGame, puzzleId, time]);

    return endGame ? (
        <div className="endgamescreen">
            <div className="endgamescreen-inner">
                <h1 className="endgame-header">Well Done!</h1>
                <p className='finished-message'>
                    You finished in {formattedMinutes}:{formattedSeconds} minutes
                </p>
                <button className="play-again" onClick={handleReload}>
                    Play Again
                </button>

                {!loggedIn && (
                    <p className='signup'>
                        <Link to="/login" className='signup-word'>Sign up</Link>&nbsp;
                        to track your progress
                    </p>
                )}
            </div>
        </div>
    ) : null;
}

export default EndGameScreen;
