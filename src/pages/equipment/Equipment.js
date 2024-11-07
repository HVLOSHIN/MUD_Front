// Equipment.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import EquipmentSlot from './Equipment-slot';
import './Equipment.css';

const Equipment = () => {
    const { axiosInstance } = useAuth();
    const [equipment, setEquipment] = useState([]);
    const [equippedItems, setEquippedItems] = useState({});

    useEffect(() => {
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
    }, [axiosInstance]);

    // API 호출 함수들
    const toggleItemEquipStatus = async (item, newEquipStatus) => {
        try {
            const response = await axiosInstance.put(`/api/user/equipment`, { id: item.id, equipped: newEquipStatus });
            const updatedItem = response.data;
            setEquipment(prev => prev.map(eq => eq.id === updatedItem.id ? updatedItem : eq));
            setEquippedItems(prev => ({
                ...prev,
                [updatedItem.slot]: newEquipStatus ? updatedItem : undefined
            }));
        } catch (error) {
            console.error('장비 장착 상태 변경에 실패했습니다:', error);
        }
    };

    const unequipItem = async (item) => {
        await axiosInstance.put(`/api/user/equipment`, { id: item.id });
        setEquippedItems(prev => {
            const updatedItems = { ...prev };
            delete updatedItems[item.slot];
            return updatedItems;
        });
        setEquipment(prev => prev.map(eq => eq.id === item.id ? { ...eq, equipped: false } : eq));
    };

    return (
        <div className="equipment-container">
            <EquipmentSlot
                equipment={equipment}
                equippedItems={equippedItems}
                toggleItemEquipStatus={toggleItemEquipStatus}
                unequipItem={unequipItem}
            />
        </div>
    );
};

export default Equipment;
