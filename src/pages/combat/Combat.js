import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import {useEquipment} from "../../context/EquipmentContext";
import {useMastery} from "../../context/MasteryContext";
import { calculateUserStats, calculateEnemyStats } from '../../utils/statCalculator';
import CombatTable from './CombatTable';
import CombatLogic from "./CombatLogic";

const Combat = () => {
    const location = useLocation();
    const { userId, enemyId, combatCount } = location.state || {};
    const [enemy, setEnemy] = useState([]);
    const [user, setUser] = useState([]);
    const [userCombat, setUserCombat] = useState(null);
    const [enemyCombat, setEnemyCombat] = useState(null);
    const { equipTotalEffects } = useEquipment();
    const {jobEffects, skillEffects, activeSkills} = useMastery();
    const { axiosInstance } = useAuth();

    useEffect(() => {
        const fetchUserAndEnemyData = async () => {
            try {
                const [userResponse, enemyResponse] = await Promise.all([
                    axiosInstance.get(`/api/user/${userId}`),
                    axiosInstance.get(`/api/enemy/${enemyId}`)
                ]);
                setUser(userResponse.data);
                setEnemy(enemyResponse.data);
                setUserCombat(calculateUserStats(userResponse.data, equipTotalEffects, skillEffects, jobEffects));
                setEnemyCombat(calculateEnemyStats(enemyResponse.data));
            } catch (error) {
                console.error('Failed to fetch combat data:', error);
            }
        };
        fetchUserAndEnemyData();
    }, [axiosInstance, userId, enemyId]);


    return (
        <div className="combat-container">
        <div style={{display: 'flex', justifyContent: 'space-around', width: '700px', margin: 'auto'}}>
            {userCombat && <CombatTable title={user.username} combatData={userCombat}/>}
            {enemyCombat && <CombatTable title={enemy.name} combatData={enemyCombat}/>}
        </div>
            <div>
            {userCombat && enemyCombat && (
                <CombatLogic user={user} enemy={enemy} userCombat={userCombat} enemyCombat={enemyCombat} activeSkills={activeSkills} combatCount={combatCount} />)}
            </div>
        </div>
    );
};

export default Combat;
