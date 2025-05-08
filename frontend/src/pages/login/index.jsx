import { useEffect, useState } from "react";
import supabase from "../../helper/supabaseClient.js";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";

function Login() {
    const [user, setUser] = useState(null);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin + "/login",
            },
        });

        if (error) {
            console.error("Google login error:", error.message);
        }
    };

    useEffect(() => {
        const checkSessionAfterRedirect = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const currentUser = session.user;
                setUser(currentUser);

                const { data: profile, error } = await supabase
                    .from("profiles")
                    .select("username")
                    .eq("id", currentUser.id)
                    .maybeSingle();

                if (error) {
                    console.error("Error checking profile:", error.message);
                    return;
                }
                console.log("Fetched profile:", profile);

                if (!profile || !profile.username) {
                    setShowUsernameModal(true); 
                } else {
                    navigate("/");
                }
            }
        };
        checkSessionAfterRedirect();
    }, [navigate]);

    // 3. Submit new username to Supabase
    const handleUsernameSubmit = async () => {
        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .upsert([{ id: user.id, username }]);

        if (error) {
            setError("Username might be taken. Try another.");
        } else {
            setShowUsernameModal(false);
            navigate("/"); // ✅ Redirect after submitting username
        }
    };

    return (
        <div>
            <h1>Welcome!</h1>
            <button onClick={handleGoogleLogin}>Sign in with Google</button>

            {/* Username Modal */}
            {showUsernameModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create your username</h2>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button onClick={handleUsernameSubmit}>Submit</button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
