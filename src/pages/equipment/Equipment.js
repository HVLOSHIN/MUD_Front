import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './Equipment.css';

const Equipment = () => {
    const { axiosInstance } = useAuth();
    const [equipment, setEquipment] = useState([]);
    const [equippedItems, setEquippedItems] = useState({});

    const gradeColors = {
        RUBBISH: "#808080",
        COMMON: "#FFFFFF",
        RARE: "#1E90FF",
        EPIC: "#9400D3",
        UNIQUE: "#FFD700",
        LEGENDARY: "#FF4500"
    };

    const gradeNames = {
        RUBBISH: "쓰레기",
        COMMON: "일반",
        RARE: "희귀",
        EPIC: "영웅",
        UNIQUE: "유니크",
        LEGENDARY: "전설"
    };

    const slotNames = {
        "TWO_HANDED_WEAPON": "양손 무기",
        "ONE_HANDED_WEAPON": "한손 무기",
        "OFFHAND_WEAPON": "보조",
        "HEAD": "머리",
        "BODY": "갑옷",
        "GLOVES": "장갑",
        "BOOTS": "신발",
        "NECKLACE": "목걸이",
        "RING": "반지",
        "BRACELET": "팔찌"
    };

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

    // 장착 및 탈착 처리 공통 함수
    const handleEquipToggle = async (item) => {
        const newEquipStatus = !item.equipped;
        const slot = item.slot;

        // 양손 무기 장착/탈착 처리
        if (item.slot === "TWO_HANDED_WEAPON" && newEquipStatus) {
            await unequipItems(["ONE_HANDED_WEAPON", "OFFHAND_WEAPON"]);
        } else if ((item.slot === "ONE_HANDED_WEAPON" || item.slot === "OFFHAND_WEAPON") && newEquipStatus) {
            await unequipItems(["TWO_HANDED_WEAPON"]);
        }

        // 기존 아이템 탈착 후 새 아이템 장착
        if (newEquipStatus && equippedItems[slot]) {
            await unequipItem(equippedItems[slot]);
        }

        // 아이템 장착 상태 변경
        await toggleItemEquipStatus(item, newEquipStatus);
    };

    // 아이템 탈착
    const unequipItem = async (item) => {
        await axiosInstance.put(`/api/user/equipment`, { id: item.id });
        setEquippedItems(prev => {
            const updatedItems = { ...prev };
            delete updatedItems[item.slot];
            return updatedItems;
        });
        setEquipment(prev => prev.map(eq => eq.id === item.id ? { ...eq, equipped: false } : eq));
    };

    // 여러 아이템 탈착
    const unequipItems = async (slots) => {
        const unequipPromises = slots.map(async (slot) => {
            const item = equippedItems[slot];
            if (item) {
                await unequipItem(item);
            }
        });
        await Promise.all(unequipPromises);
    };

    // 아이템 장착 상태 변경
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

    // 아이템 등급에 따른 색상 동적 설정
    const getGradeColor = (grade) => gradeColors[grade] || "#FFFFFF";

    return (
        <div className="equipment-container">
            <div className="equipment-slot-container">
                {Object.keys(slotNames).map((slot) => (
                    <div key={slot} className="equipment-slot">
                        <span className="slot-name">{slotNames[slot]}</span>
                        {equippedItems[slot] ? (
                            <>
                                <span className="item-name" style={{ color: getGradeColor(equippedItems[slot].grade) }}>
                                    {equippedItems[slot].name}
                                </span>
                                <button className="equip-button" onClick={() => handleEquipToggle(equippedItems[slot])}>탈착</button>
                            </>
                        ) : (
                            <span className="item-name">미장착</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="owned-equipment-container">
                <h2>내 장비 목록</h2>
                <ul className="equipment-list">
                    {equipment
                        .filter((item) => !item.equipped) // 장착되지 않은 아이템만 표시
                        .map((item) => (
                            <li key={item.id} className="equipment-item">
                                <span className="item-name" style={{ color: getGradeColor(item.grade) }}>
                                    {item.name}
                                </span>
                                <button className="equip-button"
                                    onClick={() => handleEquipToggle(item)}>
                                    {item.equipped ? "탈착" : "장착"}
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default Equipment;