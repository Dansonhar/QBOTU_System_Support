import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = "Search for help articles, guides, or FAQs..." }) => {
    return (
        <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
            />
        </div>
    );
};

export default SearchBar;
