import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../helper/supabaseClient";

function Statistics() {
    const [user, setUser] = useState(null);
    const [puzzleResults, setPuzzleResults] = useState([]);
    const [starCounts, setStarCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserAndResults = async () => {
            const { data: { user }, error: sessionError } = await supabase.auth.getUser();
            if (sessionError) {
                console.error("❌ Failed to get user:", sessionError.message);
                setLoading(false);
                return;
            }

            if (!user) {
                console.warn("⚠ No user logged in.");
                setLoading(false);
                return;
            }

            setUser(user);
            console.log("👤 Logged in as:", user.id);

            const { data: results, error } = await supabase
                .from("puzzle_results")
                .select("puzzle_id, time_taken, stars")
                .eq("user_id", user.id)
                .order("puzzle_id", { ascending: true });

            if (error) {
                console.error("❌ Failed to fetch results:", error.message);
                setLoading(false);
                return;
            }

            console.log("📦 Results fetched from Supabase:", results);
            setPuzzleResults(results);

            // Count stars
            const starSummary = {
                "5 stars": 0,
                "4 stars": 0,
                "3 stars": 0,
                "2 stars": 0,
                "1 star": 0,
            };

            results.forEach(({ stars }) => {
                const label = stars === 1 ? "1 star" : `${stars} stars`;
                starSummary[label] = (starSummary[label] || 0) + 1;
            });

            setStarCounts(starSummary);
            setLoading(false);
        };

        getUserAndResults();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>You’re not logged in.</h2>
                <Link to="/login">Login</Link> | <Link to="/">Home</Link>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
                <Link to="/">← Home</Link>
            </div>

            <h2>Your Puzzle Attempts</h2>
            {puzzleResults.length === 0 ? (
                <p>No puzzle attempts yet.</p>
            ) : (
                <ul>
                    {puzzleResults.map((result, index) => (
                        <li key={index}>
                            Puzzle {result.puzzle_id}: {result.time_taken} seconds
                        </li>
                    ))}
                </ul>
            )}

            <h2>Your Stars Summary</h2>
            <ul>
                {Object.entries(starCounts).map(([label, count]) => (
                    <li key={label}>
                        {label}: {count}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Statistics;
