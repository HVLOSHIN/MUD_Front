import React from 'react';
import '../equipment/Equipment.css';
import {useMastery} from "../../context/MasteryContext";
import {statsList} from "../../utils/statCalculator";

const MasteryStatsSummary = () => {
    const {skillEffects} = useMastery();


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
                        <td key={`${stat.key}-value`} className={getStatClass(skillEffects[stat.label])}>
                            {(skillEffects[stat.label] || 0).toFixed(1)}
                        </td>
                    ))}
                </tr>
                </tbody>
            </table>
        </div>
    );
};
export default MasteryStatsSummary;