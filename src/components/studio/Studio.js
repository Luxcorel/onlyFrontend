import React, {useState} from "react"
import StudioToolbar from "./studioToolbar/StudioToolbar";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios"
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import NavBar from "../navBar/NavBar";
import Exporting from 'highcharts/modules/exporting';

Exporting(Highcharts);

export default function Studio() {
    document.title = "Studio"

    /* colorscheme for the datasets */
    const colorscheme = [
        {index: 0, color: "#39a22a"},
        {index: 1, color: "#da6868"},
        {index: 2, color: "#a2a852"},
        {index: 3, color: "#c99664"},
        {index: 4, color: "#6384d2"},
    ];


    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const editModule = searchParams.get("editModule") || false;
    const moduleIndex = searchParams.get("moduleIndex") || null;
    const [moduleId, setModuleId] = useState(null);
    const navigate = useNavigate();
    const [username, setUsername] = useState()
    const [loading, setLoading] = useState(true);

    React.useEffect( () => {

        const fetchData = async() => {
            try {

                await axios.get(process.env.REACT_APP_BACKEND_URL+`/principal-username`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then((response) => {
                        handleUserNameChange(response.data)
                })

                if (editModule && moduleIndex != null) {
                    await axios.get(process.env.REACT_APP_BACKEND_URL+"/studio/getModuleFromId/" + moduleIndex,
                        {withCredentials: true}).then((response) => {
                        console.log(response.data.content)
                        setStudioChart(response.data.content)
                        setModuleId(response.data.id)
                        setCategoryId(response.data.category_id)
                    })
                }

            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData().then();

    }, []);

    /* the initial state of the studiochart that is set when studio is first opened */
    const [studioChartInitState, setStudioChartInitState] = useState({
        chart: {
            type: "line",
            style: {
                fontFamily: "Tahoma"
            },
            animation: {
                duration: 0,
                easing: 'linear'
            },

            renderTo: 'container'
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
            series:{
                animation:{
                    duration: 0
                }
            }
        },
        series: [{
            name: "name",
            data: [""],
            borderWidth: 0,
            color: "#39a22a",
        }],
    });

    /* messages shown to user */
    const [errorMessage, setErrorMessage] = useState([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(
        !editModule ? "SUCCESS: Your chart has been posted\nRedirecting..." : "SUCCESS: Your chart has been updated\nRedirecting..."
    );
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    /* chart objects */
    const [toolbarKey, setToolbarKey] = useState(0);
    const [categoryId, setCategoryId] = useState(null);
    const [chartType, setChartType] = useState("column");
    const [studioChart, setStudioChart] = useState(studioChartInitState);



    function putChartToInitState() {
        /*setStudioChart(studioChartInitState)*/
    }

    const handleUserNameChange = (name) => {
        setStudioChart(prevState => ({
            ...prevState,
            exporting: {
                chartOptions: {
                    subtitle: {
                        text: `Created by ${name} on OnlyFin`,
                        style: {
                            fontSize: '8px',
                            color: '#000'
                        }
                    }
                }
            }
        }))
    };

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

    function showSuccessMessageForDuration(duration) {

        /* sets the showSuccessMessage to true to show the success message */
        setShowSuccessMessage(true);

        /* sets timeout for the duration input and then sets the showSuccessMessage to false */
        setTimeout(() => {
            setShowSuccessMessage(false);
            navigate(`/Dashboard?CategoryId=${categoryId}`)

        }, duration);
    }

    function showErrorMessageForDuration(duration) {

        console.log(username)

        /* sets the showErrorMessage to true to show the error messages */
        setShowErrorMessage(true);

        /* sets timeout for the duration input and then sets the showErrorMessage to false */
        setTimeout(() => {
            setShowErrorMessage(false);
        }, duration);
    }

    function handlePostChart(postChart){
        /* posts the chart to the database */
        axios.post(process.env.REACT_APP_BACKEND_URL+"/studio/createModule", postChart, {withCredentials: true})

        /* shows success message*/
        showSuccessMessageForDuration(2000);
    }

    async function handleUpdateChart(postChart){

        postChart.id = moduleId;
        /* posts the chart to the database */

        console.log("postedChart: ", postChart)
        await axios.put(
            process.env.REACT_APP_BACKEND_URL+"/studio/updateModuleContent",
            postChart
            ,{
                headers: {
                    'Content-type': 'application/json',
                },
                withCredentials: true,
            }
        ).then((response) => {
            console.log("response: ",response.data)
        })

        /* shows success message*/
        showSuccessMessageForDuration(2000);
    }

    function createChart() {

        /* checks for error messages, the post wont be posted if there are error messages */
        if (!checkForError()) {

            /* creates a const of the chart that is going to be sent */
            const chartToSubmit = studioChart;

            /* creates a post chart with the needed data to be stored in the database */
            const postChart = {
                category_id: categoryId,
                module_type: chartType,
                content: chartToSubmit
            };

            if(editModule){
                setSuccessMessage("SUCCESS: Your chart has been updated");
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

    async function deleteChart(){
        await setSuccessMessage("SUCCESS: Your chart has been deleted\nRedirecting...")
        await axios.delete(
            process.env.REACT_APP_BACKEND_URL+`/studio/deleteModule/` + moduleId,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true
            }
        ).then(showSuccessMessageForDuration(2000)
        )
    }

    return (

        <div className="studio">

            {/* --NAVBAR-- */}
            <NavBar/>
            {/* --STUDIO CONTAINER-- */}
            <div className="studio--container">
                <div
                     className="studio--chart"
                >
                    {/* --HIGHCHART-- */}
                    {loading ? (
                        <div className="spinner"></div>
                    ) : (
                        <HighchartsReact
                            containerProps={{ style: { height: '100%', weight: '100%' } }}
                            highcharts={Highcharts}
                            options={studioChart}
                        />
                    )}
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
                        deleteChart={deleteChart}
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