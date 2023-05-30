import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import avatar from "../../assets/images/avatar.png";
export default function DashboardProfile(props){

    const [subscribed, setSubscribed] = useState(null);
    const navigate = useNavigate();

    useEffect( () => {

        axios.get(process.env.REACT_APP_BACKEND_URL+`/subscriptions/is-user-subscribed-to?username=${props.userName}`, {withCredentials: true}
        ).then((response) => {
            setSubscribed(response.data)
        })


        },[])

    async function handleSubscription() {
        if (subscribed) {
            console.log("Should unsubscribe")
            await onUnsubscribe(props.name)
        } else {
            console.log("Should subscribe")
            await onSubscribe(props.name)
        }
        console.log(subscribed)
        await axios.get(process.env.REACT_APP_BACKEND_URL+`/subscriptions/is-user-subscribed-to?username=${props.userName}`
        ,{withCredentials:true}
        ).then((response) => {
            setSubscribed(response.data)
        })
    }

    const onSubscribe = async (username) => {

        try {

            await axios.post(
                process.env.REACT_APP_BACKEND_URL+`/subscribe?username=${props.userName}`,
                {},
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }
            )
        } catch(error) {
            navigate(`../Login?Redirect=Dashboard?User=${props.userId}`)
        }

    };

    const onUnsubscribe = async (username) => {
        try {
            console.log('Unsubscribing to:', props.userName);

            await axios.delete(
                process.env.REACT_APP_BACKEND_URL+`/unsubscribe?username=${props.userName}`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true
                }
            )
        } catch(error) {
            console.log("onUnsubscribe",error)
        }
    };


    return (
        <>
            <div className="dashboard-profile-corner">
                <Link to={`../${props.userName}`}>
                    <img width="80px" src={avatar}/>
                </Link>
                <div className ="dashboard-profile-name-and-subscribe-container">
                    <p className="dashboard-profile-name">
                        {props.userName}'s Dashboard
                    </p>
                    {!props.ownDashboard && /*props.loggedIn &&*/
                        <div className="searchpage--profile--subscribtion">
                            <Link to={`${props.name}`}>
                                <h2>{props.name}</h2>
                            </Link>
                            {<button
                                className="dashboard-profile-subscribe"
                                onClick={handleSubscription}
                                style={
                                    subscribed ?
                                        {background: "#f5f3f4"}
                                        :
                                        {background: "#adb5bd", fontWeight: "bold", color: "white"}
                                }
                            >{subscribed ? "Unsubscribe" : "Subscribe"}</button>}
                        </div>
                    }
                </div>
            </div>
        </>

    )
}

