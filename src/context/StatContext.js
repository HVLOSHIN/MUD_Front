import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

const StatContext = createContext();
export const useStat = () => {
    return useContext(StatContext);
};

export const StatContextProvider = ({ children }) => {
    const { axiosInstance } = useAuth();
    const whitelistPaths = ['/stats', '/mastery'];
    const location = useLocation();
    const [stats, setStats] = useState([]);

    useEffect(() => {
        if (!whitelistPaths.includes(location.pathname)) {
            return;
        }
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}/stats`)
            .then((response) => {
                setStats(response.data);
            })
            .catch((error) => console.error('불러오기 실패:', error));
    }, [axiosInstance, location.pathname]);

    return(
        <StatContext.Provider value={{ stats }}>
            {children}
        </StatContext.Provider>
    );
};
