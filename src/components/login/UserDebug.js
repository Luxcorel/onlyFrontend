import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function UserDebug() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        axios.get('https://onlybackend-production.up.railway.app/user-debug?username=', {withCredentials: true})
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h2>User Debug Information</h2>
            {userData && (
                <ul>
                    <li>User ID: {userData.id}</li>
                    <li>Username: {userData.username}</li>
                    <li>Email: {userData.email}</li>
                    <li>About Me: {userData.aboutMe}</li>
                    <li>Roles: {userData.roles}</li>
                </ul>
            )}
        </div>
    );
}
