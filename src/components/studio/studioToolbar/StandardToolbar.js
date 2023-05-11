import React, {useEffect, useState} from "react";
import axios from "axios"
import {Link, useLocation} from "react-router-dom";

export default function StandardToolbar(props) {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const stockIndex = searchParams.get("stockIndex") || 0;
    const categoryIndex = searchParams.get("categoryIndex") || 0;
    const editModule = searchParams.get("editModule") || false;

    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedChartType, setSelectedChartType] = useState("column");
    const [stockTree, setStockTree] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null)
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL+"/fetch-current-user-id", { withCredentials: true }).then((response) => {
            axios.get(process.env.REACT_APP_BACKEND_URL+"/studio/getStocksAndCategories/" + response.data, { withCredentials: true }).then((response) => {
                setStockTree(response.data);
            }).then(() => {
                createStockTree()
            });
            //console.log(stockIndex)
            //console.log(categoryIndex)

        });
    }, []);

    async function createStockTree(){

        if(stockIndex != 0){
            await setSelectedStock(stockIndex)
            if(categoryIndex != 0){
                await setSelectedCategory(categoryIndex)
                handleCategoryChange(categoryIndex)
            }
        }

    }


    const handleChartNameChange = (name) => {
        props.setStudioChart(prevState => ({
            ...prevState,
            title: {
                ...prevState.title,
                text: name
            }
        }))
    };

    const handleCategoryChange = (index) => {
        setSelectedCategory(index);
        if(index === ""){
            props.setCategoryId(null)
        }
        else {
            props.setCategoryId(index);
        }
    };

    const handleStockChange = (stockId) => {
        console.log(stockId)

        setSelectedStock(stockId);
        setSelectedCategory("");
        props.setCategoryId(null);
    };

    const handleChartTypeChange = (type) => {
        props.setStudioChart(prevState => {
            return {
                ...prevState,
                chart: {
                    ...prevState.chart,
                    type: type
                }
            }
        })
        props.setTableType(type)
    };

    return (
        <div className="studio--toolbar--heading">
            <div className="studio--toolbar--input">
                <input
                    type="text"
                    placeholder="Enter Chart Name"
                    value={props.studioChart.title.text}
                    onChange={(e) => handleChartNameChange(e.target.value)}
                />
            </div>
            <div className="studio--toolbar--selects">
                <select
                    className="studio--sidebar--select"
                    name="typeOfDiagram"
                    onChange={(e) => handleChartTypeChange(e.target.value)}
                    value={props.studioChart.chart.type}
                >
                    <option value="line"> Line</option>
                    <option value="column"> Column</option>
                    <option value="bar"> Bar</option>
                    <option value="scatter"> Scatter</option>
                    {/*<option value="pie"> Pie</option>*/}
                    <option value="spline"> Spline</option>
                    <option value="areaspline"> Areaspline</option>
                </select>
                {!editModule && stockTree && (
                    <div className="studio--toolbar--standards--selects">
                        <select name="stock" value={selectedStock} onChange={(e) => handleStockChange(e.target.value)}>
                            <option value="">Select a stock</option>
                            {stockTree.stocks.map((stock) => (
                                <option key={stock.id} value={stock.id}>
                                    {stock.stock_ref_id.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {!editModule && stockTree && selectedStock && (
                    <div className="studio--toolbar--standards--selects">
                        <select id="category" name="category" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
                            <option value="">Select a category</option>
                            {stockTree.stocks
                                ?.find((stock) => stock.id === parseInt(selectedStock))
                                ?.categories?.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}