import React from 'react';
import './Equipment.css';
import { useEquipment } from "../../context/EquipmentContext";
import {statsList} from "../../utils/statCalculator";

const EquipmentStatsSummary = () => {
    const { equipTotalEffects } = useEquipment();

    const getStatClass = (value) => {
        if (value > 0) return "positive";    // 초록색 클래스
        if (value < 0) return "negative";    // 빨간색 클래스
        return "";                           // 0인 경우 기본 색상
    };

    return (
        <div className="equipment-stats-summary">
            <table className="stats-table">
                <thead>
                <tr>
                    {statsList.map((stat) => (
                        <th key={`${stat.key}-header`}>{stat.label}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                <tr>
                    {statsList.map((stat) => (
                        <td key={`${stat.key}-value`} className={getStatClass(equipTotalEffects[stat.label])}>
                            {(equipTotalEffects[stat.label] || 0).toFixed(1)}
                        </td>
                    ))}
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EquipmentStatsSummary;
