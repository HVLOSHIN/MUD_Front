import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";

const Dashboard = () => {
    const { axiosInstance } = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}`)
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [axiosInstance]);

    return (
        <div className="dashboard-container">
            <main className="dashboard-content">
                {data && (
                    <>
                        <h6 className="dashboard-username">
                            {data.username}님, 환영합니다!
                        </h6>
                        <div className="user-stats">
                            <p>체력: {data.userStats.hp}</p>
                            <p>행동력: {data.userStats.currentActionPoints} / {data.userStats.maxActionPoints}</p>
                            <p>현재 직업: {data.mastery[0]?.job.name}</p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
