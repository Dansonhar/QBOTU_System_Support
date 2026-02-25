import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    BarChart3, Search, MousePointerClick, TrendingUp, Trash2,
    HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AnalyticsDashboard() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [summary, setSummary] = useState({ totalClicks: 0, totalSearches: 0, uniqueArticles: 0, uniqueSearches: 0 });
    const [topArticles, setTopArticles] = useState([]);
    const [topSearches, setTopSearches] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [days, setDays] = useState(30);
    const [trendGroup, setTrendGroup] = useState('daily');
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    useEffect(() => {
        fetchAll();
    }, [days, trendGroup]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sumRes, articlesRes, searchesRes, trendRes] = await Promise.all([
                fetch(`${API_BASE_URL}/analytics/summary?days=${days}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE_URL}/analytics/top-articles?days=${days}&limit=20`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE_URL}/analytics/top-searches?days=${days}&limit=20`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE_URL}/analytics/trend?days=${days}&group=${trendGroup}`, { headers: getAuthHeaders() })
            ]);

            if (sumRes.ok) setSummary(await sumRes.json());
            if (articlesRes.ok) setTopArticles(await articlesRes.json());
            if (searchesRes.ok) setTopSearches(await searchesRes.json());
            if (trendRes.ok) setTrendData(await trendRes.json());
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async (type) => {
        const labels = { clicks: 'article click', searches: 'search', all: 'ALL analytics' };
        if (!window.confirm(`Are you sure you want to permanently delete ${labels[type]} data? This cannot be undone.`)) return;
        setClearing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/analytics/clear?type=${type}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                await fetchAll();
            } else {
                alert('Failed to clear data.');
            }
        } catch (e) {
            alert('Error clearing data: ' + e.message);
        } finally {
            setClearing(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Chart helpers
    const maxChartVal = Math.max(...trendData.map(d => d.clicks + d.searches), 1);

    const formatPeriodLabel = (period) => {
        if (trendGroup === 'daily') {
            // "2026-02-24" → "Feb 24"
            const d = new Date(period + 'T00:00:00');
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        if (trendGroup === 'weekly') {
            // "2026-W08" → "W08"
            return period.split('-')[1];
        }
        if (trendGroup === 'monthly') {
            // "2026-02" → "Feb 2026"
            const [y, m] = period.split('-');
            const d = new Date(parseInt(y), parseInt(m) - 1);
            return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
        return period;
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">
                <div className="admin-header">
                    <h1><BarChart3 size={28} style={{ marginRight: 8 }} /> Analytics</h1>
                    <div className="admin-header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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

                {/* ===== TREND CHART ===== */}
                <div className="admin-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <h3><TrendingUp size={18} style={{ marginRight: 6 }} /> Activity Trend</h3>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['daily', 'weekly', 'monthly'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => setTrendGroup(g)}
                                    style={{
                                        padding: '5px 14px',
                                        borderRadius: '20px',
                                        border: trendGroup === g ? '2px solid #F7941D' : '1px solid #ddd',
                                        background: trendGroup === g ? '#FFF3E0' : '#fff',
                                        color: trendGroup === g ? '#F7941D' : '#666',
                                        fontWeight: trendGroup === g ? '700' : '400',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        transition: 'all .2s'
                                    }}
                                >
                                    {g.charAt(0).toUpperCase() + g.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {trendData.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>No activity data for this period.</p>
                    ) : (
                        <div style={{ padding: '20px 16px 10px', overflowX: 'auto' }}>
                            {/* Legend */}
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '14px', fontSize: '13px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: 12, height: 12, borderRadius: 3, background: '#F7941D', display: 'inline-block' }}></span>
                                    Clicks
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: 12, height: 12, borderRadius: 3, background: '#1976d2', display: 'inline-block' }}></span>
                                    Searches
                                </span>
                            </div>

                            {/* Chart Container */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: trendData.length > 20 ? '2px' : '6px',
                                height: '220px',
                                borderBottom: '2px solid #eee',
                                paddingBottom: '0'
                            }}>
                                {trendData.map((d, i) => {
                                    const clickH = (d.clicks / maxChartVal) * 200;
                                    const searchH = (d.searches / maxChartVal) * 200;
                                    const barWidth = trendData.length > 20 ? 14 : (trendData.length > 10 ? 22 : 36);
                                    return (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 0', minWidth: barWidth + 8 }}>
                                            {/* Value labels */}
                                            <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px', whiteSpace: 'nowrap' }}>
                                                {d.clicks + d.searches > 0 ? (d.clicks + d.searches) : ''}
                                            </div>
                                            {/* Stacked bars */}
                                            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '200px' }}>
                                                <div
                                                    title={`Clicks: ${d.clicks}`}
                                                    style={{
                                                        width: barWidth / 2,
                                                        height: Math.max(clickH, d.clicks > 0 ? 4 : 0),
                                                        background: 'linear-gradient(180deg, #F7941D, #e67e00)',
                                                        borderRadius: '3px 3px 0 0',
                                                        transition: 'height 0.4s ease'
                                                    }}
                                                />
                                                <div
                                                    title={`Searches: ${d.searches}`}
                                                    style={{
                                                        width: barWidth / 2,
                                                        height: Math.max(searchH, d.searches > 0 ? 4 : 0),
                                                        background: 'linear-gradient(180deg, #42a5f5, #1976d2)',
                                                        borderRadius: '3px 3px 0 0',
                                                        transition: 'height 0.4s ease'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* X-axis labels */}
                            <div style={{ display: 'flex', gap: trendData.length > 20 ? '2px' : '6px' }}>
                                {trendData.map((d, i) => (
                                    <div key={i} style={{
                                        flex: '1 1 0',
                                        textAlign: 'center',
                                        fontSize: '10px',
                                        color: '#999',
                                        paddingTop: '6px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {formatPeriodLabel(d.period)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="admin-loading">Loading analytics...</div>
                ) : (
                    <div className="analytics-grid">
                        {/* Top Clicked Articles */}
                        <div className="admin-card">
                            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3><MousePointerClick size={18} style={{ marginRight: 6 }} /> Most Clicked Articles</h3>
                                {topArticles.length > 0 && (
                                    <button
                                        onClick={() => handleClear('clicks')}
                                        disabled={clearing}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            padding: '6px 14px', borderRadius: '6px',
                                            border: '1px solid #ef5350', background: '#fff',
                                            color: '#ef5350', fontSize: '12px', fontWeight: '600',
                                            cursor: clearing ? 'not-allowed' : 'pointer',
                                            transition: 'all .2s'
                                        }}
                                        onMouseEnter={e => { e.target.style.background = '#ef5350'; e.target.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#ef5350'; }}
                                    >
                                        <Trash2 size={13} /> Clear Click Data
                                    </button>
                                )}
                            </div>
                            {topArticles.length === 0 ? (
                                <p style={{ color: '#999', textAlign: 'center', padding: 24 }}>No data yet. Article clicks will appear here.</p>
                            ) : (
                                <div className="analytics-list">
                                    {topArticles.map((item, idx) => {
                                        const pct = (item.click_count / (topArticles[0]?.click_count || 1)) * 100;
                                        return (
                                            <div key={idx} className="analytics-list-item" style={{ position: 'relative' }}>
                                                {/* Background bar */}
                                                <div style={{
                                                    position: 'absolute', left: 0, top: 0, bottom: 0,
                                                    width: `${pct}%`, background: '#FFF3E0',
                                                    borderRadius: '6px', zIndex: 0, transition: 'width 0.5s ease'
                                                }} />
                                                <span className="analytics-rank" style={{ position: 'relative', zIndex: 1 }}>#{idx + 1}</span>
                                                <div className="analytics-item-info" style={{ position: 'relative', zIndex: 1 }}>
                                                    <strong>{item.title || '(Deleted Article)'}</strong>
                                                    {item.category_name && <span className="analytics-item-category">{item.category_name}</span>}
                                                </div>
                                                <span className="analytics-count" style={{ position: 'relative', zIndex: 1 }}>{item.click_count} clicks</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Top Searches */}
                        <div className="admin-card">
                            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3><Search size={18} style={{ marginRight: 6 }} /> Top Search Queries</h3>
                                {topSearches.length > 0 && (
                                    <button
                                        onClick={() => handleClear('searches')}
                                        disabled={clearing}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            padding: '6px 14px', borderRadius: '6px',
                                            border: '1px solid #ef5350', background: '#fff',
                                            color: '#ef5350', fontSize: '12px', fontWeight: '600',
                                            cursor: clearing ? 'not-allowed' : 'pointer',
                                            transition: 'all .2s'
                                        }}
                                        onMouseEnter={e => { e.target.style.background = '#ef5350'; e.target.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#ef5350'; }}
                                    >
                                        <Trash2 size={13} /> Clear Search Data
                                    </button>
                                )}
                            </div>
                            {topSearches.length === 0 ? (
                                <p style={{ color: '#999', textAlign: 'center', padding: 24 }}>No search data yet. User searches will appear here.</p>
                            ) : (
                                <div className="analytics-list">
                                    {topSearches.map((item, idx) => {
                                        const pct = (item.search_count / (topSearches[0]?.search_count || 1)) * 100;
                                        return (
                                            <div key={idx} className="analytics-list-item" style={{ position: 'relative' }}>
                                                <div style={{
                                                    position: 'absolute', left: 0, top: 0, bottom: 0,
                                                    width: `${pct}%`, background: '#E3F2FD',
                                                    borderRadius: '6px', zIndex: 0, transition: 'width 0.5s ease'
                                                }} />
                                                <span className="analytics-rank" style={{ position: 'relative', zIndex: 1 }}>#{idx + 1}</span>
                                                <div className="analytics-item-info" style={{ position: 'relative', zIndex: 1 }}>
                                                    <strong>"{item.search_query}"</strong>
                                                </div>
                                                <span className="analytics-count" style={{ position: 'relative', zIndex: 1 }}>{item.search_count} searches</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Clear ALL Data Button */}
                <div style={{ marginTop: '30px', textAlign: 'center', paddingBottom: '30px' }}>
                    <button
                        onClick={() => handleClear('all')}
                        disabled={clearing}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '10px 28px', borderRadius: '8px',
                            border: '2px solid #ef5350', background: '#fff',
                            color: '#ef5350', fontSize: '14px', fontWeight: '600',
                            cursor: clearing ? 'not-allowed' : 'pointer',
                            transition: 'all .2s'
                        }}
                        onMouseEnter={e => { e.target.style.background = '#ef5350'; e.target.style.color = '#fff'; }}
                        onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#ef5350'; }}
                    >
                        <Trash2 size={16} /> {clearing ? 'Clearing...' : 'Clear ALL Analytics Data'}
                    </button>
                </div>
            </main>
        </div>
    );
}
