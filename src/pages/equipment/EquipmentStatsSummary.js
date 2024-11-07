import React from 'react';
import './Equipment.css';

const EquipmentStatsSummary = ({ totalStats }) => {
    return (
        <div className="equipment-stats-summary">
            <h2>장비 스탯 요약</h2>
            <ul>
                <li>힘: {totalStats.strength}</li>
                <li>민첩: {totalStats.agility}</li>
                <li>지능: {totalStats.intelligence}</li>
                <li>체력: {totalStats.vitality}</li>
            </ul>
        </div>
    );
};

export default EquipmentStatsSummary;
