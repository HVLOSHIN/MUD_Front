import React from "react";
import Tooltip from '../../components/Tooltip';

const StatsSection = ({ totalEffects }) => {


    const renderTooltip = (baseValue, gapValue, finalValue) => (
        <Tooltip text={`${baseValue} + ${gapValue}`}>
            {finalValue}
        </Tooltip>
    );

    const stats = [
        { label: "체력", gap: totalEffects.effectHP, base: totalEffects.HP - totalEffects.effectHP , final: totalEffects.HP },
        { label: "물리공격력", gap: totalEffects.effectPA, base: totalEffects.PA - totalEffects.effectPA , final: totalEffects.PA },
        { label: "마법공격력", gap: totalEffects.effectMA, base: totalEffects.MA - totalEffects.effectMA , final: totalEffects.MA },
        { label: "물리방어력", gap: totalEffects.effectPD, base: totalEffects.PD - totalEffects.effectPD , final: totalEffects.PD },
        { label: "마법방어력", gap: totalEffects.effectMD, base: totalEffects.MD - totalEffects.effectMD , final: totalEffects.MD },
        { label: "치명타율", gap: totalEffects.effectCT, base: totalEffects.CT - totalEffects.effectCT , final: totalEffects.CT},
        { label: "치명타 피해", gap: totalEffects.effectCD, base: totalEffects.CD - totalEffects.effectCD , final: totalEffects.CD},
        { label: "회피", gap: totalEffects.effectAV, base: totalEffects.AV - totalEffects.effectAV , final: totalEffects.AV},
        { label: "행동간격", gap: totalEffects.DLY - totalEffects.baseDLY, base: totalEffects.baseDLY , final: totalEffects.DLY}
    ];

    return (
        <section className="stats-section">
            <h3 className="stats-section-title">전투 능력치</h3>
            <table className="stats-table">
                <thead>
                <tr>
                    {stats.map((stat) => (
                        <th key={`${stat.label}-header`}>{stat.label}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                <tr>
                    {stats.map((stat, index) => (
                        <td key={`${stat.label}-value`}>
                            {stat.gap !== null
                                ? renderTooltip(stat.base, stat.gap, stat.final)
                                : stat.final}
                        </td>
                    ))}
                </tr>
                </tbody>
            </table>
        </section>
    );
};

export default StatsSection;
