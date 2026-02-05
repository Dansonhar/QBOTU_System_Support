import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { articlesByCategory } from '../../data/articles';

const Header = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [showResults, setShowResults] = React.useState(false);
  const searchRef = React.useRef(null);

  // Flatten articles for easy searching
  const allArticles = React.useMemo(() => {
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

  // Close dropdown when clicking outside
  React.useEffect(() => {
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
          STOREHUB
        </Link>

        <h1 className="hero-title">Solutions at Your Fingertips</h1>

        <div className="search-container" ref={searchRef}>
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for articles..."
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
                  No articles found for "{searchQuery}"
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
