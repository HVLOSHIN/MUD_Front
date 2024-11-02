import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext";
import './Home.css';

const SignUp = () => {
    const {axiosInstance } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const isLoginIdValid = loginId.length >= 4 && loginId.length <= 12;
    const isUsernameValid = username.length >= 2 && username.length <= 12;
    const isPasswordValid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=-]).{8,16}$/; // 비밀번호 조건
    const doPasswordsMatch = password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.post('/api/user/signup', {
                loginId,
                username,
                password,
                confirmPassword,
            });
            navigate('/');
        } catch (error) {
            if(error.response.data.code === 'USER-02'){
                setError(error.response.data.message);
            }
            else if (error.response.data.code === 'USER-03'){
                setError(error.response.data.message);
            }
            else {
                setError('회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="gate-container">
            <h1 className="login-title">회원가입</h1>
            {error && <p className="login-error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="login-form-group">
                    <label htmlFor="loginId" className="login-label">아이디:</label>
                    <input
                        type="text"
                        id="loginId"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className={`login-input ${!isLoginIdValid && error ? 'invalid' : ''}`} // 유효성에 따라 클래스 추가
                    />
                    {loginId && ( // 입력값이 있을 때만 유효성 메시지 표시
                        <p style={{color: isLoginIdValid ? 'green' : 'red'}}>
                            {isLoginIdValid ? '유효한 아이디입니다.' : '아이디 형식이 올바르지 않습니다.'}
                        </p>
                    )}
                </div>

                <div className="login-form-group">
                    <label htmlFor="username" className="login-label">닉네임:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`login-input ${!isUsernameValid && error ? 'invalid' : ''}`} // 유효성에 따라 클래스 추가
                    />
                    {username && ( // 입력값이 있을 때만 유효성 메시지 표시
                        <p style={{color: isUsernameValid ? 'green' : 'red'}}>
                            {isUsernameValid ? '유효한 닉네임입니다.' : '2~12자 사이의 닉네임을 입력해주세요.'}
                        </p>
                    )}
                </div>

                <div className="login-form-group">
                    <label htmlFor="password" className="login-label">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`login-input ${!isPasswordValid.test(password) && error ? 'invalid' : ''}`} // 유효성에 따라 클래스 추가
                    />
                    {password && ( // 입력값이 있을 때만 유효성 메시지 표시
                        <p style={{color: isPasswordValid.test(password) ? 'green' : 'red'}}>
                            {isPasswordValid.test(password) ? '유효한 비밀번호입니다.' : '비밀번호는 최소 8~16자, 대문자, 소문자, 숫자 및 특수 문자를 포함해야 합니다.'}
                        </p>
                    )}
                </div>

                <div className="login-form-group">
                    <label htmlFor="confirmPassword" className="login-label">비밀번호 확인:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`login-input ${!doPasswordsMatch && error ? 'invalid' : ''}`} // 유효성에 따라 클래스 추가
                    />
                    {confirmPassword && ( // 입력값이 있을 때만 유효성 메시지 표시
                        <p style={{color: doPasswordsMatch ? 'green' : 'red'}}>
                            {doPasswordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                        </p>
                    )}
                </div>

                <button type="submit" className="login-button">회원가입</button>

            </form>
            <button type="button" onClick={handleBack} className="login-button">뒤로가기</button>
        </div>
    );
};

export default SignUp;
