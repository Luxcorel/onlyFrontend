import React, {useEffect} from "react"
import axios from "axios";
import SubscriptionProfile from "./SubscriptionProfile";

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

    return (
        <div>
            <div className="subBar">
                <h3>Subscriptions</h3>
                {subData === null || suggestedData === null ? (
                    <div>Loading</div>
                ) : (
                    <div>
                        {subData.map((data, index) => (
                            <div>
                                <SubscriptionProfile key={index} username={data.username}/>
                            </div>

                        ))}

                        <div className="suggestionBar">
                            <h3>Suggested</h3>
                            {suggestedData.map((data, index) => (
                                <div>
                                    <SubscriptionProfile
                                        key={index}
                                        username={data.profileDTO.username}
                                        relatedStock={data.stock.name}
                                    />
                                </div>

                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}