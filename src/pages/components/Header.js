// Header.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const whitelistPaths = ['/', '/login', '/signup'];

    if (whitelistPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <div className="rpg-header-container">
            <header className="rpg-header">
                <div className="logo">
                    <img src="/path/to/logo.png" alt="Logo" />
                </div>
                <nav className="navbar">
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Game</a></li>
                        <li><a href="#">Forum</a></li>
                        <li><a href="#">Shop</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </nav>
                <div className="user-info">
                    <button onClick={logout} className="logout-btn">로그아웃</button>
                </div>
            </header>
        </div>
    );
};

export default Header;
