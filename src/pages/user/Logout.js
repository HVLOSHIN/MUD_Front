import React from 'react';
import {useNavigate} from 'react-router-dom';

import './Home.css';

const Logout = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="gate-container">
            <h1 className="gate-title">장시간 활동하지 않아 로그아웃 되었습니다.</h1>
            <div className="gate-button-container">
            <button onClick={goHome} className="gate-button">
                홈
            </button>
            </div>
        </div>
    );
};

export default Logout;
