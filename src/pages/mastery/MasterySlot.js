import React, { useState, useEffect } from 'react';
import '../equipment/Equipment.css';
import { useAuth } from '../../context/AuthContext';
import { useMastery } from '../../context/MasteryContext';
import { useStat } from "../../context/StatContext";

const MasterySlot = () => {
    const { equippedMastery, setEquippedMastery } = useMastery();
    const { axiosInstance } = useAuth();
    const { stats } = useStat();
    const [selectedSkills, setSelectedSkills] = useState(equippedMastery);

    useEffect(() => {
        setSelectedSkills(equippedMastery);
    }, [equippedMastery]);

    useEffect(() => {
        setEquippedMastery(selectedSkills);
    },[selectedSkills])

    const isValidStatus = (status) => ['RUNNING', 'MASTER_RUNNING'].includes(status);

    // 스킬 상태 맵핑 함수
    const getUpdatedStatus = (currentStatus) => {
        const statusMap = {
            'NOT_STARTED': 'RUNNING',
            'HOLD': 'RUNNING',
            'MASTER': 'MASTER_RUNNING',
            'RUNNING': 'HOLD',
            'MASTER_RUNNING': 'MASTER'
        };
        return statusMap[currentStatus] || null;
    };

    // 스킬 상태 토글 함수
    const toggleSkill = async (skill, skillType) => {
        const currentStatus = skill[`${skillType}SkillStatus`];
        const updatedStatus = getUpdatedStatus(currentStatus);
        if (!updatedStatus) return; // 상태가 유효하지 않으면 아무 작업도 하지 않음
        const updatedSkills = selectedSkills.map((s) =>
            s.jobId === skill.jobId ? { ...s, [`${skillType}SkillStatus`]: updatedStatus } : s
        );
        setSelectedSkills(updatedSkills);
        await updateMasteryOnServer(skill, skillType, updatedStatus);
    };

    const updateMasteryOnServer = async (skill, skillType, updatedStatus) => {
        const userMasteryDTO = {
            userId: skill.userId,
            jobId: skill.jobId,
            jobStatus: skill.jobStatus,
            passiveSkillStatus: skillType === 'passive' ? updatedStatus : skill.passiveSkillStatus,
            activeSkillStatus: skillType === 'active' ? updatedStatus : skill.activeSkillStatus,
            jobMasteryEXP: skill.jobMasteryEXP,
            activeSkillId: skill.activeSkillId,
            activeSkillMasteryEXP: skill.activeSkillMasteryEXP,
            passiveSkillId: skill.passiveSkillId,
            passiveSkillMasteryEXP: skill.passiveSkillMasteryEXP,
            job: skill.job,
        };

        try {
            const response = await axiosInstance.put("/api/user/mastery", userMasteryDTO);
            updateSkillStatusFromResponse(response);
        } catch (error) {
            console.error('Error updating mastery:', error);
        }
    };

    const updateSkillStatusFromResponse = (response) => {
        // 응답 데이터의 구조가 배열이 아닐 수 있기 때문에 구조를 확인하고 데이터를 처리
        const updatedSkills = response.data && Array.isArray(response.data)
            ? response.data : [];
        if (updatedSkills.length > 0) {
            const updatedSkillsMap = updatedSkills.reduce((map, skill) => {
                map[skill.jobId] = skill; // jobId를 기준으로 맵핑
                return map;
            }, {});

            // 상태 업데이트
            const newSkills = selectedSkills.map((skill) => {
                const updatedSkill = updatedSkillsMap[skill.jobId];
                if (updatedSkill) {
                    return { ...skill, ...updatedSkill }; // 서버에서 받은 상태로 업데이트
                }
                return skill;
            });
            setSelectedSkills(newSkills);
        }
    };

    const calculateTotalAP = () => {
        return selectedSkills.reduce((total, skill) => {
            const activeAP = skill.job.activeSkills && isValidStatus(skill.activeSkillStatus)
                ? skill.job.activeSkills.requiredAP
                : 0;
            const passiveAP = skill.job.passiveSkills && isValidStatus(skill.passiveSkillStatus)
                ? skill.job.passiveSkills.requiredAP
                : 0;
            return total + activeAP + passiveAP;
        }, 0);
    };

    // 스킬 행 렌더링 함수
    const renderSkillRow = (skill, skillType) => {
        const skillData = skill.job[`${skillType}Skills`];
        if (!skillData) return null;

        const isEquipped = isValidStatus(skill[`${skillType}SkillStatus`]);
        const masteryEXP = skill[`${skillType}SkillMasteryEXP`];
        const masteryText = masteryEXP >= skillData.mastery ? "Master" : `${masteryEXP}/${skillData.mastery}`;
        const skillName = skillData.name;

        return (
            <tr key={`${skill.jobId}-${skillType}`} className={isEquipped ? 'equipped-skill' : ''}>
                <td>{skillName}</td>
                <td>{skillType}</td>
                <td>{skillData.requiredAP}</td>
                <td>{masteryText}</td>
                <td>{skillData.chance ? `${skillData.chance}%` : '-'}</td>
                <td>{skillData.description}</td>
                <td>
                    <button onClick={() => toggleSkill(skill, skillType)}>
                        {isEquipped ? '탈착' : '장착'}
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div className="mastery-container">
            <table className="stats-table">
                <thead>
                <tr>
                    <th>이름</th>
                    <th>구분</th>
                    <th>AP</th>
                    <th>숙련도</th>
                    <th>발동률</th>
                    <th>설명</th>
                    <th>장착/탈착</th>
                </tr>
                </thead>
                <tbody>
                {equippedMastery.map((skill) => (
                    <React.Fragment key={skill.jobId}>
                        {renderSkillRow(skill, 'active')}
                        {renderSkillRow(skill, 'passive')}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            <div>
                <h4 className="stats-section-title">AP: {calculateTotalAP()} / {stats.ap}</h4>
            </div>
        </div>
    );
};
export default MasterySlot;
