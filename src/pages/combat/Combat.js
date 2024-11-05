import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { calculateUserStats, calculateEnemyStats } from '../../utils/statCalculator';
import CombatTable from './CombatTable';
import CombatLogic from "./CombatLogic"; // CombatTable 컴포넌트를 import

const Combat = () => {
    const location = useLocation();
    const { userId, enemyId } = location.state || {};
    const [enemy, setEnemy] = useState([]);
    const [user, setUser] = useState([]);
    const [userCombat, setUserCombat] = useState(null);
    const [enemyCombat, setEnemyCombat] = useState(null);
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
                setUserCombat(calculateUserStats(userResponse.data));
                setEnemyCombat(calculateEnemyStats(enemyResponse.data));
                console.log("user" , user, userCombat);
                console.log("enemy", enemy, userCombat);
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
                <CombatLogic user={user} enemy={enemy} userCombat={userCombat} enemyCombat={enemyCombat}/>)}
            </div>
        </div>
    );
};

export default Combat;
