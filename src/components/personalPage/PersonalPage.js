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
    const [subscribed, setSubscribed] = React.useState(0)
    const textareaRef = React.useRef()
    const autoscrollRef = React.useRef(null)
    const [toScroll, setToScroll] = useState(true)

    document.title = `${username}`

    const [scrollPos, setScrollPos] = useState(0);
    //const [scrollDir, setScrollDir] = useState(true); use this for autoscroll to the left

    const handleHovering = () => {
        setToScroll(false)
    }
    const handleNotHovering = () => {
        setToScroll(true)
    }

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            const element = autoscrollRef.current;
            if (element && toScroll) {
                //if (scrollDir) {
                if (element.scrollLeft < element.scrollWidth - element.clientWidth) {
                    setScrollPos(scrollPos + 1);
                    element.scrollLeft += 1;
                }
                /*else {
                        setScrollDir(false);
                    }
                 }*/ // use this for autoscroll to the left (have to be fixed to work properly)
            }
        }, 50);
        return () => clearInterval(scrollInterval);
    }, [/*scrollDir, */ toScroll]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseReviews = await axios.get(process.env.REACT_APP_BACKEND_URL + `/reviews/fetch-all?targetUsername=${username}`,
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

                const responseIsPosted = await axios.get(process.env.REACT_APP_BACKEND_URL + `/reviews/get-my-review?targetUsername=${username}`,
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
        if (!userData) {
            const redirectTimer = setTimeout(() => {
                window.location.href = '/login';
            }, 1000); // Delay of 3 seconds (adjust as needed)

            return () => clearTimeout(redirectTimer); // Clear the timer if the component unmounts before the redirect
        }
    }, [userData]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const responseTargetUser = await axios.get(process.env.REACT_APP_BACKEND_URL + `/fetch-about-me-with-sub-info?username=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseTargetUser => {
                    console.log(responseTargetUser.data)
                    setUserData(responseTargetUser.data);
                });

                const responseUser = await axios.get(process.env.REACT_APP_BACKEND_URL + `/principal-username`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseUser => {

                    console.log('You are:', responseUser.data);
                    setPersonalName(responseUser.data)

                });


                const responseSubscribers = await axios.get(process.env.REACT_APP_BACKEND_URL + `/subscriptions/get-subscribe-count?targetUsername=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseSubscribers => {
                    setSubscribed(responseSubscribers.data)
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
                process.env.REACT_APP_BACKEND_URL + `/subscribe?username=${username}`,
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
                process.env.REACT_APP_BACKEND_URL + `/unsubscribe?username=${username}`,
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
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL + `/fetch-about-me-with-sub-info?username=${username}`,
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
                process.env.REACT_APP_BACKEND_URL + `/reviews/post`,
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

        window.location.reload()

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
                    <p
                        className="personalPage-review-card-post-area-text"
                    >
                        {review.reviewText}
                    </p>
                </div>
            </div>
        )
    }


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
                        <p className="mypage-subscribed"><span className="subscribed-count">{subscribed}</span> Subs</p>
                        <div className="mypage--bio--container">
                            <p>{userData.aboutMe}</p>
                            <div className="mypage-buttons">
                                {<button
                                    onClick={handleClick}
                                    className="personalPage-review-card-edit"
                                    style={
                                        userData.subscribed ?
                                            {background: "#f5f3f4"}
                                            :
                                            {background: "#adb5bd", fontWeight: "bold", color: "white"}
                                    }
                                >{userData.subscribed ? "Unsubscribe" : "Subscribe"}</button>}
                            </div>
                        </div>
                    </div>
                    <div className="edit-review-button">

                        {isPosted &&

                            <box-icon
                                name='edit-alt'
                                onClick={revertIsPosted}
                                className="personalPage-review-card-edit"
                            >
                            </box-icon>
                        }
                    </div>
                    {isPosted ?
                        ( reviews ?
                                (

                            <div>
                                <div className="personalPage-review-section"
                                     ref={autoscrollRef}
                                     onMouseEnter={handleHovering}
                                     onMouseLeave={handleNotHovering}
                                     style={{overflowX: "auto", whiteSpace: "nowrap"}}
                                >
                                    {isVisible && showReviews}
                                </div>
                            </div>



                                )
                                :
                                (
                                    <div className="loader-container" style={{marginTop: "400px"}}>
                                        <div className="loader"></div>
                                    </div>)


                        )
                        :
                        (
                            <div className="personalPage-review-section"
                                 style={{overflowX: "auto", whiteSpace: "nowrap"}}
                            >
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
                                                ref={textareaRef}
                                                value={reviewText}
                                                onChange={makeReview}
                                                rows={5}
                                                cols={30}
                                                maxLength="150"
                                                className="review-text-area"
                                            />
                                        <button className="personalPage-review-card-edit" onClick={posted}>Post</button>
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
