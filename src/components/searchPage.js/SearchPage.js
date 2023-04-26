import React, {useEffect} from "react"
import SearchBar from "./SearchBar";
import axios from "axios";
import Profile from "./Profile";
import NavBar from "../navBar/NavBar";

export default function SearchPage() {

    const [searchData, setSearchData] = React.useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://onlybackend-production.up.railway.app/search-all-analysts-include-sub-info`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log('All analysts: ' , response.data);
                setSearchData(response.data);

                response.data.map(data => {
                    console.log(data.subscribed)
                })


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const getAllAnalysts = () => {
        axios.get(`https://onlybackend-production.up.railway.app/search-all-analysts-include-sub-info`,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true,
            }

        )
            .then(response => {
                console.log('API response:', response.data);
                setSearchData(response.data)

            })
            .catch(error => {

                console.error('API error:', error);

            });
    }


    const onSearch = (searchTerm) => {
        console.log('Performing search with searchTerm:', searchTerm);

        axios.get(`https://onlybackend-production.up.railway.app/search-analyst-include-sub-info?search=${searchTerm}`,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true,
            }

            )
            .then(response => {

                //console.log('API response:', response.data[0].username);
                setSearchData(response.data)

            })
            .catch(error => {

                console.error('API error:', error);

            });
    };


    async function handleSubscription(username, subscribed) {
        if (subscribed) {
            await onUnsubscribe(username)
        } else {
            await onSubscribe(username)
        }
        await updateSearchData();
    }

    async function updateSearchData() {
        try {
            const response = await axios.get(`https://onlybackend-production.up.railway.app/search-all-analysts-include-sub-info`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                });
            setSearchData(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    const onSubscribe = async (username) => {

        try {
            console.log('Subscribing to:', username);

            await axios.post(
                `https://onlybackend-production.up.railway.app/subscribe?username=${username}`,
                {},
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }
            )
        } catch(error) {
            console.log(error)
        }

    };

    const onUnsubscribe = async (username) => {
        try {
            console.log('Unsubscribing to:', username);

            await axios.delete(
                `https://onlybackend-production.up.railway.app/unsubscribe?username=${username}`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true
                }
            )
        } catch(error) {
            console.log(error)
        }
    };




    return(
        <div className="search--body">
            <NavBar/>
            <div className="search--header">
                <h1>Discover analysts</h1>
            </div>
            <SearchBar onSearch={onSearch} classname="search--search"/>

            {searchData === null ? (
                <div>Failed to get search result</div>
            ) : (
                <div
                    className="search--profile--container"
                >
                    {searchData.map(data => (
                        <div className="search--profile--tab">
                            <Profile
                                key={data.profile.id}
                                name={data.profile.username}
                                function={() => handleSubscription(data.profile.username, data.subscribed)}
                                isSubscribed = {data.subscribed}
                            >
                            </Profile>
                        </div>

                    ))}
                </div>
            )}
            <button onClick={getAllAnalysts}>Get all analysts</button>
        </div>

    )
}
