import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import {useAuth} from '../../context/AuthContext';
import axios from 'axios'; // axios 임포트
import './Home.css';

const Login = () => {
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const { tokenPair, login } = useAuth();

    // 쿠키에서 저장된 로그인 정보 불러오기
    useEffect(() => {
        const savedLoginId = Cookies.get('loginId');
        const savedPassword = Cookies.get('password');
        const savedRememberMe = Cookies.get('rememberMe') === 'true';

        if (savedRememberMe) {
            setLoginId(savedLoginId || '');
            setPassword(savedPassword || '');
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        if (tokenPair.accessToken) {
            navigate('/dashboard');
        }
    }, [tokenPair.accessToken, navigate]);

    // 사용자 IP 주소 가져오기
    const getUserIp = async () => {
        try {
            const response = await axios.get('https://geolocation-db.com/json/');
            return response.data.IPv4;
        } catch (error) {
            console.error('IP 주소를 가져오는 데 실패했습니다:', error);
            throw error;  // 오류를 발생시켜 호출한 곳에서 처리할 수 있도록 함
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const ip = await getUserIp();

        try {
            await login(loginId, password, rememberMe, ip);
            if (rememberMe) {
                Cookies.set('loginId', loginId, { expires: 7 });
                Cookies.set('password', password, { expires: 7 });
                Cookies.set('rememberMe', true, { expires: 7 });
            } else {
                Cookies.remove('loginId');
                Cookies.remove('password');
                Cookies.remove('rememberMe');
            }
            navigate('/'); // 로그인 성공 후 홈으로 이동
        } catch (error) {
            console.error('로그인 실패:', error);
            setError('로그인에 실패했습니다. 다시 시도해주세요.');
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

                <div className="login-form-group">
                    <label className="login-remember-label">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        remember me
                    </label>
                </div>

                <button type="submit" className="login-button">로그인</button>
            </form>
            <button type="button" onClick={handleBack} className="login-button">뒤로가기</button>
        </div>
    );
};

export default Login;
