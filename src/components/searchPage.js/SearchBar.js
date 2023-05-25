import React, {useState} from 'react';
import axios from "axios";

export default function SearchBar(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownResult, setDropdownResult] = useState([]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);

        handleDropdownResults(event.target.value);
    };

    const handleFormSubmit = (event) => {
        try {
            event.preventDefault();
            props.onSearch(searchTerm);
            setSearchTerm('');
            setDropdownResult([]);
        } catch (error) {
            console.log("handleFormSubmit error: ", error)
        }

    };

    async function handleDropdownResults(searchTerm) {

        try {
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL + `/search-analyst-include-sub-info?search=${searchTerm}`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }
            );

            if (searchTerm === '') {
                setDropdownResult([]);
            } else {
                setDropdownResult(response.data)
            }


        } catch (error) {
            console.log("Dropdown error: ", error)
        }
    }

    function handleButtonSubmit(username) {
        try {
            props.onSearch(username)
            setDropdownResult([]);
            setSearchTerm('');
        } catch (error) {
            console.log("handleButtonSubmit error: ", error);
        }

    }


    return (
        <div className="dropdown-container">
            <form className="search--form" onSubmit={handleFormSubmit}>

                <input
                    className="search--search"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onInput={handleChange}
                    
                />
                {<div>
                    <ul className="search-bar-dropdown-menu">
                        {dropdownResult.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleButtonSubmit(option.profile.username)}
                            >
                                {option.profile.username}

                            </li>
                        ))}
                    </ul>
                </div>}
            </form>


        </div>
    );
};
