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
        <div ref={dropdownRef}>
            <button onClick={handleToggleMenu}>...</button>

            {showMenu && (

                <ul style={{

                        // >>>> OBS – TA BORT DETTA VID DESIGN <<<<<

                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                        padding: "10px",
                        zIndex: 10000,
                        position: "absolute",
                        overflow: "auto",
                        height: "450px",
                        width: "300px",
                        backgroundColor: "#FFFFFF"

                        // >>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<
                    }}>
                    <div>
                        <input
                            type="text"
                            placeholder="Search for a stock"
                            value={searchText}
                            onChange={(e) =>handleSearchTextChange(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleRemoveStock()}>Remove</button>
                    <p>---- Add a new stock ----</p>
                    {refStocksToShow != null &&
                        refStocksToShow.map((stock) => (
                        <div className="dashboard-stock-add-container" key={stock.id}>
                            <li>{stock.name} [{stock.ticker}]</li>
                            <button value={stock.id}
                                    onClick={() => handleAddStock(stock.id)}
                            >Add</button>
                        </div>
                    ))}
                </ul>
                )
            }

        </div>
    )
}