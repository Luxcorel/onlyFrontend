import React, {useEffect} from "react"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {Link} from "react-router-dom";


export default function FeedModule(props) {

    useEffect(() => {
            console.log(props)
        }, []
    )

    return (
        <div className="feed--new--charts">
            <div className="feed-chart-titel">
                <h1>{props.posterOfContent.username}</h1>
                <h5>Published: {props.postDate}</h5>
            </div>
            <div className="feed-chart-stocks-name">
            <h3>{props.stock}</h3>
            <Link to={`../Dashboard?User=${props.posterOfContent.id}&CategoryId=${props.category.id}`}>
                <p>{props.category.name}</p>
            </Link>
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                options={props.chart}
            />
        </div>

    )

}