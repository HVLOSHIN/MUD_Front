import React, { useEffect, useState } from 'react';
import './Combat.css';

const CombatLogic = ({ user, enemy, userCombat, enemyCombat }) => {
    const [logContainers, setLogContainers] = useState([]);
    const [victoryMessage, setVictoryMessage] = useState('');

    const userMaxHP = parseInt(userCombat.HP);
    const enemyMaxHP = parseInt(enemyCombat.HP);
    const userDLY = parseInt(userCombat.DLY);
    const enemyDLY = parseInt(enemyCombat.DLY);
    let userCurrentHp = userMaxHP; // 기본 HP 값
    let enemyCurrentHp = enemyMaxHP; // 기본 HP 값

    useEffect(() => {
        if (!userCombat || !enemyCombat) return;

        const calculateCombatLog = () => {
            const combatLog = [];

            let userTime = userDLY;
            let enemyTime = enemyDLY;

            const userTurn = () => {
                const actName = "공격";
                const baseDamage = userCombat.PA;
                const damage = Math.floor(Math.random() * (baseDamage * 0.4)) + (baseDamage * 0.8);
                const finalDamage = Math.max(damage - Math.floor(damage * enemyCombat.PD * 0.01), 1);
                enemyCurrentHp -= finalDamage;

                combatLog.push({
                    timestamp: userTime,
                    type: 'user',
                    message: `${user.username}의 ${actName} ${finalDamage}의 피해를 입혔다.`,
                    userDisplay: userCurrentHp,
                    enemyDisplay: enemyCurrentHp
                });
                userTime += userDLY;
            }

            const enemyTurn = () => {
                const actName = "공격";
                const baseDamage = enemyCombat.PA;
                const damage = Math.floor(Math.random() * (baseDamage * 0.4)) + (baseDamage * 0.8);
                const finalDamage = Math.max(damage - Math.floor(damage * userCombat.PD * 0.01), 1);
                userCurrentHp -= finalDamage;

                combatLog.push({
                    timestamp: enemyTime,
                    type: 'enemy',
                    message: `${enemy.name}의 ${actName} ${finalDamage}의 피해를 입혔다.`,
                    userDisplay: userCurrentHp,
                    enemyDisplay: enemyCurrentHp
                });
                enemyTime += enemyDLY;
            }

            while (userCurrentHp > 0 && enemyCurrentHp > 0) {
                if (userTime <= enemyTime) {
                    userTurn();
                } else {
                    enemyTurn();
                }
            }

            if (enemyCurrentHp <= 0) {
                setVictoryMessage('유저 승리!');
            } else {
                setVictoryMessage('적 승리!');
            }

            // 10개씩 끊어서 컨테이너로 나눔
            const chunkedLogContainers = [];
            for (let i = 0; i < combatLog.length; i += 10) {
                chunkedLogContainers.push(combatLog.slice(i, i + 10));
            }

            setLogContainers(chunkedLogContainers);
        };

        calculateCombatLog();
    }, [userCombat, enemyCombat]);

    return (
        <div className="combat-log">
            {logContainers.map((chunk, index) => (
                <div key={index} className="combat-log-container">
                    {chunk.map((entry, i) => (
                        <div key={i} className={`log-entry ${entry.type === 'user' ? 'user-log' : 'enemy-log'}`}>
                            {i === 0 && (
                                <div className="health-status">
                                    <div className="user-health">
                                        {user.username} <br/>
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
                            <span>{entry.message}</span>
                        </div>
                    ))}
                </div>
            ))}
            <div className="victory-message">
                {victoryMessage}
            </div>
        </div>
    );
};

export default CombatLogic;
