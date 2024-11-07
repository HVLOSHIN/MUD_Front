import React, {useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import Cookies from 'js-cookie';

const Equipment = () => {
    const { axiosInstance } = useAuth();
    const [equipment, setEquipment] = useState();


    useEffect(() => {
        const userId = Cookies.get('userId');
        axiosInstance.get(`/api/user/${userId}/equipment`)
        .then((response) => {
            console.log(response.data);
            setEquipment(response.data);
        })


    })





    return(
      <div></div>
    );
};
export default Equipment;