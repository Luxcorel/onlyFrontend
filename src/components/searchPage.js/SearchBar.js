import React, { useState } from 'react';

export default function SearchBar(props) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        props.onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className="search--form">
            <input
                className="search--search"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
            />
        </form>
    );
};
