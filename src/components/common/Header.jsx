import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL, DATA_MODE } from '../../config';
import logo from '../../assets/superpos-logo.png';

const Header = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const searchTrackTimerRef = useRef(null);
  const searchIndexRef = useRef(null); // Cache for static search index

  const trackEvent = (event_type, data = {}) => {
    if (DATA_MODE === 'static') return; // No analytics on GitHub Pages
    fetch(`${API_BASE_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type, ...data })
    }).catch(() => { });
  };

  // Debounce search
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        if (DATA_MODE === 'static') {
          // Client-side search: load index once, then filter
          if (!searchIndexRef.current) {
            const res = await fetch(`${API_BASE_URL}/search.json`);
            const data = await res.json();
            searchIndexRef.current = data.questions || [];
          }
          const query = searchQuery.toLowerCase();
          const filtered = searchIndexRef.current.filter(q =>
            q.title.toLowerCase().includes(query) ||
            (q.description && q.description.toLowerCase().includes(query))
          ).slice(0, 8);
          setSearchResults(filtered);
          setShowResults(true);
        } else {
          // Server-side search
          const res = await fetch(`${API_BASE_URL}/questions?search=${encodeURIComponent(searchQuery)}&status=published&limit=8`);
          const data = await res.json();
          setSearchResults(data.questions || []);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    // Track search queries (debounced, fire 1s after user stops typing)
    clearTimeout(searchTrackTimerRef.current);
    if (val.trim().length > 1) {
      searchTrackTimerRef.current = setTimeout(() => {
        trackEvent('search', { search_query: val.trim() });
      }, 1000);
    }
  };

  const handleResultClick = (article) => {
    trackEvent('article_click', { question_id: article.id });
    setShowResults(false);
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
              placeholder="Search by feature, issue, or module...."
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
                        onClick={() => handleResultClick(article)}
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
