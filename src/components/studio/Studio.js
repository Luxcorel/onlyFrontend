import React, {useState} from "react"
import StudioToolbar from "./studioToolbar/StudioToolbar";
import {Link, NavLink} from "react-router-dom";
import axios from "axios"
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default function Studio() {
    document.title = "Studio"

    const colorscheme = [
        {index: 0, color: "#79d06e"},
        {index: 1, color: "#da6868"},
        {index: 2, color: "#cfd574"},
        {index: 3, color: "#c99664"},
        {index: 4, color: "#6384d2"},
    ];
    const studioChartInitState = {
        chart: {
            type: "line",
            style: {
                fontFamily: "Tahoma"
            }
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
    };

    const [toolbarKey, setToolbarKey] = useState(0);
    const [errorMessage, setErrorMessage] = useState([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("SUCCESS: Your chart has been posted");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [categoryCount, setCategoryCount] = useState(1);
    const [categoryId, setCategoryId] = useState(null);
    const [chartType, setChartType] = useState("column");
    const [studioChart, setStudioChart] = useState(studioChartInitState);

    function handleCategoryCountDecrease(count) {
        setCategoryCount(count);
        setStudioChart(prevState => {
            const updatedSeries = prevState.series.map(series => {
                const updatedData = [...series.data];
                updatedData.pop();
                return {...series, data: updatedData};
            });
            const updatedCategories = [...prevState.xAxis.categories];
            updatedCategories.pop();
            return {
                ...prevState,
                series: updatedSeries,
                xAxis: {
                    ...prevState.xAxis,
                    categories: updatedCategories
                }
            };
        });
    }

    function putChartToInitState() {
        /*setStudioChart(studioChartInitState)*/
    }

    function handleCategoryCountIncrease(count) {
        setCategoryCount(count);
        setStudioChart(prevState => {
            const categories = [...prevState.xAxis.categories, `Category ${prevState.xAxis.categories.length + 1}`];
            const series = prevState.series.map(series => ({
                ...series,
                data: [...series.data, ""]
            }));
            return {
                ...prevState,
                xAxis: {
                    ...prevState.xAxis,
                    categories: categories
                },
                series: series
            };
        });
    }

    function handleDatasetAdd() {
        const colorIndex = studioChart.series.length % colorscheme.length;
        const color = colorscheme[colorIndex].color;

        const newSeries = {
            name: "name",
            data: Array(categoryCount).fill(""),
            borderWidth: 0,
            color: color
        };

        setStudioChart(prevState => ({
            ...prevState,
            series: [
                ...prevState.series,
                newSeries
            ]
        }));
    }

    function handleDatasetRemove(indexToRemove) {
        setStudioChart(prevState => {
            const filteredSeries = prevState.series.filter((_, index) => index !== indexToRemove);
            return {
                ...prevState,
                series: filteredSeries
            }
        });
    }

    function handleDatasetDataChange(index, dataIndex, value) {
        setStudioChart(prevChart => {
            const seriesToUpdate = {...prevChart.series[index]};
            seriesToUpdate.data[dataIndex] = parseInt(value);
            const updatedSeries = [...prevChart.series];
            updatedSeries[index] = seriesToUpdate;
            return {
                ...prevChart,
                series: updatedSeries
            }
        });
    }

    function handleDataSetNameChange(index, name) {
        setStudioChart(prevChart => {
            const updatedSeries = prevChart.series.map((series, i) => {
                if (i === index) {
                    return {...series, name};
                }
                return series;
            });
            return {...prevChart, series: updatedSeries};
        });
    }

    function handleCategoryNameChange(index, name) {
        setStudioChart(prevChart => {
            const updatedXAxis = {
                ...prevChart.xAxis,
                categories: [
                    ...prevChart.xAxis.categories.slice(0, index),
                    name,
                    ...prevChart.xAxis.categories.slice(index + 1),
                ]
            };
            return {
                ...prevChart,
                xAxis: updatedXAxis,
            };
        });
    }

    function handleChartNameChange(name) {
        setStudioChart(prevState => ({
            ...prevState,
            title: {
                ...prevState.title,
                text: name
            }
        }));
    }

    function handleYAxisNameChange(name) {
        setStudioChart(prevState => {
            return {
                ...prevState,
                yAxis: {
                    ...prevState.yAxis,
                    title: {
                        text: name,
                        style: {
                            color: "#000000"
                        }
                    }
                }
            };
        });
    }

    function checkForError() {
        let hasError = false;
        setErrorMessage([])


        if (categoryId === null) {
            setErrorMessage(prevState => [...prevState, "ERROR: select both stock and category"])
            hasError = true;
        }

        studioChart.series.forEach((serie) => {
            if (serie.data.filter((data) => data !== "").length === 0) {
                setErrorMessage(prevState => [...prevState, "ERROR: atleast one dataset has no data"])
                hasError = true;
            }
        });


        return hasError;
    }

    function showSuccessMessageForDuration(message, duration) {
        setSuccessMessage(message)
        setShowSuccessMessage(true);

        setTimeout(() => {
            setShowSuccessMessage(false);
        }, duration);
    }

    function showErrorMessageForDuration(duration) {
        setShowErrorMessage(true);

        setTimeout(() => {
            setShowErrorMessage(false);
        }, duration);
    }

    function postChart() {
        if (!checkForError()) {
            const chartToSend = studioChart;

            chartToSend.chart.width = 365;
            chartToSend.chart.height = 345;

            const postChart = {
                category_id: categoryId,
                module_type: chartType,
                content: chartToSend
            };

            axios.post("http://localhost:8080/studio/createModule", postChart, {withCredentials: true})
            console.log(categoryId)
            setSuccessMessage("SUCCESS: Your chart has been posted")
            showSuccessMessageForDuration(successMessage, 5000)
            setStudioChart(studioChartInitState)
            setShowErrorMessage(false);
            setToolbarKey(key => key + 1);
            setCategoryId(null);
            setCategoryCount(1);

        } else {
            showErrorMessageForDuration(5000);
        }
    }

    function handleChartTypeChange(type) {
        setChartType(type);
        setStudioChart(prevState => {
            return {
                ...prevState,
                chart: {
                    ...prevState.chart,
                    type: type
                }
            }
        })
        /*setStudioChart(prevState => {
            return {
                ...prevState,
                chart: {
                    ...prevState.chart,
                    type: type
                },
                yAxis: {
                    ...prevState.yAxis,
                    title: {
                        ...prevState.title,
                        text: ""
                    }
                },
                xAxis: {
                    ...prevState.xAxis,
                    title: {
                        ...prevState.xAxis,
                        text: ""
                    },
                    categories: ["Category 1"]
                },
                series:[{
                    name: "name",
                    data: [""],
                    borderWidth: 0,
                    color: "#b0ffa6",
                }]
            };
        });*/
    }

    function handleCategoryIdChange(id) {
        if (id === "") setCategoryId(null)
        else setCategoryId(id);
    }

    return (
        <>
            <div className="studio--navbar">
                <h1>Studio</h1>
                <Link to="/Dashboard">
                    <button className="studio--navbar--button">Dashboard</button>
                </Link>
            </div>
            <div className="studio--container">
                <div ref={(chartContainer) => {
                    if (chartContainer && chartContainer.chart) {
                        chartContainer.chart.reflow();
                    }
                }}
                     className="studio--chart"
                >
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={studioChart}
                    />
                </div>
                <div className="studio--toolbar">
                    <StudioToolbar
                        key={toolbarKey}
                        handleCategoryCountIncrease={handleCategoryCountIncrease}
                        handleCategoryCountDecrease={handleCategoryCountDecrease}
                        handleDatasetAdd={handleDatasetAdd}
                        handleDatasetRemove={handleDatasetRemove}
                        handleDatasetDataChange={handleDatasetDataChange}
                        handleDatasetNameChange={handleDataSetNameChange}
                        handleCategoryNameChange={handleCategoryNameChange}
                        handleChartNameChange={handleChartNameChange}
                        handleYAxisNameChange={handleYAxisNameChange}
                        handleChartTypeChange={handleChartTypeChange}
                        handleCategoryIdChange={handleCategoryIdChange}
                        putChartToInitState={putChartToInitState}
                    />
                    <button onClick={() => postChart()}> Post</button>
                </div>
            </div>
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
        </>
    )
}
