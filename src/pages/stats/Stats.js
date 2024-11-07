import React, {useEffect, useState} from 'react';
import './Stats.css';
import {useAuth} from "../../context/AuthContext";
import {useEquipment} from "../../context/EquipmentContext";
import {calculateUserStats} from '../../utils/statCalculator';
import Cookies from "js-cookie";
import Tooltip from '../../components/Tooltip';
import StatsSection from "./StatsSection";

const Stats = () => {
    const {axiosInstance} = useAuth();
    const {equippedItems, gradeColors, GRADE_NAMES, slotGroups, equipTotalEffects} = useEquipment();
    const [data, setData] = useState(null);
    const [totalEffects, setTotalEffects] = useState(null);

    useEffect(() => {
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}`)
            .then((response) => {
                setTotalEffects(calculateUserStats(response.data));
                const sortedData = {
                    ...response.data,
                    logs: response.data.logs.sort((a, b) => new Date(b.time) - new Date(a.time)),
                };
                setData(sortedData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [axiosInstance]);

    const currentMastery = data?.mastery.find((job) => job.jobStatus === "RUNNING" || "MASTER_RUNNING");

    const formatItemEffects = (effects) => {
        if (effects == null) {
            return
        }
        return effects.map(effect => `${effect.effectType}: ${effect.value}`).join(", ");
    };

    const statsList = [
        {label: "HP", key: "effectHP", stats: ["HP"]},
        {label: "PA", key: "effectPA", stats: ["PA"]},
        {label: "MA", key: "effectMA", stats: ["MA"]},
        {label: "PD", key: "effectPD", stats: ["PD"]},
        {label: "MD", key: "effectMD", stats: ["MD"]},
        {label: "CT", key: "effectCT", stats: ["CT"]},
        {label: "CD", key: "effectCD", stats: ["CD"]},
        {label: "AV", key: "effectAV", stats: ["AV"]},
        {label: "AR", key: "effectAR", stats: ["AR"]}
    ];

    const getStatClass = (statValue) => {
        if (statValue > 0) return "stats-positive";
        if (statValue < 0) return "stats-negative";
        return "";
    };

    const renderTooltip = (label, stats) => {
        const tooltipText = stats
            .map(stat => {
                // TODO
                const equipmentStat = equipTotalEffects[stat] || 0;
                const jobStat = data.combat.jobStats[stat] || 0;
                const skillStat = data.combat.skillStats[stat] || 0;
                return `장비 : ${equipmentStat} 스킬 : ${jobStat} 직업 : ${skillStat}`;
            })
            .join(" ");
        return <Tooltip text={tooltipText}>{label}</Tooltip>;
    };


    if (!data) return <div>Loading...</div>;

    return (
        <div className="stats-dashboard-container">
            <h2 className="stats-title"> {data.username}</h2>

            <section className="stats-section">
                <h3 className="stats-section-title">개요</h3>
                <table className="stats-table">
                    <tbody>
                    <tr>
                        <th>직업</th>
                        <td><Tooltip text={currentMastery.job.description}>
                            {currentMastery.job.name}
                        </Tooltip></td>
                        <th>생명력</th>
                        <td><Tooltip text="기본 HP">
                            {totalEffects.HP}
                        </Tooltip></td>
                        <th>소지금</th>
                        <td><Tooltip text="gold">
                            {data.userStats.gold}
                        </Tooltip></td>
                    </tr>
                    <tr>
                        <th>근력</th>
                        <td> {data.userStats.strength}</td>
                        <th>기민</th>
                        <td> {data.userStats.dexterity}</td>
                        <th>지능</th>
                        <td> {data.userStats.intelligence}</td>
                    </tr>
                    </tbody>
                </table>
            </section>

            <StatsSection totalEffects={totalEffects}/>

            <section className="stats-section">
                <h3 className="stats-section-title">효과</h3>
                <table className="stats-table">
                    <tbody>
                    {statsList.map((stat, index) => (
                        <tr key={stat.label}>
                            <th>{stat.label}</th>
                            <td className={getStatClass(totalEffects[stat.key])}>
                                {renderTooltip(
                                    totalEffects[stat.key],
                                    stat.stats
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>


            <section className="stats-section">
                <h3 className="stats-section-title">장비</h3>
                <table className="stats-table">
                    <tbody>
                    {Object.entries(slotGroups).map(([groupLabel, groupSlots]) => {
                        // 그룹화된 슬롯들을 하나의 항목으로 처리
                        const equippedItem = groupSlots
                            .map(slot => equippedItems[slot]) // 슬롯에 해당하는 아이템들 가져오기
                            .find(item => item !== undefined); // 장착된 아이템이 있는지 확인

                        return equippedItem ? (
                            <tr key={groupLabel}>
                                <th>{groupLabel}</th>
                                <td>
                                    <Tooltip
                                        text={
                                            <span>
                                                {equippedItem.description}<br/>
                                                {GRADE_NAMES[equippedItem.grade]}<br/> {/* 한글 등급 이름 */}
                                                효과: <span
                                                dangerouslySetInnerHTML={{
                                                    __html: formatItemEffects(equippedItem.effects)
                                                }}/>
                                            </span>}>
                                <span style={{color: gradeColors[equippedItem.grade]}}>
                                    {equippedItem.name}
                                </span>
                                    </Tooltip>
                                </td>
                            </tr>
                        ) : null;
                    })}
                    </tbody>
                </table>
            </section>


            <section className="stats-section">
                <h3 className="stats-section-title">최근 기록</h3>
                <ul className="stats-logs-list">
                    {data.logs.map((log, index) => (
                        <li key={index}>Login {log.ip} 에서 접속 {new Date(log.time).toLocaleString()}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};
export default Stats;