import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';

// AuthContext 생성
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tokenPair, setTokenPair] = useState(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        return { accessToken, refreshToken };
    });
    const [isLoggedOut, setIsLoggedOut] = useState(false); // 로그아웃 상태

    const updateTokens = (accessToken, refreshToken) => {
        setTokenPair({ accessToken, refreshToken });
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setIsLoggedOut(false);
    };

    const clearTokens = () => {
        setTokenPair({ accessToken: null, refreshToken: null });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedOut(true); // 로그아웃 상태로 변경
    };

    const whitelistPaths = ['/', '/login', '/signup'];

    useEffect(() => {
        if (!tokenPair.accessToken && !whitelistPaths.includes(location.pathname)) {
            navigate('/'); // 로그인하지 않은 상태로 화이트리스트 외 경로에 접근 시 홈으로 리다이렉트
        }
    }, [tokenPair.accessToken, location.pathname, navigate]);

    // Axios 인스턴스 설정
    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080",
        headers: { "Content-Type": "application/json" },
    });

    // 요청 인터셉터 설정
    axiosInstance.interceptors.request.use(
        (config) => {
            if (tokenPair.accessToken) {
                config.headers["Authorization"] = `Bearer ${tokenPair.accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 응답 인터셉터 설정
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // 401 에러 처리
            if (error.response?.status === 401 && tokenPair.refreshToken && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const { data } = await axiosInstance.post("/api/user/refresh", {
                        refresh_token: tokenPair.refreshToken
                    });
                    const newAccessToken = data.access_token;

                    // 새 토큰 업데이트
                    updateTokens(newAccessToken, tokenPair.refreshToken);
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.error("리프레시 토큰 만료:", err);
                    logout(); // 로그아웃 처리
                }
            }
            return Promise.reject(error);
        }
    );

    // 로그인 함수
    const login = async (loginId, password, rememberMe, ip) => {
        try {
            const { data } = await axiosInstance.post("/api/user/login", { ip, loginId, password });
            updateTokens(data.access_token, data.refresh_token);
            Cookies.set('userId', data.userId, { expires: 7 });
        } catch (error) {
            console.error("로그인 실패:", error);
            throw error;
        }
    };

    // 로그아웃 함수
    const logout = () => {
        clearTokens();
        delete axiosInstance.defaults.headers.common["Authorization"];
        Cookies.remove('userId');
        navigate("/");
    };

    // 자동 로그아웃 기능
    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                alert("장시간 활동하지 않아 접속을 종료합니다.")
                logout();
            }, 20 * 60 * 1000); // 20분
        };

        // 사용자의 활동 감지
        const handleActivity = () => {
            if (!isLoggedOut) { // 로그아웃 상태가 아닐 때만 타이머 리셋
                resetTimer();
            }
        };

        window.addEventListener('click', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('mousemove', handleActivity);

        // 컴포넌트 언마운트 시 클린업
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('mousemove', handleActivity);
        };
    }, [isLoggedOut]);

    return (
        <AuthContext.Provider value={{ tokenPair, login, logout, axiosInstance }}>
            {children}
        </AuthContext.Provider>
    );
};
