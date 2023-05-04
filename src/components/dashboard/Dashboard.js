import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../navBar/NavBar";
import {Link} from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CategoryDropdownMenu from "./CategoryDropdownMenu";
import StockDropdownMenu from "./StockDropdownMenu";
import {wait} from "@testing-library/user-event/dist/utils";
/*import { SearchBox } from 'react-search-box';*/

export default function Dashboard() {
    document.title = "Dashboard"
    const [dashboard, setDashboard] = useState(null);
    const [activeStockTab, setActiveStockTab] = useState(null);
    const [activeCategoryTab, setActiveCategoryTab] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState();
    const [currentStockId, setCurrentStockId] = useState(null);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);

    useEffect(() => {

        axios.get("https://onlybackend-production.up.railway.app/fetch-current-user-id", {withCredentials: true}).then(
            (response) => {
                setUserId(response.data)

            axios.get("https://onlybackend-production.up.railway.app/dashboard/" + response.data,
                {withCredentials: true}).then((response) => {
                    setDashboard(response.data);

                //only if there are stocks inside the dashboard the activeStockTab will be set to the first stock in
                // the dashboard, and also the currentStockId will also be set to the first stock
                if(response.data.stocks.length !== 0){
                    setActiveStockTab(0)
                    setCurrentStockId(response.data.stocks[0].id)

                    //only if there are categories inside the first stock the activeCategoryTab will be set to the
                    // first one, and also the currentCategoryId will be set to the first Category in the stock
                    if(response.data.stocks[0].categories.length !== 0){
                        setCurrentCategoryId(response.data.stocks[0].categories[0].id)
                        setActiveCategoryTab(0)
                    }
                }
                setIsLoading(false);
            });
        })
    }, []);

    const handleStockTabClick = (index) => {
        //changes the button index from the input
        setActiveStockTab(index);

        if(index != null){
            //sets the category click to null if there is no categories in the stock
            if(dashboard.stocks[index].categories.length === 0){
                handleCategoryTabClick(null,index);
            }
            //sets the category click to the first option if there are categories in the stocks
            else{
                console.log("categories [0].id: " + dashboard.stocks[index].categories[0].id)
                handleCategoryTabClick(0, index);
            }
        }

        //sets the current id of the selected stock (needs to be able to be null)
        if (index != null){
            setCurrentStockId(dashboard.stocks[index].id);
        }
        else {
            setCurrentStockId(null)
        }
    };

    const handleCategoryTabClick = (index, stockTab) => {

        //changes the activecategorytab to index.
        setActiveCategoryTab(index);

        if(index != null){
            setCurrentCategoryId(dashboard.stocks[stockTab].categories[index].id)
        }
        else{
            setCurrentCategoryId(null)
        }

    };

    async function handleAddCategory(categoryName) {
        if (categoryName !== ""){
            await axios.post("https://onlybackend-production.up.railway.app/studio/createCategory",
                {
                    name: categoryName,
                    stock_id: currentStockId
                },
                {withCredentials: true}
            )
            refreshDashboard()
        }
        else console.log("need to enter a string")
        /* MAYBE ADD AN ERROR MESSAGE COMPONENT THAT IS ABLE TO SHOW ERRORS TO EVERY PAGE? */
    }

    async function handleChangeCategoryName(inputName){

        await axios.put(
            "https://onlybackend-production.up.railway.app/studio/updateCategoryName",
            {
                id: currentCategoryId,
                name: inputName
            },{
                headers: {
                    'Content-type': 'application/json',
                },
                withCredentials: true,
            }
        ).then((response) => {
            setDashboard( (prevState) => {
                /* after the name is changed in the database, the response is used to update the name locally */
                const newStocks = [...prevState.stocks];
                const newCategories = [...newStocks[activeStockTab].categories];
                newCategories[activeCategoryTab] = response.data;
                newStocks[activeStockTab] = { ...newStocks[activeStockTab], categories: newCategories };
                return { ...prevState, stocks: newStocks };
                }
            )
        })
    }

    async function handleRemoveCategory() {
        await axios.delete(
            `https://onlybackend-production.up.railway.app/studio/deleteCategory/` + currentCategoryId,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true
            }

        )
        await handleCategoryTabClick(null,activeStockTab)
        refreshDashboard();
    }

    async function refreshDashboard(){
        await axios.get("https://onlybackend-production.up.railway.app/dashboard/" + userId,
            {withCredentials: true}).then((response) => {
                setDashboard(response.data);
            ;})
    }

    async function handleAddStock(stockRefId){
        await axios.post("https://onlybackend-production.up.railway.app/studio/createStock",
            {
                dashboardId: dashboard.id,
                stockRefId: stockRefId
            },
            {withCredentials: true}
            )
        refreshDashboard()
    }

    async function handleRemoveStock(){
        await axios.delete(
            `https://onlybackend-production.up.railway.app/studio/deleteStock/` + currentStockId,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true
            }
        )

        await handleStockTabClick(null)
        refreshDashboard()
    }

    if (isLoading) {
        return <div className="dashboard-is-loading">Loading dashboard...</div>;
    }

    const { stocks } = dashboard;

    return (
        <div className="dashboard">
            <NavBar />
            <div className="dashboard-content-wrapper">
                <div className="dashboard-button-underlay"></div>
                <Link to="/profile_page">
                    <button className="dashboard-profile-button">
                    </button>
                </Link>
                <div className="dashboard-stock-tab-container">
                    <div className="dashboard-stock-tab-buttons">
                        {/* --STOCK BUTTONS-- */}
                        {stocks && stocks.map((stock, index) => (
                            <button
                                key={stock.id}
                                className={index === activeStockTab ? "active" : ""}
                                onClick={() => handleStockTabClick(index)}
                            >
                                {stock.stock_ref_id.name}
                            </button>
                        ))}
                        {/* --STOCK DROPDOWN MENU-- */}
                        <StockDropdownMenu
                            addStock={handleAddStock}
                            removeStock={handleRemoveStock}
                        />
                    </div>
                    <div className="stock-tab-content">
                        <div className="dashboard-category-tab-container">
                            <div className="dashboard-category-tab-buttons">
                                {/* --CATEGORY BUTTONS-- */}
                                {activeStockTab != null && stocks.length > 0 &&
                                    stocks[activeStockTab] &&
                                    stocks[activeStockTab].categories.map((category, index) => (
                                    <button
                                        key={category.id}
                                        className={index === activeCategoryTab ? "active" : ""}
                                        onClick={() => handleCategoryTabClick(index, activeStockTab)}
                                    >
                                        {category.name}
                                    </button>

                                ))}
                                { /* --CATEGORY DROP DOWN-- */}
                                {/* checks to see that a stock is selected */}
                                {activeStockTab != null && (
                                    <CategoryDropdownMenu
                                        addCategory={handleAddCategory}
                                        removeCategory={handleRemoveCategory}
                                        changeCategoryName={handleChangeCategoryName}
                                    />
                                )}
                            </div>
                            <div className="dashboard-category-tab-content">
                                {/* --CATEGORIY CONTAINER-- */}
                                {activeStockTab != null && stocks.length > 0
                                    /* checks to see if the activeStocktab isnt null, the stocks.length isnt 0,
                                     and that there are categories contained in the stock to prevent errors whenever
                                      the dashboard might be empty */
                                    && stocks[activeStockTab]
                                    && stocks[activeStockTab].categories
                                    && stocks[activeStockTab].categories.map((category, index) => (
                                    <div
                                        key={category.id}
                                        className={`module-container ${
                                            index === activeCategoryTab ? "active" : ""
                                        }`}
                                    >
                                        {/* --MODULES-- */}
                                        {/* if there are no modules in the category, a single empty module with a
                                        button to create a module appears */}
                                        {category.moduleEntities.length === 0 ? (
                                            <div className="dashboard-empty-module">
                                                <Link to={`/Studio?stockIndex=${currentStockId}&categoryIndex=${currentCategoryId}`}>
                                                    <button>+</button>
                                                </Link>
                                            </div>
                                        ) : (
                                            {/* if there are any moules in the category the modules will be
                                             displayed as highcharts*/},
                                            category.moduleEntities.map((moduleEntity) => (
                                                <div key={moduleEntity.id} className="dashboard-module-container">
                                                    <pre>
                                                        <Link to={`/Studio?editModule=${true}&moduleIndex=${moduleEntity.id}`}>
                                                            <button>edit</button>
                                                        </Link>
                                                        <HighchartsReact
                                                            highcharts={Highcharts}
                                                            options={moduleEntity.content}
                                                        />
                                                    </pre>

                                                </div>
                                                ))
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}