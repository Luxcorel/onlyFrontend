import React, {useEffect, useRef} from "react"
import axios from "axios";


export default function StockDropdownMenu(props) {

    const [showMenu, setShowMenu] = React.useState(false);
    const dropdownRef = useRef(null);
    const [refStocks, setRefStocks] = React.useState(null);
    const [refStocksToShow, setRefStocksToShow] = React.useState(null);
    const [searchText, setSearchText] = React.useState("");

    /**
     * The menu closes when clicked outside the dropdown menu
     */
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL+"/dashboard/getStockRef", {withCredentials: true}).then((response) => {
            setRefStocks(response.data);
            setRefStocksToShow(response.data);
            console.log("stockRefs: ", response.data);
        })
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [dropdownRef]);

    /**
     * Toggle switch for when the dropdown menu
     * should be shown or not
     */
    function handleToggleMenu() {
        setShowMenu(!showMenu);
    }

    /**
     * Function for handling click inside of dropdown menu
     * @param item represents the button clicked
     */
    function handleMenuItemClick(item) {
        if(item === "Item 1") {
            console.log(item)
        } else if(item === "Item 2") {
            console.log(item)
        }
    }

    function handleSearchTextChange(value){
        setSearchText(value)

        if(value === ""){
            setRefStocksToShow(refStocks)
        }
        else{
            const searchedRefStock = refStocks.filter((stock) => {
                const searchTerm = value.toLowerCase();
                const stockName = stock.name.toLowerCase();
                const stockTicker = stock.ticker.toLowerCase();

                return stockName.includes(searchTerm) || stockTicker.includes(searchTerm);
            });
            setRefStocksToShow(searchedRefStock)
        }
    }

    function handleAddStock(stockId){
        props.addStock(stockId);
        handleToggleMenu();
        handleSearchTextChange("");
    }

    function handleRemoveStock(){
        props.removeStock();
        handleToggleMenu();
    }


    return (
        <>
        <div ref={dropdownRef}>
            <button
                onClick={handleToggleMenu}
                className="dashboard-button-round"
            >
                <p className="dashboard-button-small-text">+</p>
            </button>

            {showMenu && (
                <div className="dashboard-drop-down-container dashboard-stock-dropdown">
                    <div className="dashboard-stock-dropdown-top-container">
                        <input
                            className="dashboard-input"
                            type="text"
                            placeholder="Search for a stock"
                            value={searchText}
                            onChange={(e) =>handleSearchTextChange(e.target.value)}
                        />
                        <button
                            onClick={() => handleRemoveStock()}
                            className="dashboard-button"
                        >
                            Remove
                        </button>
                        <p> --- Add a new stock ---</p>

                    </div>
                    <div className="dashboard-add-stock-container">
                    <ul>
                        {refStocksToShow != null &&
                        refStocksToShow.map((stock) => (
                        <li>
                            <div>
                                <p>{stock.name} [{stock.ticker}]</p>
                                <button
                                    className="dashboard-button"
                                    value={stock.id}
                                    onClick={() => handleAddStock(stock.id)}
                                >
                                    <p>Add</p>
                                </button>
                            </div>
                        </li>
                    ))}
                    </ul>
                    </div>
                </div>
                )
            }

        </div>
            {/*<p className="dashboard-dropdown-menu-text">⫷ ADD A STOCK</p>*/}
        </>
    )
}