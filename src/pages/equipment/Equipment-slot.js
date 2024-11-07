// EquipmentSlot.js
import React from 'react';
import './Equipment.css';
import Tooltip from '../../components/Tooltip';

const EquipmentSlot = ({equipment, equippedItems, toggleItemEquipStatus, unequipItem}) => {
    const gradeColors = {
        RUBBISH: "#808080",
        COMMON: "#FFFFFF",
        RARE: "#1E90FF",
        EPIC: "#9400D3",
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

    const getGradeColor = (grade) => gradeColors[grade] || "#FFFFFF";

    const formatItemEffects = (effects) => {
        if (effects == null) {
            return
        }
        return effects.map(effect => `${effect.effectType}: ${effect.value}`).join(", ");
    };

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

    const unequipItems = async (slots) => {
        const unequipPromises = slots.map(async (slot) => {
            const item = equippedItems[slot];
            if (item) {
                await unequipItem(item);
            }
        });
        await Promise.all(unequipPromises);
    };

    return (
        <>
            <div className="equipment-slot-container">
                {Object.keys(slotNames).map((slot) => (
                    <div key={slot} className="equipment-slot">
                        <span className="slot-name">{slotNames[slot]}</span>
                        {equippedItems[slot] ? (
                            <>
                                <Tooltip
                                    text={
                                        <span>
                                            {equippedItems[slot].description}<br/>
                                            {GRADE_NAMES[equippedItems[slot].grade]}<br/> {/* 한글 등급 이름 */}
                                            효과: <span
                                            dangerouslySetInnerHTML={{__html: formatItemEffects(equippedItems[slot].effects)}}/>
                                                </span>}>
                                                <span style={{color: gradeColors[equippedItems[slot].grade]}}>
                                <span className="item-name" style={{color: getGradeColor(equippedItems[slot].grade)}}>
                                    {equippedItems[slot].name}
                                </span>
                                                </span>
                                </Tooltip>


                                <button className="equip-button"
                                        onClick={() => handleEquipToggle(equippedItems[slot])}>탈착
                                </button>
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
                                <Tooltip
                                    text={
                                        <span>
                                            {item.description}<br/>
                                            {GRADE_NAMES[item.grade]}<br/> {/* 한글 등급 이름 */}
                                            효과: <span
                                            dangerouslySetInnerHTML={{__html: formatItemEffects(item.effects)}}/>
                                                </span>}>
                                                <span style={{color: gradeColors[item.grade]}}>
                                                    <span className="item-name"
                                                          style={{color: getGradeColor(item.grade)}}>
                                                    {item.name}
                                                    </span>
                                                </span>
                                </Tooltip>
                                <button className="equip-button" onClick={() => handleEquipToggle(item)}>
                                    장착
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </>
    );
};

export default EquipmentSlot;
