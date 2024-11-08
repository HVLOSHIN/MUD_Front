// Header.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const whitelistPaths = ['/', '/login', '/signup', '/logout'];
    const navigate = useNavigate();

    if (whitelistPaths.includes(location.pathname)) {
        return null;
    }

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <div className="rpg-header-container">
            <header className="rpg-header">
                <div className="navbar">
                    <ul>
                        <li>
                            <button onClick={() => navigateTo('/dashboard')} className={location.pathname === '/dashboard' ? 'active' : ''}>
                                MUD
                            </button>
                        </li>
                    </ul>
                </div>
                <nav className="navbar">
                    <ul>
                        <li>
                            <button onClick={() => navigateTo('/stats')} className={location.pathname === '/stats' ? 'active' : ''}>
                                상세
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigateTo('/training')} className={location.pathname === '/training' ? 'active' : ''}>
                                훈련
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigateTo('/mastery')} className={location.pathname === '/mastery' ? 'active' : ''}>
                                능력
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigateTo('/equipment')} className={location.pathname === '/equipment' ? 'active' : ''}>
                                장비
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigateTo('/field')} className={location.pathname.startsWith('/field') ? 'active' : ''}>
                                전투
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigateTo('/village')} className={location.pathname === '/village' ? 'active' : ''}>
                                마을
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigateTo('/achievements')} className={location.pathname === '/achievements' ? 'active' : ''}>
                                업적
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigateTo('/settings')} className={location.pathname === '/settings' ? 'active' : ''}>
                                설정
                            </button>
                        </li>
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
