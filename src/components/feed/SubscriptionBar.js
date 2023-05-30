import React, {useEffect} from "react"
import axios from "axios";
import SubscriptionProfile from "./SubscriptionProfile";

export default function SubscriptionBar() {

    const [subData, setSubData] = React.useState(null);
    const [suggestedData, setSuggestedData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {

        const getSubData = async () => {
            try {
                const response = await
                    axios.get(process.env.REACT_APP_BACKEND_URL+`/user-subscription-list-sorted-by-postdate`,
                        {
                            headers: {
                                'Content-type': 'application/json'
                            },
                            withCredentials: true,
                        });

                console.log("Subscription bar data: ", response.data)

                setSubData(response.data)
                setLoading(false)

            } catch (error) {
                console.log("Get sub data error: ", error)
            }
        }

        const getSuggestedData = async () => {
            try {

                const response = await
                    axios.get(process.env.REACT_APP_BACKEND_URL+`/algo/by-stocks-covered-weighed-by-post-amount`,
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
                console.log("GetSuggestedData error: ", error)
            }
        }


        getSubData();
        getSuggestedData();

    }, [])

    const showSubs = []
    if (subData) {
        for (let i = 0; i < subData.length; i++) {
            const suggestion = subData[i]
            console.log(suggestion.id)
            showSubs.push(
                <div>
                    <SubscriptionProfile
                        key={i}
                        username={subData[i].username}
                        id={suggestion.id}
                    />
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
                        username={suggestion.profileDTO.username}
                        relatedStock={suggestion.stock}
                        id={suggestion.profileDTO.id}
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
                <div>
                    {loading ? (

                        <div>
                            <h3>Subscriptions</h3>
                            <div className="loading-list">
                                <div className="loading-list-item"></div>
                            </div>
                        </div>

                           ) : (

                        <div>
                            <h2>No subscriptions found</h2>
                            <p>Browse our amazing content and start following what interests you!<br/><br/>Here are some suggestions:</p>
                            {showSuggest}
                        </div>
                    )}


                </div>

            }
        </div>
    )
}