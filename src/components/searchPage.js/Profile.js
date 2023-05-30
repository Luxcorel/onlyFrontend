import React, {useEffect} from "react"
import Avatar from "../../assets/images/avatar.png";
import {Link} from "react-router-dom";
import axios from "axios";

export default function Profile(props) {
    const [subscribed, setSubscribed] = React.useState(props.isSubscribed)

    async function handleSubscription() {
        if (subscribed) {
            console.log("Should unsubscribe")
            await onUnsubscribe(props.name)
        } else {
            console.log("Should subscribe")
            await onSubscribe(props.name)
        }
        await updateSearchData();
    }

    async function updateSearchData() {
        try {
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL+`/search-all-analysts-include-sub-info`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                });
            setSubscribed((prevValue) => !prevValue);
        } catch (error) {
            console.log("Error when updating search data",error)
        }
    }

    const onSubscribe = async (username) => {

        try {
            console.log('Subscribing to:', username);

            await axios.post(
                process.env.REACT_APP_BACKEND_URL+`/subscribe?username=${username}`,
                {},
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }
            )
        } catch(error) {
            console.log("onSubscribe",error)
        }

    };

    const onUnsubscribe = async (username) => {
        try {
            console.log('Unsubscribing to:', username);

            await axios.delete(
                process.env.REACT_APP_BACKEND_URL+`/unsubscribe?username=${username}`,
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
        <div className="searchpage--profile">
            <img src={Avatar} className="searchpage--profile--image"/>
            <div className="searchpage--profile--subscribtion">
                <Link to={`/Dashboard?User=${props.id}`} className="custom-link">
                    <h2>{props.name}</h2>
                </Link>
                {<button
                    onClick={handleSubscription}
                    style={
                        subscribed ?
                            {background: "#f5f3f4"}
                            :
                            {background: "#adb5bd", fontWeight: "bold", color: "white"}
                    }
                >{subscribed ? "Unsubscribe" : "Subscribe"}</button>}
            </div>
        </div>
    )
}