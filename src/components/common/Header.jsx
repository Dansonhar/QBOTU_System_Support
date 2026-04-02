import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL, DATA_MODE } from '../../config';
import logo from '../../assets/qpos-logo.png';

function WaterCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLS = 28;   // vertical lines
    const ROWS = 22;   // horizontal lines
    const GRID_W = 2400;
    const GRID_D = 1800;

    function waveY(x, z, t) {
      return (
        Math.sin(x * 0.0035 + t * 1.1) * 28 +
        Math.sin(x * 0.007 - z * 0.004 + t * 1.7) * 14 +
        Math.sin(z * 0.005 + t * 0.8) * 20 +
        Math.sin(x * 0.0015 + z * 0.006 - t * 1.3) * 10 +
        Math.sin(x * 0.012 + z * 0.003 + t * 2.2) * 6
      );
    }

    function project(wx, wy, wz, W, H) {
      const fov = 420;
      const camY = 280;
      const horizon = H * 0.52;
      const dx = wx - GRID_W / 2;
      const dy = wy - camY;
      const dz = wz + 10;
      const scale = fov / dz;
      return {
        x: W / 2 + dx * scale,
        y: horizon + dy * scale,
        scale,
        depth: wz / GRID_D,
      };
    }

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Build vertex grid
      const verts = [];
      for (let r = 0; r <= ROWS; r++) {
        const row = [];
        for (let c = 0; c <= COLS; c++) {
          const wx = (c / COLS) * GRID_W;
          const wz = (r / ROWS) * GRID_D + 80;
          const wy = waveY(wx, wz, time);
          row.push(project(wx, wy, wz, W, H));
        }
        verts.push(row);
      }

      // Draw horizontal lines (rows going into depth)
      for (let r = 0; r <= ROWS; r++) {
        const d = verts[r][0].depth;
        const alpha = 0.06 + d * 0.55;
        const lw = 0.3 + d * 1.6;
        ctx.beginPath();
        for (let c = 0; c <= COLS; c++) {
          const { x, y } = verts[r][c];
          c === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(160,230,255,${alpha.toFixed(2)})`;
        ctx.lineWidth = lw;
        ctx.shadowBlur = d > 0.6 ? 8 : 0;
        ctx.shadowColor = 'rgba(100,200,255,0.4)';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw vertical lines (columns running toward horizon)
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        for (let r = 0; r <= ROWS; r++) {
          const { x, y } = verts[r][c];
          r === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(100,200,255,0.08)';
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // Top fade mask
      const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.35);
      topGrad.addColorStop(0, 'rgba(0,0,0,1)');
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, H * 0.35);

      // Bottom fade mask
      const botGrad = ctx.createLinearGradient(0, H * 0.72, 0, H);
      botGrad.addColorStop(0, 'rgba(0,0,0,0)');
      botGrad.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, H * 0.72, W, H * 0.28);

      time += 0.012;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

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
    <header className="header" style={{ position: 'relative', overflow: 'hidden' }}>
      <WaterCanvas />

      <div className="container header-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div className="header-left">
          <Link to="/" className="logo">
            <img src={logo} alt="QPOS" className="logo-img" />
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
