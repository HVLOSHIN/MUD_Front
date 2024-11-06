import React, { createContext, useState, useEffect } from 'react';
import {useAuth} from "./AuthContext";
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { axiosInstance } = useAuth();

    const INTERVAL =  10 * 1000;
    const [currentActionPoints, setCurrentActionPoints] = useState();
    const [maxActionPoints, setMaxActionPoints] = useState();

    useEffect(() => {
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/action-points?userId=${userId}`)
            .then((response) => {
                setCurrentActionPoints(response.data.currentActionPoints);
                setMaxActionPoints(response.data.maxActionPoints);
            })
            .catch((error) => {
                console.error("서버 동기화 실패:", error);
            });
    }, [])

    /// 주기적인 서버 동기화 로직
    useEffect(() => {

            const syncInterval = setInterval(() => {
                if(currentActionPoints === maxActionPoints){
                    clearInterval(syncInterval);
                    return;
                }
                    const userId = Cookies.get('userId');
                    axiosInstance.post(`/api/user/action-points?userId=${userId}`)
                        .then((response) => {
                            setCurrentActionPoints(response.data.currentActionPoints);
                            setMaxActionPoints(response.data.maxActionPoints);
                        })
                        .catch((error) => {
                            console.error("서버 동기화 실패:", error);
                        });
            }, INTERVAL);


            return () => clearInterval(syncInterval); // 언마운트 시 정리

    }, [axiosInstance]);

    return (
        <UserContext.Provider value={{ currentActionPoints }}>
            {children}
        </UserContext.Provider>
    );
};
