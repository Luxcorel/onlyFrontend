import React, {useState} from 'react';
import axios from 'axios';

export default function Login() {
    document.title="Login"

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        axios
            .post(
                'https://onlybackend-production.up.railway.app/plz',
                `username=${username}&password=${password}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    withCredentials: true,
                }
            )
            .then(() => {
                window.location.href = 'https://onlyfrontend-production.up.railway.app/Dashboard';
            })
            .catch((error) => {
                setError(error.response.data.error);
            });
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit} className="login--holder">
                <div className="login--titel">
                    <h1>Log in</h1>
                    <p>Welcome to OnlyFin, please put your credentals below to start using the website</p>
                </div>
                <div className="login--inputs">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                        className="form-control"
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-control"
                        placeholder="Password"
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login--submit">
                    Log in
                </button>
            </form>
        </div>
    );
}
