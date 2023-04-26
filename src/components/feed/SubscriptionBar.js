import React, {useEffect} from "react"
import axios from "axios";
import SubscriptionProfile from "./SubscriptionProfile";
import FeedModule from "./FeedModule";


export default function SubscriptionBar() {

    const [subData, setSubData] = React.useState(null);

    useEffect(() => {

        const getData = async () => {
            try {

                const response = await axios.get(`http://localhost:8080/user-subscription-list-sorted-by-postdate`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log("Subscription bar data: ", response.data)

                setSubData(response.data)

            } catch (error) {
                console.log(error)
            }
        }

        getData();

    }, [])

    return (
        <div className="subBar">
            <h3>Subscriptions</h3>
            {subData === null ? (
                <div>Loading</div>
            ) : (
                <div>
                    {subData.map(data => (
                        <div>
                            <SubscriptionProfile username={data.username}/>
                        </div>

                    ))}
                </div>
            )}
        </div>
    )
}