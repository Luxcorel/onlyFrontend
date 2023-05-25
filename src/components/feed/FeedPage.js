import React from "react"
import Feed from "./Feed"
import SubscriptionBar from "./SubscriptionBar";
import {useNavigate} from "react-router-dom";

export default function FeedPage() {

    document.title = "Feed"

    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate("/Login");
    };

    return (
        <Feed
            redirectToLogin={redirectToLogin}
        />
    )
}