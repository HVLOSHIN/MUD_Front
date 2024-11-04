import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import {useParams} from "react-router-dom";

const Field = () => {
    const [enemies, setEnemies] = useState([]);
    const {fieldId} = useParams();
    const { axiosInstance } = useAuth();

    useEffect(() => {
        // 필드 데이터 가져오기
        axiosInstance.get(`/api/enemy/${fieldId}`)
            .then((response) => {
                setEnemies(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }, [axiosInstance]);


    return (
        <div>

        </div>
    );
};


export default Field;
