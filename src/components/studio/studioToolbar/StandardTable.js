import React, {useState} from "react";

export default function StandardTable(props) {
    const [categoryCount, setCategoryCount] = useState(props.studioChart.xAxis.categories.length);
    const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
    const [indexRemove, setIndexRemove] = React.useState(0);

    function changeIndex(newIndex) {
        setIndexRemove(newIndex);
    }

    const handleCategoryCountDecrease = () => {
        props.setStudioChart(prevState => {

            /* creates a copy of the series from the studioChart */
            const updatedSeries = prevState.series.map(series => {
                const updatedData = [...series.data];

                /* removes the last series in the array */
                updatedData.pop();
                return {...series, data: updatedData};
            });

            /* creates a copy of the categories from the studioChart */
            const updatedCategories = [...prevState.xAxis.categories];

            /* removes the last category in the array */
            updatedCategories.pop();

            /* returns the updated studiochart */
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

    const handleCategoryCountIncrease = () => {
        props.setStudioChart(prevState => {

            /* adds a new category in the highchart category array with the with title Category % */
            const categories = [...prevState.xAxis.categories, `Category ${prevState.xAxis.categories.length + 1}`];

            /* adds a new series aswell as the category */
            const series = prevState.series.map(series => ({
                ...series,
                data: [...series.data, ""]
            }));

            /* returns the updated studioChart */
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

    const handleCategoryCountChange = (count) => {

        /* --INCREASE CATEGORY LENGTH-- */
        if (count > categoryCount) {
            props.setStudioChart(prevState => {

                /* adds a new category in the highchart category array with the with title Category % */
                const categories = [...prevState.xAxis.categories, `Category ${prevState.xAxis.categories.length + 1}`];

                /* adds a new series aswell as the category */
                const series = prevState.series.map(series => ({
                    ...series,
                    data: [...series.data, ""]
                }));

                /* returns the updated studioChart */
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

        /* --DECREASE CATEGORY LENGTH-- */
        else if (count < categoryCount) {
            props.setStudioChart(prevState => {

                /* creates a copy of the series from the studioChart */
                const updatedSeries = prevState.series.map(series => {
                    const updatedData = [...series.data];

                    /* removes the last series in the array */
                    updatedData.pop();
                    return {...series, data: updatedData};
                });

                /* creates a copy of the categories from the studioChart */
                const updatedCategories = [...prevState.xAxis.categories];

                /* removes the last category in the array */
                updatedCategories.pop();

                /* returns the updated studiochart */
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

        /* sets the categoryCount to the new count */
        setCategoryCount(count);
    };

    const handleDatasetAdd = () => {
        /* gets the index of which color the next series should have based of the colorscheme defined in studio.js */
        const colorIndex = props.studioChart.series.length % props.colorscheme.length;

        /* sets the color variable */
        const color = props.colorscheme[colorIndex].color;

        /* creates a blank series to input into the studio chart */
        const newSeries = {
            name: "name",
            data: Array(props.studioChart.xAxis.categories.length).fill(""),
            borderWidth: 0,
            color: color
        };

        /* sets the blank series in the studioChart */
        props.setStudioChart(prevState => ({
            ...prevState,
            series: [
                ...prevState.series,
                newSeries
            ]
        }));
    }

    const handleDatasetRemove = (indexToRemove) => {

        /* checks to make sure the first dataset isnt removed (cant have 0 datasets) */
        console.log(props.studioChart.series.length)
        if (props.studioChart.series.length > 1) {

            /* returns the selected dataset to the first one */
            setActiveDatasetIndex(0);

            /* filters out the dataset out of the series and updates it */
            props.setStudioChart(prevState => {
                const filteredSeries = prevState.series.filter((_, index) => index !== indexToRemove);
                return {
                    ...prevState,
                    series: filteredSeries
                }
            });
        }
    }

    const handleDatasetNameChange = (index, name) => {
        props.setStudioChart(prevChart => {
            const updatedSeries = prevChart.series.map((series, i) => {
                if (i === index) {
                    return {...series, name};
                }
                return series;
            });
            return {...prevChart, series: updatedSeries};
        });
    }

    const handleDatasetDataChange = (index, dataIndex, value) => {
        props.setStudioChart(prevChart => {
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

    const handleCategoryNameChange = (index, name) => {
        props.setStudioChart(prevChart => {
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
    const handleDatasetTabClick = (index) => {
        setActiveDatasetIndex(index);
        changeIndex(index)
    }

    const handleYAxisNameChange = (name) => {
        props.setStudioChart(prevState => {
            return {
                ...prevState,
                yAxis: {
                    ...prevState.yAxis,
                    title: {
                        text: name,
                    }
                }
            };
        });
    }

    const handleXAxisNameChange = (name) => {
        props.setStudioChart(prevState => {
            return {
                ...prevState,
                xAxis: {
                    ...prevState.xAxis,
                    title: {
                        text: name,
                    }
                }
            };
        });
    }

    const ref1 = React.useRef(null);
    const ref2 = React.useRef(null);

    const handleScroll = (e) => {
        if (ref1.current && ref2.current) {
            ref1.current.scrollTop = e.target.scrollTop;
            ref2.current.scrollTop = e.target.scrollTop;
        }
    };

    return (
        <>

            <div className="studio--category--axis--inputs">
                <input placeholder={"(X-axis)"}
                       value={props.studioChart.xAxis.title.text}
                       maxLength={30}
                       onChange={(event) => handleXAxisNameChange(event.target.value)}
                />
                <input placeholder={"(Y-axis)"}
                       value={props.studioChart.yAxis.title.text}
                       maxLength={30}
                       onChange={(event) => handleYAxisNameChange(event.target.value)}
                />
            </div>
            <div className="studio--toolbar--columns">
                <div className="studio--category-container">
                    <h2>Year</h2>
                    <div className="studio--category-count-btn">
                        <button onClick={() => handleCategoryCountDecrease()}>
                            Remove
                        </button>
                        <button onClick={() => handleCategoryCountIncrease()}>
                            Add
                        </button>
                    </div>
                    <div className="studio--category-input-fields" onScroll={handleScroll}
                         ref={ref1}>
                        {props.studioChart.xAxis.categories.map((categoryName, index) => {
                            return (
                                <input
                                    key={index}
                                    type="text"
                                    placeholder={`Value ${index + 1}`}
                                    maxLength={30}
                                    onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="studio--dataset-container">

                    <div className="studio--dataset-tabs-btn">
                        {props.studioChart.series.map((dataset, index) => (
                            <button key={index}
                                    onClick={() => handleDatasetTabClick(index)}>{dataset.name || `Dataset ${index + 1}`}
                            </button>
                        ))}
                    </div>
                    <div className="studio--dataset--buttons">
                        <button onClick={handleDatasetAdd}>
                            Add Dataset
                        </button>
                        <button onClick={() => handleDatasetRemove(indexRemove)}>
                            Remove Dataset
                        </button>
                    </div>
                    {props.studioChart.series.map((dataset, index) => (
                        <div className="studio--dataset-tab-container" key={index}
                             style={{display: activeDatasetIndex === index ? "block" : "none"}}>
                            <div className="studio--dataset-input-name">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    maxLength={30}
                                    onChange={(e) => handleDatasetNameChange(index, e.target.value)}
                                />
                            </div>
                            <div className="dataset-input-fields" onScroll={handleScroll}
                                 ref={ref2}>
                                {dataset.data.map((data, dataIndex) => (
                                    <input key={dataIndex}
                                           type="number"
                                           placeholder={`Data ${dataIndex + 1}`}
                                           value={data}
                                           onChange={(e) => handleDatasetDataChange(index, dataIndex, e.target.value)}/>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
