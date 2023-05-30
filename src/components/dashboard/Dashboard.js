import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../navBar/NavBar";
import {Link, useLocation,useNavigate} from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CategoryDropdownMenu from "./CategoryDropdownMenu";
import StockDropdownMenu from "./StockDropdownMenu";
import EditableLayout from "./EditableLayout"
import {wait} from "@testing-library/user-event/dist/utils";
import icon from "../../assets/images/web-design.gif";
import emptyCat from "../../assets/images/emptyCharts.gif"
import DashboardProfile from "./DashboardProfile";

/*import { SearchBox } from 'react-search-box';*/

export default function Dashboard() {
    document.title = "Dashboard"
    const [dashboard, setDashboard] = useState(null);
    const [dashboardLayout, setDashboardLayout] = useState(null)
    const [activeStockTab, setActiveStockTab] = useState(null);
    const [activeCategoryTab, setActiveCategoryTab] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState();
    const [currentStockId, setCurrentStockId] = useState(null);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [userName, setUserName] = useState ("n/a");

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryIndexId = searchParams.get("CategoryId") || null;
    const otherUserID = searchParams.get("User") || null
    const [ownDashboard, setOwnDashboard] = useState(false)


    useEffect(() => {
        setIsLoading(true)

        console.log(otherUserID)
        axios.get(process.env.REACT_APP_BACKEND_URL+"/fetch-current-user-id", {withCredentials: true}).then(
            (response) => {
                if (parseInt(otherUserID) === response.data || otherUserID == null) {
                    setUserId(response.data)
                    setOwnDashboard(true)
                } else {
                    setUserId(otherUserID)
                    setOwnDashboard(false)
                }
            }
        ).catch(() => {
            if(otherUserID != null){
                setUserId(otherUserID)
            }
            else{
                navigate(`../Login?Redirect=Dashboard`)
            }
        })
    }, [otherUserID]);

    useEffect(() => {
        if (!userId) {
            return; // exit early if userId is not yet defined
        }

        console.log(userId)

        axios.get(process.env.REACT_APP_BACKEND_URL+"/getNameFromUserId/" + userId, {withCredentials:true}).then((response) => {
            setUserName(response.data);
        })

        axios.get(process.env.REACT_APP_BACKEND_URL+"/dashboard/get/" + userId,
            {withCredentials: true}).then((response) => {
            setDashboard(response.data.dashboard);
            setDashboardLayout(response.data.dashboardLayout)
            console.log(response.data)


            //only if there are stocks inside the dashboard the activeStockTab will be set to the first stock in
            // the dashboard, and also the currentStockId will also be set to the first stock
            if(response.data.dashboard.stocks.length !== 0){
                setActiveStockTab(0)
                setCurrentStockId(response.data.dashboard.stocks[0].id)

                //only if there are categories inside the first stock the activeCategoryTab will be set to the
                // first one, and also the currentCategoryId will be set to the first Category in the stock
                if(response.data.dashboard.stocks[0].categories.length !== 0){
                    setCurrentCategoryId(response.data.dashboard.stocks[0].categories[0].id)
                    setActiveCategoryTab(0)
                }
            }

            //this code is usedwhenever the url wants to redirect the user to a specific dashboard page through a
            // categoryID it loops through the stocks and categories to find if its possible to find, if it doesnt
            // find it doesnt set a new stock tab and category tab
            if(categoryIndexId != null){

                let categoryIndexToFind, stockIndexToFind;
                let foundCategoryID = false;

                for (let i = 0; i < response.data.dashboard.stocks.length; i++) {
                    const stock = response.data.dashboard.stocks[i];

                    for (let j = 0; j < stock.categories.length; j++) {
                        const category = stock.categories[j];

                        if (category.id === parseInt(categoryIndexId)) {

                            //if the categoryID in the URL can be found in the arrays the tab will redirect to the
                            // correct page
                            setCurrentCategoryId(stock.id)
                            setActiveStockTab(i)

                            setCurrentCategoryId(category.id)
                            setActiveCategoryTab(j)

                            foundCategoryID = true
                        }
                    }
                }
                if(!foundCategoryID) console.error("CategoryId["+categoryIndexId+
                    "] could not be found in the dashboard")
            }

            setIsLoading(false);
        });
    }, [userId]);

    function getCategorySelected() {
        console.log("test",activeCategoryTab);
        if(activeCategoryTab != null){
            return true
        }
        else{
            return false;
        }
    }

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
            await axios.post(process.env.REACT_APP_BACKEND_URL+"/studio/createCategory",
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
            process.env.REACT_APP_BACKEND_URL+"/studio/updateCategoryName",
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
            process.env.REACT_APP_BACKEND_URL+`/studio/deleteCategory/${currentCategoryId}`,
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
        await axios.get(process.env.REACT_APP_BACKEND_URL+"/dashboard/get/" + userId,
            {withCredentials: true}).then((response) => {
                setDashboard(response.data.dashboard);
            ;})
    }

    async function handleAddStock(stockRefId){
        await axios.post(process.env.REACT_APP_BACKEND_URL+"/studio/createStock",
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
            process.env.REACT_APP_BACKEND_URL+`/studio/deleteStock/` + currentStockId,
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
        return (<div className="loader-container">
            <div className="loader"></div>
        </div>);
    }

    const { stocks } = dashboard;

    return (
        <div className="dashboard">
            <NavBar />
            <div className="dashboard-content-wrapper">
                <div className="dashboard-button-underlay">
                    <DashboardProfile
                        userName={userName}
                        ownDashboard={ownDashboard}
                        userId={userId}
                    />
                </div>
                <div className="dashboard-stock-tab-container">
                    <div className="dashboard-stock-tab-buttons">
                        {/* --STOCK BUTTONS-- */}
                        {stocks && stocks.map((stock, index) => (
                            <button
                                key={stock.id}
                                className={"dashboard-button " + (index === activeStockTab ? "active" : "")}
                                onClick={() => handleStockTabClick(index)}
                            >
                                <p className="dashboard-text">{stock.stock_ref_id.name}</p>
                            </button>
                        ))}
                        {/* --STOCK DROPDOWN MENU-- */}
                        {ownDashboard && (
                            <StockDropdownMenu
                            addStock={handleAddStock}
                            removeStock={handleRemoveStock}
                        />
                        )}
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
                                        className={"dashboard-button " + (index === activeCategoryTab ? "active" : "")}
                                        onClick={() => handleCategoryTabClick(index, activeStockTab)}
                                    >
                                        {category.name}
                                    </button>

                                ))}
                                { /* --CATEGORY DROP DOWN-- */}
                                {/* checks to see that a stock is selected */}
                                {activeStockTab != null && ownDashboard && (
                                    <CategoryDropdownMenu
                                        addCategory={handleAddCategory}
                                        removeCategory={handleRemoveCategory}
                                        changeCategoryName={handleChangeCategoryName}
                                        getCategorySelected={getCategorySelected}
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
                                        {ownDashboard && category.moduleEntities.length === 0 ? (
                                            <div className="dashboard-empty-module">
                                                    <img width="100px" src={emptyCat}/>
                                                <Link to={`/Studio?stockIndex=${currentStockId}&categoryIndex=${currentCategoryId}`}>
                                                    <button className="dashboard-empty-module-button">
                                                        Create your first chart&nbsp;
                                                        <span className="dashboard-empty-module-button-here">here</span>
                                                        !
                                                    </button>
                                                </Link>
                                            </div>
                                        ) : (
                                            {/* if there are any moules in the category the modules will be
                                             displayed as highcharts*/},

                                            <EditableLayout
                                                category={category}
                                                dashboardLayout={dashboardLayout}
                                                ownDashboard={ownDashboard}
                                            />

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