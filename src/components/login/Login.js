import React, {useState} from 'react';
import axios from 'axios';
import {useLocation, useNavigate, Link} from "react-router-dom";

export default function Login() {
    document.title = "Login"

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get("Redirect") || null;
    const navigate = useNavigate();
    const [showErrorMessage, setShowErrorMessage] = React.useState(false)

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        axios.post(
            process.env.REACT_APP_BACKEND_URL + '/plz',
            `username=${username}&password=${password}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true,
            }
        )
            .then(() => {
                if (redirect == null) {
                    navigate('../Feed')
                } else {
                    navigate(`../${redirect}`)
                }

            })
            .catch((error) => {
                setError(error.response.data.error);
                showErrorMessageForDuration(15000)
            });
        console.log(redirect)
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
        <div className="login">
            <form onSubmit={handleSubmit} className="login--holder">
                <div className="login--titel">
                    <h1>Log in</h1>
                    <p>Welcome to OnlyFin, please put your credentals below to start using the website</p>
                </div>
                <div className="login--inputs">
                    <input
                        type="email"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                        className="form-control"
                        placeholder="Email"
                        maxLength={50}
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-control"
                        placeholder="Password"
                        maxLength={100}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login--submit">
                    Log in
                </button>
                <Link to={"../Register"}>
                    Not a user? Register here.
                </Link>
            </form>
            {showErrorMessage && (
                <div className="login-error-message">
                    <p>Please check if your username or password is correct</p>
                </div>
            )}
        </div>
    );
}
