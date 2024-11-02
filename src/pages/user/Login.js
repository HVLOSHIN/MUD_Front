import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Login = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // 엑세스 토큰이 존재하면 다른 페이지로 리다이렉트
        if (accessToken) {
            alert("왜 여깄노")
            navigate('/dashboard'); // 대시보드 또는 리다이렉트할 페이지
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(loginId, password); // AuthContext의 login 메서드 호출
            navigate('/'); // 로그인 성공 후 홈으로 이동
        } catch (error) {
            console.error('로그인 실패:', error);
            setError('로그인에 실패했습니다. 다시 시도해주세요.'); // 에러 메시지 설정
        }
    };

    const handleBack = () => {
        navigate(-1);
    };


    return (
        <div className="gate-container">
            <h1 className="login-title">로그인</h1>
            {error && <p className="login-error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="login-form-group">
                    <label htmlFor="loginId" className="login-label">아이디:</label>
                    <input
                        type="text"
                        id="loginId"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>

                <div className="login-form-group">
                    <label htmlFor="password" className="login-label">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>

                <button type="submit" className="login-button">로그인</button>
            </form>
            <button type="button" onClick={handleBack} className="login-button">뒤로가기</button>
        </div>
    );
};

export default Login;
