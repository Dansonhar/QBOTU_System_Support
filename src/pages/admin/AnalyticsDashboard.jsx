import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    BarChart3, Search, MousePointerClick, TrendingUp, ArrowLeft,
    LayoutDashboard, FolderOpen, HelpCircle, Users, LogOut, Settings, ChevronDown, MessageCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';



export default function AnalyticsDashboard() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [summary, setSummary] = useState({ totalClicks: 0, totalSearches: 0, uniqueArticles: 0, uniqueSearches: 0 });
    const [topArticles, setTopArticles] = useState([]);
    const [topSearches, setTopSearches] = useState([]);
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    useEffect(() => {
        fetchAll();
    }, [days]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sumRes, articlesRes, searchesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/analytics/summary?days=${days}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE_URL}/analytics/top-articles?days=${days}&limit=20`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE_URL}/analytics/top-searches?days=${days}&limit=20`, { headers: getAuthHeaders() })
            ]);

            if (sumRes.ok) setSummary(await sumRes.json());
            if (articlesRes.ok) setTopArticles(await articlesRes.json());
            if (searchesRes.ok) setTopSearches(await searchesRes.json());
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>SUPERPOS</h2>
                    <span>Admin Panel</span>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className={`admin-nav-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/categories" className={`admin-nav-item ${location.pathname === '/admin/categories' ? 'active' : ''}`}>
                        <FolderOpen size={20} /> Categories
                    </Link>
                    <Link to="/admin/questions" className={`admin-nav-item ${location.pathname.startsWith('/admin/questions') ? 'active' : ''}`}>
                        <HelpCircle size={20} /> Questions
                    </Link>
                    <Link to="/admin/analytics" className={`admin-nav-item ${location.pathname === '/admin/analytics' ? 'active' : ''}`}>
                        <BarChart3 size={20} /> Analytics
                    </Link>
                    <Link to="/admin/users" className={`admin-nav-item ${location.pathname === '/admin/users' ? 'active' : ''}`}>
                        <Users size={20} /> Users
                    </Link>
                    <Link to="/admin/tickets" className={`admin-nav-item ${location.pathname === '/admin/tickets' ? 'active' : ''}`}>
                        <MessageCircle size={20} /> Tickets
                    </Link>
                    <Link to="/admin/support-settings" className={`admin-nav-item ${location.pathname === '/admin/support-settings' ? 'active' : ''}`}>
                        <Settings size={20} /> Support Widget
                    </Link>
                </nav>
                <div className="admin-sidebar-footer">
                    <button onClick={handleLogout} className="admin-nav-item admin-logout-btn">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <div className="admin-header">
                    <h1><BarChart3 size={28} style={{ marginRight: 8 }} /> Analytics</h1>
                    <div className="admin-header-actions">
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="admin-filter-select"
                        >
                            <option value={7}>Last 7 days</option>
                            <option value={14}>Last 14 days</option>
                            <option value={30}>Last 30 days</option>
                            <option value={90}>Last 90 days</option>
                            <option value={365}>Last year</option>
                        </select>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: '#fff3e0', color: '#F7941D' }}>
                            <MousePointerClick size={24} />
                        </div>
                        <div className="admin-stat-content">
                            <span className="admin-stat-value">{summary.totalClicks}</span>
                            <span className="admin-stat-label">Total Article Clicks</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
                            <Search size={24} />
                        </div>
                        <div className="admin-stat-content">
                            <span className="admin-stat-value">{summary.totalSearches}</span>
                            <span className="admin-stat-label">Total Searches</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                            <HelpCircle size={24} />
                        </div>
                        <div className="admin-stat-content">
                            <span className="admin-stat-value">{summary.uniqueArticles}</span>
                            <span className="admin-stat-label">Unique Articles Viewed</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: '#fce4ec', color: '#c62828' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className="admin-stat-content">
                            <span className="admin-stat-value">{summary.uniqueSearches}</span>
                            <span className="admin-stat-label">Unique Search Terms</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading analytics...</div>
                ) : (
                    <div className="analytics-grid">
                        {/* Top Clicked Articles */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3><MousePointerClick size={18} style={{ marginRight: 6 }} /> Most Clicked Articles</h3>
                            </div>
                            {topArticles.length === 0 ? (
                                <p style={{ color: '#999', textAlign: 'center', padding: 24 }}>No data yet. Article clicks will appear here.</p>
                            ) : (
                                <div className="analytics-list">
                                    {topArticles.map((item, idx) => (
                                        <div key={idx} className="analytics-list-item">
                                            <span className="analytics-rank">#{idx + 1}</span>
                                            <div className="analytics-item-info">
                                                <strong>{item.title || '(Deleted Article)'}</strong>
                                                {item.category_name && <span className="analytics-item-category">{item.category_name}</span>}
                                            </div>
                                            <span className="analytics-count">{item.click_count} clicks</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Top Searches */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3><Search size={18} style={{ marginRight: 6 }} /> Top Search Queries</h3>
                            </div>
                            {topSearches.length === 0 ? (
                                <p style={{ color: '#999', textAlign: 'center', padding: 24 }}>No search data yet. User searches will appear here.</p>
                            ) : (
                                <div className="analytics-list">
                                    {topSearches.map((item, idx) => (
                                        <div key={idx} className="analytics-list-item">
                                            <span className="analytics-rank">#{idx + 1}</span>
                                            <div className="analytics-item-info">
                                                <strong>"{item.search_query}"</strong>
                                            </div>
                                            <span className="analytics-count">{item.search_count} searches</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
