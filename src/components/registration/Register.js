import React, {useState} from 'react';
import axios from 'axios';

export default function Register() {
    document.title ="Registration"

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        axios.post('https://onlybackend-production.up.railway.app/register', {
            email: email,
            username: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
            .then(response => {
                window.location.href = 'https://onlyfrontend-production.up.railway.app/Login/';
            })
            .catch(error => {
                setError(error.response.data.error);
            });
    }

    return (
        <div className="register">
            <form onSubmit={handleSubmit} className="register--holder">
                <div className="register--title">
                    <h1>Elevate your investments</h1>
                    <p>Sign up now and take control of your financial future</p>
                </div>
                <div className="register--inputs--container">

                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Email"
                        required
                    />

                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        required/>
                </div>
                {error && <div>{error}</div>}
                <button type="submit" className="register--submit">Sign up</button>
            </form>
        </div>
    );
}