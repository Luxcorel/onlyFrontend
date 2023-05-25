import React, {useEffect, useRef, useState} from "react"

export default function CategoryDropdownMenu(props) {

    const [showMenu, setShowMenu] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const dropdownRef = useRef(null);
    const categorySelected = useState(
        props.getCategorySelected()
    )

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
        console.log(categorySelected, "category SElected")
    }


    function handleRemoveCategory(event) {
        props.removeCategory()
        handleOnSubmit(event)
    }

    function handleAddCategory(event){
        props.addCategory("New Category")
        handleOnSubmit(event)
    }

    function handleCangeCategoryName(event, inputValue){
        if(inputValue !== ""){
            props.changeCategoryName(inputValue)
            handleOnSubmit(event)
        }

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
        <>
        <div ref={dropdownRef}>
            <button
                className="dashboard-button-round"
                onClick={handleToggleMenu}
            >
                <p className="dashboard-button-small-text">+</p>
            </button>
            {
                showMenu &&
                (
                    <div
                        className="dashboard-drop-down-container"
                        >
                        <p className="dashboard-text">Modify your categories</p>
                        <div className="dashboard-category-drop-down-button-container">
                            <button
                                onClick={ (e) => handleAddCategory(e)}
                                className="dashboard-button"
                            >
                                Add Category
                            </button>
                            {categorySelected && (<button
                                onClick={ (e) => handleRemoveCategory(e)}
                                className="dashboard-button"

                            >
                                Remove selected category
                            </button>
                            )}
                        </div>
                        <form onSubmit={handleOnSubmit}>
                            <input
                                className="dashboard-input"
                                type="text"
                                placeholder="Category Name"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </form>
                        <div>
                            <button
                                className="dashboard-button"
                                onClick={(e) => handleCangeCategoryName(e, inputValue)}
                            >
                                Change selected name
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
            {/*<p>hej</p>*/}
        </>
    )
}