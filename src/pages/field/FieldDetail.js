import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Cookies from "js-cookie";

const FieldDetail = () => {
    const [enemies, setEnemies] = useState([]);
    const [combatCount, setCombatCount] = useState(1);
    const [selectedEnemy, setSelectedEnemy] = useState(null); // 선택된 적 상태
    const navigate = useNavigate();
    const { fieldId } = useParams();
    const { axiosInstance } = useAuth();

    useEffect(() => {
        axiosInstance.get(`/api/enemy/field/${fieldId}`)
            .then((response) => {
                setEnemies(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [axiosInstance, fieldId]);

    const handleBattleStart = () => {
        if (!selectedEnemy) {
            alert("전투할 적을 선택해주세요.");
            return;
        }

        if (combatCount <= 0) {
            alert("전투 횟수는 1 이상이어야 합니다.");
            return;
        }

        const userId = Cookies.get('userId');
        const enemyId = selectedEnemy;

        navigate(`/combat`, {
            state: { userId, enemyId,  combatCount }
        });


    };

    const handleExplore = () => {
        alert("탐사를 시작합니다!");
    };

    const handleSelectEnemy = (enemyId) => {
        setSelectedEnemy(enemyId === selectedEnemy ? null : enemyId); // 이미 선택된 적을 다시 클릭하면 선택 해제
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>적 목록</h2>
            <div style={styles.enemyList}>
                {enemies.map((enemy) => (
                    <div
                        key={enemy.id}
                        style={{
                            ...styles.enemyItem,
                            ...(selectedEnemy === enemy.id ? styles.selectedEnemy : {}),
                        }}
                        onClick={() => handleSelectEnemy(enemy.id)}
                    >
                        <img src="https://rpg.kr/lib/png.php?enemy/6001" alt={enemy.name} style={styles.enemyImage} />
                        <p style={styles.enemyName}>{enemy.name}</p>
                    </div>
                ))}
            </div>

            <div style={styles.battleContainer}>
                <label htmlFor="battleCount" style={styles.label}>전투 횟수:</label>
                <input
                    type="number"
                    id="battleCount"
                    value={combatCount}
                    onChange={(e) => setCombatCount(Number(e.target.value))}
                    min="1"
                    style={styles.input}
                />
                <button onClick={handleBattleStart} className="logout-btn">전투 시작</button>
            </div>

            <button onClick={handleExplore} style={styles.exploreButton}>탐사하기</button>
        </div>
    );
};

const styles = {
    container: {
        width: '1200px',
        minWidth: '1200px',
        height: '100vh',
        margin: 'auto',
        padding: '20px',
        backgroundColor: '#030303',
        textAlign: 'center',
    },
    title: {
        fontSize: '24px',
        marginTop: '20px',
        marginBottom: '30px',
    },
    enemyList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 0,
        gap: '15px',
        maxWidth: '900px',
    },
    enemyItem: {
        borderRadius: '5px',
        padding: '15px',
        width: '120px',
        textAlign: 'center',
        cursor: 'pointer',
        border: '1px solid #ddd',
        transition: 'transform 0.2s, border-color 0.2s',
    },
    selectedEnemy: {
        borderColor: 'gold',
        transform: 'scale(1.01)',
        boxShadow: '0 0 5px rgba(255, 215, 0, 0.8)',
    },
    enemyImage: {
        width: '100%',
        borderRadius: '5px',
    },
    enemyName: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    battleContainer: {
        marginTop: '20px',
    },
    label: {
        marginRight: '10px',
    },
    input: {
        width: '40px',
        height: '30px',
        fontSize: '16px',
        textAlign: 'center',
        borderRadius: '5px',
    },

    exploreButton: {
        marginTop: '30px',
        padding: '12px 15px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#5744ff',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
    },
};

export default FieldDetail;
