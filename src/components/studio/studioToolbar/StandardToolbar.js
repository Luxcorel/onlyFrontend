import React, {useEffect, useState} from "react";
import axios from "axios"
import {Link} from "react-router-dom";

export default function StandardToolbar(props) {


    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedChartType, setSelectedChartType] = useState("column");
    const [stockTree, setStockTree] = useState(null);
    const [selectedStock, setSelectedStock] = useState("");
    const [userId, setUserId] = useState(null);

    const handleStockChange = (name) => {
        setSelectedStock(name);
        setSelectedCategory("");
        props.handleCategoryIdChange(null);
    };

    useEffect(() => {
        axios.get("http://localhost:8080/fetch-current-user-id", {withCredentials: true}).then((response) => {
            axios.get("http://localhost:8080/studio/getStocksAndCategories/" + response.data, {withCredentials: true}).then((response) => {
                setStockTree(response.data);
            })
        })
    },[]);


    const handleChartNameChange = (name) => {
        props.handleChartNameChange(name);
    };

    const handleCategoryChange = (index) => {
        setSelectedCategory(index);
        props.handleCategoryIdChange(index);
    };

    const handleChartTypeChange = (type) => {
        setSelectedChartType(type);
        props.handleChartTypeChange(type);
    };


    return (
        /* this section includes the chart name, selection of the chart type,
        which stock it goes to and also the category */

        /* jag har ändrat en del i denna klassen victor, så om du undrar varför det ser annorlunda ut där chartname är
        så är det för att jag har gjort om denna delen, har skrivit vissa placeholders så att det ska vara lätt att
        hitta vilka klasser som är vilka. Så det är bara att ändra namnen på klasserna om det behövs har inte ändrat
        på något i index.css*/
        <div className="studio--toolbar--heading">
            <div className="studio--toolbar--input">
                <input
                    type="text"
                    placeholder="Enter Chart Name"
                    onChange={(e) => handleChartNameChange(e.target.value)}
                />
            </div>
            <div className="studio--toolbar--selects">
                <select className="studio--sidebar--select" name="typeOfDiagram"
                        onChange={(e) => handleChartTypeChange(e.target.value)}>
                    <option value="line"> Line</option>
                    <option value="column"> Column</option>
                    <option value="bar"> Bar</option>
                    <option value="scatter"> Scatter</option>
                    <option value="pie"> Pie</option>
                    <option value="spline"> Spline</option>
                    <option value="areaspline"> Areaspline</option>
                </select>
                {stockTree && (
                    <div className="studio--toolbar--standards--selects">
                        <select name="stock" value={selectedStock} onChange={(e) => handleStockChange(e.target.value)}>
                            <option value="">Select a stock</option>
                            {stockTree.stocks.map((stock) => (
                                <option key={stock.id} value={stock.stock_ref_id.name}>
                                    {stock.stock_ref_id.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {selectedStock && (
                    <div className="studio--toolbar--standards--selects">
                        <select id="category" name="category" value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}>
                            <option value="">Select a category</option>
                            {stockTree.stocks
                                .find((stock) => stock.stock_ref_id.name === selectedStock)
                                .categories.map((category) => (
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