import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// AuthContext 생성
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [tokenPair, setTokenPair] = useState(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        return { accessToken, refreshToken };
    });

    const updateTokens = (accessToken, refreshToken) => {
        setTokenPair({ accessToken, refreshToken });
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    };

    const clearTokens = () => {
        setTokenPair({ accessToken: null, refreshToken: null });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    // Axios 인스턴스 설정 및 토큰 추가
    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080",
        headers: { "Content-Type": "application/json" },
    });

    // 요청 인터셉터 설정: 인증 토큰 추가
    axiosInstance.interceptors.request.use(
        (config) => {
            if (tokenPair.accessToken) {
                config.headers["Authorization"] = `Bearer ${tokenPair.accessToken}`;
                console.log("Access Token:", tokenPair.accessToken); // 디버깅용 로그
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 응답 인터셉터 설정: 토큰 갱신
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
                    return axiosInstance(originalRequest); // 새로운 요청 보내기
                } catch (err) {
                    console.error("리프레시 토큰 만료:", err);
                    logout(); // 로그아웃 처리
                }
            }
            return Promise.reject(error); // 다른 에러는 그대로 전달
        }
    );

    // 로그인 함수
    const login = async (loginId, password) => {
        try {
            const { data } = await axiosInstance.post("/api/user/login", { loginId, password });
            updateTokens(data.access_token, data.refresh_token);
        } catch (error) {
            console.error("로그인 실패:", error);
            throw error; // 에러를 상위로 던져서 처리 가능하게 함
        }
    };

    // 로그아웃 함수
    const logout = () => {
        clearTokens();
        delete axiosInstance.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ tokenPair, login, logout, axiosInstance }}>
            {children}
        </AuthContext.Provider>
    );
};
