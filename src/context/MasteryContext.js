import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

const MasteryContext = createContext();
export const useMastery = () => {
    return useContext(MasteryContext);
};

// 직업 및 스킬 상태가 유효한지 검사하는 유틸리티 함수
const isValidStatus = (status) => {
    const validStatuses = ['RUNNING', 'MASTER_RUNNING', 'MASTER'];
    return validStatuses.includes(status);
};

export const MasteryProvider = ({ children }) => {
    const { axiosInstance } = useAuth();
    const whitelistPaths = ['/stats', '/mastery', '/combat'];
    const [mastery, setMastery] = useState([]);
    const [jobEffects, setJobEffects] = useState({});
    const [skillEffects, setSkillEffects] = useState({});
    const location = useLocation();

    // API 호출하여 마스터 정보 불러오기
    useEffect(() => {
        if (!whitelistPaths.includes(location.pathname)) {
            return;
        }
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}/mastery`)
            .then((response) => {
                setMastery(response.data);
            })
            .catch((error) => console.error('불러오기 데 실패했습니다:', error));
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
        console.log(newJobEffects);
    }, [mastery]);

    // 스킬 효과 종합
    useEffect(() => {
        const newSkillEffects = mastery.reduce((acc, masteryItem) => {
            if (isValidStatus(masteryItem.jobStatus) && isValidStatus(masteryItem.passiveSkillStatus)) {
                masteryItem.job.passiveSkills.effects.forEach(effect => {
                    const { effectType, value } = effect;
                    acc[effectType] = (acc[effectType] || 0) + value;
                });
            }
            return acc;
        }, {});
        setSkillEffects(newSkillEffects);
        console.log(newSkillEffects);
    }, [mastery]);

    return (
        <MasteryContext.Provider value={{ mastery, jobEffects, skillEffects }}>
            {children}
        </MasteryContext.Provider>
    );
};
