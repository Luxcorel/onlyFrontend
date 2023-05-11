import React from "react"
import {Link} from "react-router-dom";
import homeIcon from "../../assets/icons/home.png"
import Profile from "../../assets/icons/profile-user-svgrepo-com.svg"
import Avatar from "../../assets/images/avatar.png";
import axios from "axios";
import 'boxicons'


/*
Make logout function (POST / logout)
 */

async function logout() {
    try {
        await axios.post(process.env.REACT_APP_BACKEND_URL+`/logout`,
            {},
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true,
            });

    } catch (error) {
        console.log(error)
    }

    window.location.replace(process.env.REACT_APP_FRONTEND_URL);
}

export default function NavBar() {

    return (
        <div className="navbar-container">
            <Link to="/mypage">
                <span className="navbar--img--line">
                        <box-icon name='user'/>
                </span>
            </Link>
            <Link to="/feed">
                <div className="navbar--icon">
                    <box-icon name='home'></box-icon>
                </div>

            </Link>
            <Link to="/searchpage">
                <div className="navbar--icon">
                    <box-icon name='search'></box-icon>
                </div>
            </Link>
            <Link to="../Dashboard">
                <div className="navbar--icon">
                    <box-icon name='news'></box-icon>
                </div>
            </Link>
            <Link to="/Studio">
                <div className="navbar--icon">
                    <box-icon name='add-to-queue'></box-icon>
                </div>
            </Link>
            <div className="navbar--icon">
                <box-icon name='exit' onClick={logout}></box-icon>
            </div>


        </div>
    )
}