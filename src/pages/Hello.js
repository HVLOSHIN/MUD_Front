import React, {useEffect, useState} from 'react';
import axios from 'axios';


function Hello() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/user')
            .then((response) => console.log(response.data))
            .catch((error) => console.log(error))
    },[]);

    return (
        <div>

        </div>
    );
}

export default Hello;
