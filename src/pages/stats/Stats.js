import React, {useEffect, useState} from 'react';
import './Stats.css';
import {useAuth} from "../../context/AuthContext";
import {useEquipment} from "../../context/EquipmentContext";
import {useMastery} from "../../context/MasteryContext";
import {calculateUserStats, statsList} from '../../utils/statCalculator';
import Cookies from "js-cookie";
import Tooltip from '../../components/Tooltip';
import StatsSection from "./StatsSection";

const Stats = () => {
    const {axiosInstance} = useAuth();
    const {equippedItems, gradeColors, GRADE_NAMES, slotGroups, equipTotalEffects, gradeMultipliers} = useEquipment();
    const {jobEffects, skillEffects} = useMastery();
    const [data, setData] = useState(null);
    const [totalEffects, setTotalEffects] = useState(null);

    useEffect(() => {
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}`)
            .then((response) => {
                setTotalEffects(calculateUserStats(response.data, equipTotalEffects, skillEffects, jobEffects ));
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

    const formatItemEffects = (item) => {
        if (item.effects == null) {
            return;
        }
        const multiplier = gradeMultipliers[item.grade] || 1; // 등급에 맞는 배율 가져오기 (기본값: 1)

        return item.effects
            .map(effect => `${effect.effectType}: ${(effect.value * multiplier).toFixed(1)}`) // 배율 적용
            .join(", ");
    };

    const getStatClass = (statValue) => {
        if (statValue > 0) return "stats-positive";
        if (statValue < 0) return "stats-negative";
        return "";
    };

    const renderTooltip = (label, stats) => {
        const tooltipText = stats
            .map(stat => {
                const equipmentStat = equipTotalEffects[stat] || 0;
                const jobStat = jobEffects[stat] || 0;
                const skillStat = skillEffects[stat] || 0;
                return `장비 : ${equipmentStat} 스킬 : ${skillStat} 직업 : ${jobStat}`;
            })
            .join(" ");
        return <Tooltip text={tooltipText}>{label}</Tooltip>;
    };


    if (!data) return <div>Loading...</div>;

    return (
        <div className="stats-dashboard-container">
            <p className="stats-title">마우스를 올려보면 더 많은 정보를 확인하실 수 있습니다.</p>
            <section className="stats-section">
                <h3 className="stats-section-title">{data.username}</h3>
                <table className="stats-table">
                    <tbody>
                    <tr>
                        <th>직업</th>
                        <td><Tooltip text={currentMastery.job.description}>
                            {currentMastery.job.name}
                        </Tooltip></td>
                        <th>레벨</th>
                        <td>{data.userStats.level}</td>
                        <th>소지금</th>
                        <td>{data.userStats.gold}</td>
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
                    <thead>
                    <tr>
                        {statsList.map((stat) => (
                            <th key={`${stat.label}-header`}>{stat.label}</th>))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {statsList.map((stat) => (
                            <td key={`${stat.label}-value`} className={getStatClass(totalEffects[stat.key])}>
                                {renderTooltip(totalEffects[stat.key], stat.stats)}</td>))}
                    </tr>
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
                                                    __html: formatItemEffects(equippedItem)
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
                <table className="stats-log-table">
                <ul className="stats-logs-list">
                    {data.logs.map((log, index) => (

                        <li key={index}>Login {log.ip} 에서 접속 {new Date(log.time).toLocaleString()}</li>
                    ))}
                </ul>
                </table>
            </section>
        </div>
    );
};
export default Stats;