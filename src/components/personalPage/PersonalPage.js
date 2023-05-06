import React, {useEffect, useState} from "react";
import Avatar from "../../assets/images/avatar.png";
import axios, {postForm} from "axios";
import {useParams} from "react-router-dom";
import NavBar from "../navBar/NavBar";

export default function PersonalPage() {

    const {username} = useParams();
    const [userData, setUserData] = React.useState();
    const [error, setError] = React.useState(null)
    const [personalName, setPersonalName] = useState()
    const [reviewText, setReviewText] = useState()
    const [isPosted, setIsPosted] = useState(false);
    const [reviews, setReviews] = useState()
    const [isVisible, setIsVisible] = React.useState(false)

    document.title = `${username}`

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseReviews = await axios.get(`https://onlybackend-production.up.railway.app/reviews/fetch-all?targetUsername=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseReviews => {
                    if (responseReviews.data !== null) {
                        console.log("test", responseReviews.data)
                        setReviews(responseReviews.data)
                        if (reviews !== null) {
                            setIsVisible(true)
                            console.log(isVisible, "is Visible")
                        }
                    }
                });

                const responseIsPosted = await axios.get(`https://onlybackend-production.up.railway.app/reviews/get-my-review?targetUsername=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseIsPosted => {
                    if (responseIsPosted.status == 200) {
                        setIsPosted(true)
                    }
                });


            } catch (error) {
                if (error.response && error.response.status === 500) {
                    setIsPosted(false)
                    console.error('Bad Request:', error);
                }

                if (error.response && error.response.status === 400) {
                    // Handle 400 error
                    console.error('Bad Request:', error);
                    setError("User not found")
                }
            }
        }
        fetchData()
        console.log("page is updated")
    }, [username])

    useEffect(() => {

        const fetchData = async () => {
            try {
                const responseTargetUser = await axios.get(`https://onlybackend-production.up.railway.app/fetch-about-me-with-sub-info?username=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseTargetUser => {
                    console.log(responseTargetUser.data)
                    setUserData(responseTargetUser.data);
                });

                const responseUser = await axios.get(`https://onlybackend-production.up.railway.app/principal-username`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseUser => {

                    console.log('You are:', responseUser.data);
                    setPersonalName(responseUser.data)

                });


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
    }, []);

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


    async function posted() {
        setIsPosted(true)
        await post()
    }

    const post = async () => {

        try {
            console.log('Posting review to:', username);

            await axios.put(
                `https://onlybackend-production.up.railway.app/reviews/post`,
                {targetUsername: username, reviewText: reviewText},
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.log(error)
        }
    };

    function makeReview(e) {
        setReviewText(e.target.value)
    }

    const showReviews = []
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i]
        showReviews.push(
            <div key={review.id} className="personalPage-review-card">
                <div className="personalPage-review-card-header">
                    <img src={Avatar} style={{
                        width: 50,
                        height: 50
                    }}/>
                    <h3>{review.author}</h3>
                </div>
                <div className="personalPage-review-card-post-area">
                    <p>{review.reviewText}</p>
                </div>
            </div>
        )
    }


    /*
        const showReviews = reviews.map(review => {
            return (
                <div key={review.id}>
                    <div className="personalPage-review-card-header">
                        <img src={Avatar} style={{
                            width: 50,
                            height: 50
                        }}/>
                        <h3>{review.author}</h3>
                    </div>
                    <div className="personalPage-review-card-post-area">
                        <p>{review.reviewText}</p>
                    </div>
                </div>
            )
        })
    */
    const revertIsPosted = () => {
        setIsPosted(false)
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
                    {isPosted ?
                        (
                            <div className="personalPage-review-section">
                                {isVisible && showReviews}
                                <button onClick={revertIsPosted} className="personalPage-review-card-edit">edit</button>
                            </div>
                        )
                        :
                        (
                            <div className="personalPage-review-section">
                                <div className="personalPage-review-card">

                                    <div className="personalPage-review-card-header">

                                        <img src={Avatar} style={{
                                            width: 50,
                                            height: 50
                                        }}/>
                                        <h3>{personalName}</h3>
                                    </div>
                                    <div className="personalPage-review-card-post-area">
                                            <textarea
                                                value={reviewText}
                                                onChange={makeReview}
                                                rows={5}
                                                cols={30}
                                                maxLength={700}
                                                className=""
                                            />
                                        <button onClick={posted}>Post</button>
                                    </div>
                                </div>
                                {isVisible && showReviews}
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
}
