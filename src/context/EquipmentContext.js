import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

const EquipmentContext = createContext();

export const useEquipment = () => {
    return useContext(EquipmentContext);
};

export const EquipmentProvider = ({ children }) => {
    const { axiosInstance } = useAuth();
    const [equipment, setEquipment] = useState([]);
    const [equippedItems, setEquippedItems] = useState({});
    const [totalEffects, setTotalEffects] = useState({});
    const whitelistPaths = ['/stats', '/equipment', '/combat'];
    const location = useLocation();

    useEffect(() => {
        if (!whitelistPaths.includes(location.pathname)) {
            return;
        }

        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}/equipment`)
            .then((response) => {
                setEquipment(response.data);
                const equipped = response.data.reduce((acc, item) => {
                    if (item.equipped) acc[item.slot] = item;
                    return acc;
                }, {});
                setEquippedItems(equipped);
            })
            .catch((error) => console.error('장비를 불러오는 데 실패했습니다:', error));
    }, [axiosInstance, location.pathname]);

    // 장착된 아이템에 변화가 있을 때마다 totalEffects를 계산
    useEffect(() => {
        const newTotalEffects = Object.values(equippedItems).reduce((acc, item) => {
            // item이 존재하고 item.effects가 배열인 경우만 처리
            if (item && Array.isArray(item.effects)) {
                item.effects.forEach(effect => {
                    const { effectType, value } = effect;
                    acc[effectType] = (acc[effectType] || 0) + value;
                });
            }
            return acc;
        }, {});

        setTotalEffects(newTotalEffects);
    }, [equippedItems]);

    return (
        <EquipmentContext.Provider value={{ equipment, equippedItems, totalEffects, setEquipment, setEquippedItems }}>
            {children}
        </EquipmentContext.Provider>
    );
};

