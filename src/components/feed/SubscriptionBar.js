import React, {useEffect} from "react"
import axios from "axios";
import SubscriptionProfile from "./SubscriptionProfile";
import Avatar from "../../assets/images/avatar.png";

export default function SubscriptionBar() {

    const [subData, setSubData] = React.useState(null);
    const [suggestedData, setSuggestedData] = React.useState(null);

    useEffect(() => {

        const getSubData = async () => {
            try {

                const response = await
                    axios.get(`https://onlybackend-production.up.railway.app/user-subscription-list-sorted-by-postdate`,
                        {
                            headers: {
                                'Content-type': 'application/json'
                            },
                            withCredentials: true,
                        });

                console.log("Subscription bar data: ", response.data)

                setSubData(response.data)

            } catch (error) {
                console.log("Get sub data error: ", error)
            }
        }

        const getSuggestedData = async () => {
            try {

                const response = await
                    axios.get(`https://onlybackend-production.up.railway.app/algo/by-stocks-covered-weighed-by-post-amount`,
                        {
                            headers: {
                                'Content-type': 'application/json'
                            },
                            withCredentials: true,
                        });

                console.log("Suggested subscribers bar data: ",
                    response.data)

                setSuggestedData(response.data)

            } catch (error) {
                console.log(error)
            }
        }


        getSubData();
        getSuggestedData();

    }, [])

    const showSubs = []
    if (subData) {
        for (let i = 0; i < subData.length; i++) {
            const suggestion = subData[i]
            showSubs.push(
                <div>
                    <SubscriptionProfile key={i} username={subData[i].username}/>
                </div>
            )
        }
    }

    const showSuggest = []
    if (suggestedData) {
        for (let i = 0; i < suggestedData.length; i++) {
            const suggestion = suggestedData[i]
            showSuggest.push(
                <div>
                    <SubscriptionProfile
                        key={i}
                        username={suggestedData[i].profileDTO.username}
                        relatedStock={suggestedData[i].stock}
                    />
                </div>
            )
        }
    }


    return (
        <div className="subBar">
            {subData ?
                <div>
                    <h3>Subscriptions</h3>
                    {showSubs}

                    <div className="suggestionBar">
                        <h3>Suggested</h3>
                        {showSuggest}
                    </div>
                </div>
                :
                <h1>Your subscriptions will appear here</h1>
            }
        </div>
    )
}