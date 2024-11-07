import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
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

    const slotNames = {
        "ONE_HANDED_WEAPON": "무기",
        "TWO_HANDED_WEAPON": "양손 무기",
        "OFF_HAND": "보조",
        "HEAD": "머리",
        "BODY": "갑옷",
        "GLOVES": "장갑",
        "BOOTS": "신발",
        "NECKLACE": "목걸이",
        "RING": "반지",
        "BRACELET": "팔찌"
    };

    const toggleEquip = (item) => {
        const newEquipStatus = !item.equipped;
        axiosInstance.post(`/api/user/equip`, { itemId: item.id, equipped: newEquipStatus })
            .then(() => {
                setEquipment((prevEquipment) =>
                    prevEquipment.map((eq) =>
                        eq.id === item.id ? { ...eq, equipped: newEquipStatus } : eq
                    )
                );
                if (newEquipStatus) {
                    setEquippedItems((prevItems) => ({ ...prevItems, [item.slot]: item }));
                } else {
                    setEquippedItems((prevItems) => {
                        const updatedItems = { ...prevItems };
                        delete updatedItems[item.slot];
                        return updatedItems;
                    });
                }
            })
            .catch((error) => console.error('장착 상태 변경에 실패했습니다:', error));
    };

    return (
        <div className="equipment-container">
            <div className="equipment-slot-container">
                {Object.keys(slotNames).map((slot) => (
                    <div key={slot} className="equipment-slot">
                        <span className="slot-name">{slotNames[slot]}</span>
                        {equippedItems[slot] ? (
                            <>
                                <span className="item-name">{equippedItems[slot].name}</span>
                                <button onClick={() => toggleEquip(equippedItems[slot])}>탈착</button>
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
                    {equipment.map((item) => (
                        <li key={item.id} className="equipment-item">
                            <span className="item-name">{item.name}</span>
                            <button onClick={() => toggleEquip(item)}>
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
