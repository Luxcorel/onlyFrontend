import React, {useEffect, useRef} from "react"

export default function CategoryDropdownMenu(props) {

    const [showMenu, setShowMenu] = React.useState(false);
    const [inputValue, setInputValue] = React.useState();
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


    function handleRemoveCategory() {

    }

    /**
     * Handles what happens after the dropdown input is submitted
     * @param event
     */
    function handleOnSubmit(event) {
        event.preventDefault();
        setShowMenu(false);



        setInputValue("");
    }


    return (
        <div ref={dropdownRef}>
            <button onClick={handleToggleMenu}>...</button>
            {
                showMenu &&
                (
                    <div style={{

                        // >>>> OBS – TA BORT DETTA VID DESIGN <<<<<

                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                        backgroundColor: "#fff",
                        padding: "10px"

                        // >>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<
                    }}>

                        <button onClick={props.addCategory}>Add Category</button>
                        <button onClick={props.removeCategory}>Remove Category</button>
                        <button onClick={props.changeCategoryName}>Change name</button>

                        <form onSubmit={handleOnSubmit}>
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </form>
                    </div>
                )
            }
        </div>
    )
}