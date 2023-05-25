import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom";
import homeIcon from "../../assets/icons/home.png"
import Profile from "../../assets/icons/profile-user-svgrepo-com.svg"
import Avatar from "../../assets/images/avatar.png";
import axios from "axios";
import 'boxicons'
import SubscriptionBar from "../feed/SubscriptionBar";
import SubscriptionsNavbar from "./SubscriptionsNavbar";


/*
Make logout function (POST / logout)
 */


async function logout() {
    try {
        await axios.post(process.env.REACT_APP_BACKEND_URL + `/logout`,
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

    const [loggedIn, setLoggedIn] = useState(false)
    const [userId, setUserId] = useState(null)
    const [userName, setUserName] = useState(null)
    const [subs, setSubs] = useState([])
    const [slideDivUp, setSlideDivUp] = useState(false)
    const [divHeight, setDivHeight] = useState('8%')
    const viewportWidth = window.innerWidth;


    function slideDiv() {
        setSlideDivUp(prevState => !prevState)
        setDivHeight(slideDivUp ? '8%' : '90%')
    }


    useEffect(() => {
        try {
            axios.get(process.env.REACT_APP_BACKEND_URL+"/fetch-current-user-id", {withCredentials: true}).then((response) => {
                setLoggedIn(true)
                setUserId(response.data)
            })
            axios.get(process.env.REACT_APP_BACKEND_URL+"/principal-username", {withCredentials: true}).then((response) => {
                setUserName(response.data)
            })


        } catch (e) {

        }
    }, []);

    if (loggedIn) {

        return (
            <div>
                {viewportWidth >= 800 ? (
                    <div className="navbar-container">
                        <Link to="/mypage">
                    <span className="navbar--img--line">
                        <box-icon name='user'/>
                    </span>
                        </Link>

                        <div className="navbar-icon-container">
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
                            <Link to={`../Dashboard?User=${userId}`}>
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
                    </div>
                ) : (
                    <div>
                        <div
                            className="navbar-container"
                            style={{
                                height: divHeight,
                                transition: 'height 0.3s ease'
                            }}
                        >
                            {slideDivUp ? (
                                <div className="navbar-slide-container">
                                    <div className="navbar-header">
                                        <div className="profile-data">
                                            <Link to="/mypage">
                                                <box-icon name='user'/>
                                            </Link>
                                            <h3>{userName}</h3>
                                        </div>
                                        <div onClick={slideDiv} className="slide-out">
                                            <box-icon type='solid' name='chevrons-down'></box-icon>
                                        </div>
                                    </div>
                                    <SubscriptionsNavbar/>

                                </div>
                            ) : (
                                <div className="navbar-icon-container">

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
                                    <Link to={`../Dashboard?User=${userId}`}>
                                        <div className="navbar--icon">
                                            <box-icon name='news'></box-icon>
                                        </div>
                                    </Link>
                                    <Link to="/Studio">
                                        <div className="navbar--icon">
                                            <box-icon
                                                name='add-to-queue'
                                            ></box-icon>
                                        </div>
                                    </Link>
                                    <div
                                        className="navbar-change"
                                        onClick={slideDiv}
                                    >
                                        <box-icon type='solid' name='chevrons-up'></box-icon>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                )}

            </div>
        )
    } else {
        return (
            <div>
                {viewportWidth > 800 ? (
                    <div className="navbar-container">
                        <Link to="../Login?Redirect=mypage">
                <span className="navbar--img--line">
                        <box-icon name='user'/>
                </span>
                        </Link>
                        <div className="navbar-icon-container">
                            <Link to="/Login?Redirect=Feed">
                                <div className="navbar--icon">
                                    <box-icon name='home'></box-icon>
                                </div>
                            </Link>
                            <Link to="/searchpage">
                                <div className="navbar--icon">
                                    <box-icon name='search'></box-icon>
                                </div>
                            </Link>
                            <Link to="../Login?Redirect=Dashboard">
                                <div className="navbar--icon">
                                    <box-icon name='news'></box-icon>
                                </div>
                            </Link>
                            <Link to="/Studio">
                                <div className="navbar--icon">
                                    <box-icon name='add-to-queue'></box-icon>
                                </div>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="navbar-container">
                        <Link to="../Login?Redirect=mypage">
                <span className="navbar--img--line">
                        <box-icon name='user'/>
                </span>
                        </Link>
                        <div className="navbar-icon-container">
                            <Link to="/Login?Redirect=Feed">
                                <div className="navbar--icon">
                                    <box-icon name='home'></box-icon>
                                </div>
                            </Link>
                            <Link to="/searchpage">
                                <div className="navbar--icon">
                                    <box-icon name='search'></box-icon>
                                </div>
                            </Link>
                            <Link to="../Login?Redirect=Dashboard">
                                <div className="navbar--icon">
                                    <box-icon name='news'></box-icon>
                                </div>
                            </Link>
                            <Link to="/Studio">
                                <div className="navbar--icon">
                                    <box-icon name='add-to-queue'></box-icon>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        )
    }
}