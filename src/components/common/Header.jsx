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
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NUM_ROWS = 32;   // horizontal wave lines spread across full height
    const NUM_COLS = 22;   // vertical connector lines

    // Pre-compute per-row properties
    const rows = Array.from({ length: NUM_ROWS }, (_, i) => {
      const d = i / (NUM_ROWS - 1); // 0 = top, 1 = bottom
      return {
        baseY: d,                                     // fraction of height
        amp:   0.012 + d * 0.045,                    // bigger waves toward bottom
        freq:  0.009 - d * 0.004,                    // longer waves toward bottom
        speed: 0.25 + d * 0.6,                       // faster toward bottom
        phase: i * 0.55,
        freq2: 0.018 - d * 0.006,
        speed2: -(0.18 + d * 0.35),
        alpha: 0.04 + d * 0.42,                      // brighter toward bottom
        lw:    0.4 + d * 2.2,                        // thicker toward bottom
        glow:  d > 0.55,
      };
    });

    // Sample X positions for vertical connectors
    const colXFrac = Array.from({ length: NUM_COLS + 1 }, (_, i) => i / NUM_COLS);

    function rowY(row, xFrac, t) {
      const x = xFrac * 1000; // scale for frequency math
      return (
        row.baseY +
        Math.sin(x * row.freq  + t * row.speed  + row.phase) * row.amp +
        Math.sin(x * row.freq2 + t * row.speed2 + row.phase * 0.7) * row.amp * 0.4
      );
    }

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Cache row points for vertical lines
      const pts = rows.map(row =>
        colXFrac.map(xf => ({
          x: xf * W,
          y: rowY(row, xf, t) * H,
        }))
      );

      // Draw vertical connector lines (grid mesh)
      for (let c = 0; c <= NUM_COLS; c++) {
        ctx.beginPath();
        pts.forEach((rowPts, ri) => {
          ri === 0 ? ctx.moveTo(rowPts[c].x, rowPts[c].y) : ctx.lineTo(rowPts[c].x, rowPts[c].y);
        });
        ctx.strokeStyle = 'rgba(100,210,255,0.07)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw horizontal wave lines
      rows.forEach((row, ri) => {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const y = rowY(row, x / W, t) * H;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        if (row.glow) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(80,200,255,0.5)';
        }
        ctx.strokeStyle = `rgba(140,220,255,${row.alpha.toFixed(3)})`;
        ctx.lineWidth = row.lw;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Subtle left/right edge fade
      ['left', 'right'].forEach(side => {
        const g = ctx.createLinearGradient(side === 'left' ? 0 : W, 0, side === 'left' ? W * 0.08 : W * 0.92, 0);
        g.addColorStop(0, 'rgba(0,0,0,0.6)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(side === 'left' ? 0 : W * 0.92, 0, W * 0.08, H);
      });

      t += 0.011;
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
