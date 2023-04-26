import React, {useEffect} from "react"
import Avatar from "../../assets/images/avatar.png";
import {Link} from "react-router-dom";

export default function Profile(props) {
    const [subscribed, setSubscribed] = React.useState(props.isSubscribed)


    return (
        <div className="searchpage--profile">
            <img src={Avatar} className="searchpage--profile--image"/>
            <div className="searchpage--profile--subscribtion">
                <Link to={`${props.name}`}>
                    <h2>{props.name}</h2>
                </Link>
                {<button
                    onClick={props.function}
                    style={
                        props.isSubscribed ?
                            {background: "#f5f3f4"}
                            :
                            {background: "#adb5bd", fontWeight: "bold", color: "white"}
                    }
                >{props.isSubscribed ? "Unsubscribe" : "Subscribe"}</button>}
            </div>
        </div>
    )
}