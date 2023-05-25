import React, {useEffect} from "react"
import axios from "axios";
import {Link} from "react-router-dom";
import Avatar from "../../assets/images/avatar.png";

export default function SubscriptionsNavbar() {

    const [subData, setSubData] = React.useState(null);

    useEffect(() => {

        const getSubData = async () => {
            try {

                const response = await
                    axios.get(process.env.REACT_APP_BACKEND_URL+"/fetch-current-user-subscriptions", {withCredentials: true}).then((response) => {
                        setSubData(response.data)
                    })

                console.log("Subscription bar data: ", response.data)

                setSubData(response.data)

            } catch (error) {
                console.log("Get sub data error: ", error)
            }
        }

        getSubData();

    }, [])

    const showSubs = []
    if (subData) {
        for (let i = 0; i < subData.length; i++) {
            const suggestion = subData[i]
            console.log(suggestion.id)
            showSubs.push(
                <div className="profile-card">
                    <img src={Avatar} width="50px"/>
                    <Link to={`/Dashboard?user=${suggestion.id}`}>
                        <h3>{subData[i].username}</h3>
                    </Link>
                </div>
            )
        }
    }


    return (
        <div>
            {subData ?
                <div className="navbar-subs">
                    <h2>Subscriptions</h2>
                    {showSubs}
                </div>
                :
                <div className="no-subs">
                    <h2>No subscriptions found</h2>
                </div>

            }
        </div>
    )
}