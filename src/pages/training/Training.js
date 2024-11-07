import React, {useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './Training.css'; // 일반 CSS 파일 import

const Training = () => {
    const { axiosInstance } = useAuth();
    const [trainingCount, setTrainingCount] = useState({
        strength: 0,
        dexterity: 0,
        intelligence: 0,
    });

    const [HP, setHP] = useState(0);
    const [level, setLevel] = useState(0);
    const [statValues, setStatValues] = useState({
        strength: 0,
        dexterity: 0,
        intelligence: 0,
    });

    useEffect(() => {
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}/stats`)
            .then(response => {
                setHP(response.data.hp);
                setLevel(response.data.level);
                setStatValues({
                    strength: response.data.strength,
                    dexterity: response.data.dexterity,
                    intelligence: response.data.intelligence,
                });
            })
            .catch(error => console.error(error));
    }, [axiosInstance]);

    const calcExperience = (level) => {
        return Math.floor(10 * Math.log(level + 5) - 25);
    };

    const getRequiredLife = (stat) => {
        const baseLevel = statValues[stat];
        return calcExperience(baseLevel + 1);
    };

    const handleTrain = (stat, action) => {
        const cost = getRequiredLife(stat);

        if (action === 'increase') {
            if (HP > cost) {
                setTrainingCount(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
                setHP(prevHP => prevHP - cost);
                setStatValues(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
                setLevel(prevLevel => prevLevel + 1);
            } else {
                alert('생명력이 부족합니다.');
            }
        } else if (action === 'decrease' && trainingCount[stat] > 0) {
            setTrainingCount(prev => ({ ...prev, [stat]: prev[stat] - 1 }));
            setHP(prevHP => prevHP + cost);
            setStatValues(prev => ({ ...prev, [stat]: prev[stat] - 1 }));
            setLevel(prevLevel => prevLevel - 1);
        }
    };

    const handleCompleteTraining = () => {
        const userId = Cookies.get('userId');
        axiosInstance.post(`/api/user/${userId}/training`, {
            strength: statValues.strength,
            dexterity: statValues.dexterity,
            intelligence: statValues.intelligence,
            hp: HP,
            level: level,
        })
            .then(response => {
                alert('훈련 완료!');
                window.location.reload();
            })
            .catch(error => console.error('훈련 완료 처리 실패:', error));
    };

    const statItems = [
        { name: 'strength', label: '근력' },
        { name: 'dexterity', label: '기민' },
        { name: 'intelligence', label: '지능' },
    ];

    return (
        <div className="training-container">
            <h2 className="training-header">훈련</h2>
            <table className="training-table">
                <thead>
                <tr>
                    <th>현재스탯</th>
                    <th>훈련횟수</th>
                    <th>필요생명</th>
                </tr>
                </thead>
                <tbody>
                {statItems.map(stat => (
                    <tr key={stat.name}>
                        <td>{`${stat.label} ${statValues[stat.name]}`}</td>
                        <td>
                            <button
                                className="training-button"
                                onClick={() => handleTrain(stat.name, 'decrease')}
                            >
                                -
                            </button>
                            {trainingCount[stat.name]}
                            <button
                                className="training-button"
                                onClick={() => handleTrain(stat.name, 'increase')}
                            >
                                +
                            </button>
                        </td>
                        <td>{getRequiredLife(stat.name)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="training-life">
                <p className="training-level-P">레벨 : {level}</p>
                <p className="training-life-P">HP : {HP}</p>
                <p>주의! 체력이 너무 낮으면 전투가 힘들어질 수 있습니다.</p>
                <button className="training-button" onClick={handleCompleteTraining}>
                    훈련
                </button>
            </div>

        </div>
    );
};

export default Training;
