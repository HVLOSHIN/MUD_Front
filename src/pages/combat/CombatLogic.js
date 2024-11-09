import React, {useEffect, useState} from 'react';
import './Combat.css';
import {useAuth} from "../../context/AuthContext";

const CombatLogic = ({user, enemy, userCombat, enemyCombat, activeSkills, combatCount}) => {
    const [logContainers, setLogContainers] = useState([]);
    const [victoryMessages, setVictoryMessages] = useState([]);
    const {axiosInstance} = useAuth();

    const userMaxHP = parseInt(userCombat.HP);
    const enemyMaxHP = parseInt(enemyCombat.HP);
    const userDLY = parseInt(userCombat.DLY);
    const enemyDLY = parseInt(enemyCombat.DLY);
    let userCurrentHp = userMaxHP; // 기본 HP 값
    let enemyCurrentHp = enemyMaxHP; // 기본 HP 값
    const TIME = 1000 * 60;
    let totalDamage = 0;
    let maxDamage = 0;

    const createCombatLogEntry = (timestamp, type, name, actName, finalDamage, userDisplay, enemyDisplay, isCritical = false) => ({
        timestamp,
        type,
        name,
        actName,
        finalDamage,
        userDisplay,
        enemyDisplay,
        isCritical
    });

    const updateHealth = (userId, newHp) => {
        axiosInstance.put('/api/user/hp', {userId, newHp})
            .catch(error => console.error('HP 업데이트 실패 : ', error));
    };

    const updateEXP = (userId, quantity) => {
        axiosInstance.put('/api/user/exp', {userId, quantity})
            .catch(error => console.error('EXP 업데이트 실패 : ', error));
    }

    const updateAchieve = (userId, totalDamage, maxDamage, killCount) => {
        axiosInstance.put('/api/user/achieve', {userId, totalDamage, maxDamage, killCount})
            .catch(error => console.error('Achieve 업데이트 실패 : ', error));
    }

    const handleVictory = (enemyCurrentHp, index) => {
        if(combatCount === 1){
            if (enemyCurrentHp <= 0) {
                setVictoryMessages(prevMessages => [
                    `${enemy.name}에게 승리했다! \n생명력이 ${user.userStats.hp}에서 ${user.userStats.hp + enemy.giveHP}로 ${enemy.giveHP} 증가했다!`
                ]);
                updateHealth(user.userid, user.userStats.hp + enemy.giveHP);
                updateEXP(user.userid, 1);
                updateAchieve(user.userid, totalDamage, maxDamage, 1);
            } else {
                setVictoryMessages(prevMessages => [
                    `${enemy.name}에게 패배했다...`
                ]);
                updateHealth(user.userid, user.userStats.hp);
                updateAchieve(user.userid, totalDamage, maxDamage, 0);
            }
        }
        else {


            const battleNumber = index + 1;
            const battlePrefix = `${battleNumber}번째 전투 `; // 2번째 전투부터 번호 출력

            if (enemyCurrentHp <= 0) {
                setVictoryMessages(prevMessages => [
                    ...prevMessages,
                    `${battlePrefix}${enemy.name}에게 승리했다! \n생명력이 ${user.userStats.hp}에서 ${user.userStats.hp + enemy.giveHP}로 ${enemy.giveHP} 증가했다!`
                ]);
                updateHealth(user.userid, user.userStats.hp + enemy.giveHP);
                updateEXP(user.userid, 1);
                updateAchieve(user.userid, totalDamage, maxDamage, 1);
            } else {
                setVictoryMessages(prevMessages => [
                    ...prevMessages,
                    `${battlePrefix}${enemy.name}에게 패배했다...`
                ]);
                updateHealth(user.userid, user.userStats.hp);
                updateAchieve(user.userid, totalDamage, maxDamage, 0);
            }
        }
    };

    const handleTimeOut = () => {
        setVictoryMessages(prevMessages => [
            ...prevMessages,
            `시간 초과 \n  ${enemy.name}에게 패배했다...`
        ]);
        updateHealth(user.userid, user.userStats.hp);
    };

    const calculateDamage = (base, defense, isMA) => {
        const rawDamage = Math.floor(Math.random() * (base * 0.4)) + (base * 0.8);
        const defenseValue = isMA ? defense.MD : defense.PD;
        return rawDamage - rawDamage * defenseValue * 0.01;
    };

    const calculateCombatLog = (index) => {
        const combatLog = [];
        let userTime = userDLY;
        let enemyTime = enemyDLY;

        const userTurn = () => {
            let actName;
            let baseDamage;
            let finalDamage;
            let skillActivated = false;
            let critical = false;

            for (const skill of activeSkills) {
                if (Math.random() * 100 < skill.chance) {
                    actName = skill.name;
                    const effect = skill.effects.find(effect => effect.effectType === 'PA' || effect.effectType === 'MA');
                    if (effect) {
                        const isMA = effect.effectType === 'MA';
                        baseDamage = isMA ? userCombat.MA * effect.value : userCombat.PA * effect.value;
                        finalDamage = Math.floor(calculateDamage(baseDamage, enemyCombat, isMA));
                        skillActivated = true;
                        break;
                    }
                }
            }
            if (!skillActivated) {
                actName = "공격";
                baseDamage = userCombat.PA;
                finalDamage = Math.floor(calculateDamage(baseDamage, enemyCombat, false));
            }

            if (Math.random() * 100 < userCombat.CT) {
                finalDamage = Math.floor(finalDamage + (finalDamage * userCombat.CD * 0.01));
                critical = true;
            }
            enemyCurrentHp -= finalDamage;

            totalDamage += finalDamage;
            if (maxDamage < finalDamage) {
                maxDamage = finalDamage;
            }

            combatLog.push(createCombatLogEntry(userTime, 'user', user.username, actName, finalDamage, userCurrentHp, enemyCurrentHp, critical));
            userTime += userDLY;
        };

        const enemyTurn = () => {
            const actName = "공격";
            const baseDamage = enemyCombat.PA;
            const damage = Math.floor(Math.random() * (baseDamage * 0.4)) + (baseDamage * 0.8);
            const finalDamage = Math.max(damage - Math.floor(damage * userCombat.PD * 0.01), 1);
            userCurrentHp -= finalDamage;

            combatLog.push(createCombatLogEntry(enemyTime, 'enemy', enemy.name, actName, finalDamage, userCurrentHp, enemyCurrentHp));
            enemyTime += enemyDLY;
        };

        while (userCurrentHp > 0 && enemyCurrentHp > 0) {
            if (userTime > TIME || enemyTime > TIME) break;
            if (userTime <= enemyTime) {
                userTurn();
            } else {
                enemyTurn();
            }
        }

        if (userTime > TIME || enemyTime > TIME) {
            handleTimeOut();
        } else {
            handleVictory(enemyCurrentHp, index); // 전투 번호 전달
        }

        const chunkedLogContainers = [];
        for (let i = 0; i < combatLog.length; i += 10) {
            chunkedLogContainers.push(combatLog.slice(i, i + 10));
        }
        setLogContainers(chunkedLogContainers);
    };

    useEffect(() => {
        if (!userCombat || !enemyCombat) return;
        for (let i = 0; i < combatCount; i++) {
            calculateCombatLog(i); // 전투 번호를 전달
        }
    }, [userCombat, enemyCombat, combatCount]);

    const displayContent = () => {
        if (combatCount === 1) {
            return (
                <div className="combat-log">
                    {logContainers.map((chunk, index) => (
                        <div key={index} className="combat-log-container">
                            {chunk.map((entry, i) => (
                                <div key={i} className={`log-entry ${entry.type === 'user' ? 'user-log' : 'enemy-log'}`}>
                                    {i === 0 && (
                                        <div className="health-status">
                                            <div className="user-health">
                                                {entry.user} <br/>
                                                {entry.userDisplay} / {userMaxHP}
                                            </div>
                                            <div className="enemy-health">
                                                {enemy.name} <br/>
                                                {entry.enemyDisplay} / {enemyMaxHP}
                                            </div>
                                        </div>
                                    )}
                                    <span className="combat-log-timestamp">{`${(entry.timestamp / 1000).toFixed(1)}s`}</span>
                                    <br/>
                                    <span>
                                        <span className="name">{entry.name}의 </span>
                                        <span className="act-name">{entry.actName}! </span>
                                        <span className={entry.isCritical ? 'critical-damage' : ''}>
                                            {entry.finalDamage}의 피해를 입혔다.
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                    {victoryMessages.map((message, index) => (
                        <div key={index} className="victory-message">
                            {message} <br/>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="victory-message">
                     {victoryMessages.map((message, index) => (
                         <div key={index} className="victory-message">
                             {message} <br/>
                         </div>
                     ))}
                </div>
            );
        }
    };

    return displayContent();
};

export default CombatLogic;
