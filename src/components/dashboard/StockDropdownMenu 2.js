import React, {useEffect, useRef} from "react"


export default function StockDropdownMenu() {

    const [showMenu, setShowMenu] = React.useState(false);
    const dropdownRef = useRef(null);

    /**
     * The menu closes when clicked outside the dropdown menu
     */
    useEffect(() => {
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

    return (
        <div ref={dropdownRef}>
            <button onClick={handleToggleMenu}>...</button>

            {showMenu && (
                    <ul style={{

                        // >>>> OBS – TA BORT DETTA VID DESIGN <<<<<

                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                        backgroundColor: "#fff",
                        padding: "10px"

                        // >>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<
                    }}>
                        <button onClick={() => handleMenuItemClick('Item 1')}>Item 1</button>
                        <button onClick={() => handleMenuItemClick('Item 2')}>Item 2</button>
                        <button onClick={() => handleMenuItemClick('Item 3')}>Item 3</button>
                    </ul>
                )
            }

        </div>
    )
}