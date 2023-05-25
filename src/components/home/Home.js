import React from "react"
import {Link, NavLink} from "react-router-dom";
import Dashboard from "../../assets/images/Dashboard.png";
import Discover from "../../assets/images/Discover.png";
import Visualize from "../../assets/images/Visualize.png";
import Monetize from "../../assets/images/Monetize.jpg";
import GetAhead from "../../assets/images/GetAhead.jpg";

export default function Home() {
    document.title = "OnlyFin"

    function handleClick() {
        return <Link to="Register"/>
    }

    return (
        <div className="welcome">
            <nav className="welcome--navbar">
                <h2 className="welcome--navbar--title">OnlyFin <span>beta</span></h2>
                <ul className="navbar--text">
                    <li>
                        <NavLink to="Login">
                            Log in
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="welcome--hero">
                <h1 className="welcome--hero--fin">The OnlyFans<br/>of investing</h1>
                <p className="welcome--hero--p">Make money on your stock<br/>market analysis</p>

                <div className="welcome--hero--buttons--container">
                    <Link to="Register">
                        <div className="welcome--hero--buttons">
                            <button onClick={handleClick}>Get Started</button>
                        </div>
                    </Link>

                    <Link to="searchpage">
                        <div className="welcome--hero--buttons">
                            <button onClick={handleClick}>Explore</button>
                        </div>
                    </Link>
                </div>


                <img className="welcome--hero--image" src={Dashboard}/>

                <div className="welcome-section-two">
                    <div className="welcome-section-two-content-left">
                        <h2>Discover <span>world-class</span> analysts</h2>
                        <p>Find and follow world-class stock market analysts. Access strategies and insights from brilliant analysts with a proven track record of success.</p>
                    </div>
                    <div className="welcome-section-two-content-right">
                        <img src={Discover} alt="Discover" />
                    </div>
                </div>

                <div className="welcome-section-three">
                    <div className="welcome-section-three-content-left">
                        <img src={Visualize} alt="Discover" />
                    </div>
                    <div className="welcome-section-three-content-right">
                        <h2><span>Visualize</span> and Share Your Analysis</h2>
                        <p>Visualize and share your stock market analysis with unprecedented power. Gain recognition, build your expert reputation, and empower yourself with data-driven insights.</p>
                    </div>
                </div>

                <div className="welcome-section-four">
                    <div className="welcome-section-four-content-left">
                        <h2>Monetize Your Analysis <span>Coming Soon</span></h2>
                        <p>Soon, we will introduce the option for analysts to monetize their analysis.
                             Giving you the ability to earn a substantial income doing what you love most—analyzing the stock market.</p>
                    </div>
                    <div className="welcome-section-four-content-right">
                        <img src={Monetize} alt="Monetize" />
                    </div>
                </div>

                <div className="welcome-section-five">
                    <div className="welcome-section-five-content-left">
                        <img src={GetAhead} alt="GetAhead" />
                    </div>
                    <div className="welcome-section-five-content-right">
                        <h2>Get ahead of<br/>the curve</h2>
                        <p>Start building your name and reputation today by trying our platform and sharing your valuable insights on social media.

                            Together, we're revolutionizing the way we understand and profit from the stock market.</p>
                    </div>
                </div>

            </div>
        </div>

    )
}