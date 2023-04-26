import React from "react"
import {Link} from "react-router-dom";
import homeIcon from "../../assets/icons/home.png"
import studioIcon from "../../assets/icons/studio.png"
import Avatar from "../../assets/images/avatar.png";
import axios from "axios";


/*
Make logout function (POST / logout)
 */

async function logout() {
    try {
        await axios.post(`https://onlybackend-production.up.railway.app/logout`,
            {},
            { headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true,
            });

    } catch (error) {
        console.log(error)
    }

    window.location.replace("http://localhost:3000");
}

export default function NavBar() {
    return (
        <div className="navbar-container">
            <Link to="/mypage">
                <span className="navbar--img--line">
                    <img src={Avatar} alt="My page" title="My page" className="navbar--img"/>
                </span>
            </Link>
            <Link to="/Dashboard">
                <img className="navbar--icon" src={homeIcon} alt="Home" title="Home"/>
            </Link>
            <Link to="/Studio">
                <img className="navbar--icon" src={studioIcon} alt="Studio" title="Studio"/>
            </Link>
            <Link to="/searchpage">
                <img className="navbar--icon" src={homeIcon} alt="Search page"/>
            </Link>
            <Link to="/feed">
                <img className="navbar--icon" src={homeIcon} alt="Feed"/>
            </Link>

            <button className="navbar--logout" onClick={logout}/>
        </div>
    )
}