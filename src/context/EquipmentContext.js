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
    const [equipTotalEffects, setEquipTotalEffects] = useState({});
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

        setEquipTotalEffects(newTotalEffects);
    }, [equippedItems, location.pathname, equippedItems]);

    const gradeColors = {
        RUBBISH: "#949494",
        COMMON: "#FFFFFF",
        RARE: "#5eacff",
        EPIC: "#d171ff",
        UNIQUE: "#FFD700",
        LEGENDARY: "#FF4500"
    };

    const GRADE_NAMES = {
        RUBBISH: "쓰레기",
        COMMON: "일반",
        RARE: "희귀",
        EPIC: "영웅",
        UNIQUE: "유니크",
        LEGENDARY: "전설"
    };

    const slotNames = {
        "TWO_HANDED_WEAPON": "양손",
        "ONE_HANDED_WEAPON": "한손",
        "OFFHAND_WEAPON": "보조",
        "HEAD": "머리",
        "BODY": "갑옷",
        "GLOVES": "장갑",
        "BOOTS": "신발",
        "NECKLACE": "목걸이",
        "RING": "반지",
        "BRACELET": "팔찌"
    };

    const slotGroups = {
        "무기": ["ONE_HANDED_WEAPON", "TWO_HANDED_WEAPON"],
        "보조": ["OFFHAND_WEAPON"],
        "머리": ["HEAD"],
        "몸통": ["BODY"],
        "장갑": ["GLOVES"],
        "신발": ["BOOTS"],
        "목걸이": ["NECKLACE"],
        "반지": ["RING"],
        "팔찌": ["BRACELET"]
    };

    return (
        <EquipmentContext.Provider value={{ equipment, equippedItems, equipTotalEffects, setEquipment, setEquippedItems, gradeColors, GRADE_NAMES, slotNames, slotGroups }}>
            {children}
        </EquipmentContext.Provider>
    );
};

