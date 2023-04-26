import React from "react"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


export default function FeedModule(props) {


    return(
        <div>
            <p>{props.posterOfContent}</p>
            <p>{props.postDate}</p>
            <p>{props.stock}</p>
            <HighchartsReact
                highcharts={Highcharts}
                options={props.chart}
            />
        </div>

    )

}