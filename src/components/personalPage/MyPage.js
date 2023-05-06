import React, {useEffect, useState} from "react"
import Avatar from "../../assets/images/avatar.png"
import axios from "axios";
import {useNavigate} from "react-router-dom"
import NavBar from "../navBar/NavBar";

export default function PersonalPage() {

    const [reviews, setReviews] = useState([""])
    const [isEditable, setIsEditable] = React.useState(false);
    const [username, setUsername] = React.useState();
    const [userData, setUserData] = React.useState();
    const [isVisible, setIsVisible] = React.useState(false)

    const navigate = useNavigate();

    document.title = `${username}`

    useEffect(() => {

        const fetchData = async () => {
            try {

                //await axios.get("http://localhost:8080/test-login")

                const response1 = await axios.get(`https://onlybackend-production.up.railway.app/principal-username`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then();


                setUsername(response1.data);
                console.log(username)

                const response2 = await axios.get(`https://onlybackend-production.up.railway.app/fetch-about-me?username=${response1.data}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log('API response:', response2.data);
                console.log(username)
                setUserData(response2.data);


            } catch (error) {
                console.error('Error fetching data:', error);
                navigate("/Login")
            }

            const responseReviews = await axios.get(`https://onlybackend-production.up.railway.app/reviews/fetch-all?targetUsername=${username}`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }).then(responseReviews => {
                if (responseReviews.data != null) {
                    console.log(responseReviews.data)
                    setReviews(responseReviews.data)
                    setIsVisible(true)
                }
            });
        };


        fetchData();
    }, [username]);


    function handleTextAreaChange(e) {
        setUserData(e.target.value)
    }

    function handleButtonClick() {
        if (isEditable) {
            setIsEditable(false)
            updateUserText();
        } else {
            setIsEditable(true)
        }
    }

    const updateUserText = async () => {
        try {
            await axios.put(`https://onlybackend-production.up.railway.app/update-about-me`,
                {text: userData},
                {
                    headers: {
                        'Content-type': 'application/json',
                    },
                    withCredentials: true,
                });

            console.log("Puttar: " + userData)

        } catch (error) {
            console.error('Error updating user text:', error);
        }
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

    return (
        <div className="mypage">
            <NavBar/>
            <div className="mypage--background">
                <img
                    src={Avatar}
                    width="100px"
                    className="mypage--img"
                />
            </div>
            <div className="mypage--text--container">
                <h2>{username}</h2>
                <div className="mypage--bio--container">
                    {isEditable ? (
                        <textarea
                            value={userData}
                            onChange={handleTextAreaChange}
                            rows={5}
                            cols={30}
                            maxLength={700}
                            className="mypage--bio"
                        />
                    ) : (
                        <p>{userData}</p>
                    )}
                    <button onClick={handleButtonClick}>{isEditable ? 'Save' : 'Edit'}</button>
                </div>
            </div>
            <div className="personalPage-review-section">
                {isVisible && showReviews}
            </div>
        </div>
    )
}