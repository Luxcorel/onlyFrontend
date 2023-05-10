import React from "react"
import {Link, NavLink} from "react-router-dom";
import mallDashboard from "../../assets/images/mallDashboard.png";
import studioPic from "../../assets/images/studio.png";

export default function Home() {
    document.title = "OnlyFin"
    return (
        <div className="welcome">
            <nav className="welcome--navbar">
                <h2 className="welcome--navbar--title">OnlyFin</h2>
                <ul className="navbar--text">
                    <li>
                        <NavLink to="Login">
                            Log in
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="welcome--hero">
                <h1>Welcome to <span className="welcome--hero--fin">OnlyFin</span></h1>
                <h2>Create your own analysis...</h2>
                <img className="welcome--hero--image" src={studioPic}/>
                <h2>...and share it with people around the world on your dashboard</h2>
                <img className="welcome--hero--image" src={mallDashboard}/>
                <Link to='Register'>
                    <button className="welcome--hero--button">Get Started</button>
                </Link>
            </div>
        </div>

    )
}