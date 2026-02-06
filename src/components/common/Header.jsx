import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { articlesByCategory } from '../../data/articles';
import logo from '../../assets/superpos-logo.png';

const Header = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Flatten articles for easy searching
  const allArticles = useMemo(() => {
    let articles = [];
    Object.keys(articlesByCategory).forEach(catId => {
      const category = articlesByCategory[catId];
      if (category.sections) {
        category.sections.forEach(section => {
          if (section.articles) {
            section.articles.forEach(article => {
              articles.push({
                ...article,
                categoryId: catId,
                categoryTitle: category.title
              });
            });
          }
        });
      }
    });
    return articles;
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      const filtered = allArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
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
        <Link to="/" className="logo">
          <img src={logo} alt="SUPERPOS" className="logo-img" />
        </Link>

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
                  {searchResults.slice(0, 8).map((article) => ( // Limit to 8 results
                    <li key={article.id}>
                      <Link
                        to={`/article/${article.id}`}
                        className="search-result-item"
                        onClick={() => setShowResults(false)}
                      >
                        <span className="search-result-title">{article.title}</span>
                        <span className="search-result-category">{article.categoryTitle}</span>
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
