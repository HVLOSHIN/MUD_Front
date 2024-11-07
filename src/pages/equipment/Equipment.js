// Equipment.js
import React, {useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import Cookies from 'js-cookie';
import EquipmentSlot from './Equipment-slot';
import EquipmentStatsSummary from './EquipmentStatsSummary';
import './Equipment.css';

const Equipment = () => {
    const {axiosInstance} = useAuth();
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
            const response = await axiosInstance.put(`/api/user/equipment`, {id: item.id, equipped: newEquipStatus});
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
        await axiosInstance.put(`/api/user/equipment`, {id: item.id});
        setEquippedItems(prev => {
            const updatedItems = {...prev};
            delete updatedItems[item.slot];
            return updatedItems;
        });
        setEquipment(prev => prev.map(eq => eq.id === item.id ? {...eq, equipped: false} : eq));
    };

    // // 장착된 아이템들의 스탯 합계 계산
    // const calculateTotalStats = () => {
    //     const initialStats = {strength: 0, agility: 0, intelligence: 0, vitality: 0}; // 필요한 스탯 필드를 정의
    //     return Object.values(equippedItems).reduce((total, item) => {
    //         total.strength += item.stats?.strength || 0;
    //         total.agility += item.stats?.agility || 0;
    //         total.intelligence += item.stats?.intelligence || 0;
    //         total.vitality += item.stats?.vitality || 0;
    //         return total;
    //     }, initialStats);
    // };

    return (
        <div>
            {/*<EquipmentStatsSummary totalStats={calculateTotalStats()}/>*/}
            <div className="equipment-container">
                <EquipmentSlot
                    equipment={equipment}
                    equippedItems={equippedItems}
                    toggleItemEquipStatus={toggleItemEquipStatus}
                    unequipItem={unequipItem}
                />
            </div>
        </div>
    );
};

export default Equipment;
