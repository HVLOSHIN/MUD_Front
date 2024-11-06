import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";


const Dashboard = () => {
    const { axiosInstance } = useAuth();

    const [data, setData] = useState(null);


    useEffect(() => {
        const userId = Cookies.get('userId');
        if(userId === undefined){
            return;
        }

        axiosInstance.get(`/api/user/${userId}`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [axiosInstance]);

    // 현재 직업을 RUNNING 상태인 mastery에서 찾기
    const currentMastery = data?.mastery.find((job) => job.jobStatus === "RUNNING");

    return (
        <div className="dashboard-container">
            <main className="dashboard-content">
                {data && (
                    <>
                        <h6 className="dashboard-username">
                            {data.username}님, 환영합니다!
                        </h6>
                        <div className="user-stats">
                            <p>
                                {data.username} ( {data.userStats.level} )
                            </p>
                            <p>
                                <span style={{color: 'white'}}>{currentMastery.job.name}</span> :
                                <span style={{color: 'deepskyblue'}}> {currentMastery.jobMasteryEXP} </span> /
                                <span style={{color: 'white'}}> {currentMastery.job.mastery}</span>
                            </p>
                            <p>
                                행동력 :
                                <span style={{color: 'orange'}}> {data.userStats.currentActionPoints}</span> /
                                <span style={{color: 'white'}}> {data.userStats.maxActionPoints}</span>
                            </p>
                            <p>
                                생명력 :
                                <span style={{color: 'orangered'}}> {data.userStats.hp}</span>
                            </p>

                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
