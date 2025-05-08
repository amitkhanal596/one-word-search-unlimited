import React, { useState, useEffect } from 'react';
import "../styles/Menu.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiMiniXMark } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import supabase from '../helper/supabaseClient';

function Menu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    // Track user session
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout error:", error.message);
        else window.location.replace("/");
    };

    return (
        <div>
            {/* Menu toggle button */}
            <button className='menu-toggle' onClick={toggleMenu}>
                <RxHamburgerMenu className='hamburger-icon' />
            </button>

            {/* Sidebar menu */}
            <div className={`sidenav ${menuOpen ? 'active' : ''}`}>
                <div className="sidenav-content">
                    {/* Header */}
                    <div className="menu-header">
                        <p className="menu-title">Menu</p>
                        <HiMiniXMark className='menu-close' onClick={toggleMenu} />
                    </div>
                    <hr className="menu-divider" />

                    {/* Menu links */}
                    <div className="menu-sections">
                        <ul className="menu-list">
                            <li><Link className="menu-link" to="/statistics">Statistics</Link></li>
                            <li><Link className="menu-link" to="/date-select">Date Select</Link></li>
                            <li><Link className="menu-link" to="/settings">Settings</Link></li>
                        </ul>

                        {/* Bottom login/logout toggle */}
                        <div className="bottom-menu">
                            {user ? (
                                <button className="menu-link logout-button" onClick={handleLogout}>
                                    Logout
                                </button>
                            ) : (
                                <Link className="menu-link" to="/login">Login</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Menu;
