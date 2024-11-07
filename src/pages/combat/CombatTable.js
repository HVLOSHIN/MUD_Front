import React from 'react';
import './Combat.css';

const CombatTable = ({ title, combatData }) => {
    const entries = Object.entries(combatData);

    return (
        <div className="combat-table-container">
            <h2 className="combat-table-title">{title}</h2>
            <table className="combat-table">
                <tbody>
                {entries.map(([, value], index) => (
                    index >= 9 ? null : // 인덱스가 5 이상일 경우 null을 반환하여 렌더링 중단
                        index % 2 === 0 ? ( // 짝수 인덱스일 때만 새로운 행을 시작
                            <tr key={index}>
                                <td>{entries[index][0]}</td>
                                <td>{value}</td>
                                {entries[index + 1] && ( // 다음 항목이 있을 경우
                                    <>
                                        <td>{entries[index + 1][0]}</td>
                                        <td>{entries[index + 1][1]}</td>
                                    </>
                                )}
                            </tr>
                        ) : null // 짝수 인덱스가 아닐 경우에는 아무 것도 렌더링하지 않음
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CombatTable;
