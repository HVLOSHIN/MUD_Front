import React, {useEffect, useState} from 'react';
import { useAuth } from '../context/AuthContext';

function Hello() {
    const {axiosInstance } = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        axiosInstance.get('/api/user')
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [axiosInstance]);

    return (
        <div>

        </div>
    );
}

export default Hello;
