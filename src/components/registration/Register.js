import React, {useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

export default function Register() {
    document.title = "Registration"

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('')
    const [error, setError] = useState(null);
    const [showErrorMessage, setShowErrorMessage] = React.useState(false)

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleCheckPasswordChange(event) {
        setCheckPassword(event.target.value);
    }

    function testToRegister(event) {
        event.preventDefault()
        console.log("im here")
        if (password === checkPassword) {
            console.log("im the same")
            handleSubmit(event)
        } else {
            console.log("im not the same")
            showErrorMessageForDuration(15000)
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        axios.post(process.env.REACT_APP_BACKEND_URL + '/register', {
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
                window.location.href = process.env.REACT_APP_FRONTEND_URL + '/Login/';
            })
            .catch(error => {
                setError(error.response.data.error);
            });
    }

    function showErrorMessageForDuration(duration) {

        console.log(username)

        /* sets the showErrorMessage to true to show the error messages */
        setShowErrorMessage(true);

        /* sets timeout for the duration input and then sets the showErrorMessage to false */
        setTimeout(() => {
            setShowErrorMessage(false);
        }, duration);
    }

    return (
        <div className="register">
            <form onSubmit={testToRegister} className="register--holder">
                <div className="register--title">
                    <h1>Elevate your investments</h1>
                    <p>Sign up now and take control of your financial future</p>
                </div>
                <div className="register--inputs--container">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Username"
                        required
                        maxLength={25}
                    />

                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Email"
                        required
                        maxLength={50}
                    />

                    <div className="register-whitespace"></div>
                    <input
                        type="password"
                        id="password1"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        required
                        maxLength={55}
                    />
                    <input
                        type="password"
                        id="password2"
                        name="password"
                        value={checkPassword}
                        onChange={handleCheckPasswordChange}
                        placeholder="Confirm password"
                        required
                        maxLength={55}
                    />

                </div>
                {error && <div>{error}</div>}
                <button type="submit" className="register--submit">Sign up</button>
                <Link to={"../Login"}>
                    Already have an account? Login here.
                </Link>
            </form>
            {showErrorMessage && (
                <div className="register-error-message">
                    <p>Applied passwords are not the same</p>
                </div>
            )}
        </div>
    );
}