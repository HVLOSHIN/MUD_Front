import React, {useEffect, useState} from 'react';
import './Stats.css';
import {useAuth} from "../../context/AuthContext";
import Cookies from "js-cookie";
import Tooltip from '../../components/Tooltip';

const Stats = () => {
    const {axiosInstance} = useAuth();
    const [data, setData] = useState(null);
    const [calculatedStats, setCalculatedStats] = useState({});



    useEffect(() => {
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}`)
            .then((response) => {
                const sortedData = {
                    ...response.data,
                    logs: response.data.logs.sort((a, b) => new Date(b.time) - new Date(a.time)),
                };
                setData(sortedData);
                calculateStats(sortedData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [axiosInstance]);

    const currentMastery = data?.mastery.find((job) => job.jobStatus === "RUNNING" || "MASTER_RUNNING");

    const findEquippedItem = (slots) => {
        for (const slot of slots) {
            const item = data.equipments.find(eq => eq.slot === slot && eq.equipped);
            if (item) return item; // 장착된 아이템이 있으면 그 이름을 반환
        }
        return "없음"; // 모든 슬롯에서 장착된 아이템이 없으면 "없음" 반환
    };

    const formatItemEffects = (effects) => {
        if(effects == null){
            return
        }
        return effects.map(effect => `${effect.effectType}: ${effect.value}`).join(", ");
    };

    const calculateStats = (data) => {
        if (!data) return;


        const stats = data.combat;

        const baseHP = stats.baseStats.HP;
        const usedHP = data.achievements.usedHp;
        const additionalHP = stats.equipmentStats.HP + stats.jobStats.HP + stats.skillStats.HP;
        const finalHP = (baseHP * (1 + 0.01 * additionalHP)).toFixed(1);
        const gapHP = (finalHP - baseHP).toFixed(1);

        const basePA = stats.baseStats.PA;
        const additionalPA = stats.equipmentStats.PA + stats.jobStats.PA + stats.skillStats.PA;
        const finalPA = (basePA * (1 + 0.01 * additionalPA)).toFixed(1);
        const gapPA = (finalPA - basePA).toFixed(1);

        const baseMA = stats.baseStats.MA;
        const additionalMA = stats.equipmentStats.MA + stats.jobStats.MA + stats.skillStats.MA;
        const finalMA = (baseMA * (1 + 0.01 * additionalMA)).toFixed(1);
        const gapMA  = (finalMA - baseMA).toFixed(1);

        const basePD = stats.baseStats.PD;
        const additionalPD = stats.equipmentStats.PD + stats.jobStats.PD + stats.skillStats.PD;
        const finalPD = (basePD * (1 + 0.01 * additionalPD)).toFixed(1);
        const gapPD = (finalPD - basePD).toFixed(1);

        const baseMD = stats.baseStats.MD;
        const additionalMD = stats.equipmentStats.MD + stats.jobStats.MD + stats.skillStats.MD;
        const finalMD = (baseMD * (1 + 0.01 * additionalMD)).toFixed(1);
        const gapMD = (finalMD - baseMD).toFixed(1);

        const baseCT = stats.baseStats.CT;
        const additionalCT = stats.equipmentStats.CT + stats.jobStats.CT + stats.skillStats.CT;
        const finalCT = (baseCT * (1 + 0.01 * additionalCT)).toFixed(1);
        const gapCT = (finalCT - baseCT).toFixed(1);

        const baseCD = stats.baseStats.CD;
        const additionalCD = stats.equipmentStats.CD + stats.jobStats.CD + stats.skillStats.CD;
        const finalCD = (baseCD * (1 + 0.01 * additionalCD)).toFixed(1);
        const gapCD = (finalCD - baseCD).toFixed(1);

        const baseAV = stats.baseStats.AV;
        const additionalAV = stats.equipmentStats.AV + stats.jobStats.AV + stats.skillStats.AV;
        const finalAV = (baseAV * (1 + 0.01 * additionalAV)).toFixed(1);
        const gapAV = (finalAV - baseAV).toFixed(1);

        const baseAR = stats.baseStats.AR;
        const additionalAR = stats.equipmentStats.AR + stats.jobStats.AR + stats.skillStats.AR;
        const finalAR = (baseAR * (1 + 0.01 * additionalAR)).toFixed(1);
        const DLY = ((1000 - 50 * Math.pow(data.userStats.dexterity, 0.3)) * (1 - additionalAR / 100)).toFixed(2);
        const baseDLY = (1000 - 50 * Math.pow(data.userStats.dexterity, 0.3)).toFixed();
        const gapDLY = (DLY - baseDLY).toFixed(2);


        setCalculatedStats({
            currentMastery: currentMastery ? currentMastery.name : "N/A",
            baseHP, finalHP, usedHP, additionalHP, gapHP,
            finalPA, basePA, additionalPA, gapPA,
            finalMA, baseMA, additionalMA, gapMA,
            finalPD, basePD, additionalPD, gapPD,
            finalMD, baseMD, additionalMD, gapMD,
            finalCT, baseCT, additionalCT, gapCT,
            finalCD, baseCD, additionalCD, gapCD,
            finalAV, baseAV, additionalAV, gapAV,
            finalAR, baseAR, additionalAR, DLY, baseDLY, gapDLY,
        });
    };

    const gradeColors = {
        RUBBISH: "#808080",     // 회색
        COMMON: "#FFFFFF",      // 흰색
        RARE: "#1E90FF",        // 파란색
        EPIC: "#9400D3",        // 보라색
        UNIQUE: "#FFD700",      // 금색
        LEGENDARY: "#FF4500"    // 주황색
    };

    const gradeNames = {
        RUBBISH: "쓰레기",
        COMMON: "일반",
        RARE: "희귀",
        EPIC: "영웅",
        UNIQUE: "유니크",
        LEGENDARY: "전설"
    };



    if (!data) return <div>Loading...</div>;

    return (
        <div className="stats-dashboard-container">
            <h2 className="stats-title"> {data.username}</h2>

            <section className="stats-section">
                <h3 className="stats-section-title">생명력</h3>
                <table className="stats-table">
                    <tbody>
                    <tr>
                        <th>직업</th>
                        <td><Tooltip text={currentMastery.job.description}>
                            {currentMastery.job.name}
                        </Tooltip></td>
                        <th>현재 HP</th>
                        <td><Tooltip text="기본 HP">
                            {calculatedStats.baseHP}
                        </Tooltip></td>
                        <th>총 사용 HP</th>
                        <td>{calculatedStats.usedHP}</td>
                        <th>소지금</th>
                        <td><Tooltip text="gold">
                            {data.userStats.gold}
                        </Tooltip></td>
                    </tr>
                    </tbody>
                </table>
            </section>

            <section className="stats-section">
                <h3 className="stats-section-title">능력치</h3>
                <table className="stats-table">
                    <tbody>
                    <tr>
                        <th>체력</th>
                            <td>
                                <Tooltip text={`${calculatedStats.baseHP.toFixed(1)} + ${calculatedStats.gapHP}`}>
                                {calculatedStats.finalHP}
                                </Tooltip>
                            </td>

                        <th>근력</th>
                            <td>
                                {data.userStats.strength}
                            </td>
                        <th>기민</th>
                        <td>{data.userStats.dexterity}</td>
                        <th>지능</th>
                        <td>{data.userStats.intelligence}</td>
                    </tr>
                    <tr>
                        <th>물리공격력</th>
                        <td>
                            <Tooltip text={`${calculatedStats.basePA.toFixed(1)} + ${calculatedStats.gapPA}`}>
                                {calculatedStats.finalPA}
                            </Tooltip>
                        </td>
                        <th>마법공격력</th>
                        <td>
                            <Tooltip text={`${calculatedStats.baseMA.toFixed(1)} + ${calculatedStats.gapMA}`}>
                                {calculatedStats.finalMA}
                            </Tooltip>
                        </td>
                        <th>물리방어력</th>
                        <td>
                            <Tooltip text={`${calculatedStats.basePD.toFixed(1)} + ${calculatedStats.gapPD}`}>
                                {calculatedStats.finalPD}
                            </Tooltip>
                        </td>
                        <th>마법방어력</th>
                        <td>
                            <Tooltip text={`${calculatedStats.baseMD.toFixed(1)} + ${calculatedStats.gapMD}`}>
                            {calculatedStats.finalMD}
                            </Tooltip>
                        </td>
                    </tr>
                    <tr>
                        <th>치명타율</th>
                        <td>
                            <Tooltip text={`${calculatedStats.baseCT.toFixed(1)} + ${calculatedStats.gapCT}`}>
                                {calculatedStats.finalCT}
                            </Tooltip>
                        </td>
                        <th>치명타 피해</th>
                        <td>
                            <Tooltip text={`${calculatedStats.baseCD.toFixed(1)} + ${calculatedStats.gapCD}`}>
                                {calculatedStats.finalCD}
                            </Tooltip>
                        </td>
                        <th>회피</th>
                        <td>
                            <Tooltip text={`${calculatedStats.baseAV.toFixed(1)} + ${calculatedStats.gapAV}`}>
                                {calculatedStats.finalAV}
                            </Tooltip>
                        </td>
                        <th>행동간격</th>
                        <td>
                            <Tooltip text={`${calculatedStats.baseDLY} ${calculatedStats.gapDLY}`}>
                            {calculatedStats.DLY}
                            </Tooltip>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </section>

            <section className="stats-section">
                <h3 className="stats-section-title">효과</h3>
                <table className="stats-table">
                    <tbody>
                    <tr>
                        <th>HP</th>
                        <td className={calculatedStats.additionalHP > 0 ? "stats-positive" : calculatedStats.additionalHP < 0 ? "stats-negative" : ""}>
                            <Tooltip text={`장비 : ${data.combat.equipmentStats.HP} 스킬 : ${data.combat.jobStats.HP} 직업 : ${data.combat.skillStats.HP}`}>
                            {calculatedStats.additionalHP}
                            </Tooltip>
                        </td>
                        <th>PA</th>
                        <td className={calculatedStats.additionalPA > 0 ? "stats-positive" : calculatedStats.additionalPA < 0 ? "stats-negative" : ""}>
                            <Tooltip text={`장비 : ${data.combat.equipmentStats.PA} 스킬 : ${data.combat.jobStats.PA} 직업 : ${data.combat.skillStats.PA}`}>
                            {calculatedStats.additionalPA}
                            </Tooltip>
                        </td>
                        <th>MA</th>
                        <td className={calculatedStats.additionalMA > 0 ? "stats-positive" : calculatedStats.additionalMA < 0 ? "stats-negative" : ""}>
                            <Tooltip text={`장비 : ${data.combat.equipmentStats.MA} 스킬 : ${data.combat.jobStats.MA} 직업 : ${data.combat.skillStats.MA}`}>
                            {calculatedStats.additionalMA}
                            </Tooltip>
                        </td>
                        <th>PD</th>
                        <td className={calculatedStats.additionalPD > 0 ? "stats-positive" : calculatedStats.additionalPD < 0 ? "stats-negative" : ""}>
                            <Tooltip text={`장비 : ${data.combat.equipmentStats.PD} 스킬 : ${data.combat.jobStats.PD} 직업 : ${data.combat.skillStats.PD}`}>
                            {calculatedStats.additionalPD}
                                </Tooltip>
                        </td>
                        <th>MD</th>
                        <td className={calculatedStats.additionalMD > 0 ? "stats-positive" : calculatedStats.additionalMD < 0 ? "stats-negative" : ""}>
                            <Tooltip text={`장비 : ${data.combat.equipmentStats.MD} 스킬 : ${data.combat.jobStats.MD} 직업 : ${data.combat.skillStats.MD}`}>
                            {calculatedStats.additionalMD}
                                </Tooltip>
                        </td>
                    </tr>
                    <tr>
                        <th>CT</th>
                        <td className={calculatedStats.additionalCT > 0 ? "stats-positive" : calculatedStats.additionalCT < 0 ? "stats-negative" : ""}>
                            <Tooltip text={`장비 : ${data.combat.equipmentStats.CT} 스킬 : ${data.combat.jobStats.CT} 직업 : ${data.combat.skillStats.CT}`}>
                            {calculatedStats.additionalCT}
                                </Tooltip>
                        </td>
                        <th>CD</th>
                        <td className={calculatedStats.additionalCD > 0 ? "stats-positive" : calculatedStats.additionalCD < 0 ? "stats-negative" : ""}>
                            <Tooltip text={`장비 : ${data.combat.equipmentStats.CD} 스킬 : ${data.combat.jobStats.CD} 직업 : ${data.combat.skillStats.CD}`}>
                            {calculatedStats.additionalCD}
                                </Tooltip>
                        </td>
                        <th>AV</th>
                        <td className={calculatedStats.additionalAV > 0 ? "stats-positive" : calculatedStats.additionalAV < 0 ? "stats-negative" : ""}>
                            <Tooltip text={`장비 : ${data.combat.equipmentStats.AV} 스킬 : ${data.combat.jobStats.AV} 직업 : ${data.combat.skillStats.AV}`}>
                            {calculatedStats.additionalAV}
                                </Tooltip>
                        </td>
                        <th>AR</th>
                        <td className={calculatedStats.additionalAR > 0 ? "stats-positive" : calculatedStats.additionalAR < 0 ? "stats-negative" : ""}>
                            <Tooltip text={`장비 : ${data.combat.equipmentStats.AR} 스킬 : ${data.combat.jobStats.AR} 직업 : ${data.combat.skillStats.AR}`}>
                            {calculatedStats.additionalAR}
                                </Tooltip>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </section>


            <section className="stats-section">
                <h3 className="stats-section-title">장비</h3>
                <table className="stats-table">
                    <tbody>
                    {[
                        {label: "무기", slots: ["TWO_HANDED_WEAPON", "ONE_HANDED_WEAPON"]},
                        {label: "보조", slots: ["OFFHANDED_WEAPON"]},
                        {label: "머리", slots: ["HEAD"]},
                        {label: "몸통", slots: ["ARMOR"]},
                        {label: "장갑", slots: ["GLOVES"]},
                        {label: "신발", slots: ["BOOTS"]},
                        {label: "목걸이", slots: ["NECKLACE"]},
                        {label: "반지", slots: ["RING"]},
                        {label: "팔찌", slots: ["BRACELET"]}
                    ]?.map(({label, slots}) => {
                        const equippedItem = findEquippedItem(slots);
                        return (
                            <tr key={label}>
                                <th>{label}</th>
                                <td>
                                    {equippedItem ? (
                                        <Tooltip
                                            text={
                                                <span>
                                                    {equippedItem.description}<br/>
                                                    {gradeNames[equippedItem.grade]}<br/> {/* 한글 등급 이름 */}
                                                    효과: <span
                                                    dangerouslySetInnerHTML={{__html: formatItemEffects(equippedItem.effects)}}
                                                />
                                                </span>}>
                                                <span style={{color: gradeColors[equippedItem.grade]}}>
                                                    {equippedItem.name}
                                                </span>
                                        </Tooltip>
                                    ) : (
                                        "없음"
                                    )}
                                </td>

                            </tr>
                        );
                    }) || "장비가 없습니다."}
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
