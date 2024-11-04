import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { calculateUserStats, calculateEnemyStats } from '../../utils/statCalculator';
import CombatTable from './CombatTable'; // CombatTable 컴포넌트를 import

const Combat = () => {
    const location = useLocation();
    const { userId, enemyId } = location.state || {};
    const [enemy, setEnemy] = useState([]);
    const [user, setUser] = useState([]);
    const [userCombat, setUserCombat] = useState(null);
    const [enemyCombat, setEnemyCombat] = useState(null);
    const { axiosInstance } = useAuth();

    useEffect(() => {
        axiosInstance.get(`/api/user/${userId}`)
            .then((response) => {
                setUser(response.data);
                const calculatedStats = calculateUserStats(response.data);
                setUserCombat(calculatedStats);
            })
            .catch((error) => {
                console.error(error);
            });

        axiosInstance.get(`/api/enemy/${enemyId}`)
            .then((response) => {
                setEnemy(response.data);
                const calculatedStats = calculateEnemyStats(response.data);
                setEnemyCombat(calculatedStats);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [axiosInstance, userId, enemyId]);

    return (
        <div className="combat-container">
        <div style={{display: 'flex', justifyContent: 'space-around', width: '900px', margin: 'auto'}}>
            {userCombat && <CombatTable title="User Stats" combatData={userCombat}/>}
            {enemyCombat && <CombatTable title="Enemy Stats" combatData={enemyCombat}/>}
        </div>
        </div>
    );
};

export default Combat;
