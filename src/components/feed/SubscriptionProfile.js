import React from "react"
import Avatar from "../../assets/images/avatar.png";

export default function SubscriptionProfile(props) {

    return(
        <div style={{
            backgroundColor: "#fff",
            borderRadius: "4px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            padding: "20px",
            width: "250px",
            float: "left",
            marginRight: "20px",
            marginBottom: "20px"
        }}>
            <h3>{props.username}</h3>
            <img src={Avatar} width="50px"/>
        </div>
    )
}