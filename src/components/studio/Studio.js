import React, {useState} from "react"
import StudioToolbar from "./studioToolbar/StudioToolbar";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios"
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import NavBar from "../navBar/NavBar";

export default function Studio() {
    document.title = "Studio"

    /* colorscheme for the datasets */
    const colorscheme = [
        {index: 0, color: "#79d06e"},
        {index: 1, color: "#da6868"},
        {index: 2, color: "#cfd574"},
        {index: 3, color: "#c99664"},
        {index: 4, color: "#6384d2"},
    ];

    const [chartWidth, setC] = React.useState(window.screen.width * 0.4);
    const [chartHeith, setChartHeith] = React.useState(window.screen.height * 0.8);

    const [divWidth, setDivWidth] = useState(window.innerWidth);
    const [divHeight, setDivHeight] = useState(window.innerHeight);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const editModule = searchParams.get("editModule") || false;
    const moduleIndex = searchParams.get("moduleIndex") || null;
    const [moduleId, setModuleId] = useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {

        if(editModule && moduleIndex != null){
            axios.get("https://onlybackend-production.up.railway.app/studio/getModuleFromId/" + moduleIndex,
                {withCredentials:true}).then((response) =>{
                console.log(response.data.content)
                setStudioChart(response.data.content)
                setModuleId(response.data.id)
                setCategoryId(response.data.category_id)
                handleResize();
            })
        }
        function handleResize() {
            setStudioChart(prevState => {

                return {
                    ...prevState,
                    chart: {
                        ...prevState.chart,
                        width: `${window.innerWidth * 0.4}`,
                        height: `${window.innerHeight * 0.8}`
                    }

                };
            });
        }

        handleResize();

        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        };
    }, []);

    /* the initial state of the studiochart that is set when studio is first opened */
    const [studioChartInitState, setStudioChartInitState] = useState({
        chart: {
            type: "line",
            style: {
                fontFamily: "Tahoma"
            },
            width: `${divWidth * 0.4}`,
            height: `${divHeight * 0.8}`
        },
        style: {
            borderColor: "#1A1616"
        },
        title: {
            text: "",
            style: {
                color: "#1A1616",
                fontWeight: "lighter"
            }
        },
        xAxis: {
            title: {
                text: "",
                style: {
                    color: "#1A1616"
                }
            },
            categories: ["Category 1"],
            labels: {
                style: {
                    color: "#1A1616"
                }
            },
            gridLineColor: "#1A1616"
        },
        yAxis: {
            title: {
                text: "",
                style: {
                    color: "#1A1616"
                }
            },
            gridLineColor: "#1A1616",
            labels: {
                style: {
                    color: "#1A1616"
                }
            }
        },
        labels: {
            style: {
                color: "#1A1616"
            }
        },
        plotOptions: {
            bb: {}
        },
        series: [{
            name: "name",
            data: [""],
            borderWidth: 0,
            color: "#b0ffa6",
        }]
    });

    /* messages shown to user */
    const [errorMessage, setErrorMessage] = useState([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("SUCCESS: Your chart has been posted");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    /* chart objects */
    const [toolbarKey, setToolbarKey] = useState(0);
    const [categoryId, setCategoryId] = useState(null);
    const [chartType, setChartType] = useState("column");
    const [studioChart, setStudioChart] = useState(studioChartInitState);



    function putChartToInitState() {
        /*setStudioChart(studioChartInitState)*/
    }
    function checkForError() {

        /* Starts with assuming there are no errors by setting hasError to false and creates an empty table
        of error message*/
        let hasError = false;
        setErrorMessage([])

        /* -- ERROR CHECKS -- */

        /* Checks if a category is selected */
        if (categoryId === null) {
            setErrorMessage(prevState => [...prevState, "Please, select both STOCK and CATEGORY"])
            hasError = true;
        }

        /* Chekcs if every dataset has atleast one point of data */
        studioChart.series.forEach((serie) => {
            if (serie.data.filter((data) => data !== "").length === 0) {
                setErrorMessage(prevState => [...prevState, "Pay attention, at least one DATASET has NO DATA"])
                hasError = true;
            }
        });

        /* --MORE ERROR CHECKS CAN BE ADDED HERE-- */

        return hasError;
    }

    function showSuccessMessageForDuration(message, duration) {

        /* sets the showSuccessMessage to true to show the success message */
        setSuccessMessage(message)
        setShowSuccessMessage(true);

        /* sets timeout for the duration input and then sets the showSuccessMessage to false */
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, duration);
    }

    function showErrorMessageForDuration(duration) {

        /* sets the showErrorMessage to true to show the error messages */
        setShowErrorMessage(true);

        /* sets timeout for the duration input and then sets the showErrorMessage to false */
        setTimeout(() => {
            setShowErrorMessage(false);
        }, duration);
    }

    function handlePostChart(postChart){
        /* posts the chart to the database */
        axios.post("https://onlybackend-production.up.railway.app/studio/createModule", postChart, {withCredentials: true})

        /* shows success message*/
        setSuccessMessage("SUCCESS: Your chart has been posted");
        showSuccessMessageForDuration(successMessage, 5000);

        /* resets the whole studio back to its initial state */
        setStudioChart(studioChartInitState);
        setToolbarKey(key => key + 1);
        setCategoryId(null);
    }

    async function handleUpdateChart(postChart){

        /* posts the chart to the database */
        axios.post("https://onlybackend-production.up.railway.app/studio/createModule", postChart, {withCredentials: true})

        /* shows success message*/
        setSuccessMessage("SUCCESS: Your chart has been updated");
        await showSuccessMessageForDuration(successMessage, 5000);

        await navigate("/Dashboard")
    }

    function createChart() {

        /* checks for error messages, the post wont be posted if there are error messages */
        if (!checkForError()) {

            /* creates a const of the chart that is going to be sent */
            const chartToSubmit = studioChart;

            /* change the width and height to the standard width and height */
            chartToSubmit.chart.width = 365;
            chartToSubmit.chart.height = 345;

            /* creates a post chart with the needed data to be stored in the database */
            const postChart = {
                category_id: categoryId,
                module_type: chartType,
                content: chartToSubmit
            };

            if(editModule){
                handleUpdateChart(postChart)
            }

            else{
                handlePostChart(postChart)
            }



        }
        /* if there are errors an error message is displayed */
        else {
            showErrorMessageForDuration(5000);
        }
    }

    return (

        <div className="studio">

            {/* --NAVBAR-- */}
            <NavBar/>
            {/* --STUDIO CONTAINER-- */}
            <div className="studio--container">
                <div ref={(chartContainer) => {
                    if (chartContainer && chartContainer.chart) {
                        chartContainer.chart.reflow();
                    }
                }}
                     className="studio--chart"
                >
                    {/* --HIGHCHART-- */}
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={studioChart}
                    />
                </div>
                <div className="studio--toolbar">

                    {/* --TOOLBAR-- */}
                    <StudioToolbar
                        setToolbarKey={setToolbarKey}
                        setStudioChart={setStudioChart}
                        studioChart={studioChart}
                        colorscheme={colorscheme}
                        setCategoryId={setCategoryId}
                        categoryId={categoryId}
                        createChart={createChart}
                    />
                </div>
            </div>

            {/* --ERROR/SUCCESS MESSAGE CONTAINER-- */}
            <div className={`studio-message-container ${showErrorMessage || showSuccessMessage ? 'show' : ''}`}>
                {showErrorMessage && (
                    <div className="studio-error-message">
                        {errorMessage.map((message, index) => (
                            <p key={index}>{message}<br/></p>
                        ))}
                    </div>
                )}
                {showSuccessMessage && (
                    <div className="studio-success-message">
                        <p>{successMessage}</p>
                    </div>
                )}
            </div>
        </div>
    )
}