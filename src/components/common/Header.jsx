import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/superpos-logo.png';

const Header = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3001/api/questions?search=${encodeURIComponent(searchQuery)}&status=published&limit=8`);
        const data = await res.json();
        setSearchResults(data.questions || []);
        setShowResults(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      {/* Admin Login Button - Absolute Top Left */}
      <Link to="/admin/login" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '8px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white to blend with orange header
        color: 'white',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        textDecoration: 'none',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'all 0.2s',
        zIndex: 1000
      }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
      >
        Admin Login
      </Link>

      <div className="container header-inner">
        <div className="header-left">
          <Link to="/" className="logo">
            <img src={logo} alt="SUPERPOS" className="logo-img" />
          </Link>
        </div>

        <h1 className="hero-title">{t('nav.solutions_title')}</h1>

        <div className="search-container" ref={searchRef}>
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={t('nav.search_placeholder')}
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => {
                if (searchQuery.length > 0) setShowResults(true);
              }}
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="search-dropdown">
              {searchResults.length > 0 ? (
                <ul className="search-results-list">
                  {searchResults.map((article) => (
                    <li key={article.id}>
                      <Link
                        to={`/article/${article.id}`}
                        className="search-result-item"
                        onClick={() => setShowResults(false)}
                      >
                        <span className="search-result-title">
                          {article.title}
                        </span>
                        <span className="search-result-category">
                          {article.category_name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="search-no-results">
                  {t('nav.no_results', { query: searchQuery })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
