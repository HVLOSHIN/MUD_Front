import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

const MasteryContext = createContext();
export const useMastery = () => {
    return useContext(MasteryContext);
};

const isValidStatus = (status) => {
    const validStatuses = ['RUNNING', 'MASTER_RUNNING','MASTER'];
    return validStatuses.includes(status);
};

export const MasteryProvider = ({ children }) => {
    const { axiosInstance } = useAuth();
    const whitelistPaths = ['/stats', '/mastery', '/combat'];
    const [mastery, setMastery] = useState([]);
    const [equippedMastery, setEquippedMastery] = useState([]);
    const [jobEffects, setJobEffects] = useState({});
    const [skillEffects, setSkillEffects] = useState({});
    const location = useLocation();

    const activeSkills =
        equippedMastery
            .filter(mastery => mastery.activeSkillStatus === "RUNNING" || mastery.activeSkillStatus === "MASTER_RUNNING")
            .flatMap(mastery => mastery.job.activeSkills)
            .sort((a, b) => b.priority - a.priority);

    useEffect(() => {
        if (!whitelistPaths.includes(location.pathname)) {
            return;
        }
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}/mastery`)
            .then((response) => {
                setMastery(response.data);

                const validMastery = response.data.filter(
                    (skill) =>
                        isValidStatus(skill.jobStatus)
                );
                setEquippedMastery(validMastery);

            })
            .catch((error) => console.error('불러오기 실패:', error));
    }, [axiosInstance, location.pathname]);

    // 직업 효과 종합
    useEffect(() => {
        const newJobEffects = mastery.reduce((acc, masteryItem) => {
            if (isValidStatus(masteryItem.jobStatus)) {
                masteryItem.job.effects.forEach(effect => {
                    const { effectType, value } = effect;
                    acc[effectType] = (acc[effectType] || 0) + value;
                });
            }
            return acc;
        }, {});
        setJobEffects(newJobEffects);
    }, [mastery, setEquippedMastery]);

    // 스킬 효과 종합
    useEffect(() => {
        const newSkillEffects = equippedMastery.reduce((acc, masteryItem) => {
            if (masteryItem.passiveSkillStatus === "RUNNING" || masteryItem.passiveSkillStatus === "MASTER_RUNNING") {
                masteryItem.job.passiveSkills.effects.forEach(effect => {
                    const { effectType, value } = effect;
                    acc[effectType] = (acc[effectType] || 0) + value;
                });
            }
            return acc;
        }, {});
        setSkillEffects(newSkillEffects);
    }, [equippedMastery, setEquippedMastery]);

    return (
        <MasteryContext.Provider value={{ mastery, setMastery, equippedMastery, jobEffects, skillEffects, setEquippedMastery, activeSkills }}>
            {children}
        </MasteryContext.Provider>
    );
};
