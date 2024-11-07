import React from 'react';
import './Equipment.css';
import { useEquipment } from "../../context/EquipmentContext";

const EquipmentStatsSummary = () => {
    const { equipTotalEffects } = useEquipment();

    if (!equipTotalEffects || Object.keys(equipTotalEffects).length === 0) {
        return (
            <div className="equipment-stats-summary">
                <p>장착된 장비가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="equipment-stats-summary">
            <h2>장착한 장비의 스탯 합계</h2>
            <ul>
                {Object.entries(equipTotalEffects).map(([effectType, totalValue]) => (
                    <li key={effectType}>
                        {effectType}: {totalValue.toFixed(1)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EquipmentStatsSummary;
