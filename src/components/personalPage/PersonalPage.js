import React, {useEffect} from "react"
import Avatar from "../../assets/images/avatar.png"
import axios from "axios";
import {useParams} from "react-router-dom";
import NavBar from "../navBar/NavBar";

export default function PersonalPage() {

    const {username} = useParams();
    const [userData, setUserData] = React.useState();
    const [error, setError] = React.useState(null)

    document.title =`${username}`

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(`https://onlybackend-production.up.railway.app/fetch-about-me-with-sub-info?username=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log('API response:', response.data);
                setUserData(response.data);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    // Handle 400 error
                    console.error('Bad Request:', error);
                    setError("User not found")
                } else {
                    console.error('Error fetching data:', error);
                    setError("Failed to load page")
                }
            }
        };

        fetchData();
    }, [username]);

    async function handleClick() {
        if (userData.subscribed) {
            await onUnsubscribe();
        } else {
            await onSubscribe()
        }
        await updateUserData();
    }

    const onSubscribe = async () => {

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
        } catch (error) {
            console.log(error)
        }
    };

    const onUnsubscribe = async () => {
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
        } catch (error) {
            console.log(error)
        }
    };

    async function updateUserData() {
        try {
            const response = await axios.get(`https://onlybackend-production.up.railway.app/fetch-about-me-with-sub-info?username=${username}`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                });

            console.log('API response:', response.data);
            setUserData(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    if (!userData) {
        return (
            <div>Loading</div>
        )
    }


    return (
        <div>
            {error ? <p>{error}</p> : (
                <div className="personalPage">
                    <NavBar/>
                    <div className="personalPage--background">
                        <img
                            src={Avatar}
                            width="100px"
                            className="mypage--img"
                        />
                    </div>
                    <div className="mypage--text--container">
                        <h2>{username}</h2>
                        <div className="mypage--bio--container">
                            <p>{userData.aboutMe}</p>
                            <button onClick={handleClick}>{userData.subscribed ? "Unsubscribe" : "Subscribe"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
