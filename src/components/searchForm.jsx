import React, { useState } from 'react';
import '../styles/searchForm.css';

const SearchForm = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </form>
    );
};

export default SearchForm;