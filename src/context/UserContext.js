import React, {createContext, useState, useEffect} from 'react';
import {useAuth} from "./AuthContext";

export const UserContext = createContext();
export const UserProvider = ({children}) => {
    const {axiosInstance, whitelistPaths, location} = useAuth();
    const INTERVAL = 10 * 1000;
    const [currentActionPoints, setCurrentActionPoints] = useState();
    const [maxActionPoints, setMaxActionPoints] = useState();
    const [userId, setUserId] = useState();

    useEffect(() => {
        if (whitelistPaths.includes(location.pathname)) {
            return;
        }
        axiosInstance.get(`/api/user`)
            .then((response) => {
                setUserId(response.data.userId);
                axiosInstance.get(`/api/user/action-points?userId=${response.data.userId}`)
                    .then((response) => {
                        setCurrentActionPoints(response.data.currentActionPoints);
                        setMaxActionPoints(response.data.maxActionPoints);
                    })
                    .catch((error) => {
                        console.error("서버 동기화 실패:", error);
                    });
            })
    }, [axiosInstance])

    // 행동력 증가 요청
    useEffect(() => {
        const syncInterval = setInterval(() => {
            // 화이트리스트에서는 요청X
            if (whitelistPaths.includes(location.pathname)) {
                clearInterval(syncInterval);
                return;
            }
            // 행동력이 꽉차있을 떄는 요청X
            if (currentActionPoints === maxActionPoints) {
                clearInterval(syncInterval);
                return;
            }
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
    }, [axiosInstance, location, currentActionPoints]);

    return (
        <UserContext.Provider value={{currentActionPoints}}>
            {children}
        </UserContext.Provider>
    );
};
