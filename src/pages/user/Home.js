import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext"; // AuthContext 가져오기
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { tokenPair} = useAuth();

    useEffect(() => {
        if (tokenPair.accessToken) {
            navigate('/dashboard');
        }
    }, [tokenPair.accessToken, navigate]);


    const handleLogin = () => {
        navigate('/login'); // 로그인 페이지로 이동
    };

    const handleSignUp = () => {
        navigate('/signup'); // 회원가입 페이지로 이동
    };

    return (
        <div className="gate-container">
            <h1 className="gate-title">환영합니다!</h1>
            <p className="gate-text">로그인하거나 회원가입하세요.</p>
            <div className="gate-button-container">
                <button onClick={handleSignUp} className="gate-button">
                    회원가입
                </button>
                <button onClick={handleLogin} className="gate-button">
                    로그인
                </button>
            </div>
        </div>
    );
};

export default Home;
