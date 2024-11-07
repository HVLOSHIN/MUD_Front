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
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
    const [isLoggedOut, setIsLoggedOut] = useState(false); // 로그아웃 상태
    const whitelistPaths = ['/', '/login', '/signup', '/logout'];

    const updateTokens = (newAccessToken, newRefreshToken) => {
        if (newAccessToken) {
            setAccessToken(newAccessToken);
            localStorage.setItem("accessToken", newAccessToken);
        }
        if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
            localStorage.setItem("refreshToken", newRefreshToken);
        }
        setIsLoggedOut(false);
    };

    const clearTokens = () => {
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedOut(true);
    };


    useEffect(() => {
        if (!accessToken && !whitelistPaths.includes(location.pathname)) {
            navigate('/');
        }
    }, [accessToken, location.pathname, navigate]);

    // Axios 인스턴스 설정
    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080",
        headers: { "Content-Type": "application/json" },
    });

    // 요청 인터셉터 설정
    axiosInstance.interceptors.request.use(
        (config) => {
            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
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
            if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const { data } = await axiosInstance.post("/api/user/refresh", {
                        refresh_token: refreshToken,
                        access_token: accessToken,
                        userId: null
                    });
                    const newAccessToken = data.access_token;
                    updateTokens(newAccessToken, refreshToken);
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.error("리프레시 토큰 만료:", err);
                    logout();
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
                clearTokens();
                delete axiosInstance.defaults.headers.common["Authorization"];
                Cookies.remove('userId');
                navigate("/logout");
            }, 10*60*1000); // 10분
        };

        // 사용자의 활동 감지
        const handleActivity = () => {
            if (!isLoggedOut) { // 로그아웃 상태가 아닐 때만 타이머 리셋
                resetTimer();
            }
        };

        window.addEventListener('click', handleActivity);
        window.addEventListener('keydown', handleActivity);
        //window.addEventListener('mousemove', handleActivity);

        // 컴포넌트 언마운트 시 클린업
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            //window.removeEventListener('mousemove', handleActivity);
        };
    }, [isLoggedOut]);

    return (
        <AuthContext.Provider value={{ accessToken, login, logout, axiosInstance, whitelistPaths , location }}>
            {children}
        </AuthContext.Provider>
    );
};
