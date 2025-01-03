import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import {hover} from "@testing-library/user-event/dist/hover"; // 추가

const Field = () => {
    const [fields, setFields] = useState([]);
    const [usrFields, setUsrFields] = useState([]);
    const { axiosInstance } = useAuth();
    const navigate = useNavigate(); // 추가

    useEffect(() => {
        // 필드 데이터 가져오기
        axiosInstance.get(`/api/field`)
            .then((response) => {
                setFields(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        // 사용자 필드 상태 가져오기
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}/field`)
            .then((response) => {
                setUsrFields(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [axiosInstance]);

    // 해금된 필드만 필터링
    const unlockedFields = fields.filter(field =>
        usrFields.some(usrField => usrField.fieldId === field.id && usrField.fieldStatus === "UNLOCKED")
    );

    // 필드 클릭 시 이동하는 핸들러
    const handleFieldClick = (fieldId) => {
        navigate(`/field/${fieldId}`); // 필드 ID에 따라 이동
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.h2}>전장 목록</h2>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.header}>전장 이름</th>
                    <th style={styles.header}>권장 레벨</th>
                    <th style={styles.header}>설명</th>
                </tr>
                </thead>
                <tbody>
                {unlockedFields.length > 0 ? (
                    unlockedFields.map(field => (
                        <tr key={field.id} style={styles.row} onClick={() => handleFieldClick(field.id)}>
                            <td style={styles.cell}>{field.name}</td>
                            <td style={styles.cell}>{field.minLevel}</td>
                            <td style={styles.cell}>{field.description}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" style={styles.cell}>해금된 전장이 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    h2: {
        marginTop: '70px'
    },
    container: {
        width: '1200px',
        minWidth: '1240px',
        height: '100vh',
        display: 'flex',
        backgroundColor: '#030303',
        flexDirection: 'column',
        margin: 'auto',
        alignItems: 'center',
    },
    table: {
        width: '80%',
        borderCollapse: 'collapse',
        marginTop: '30px',


    },
    header: {
        backgroundColor: '#363636',
        padding: '20px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        transition: 'background-color 0.2s',
        cursor: 'pointer', // 커서 포인터 추가
    },

    cell: {
        padding: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #363636',
    },
};

export default Field;
