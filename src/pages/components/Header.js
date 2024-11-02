// Header.js
import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../context/AuthContext';


const Header = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const whitelistPaths = ['/', '/login', '/signup'];
    const navigate = useNavigate();

    if (whitelistPaths.includes(location.pathname)) {
        return null;
    }

    function goDashboard() {
        navigate('/dashboard');
    }

    function goStats() {
        navigate('/stats');
    }

    return (
        <div className="rpg-header-container">
            <header className="rpg-header">
                <div className="navbar">
                    <ul>
                        <li>
                            <button onClick={goDashboard}>홈</button>
                        </li>
                    </ul>
                </div>
                <nav className="navbar">
                <ul>

                        <li><button onClick={goStats}>상세</button></li>
                        <li><button onClick={goStats}>훈련</button></li>
                        <li><button onClick={goStats}>능력</button></li>
                        <li><button onClick={goStats}>장비</button></li>
                        <li><button onClick={goStats}>전투</button></li>
                        <li><button onClick={goStats}>마을</button></li>
                        <li><button onClick={goStats}>업적</button></li>
                        <li><button onClick={goStats}>설정</button></li>

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
