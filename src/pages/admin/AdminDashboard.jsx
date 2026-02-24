import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import {
    LayoutDashboard, FolderOpen, HelpCircle, LogOut, Plus,
    TrendingUp, FileText, CheckCircle, Users, BarChart3, Settings, MessageCircle
} from 'lucide-react';

const AdminDashboard = () => {
    const { logout, getAuthHeaders } = useAuth();
    const [stats, setStats] = useState({
        categories: 0,
        questions: 0,
        published: 0,
        drafts: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch categories
            const catRes = await fetch(`${API_BASE_URL}/categories`);
            const categories = await catRes.json();

            // Fetch questions
            const qRes = await fetch(`${API_BASE_URL}/questions`);
            const questionsData = await qRes.json();

            setStats({
                categories: categories.length,
                questions: questionsData.pagination?.total || 0,
                published: questionsData.questions?.filter(q => q.status === 'published').length || 0,
                drafts: questionsData.questions?.filter(q => q.status === 'draft').length || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const [isPublishing, setIsPublishing] = useState(false);
    const [publishMessage, setPublishMessage] = useState('');

    const handlePublish = async () => {
        setIsPublishing(true);
        setPublishMessage('Publishing changes... this may take a minute.');
        try {
            const res = await fetch(`${API_BASE_URL}/publish`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setPublishMessage('✅ Successfully published to GitHub! Changes will be live in 1-2 minutes.');
            } else {
                setPublishMessage('❌ Failed to publish: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Publish error:', error);
            setPublishMessage('❌ Failed to publish: Network or server error');
        } finally {
            setIsPublishing(false);
            setTimeout(() => setPublishMessage(''), 8000);
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>SUPERPOS</h2>
                    <span>Admin Panel</span>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className="admin-nav-item active">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/categories" className="admin-nav-item">
                        <FolderOpen size={20} />
                        <span>Categories</span>
                    </Link>
                    <Link to="/admin/questions" className="admin-nav-item">
                        <HelpCircle size={20} />
                        <span>Questions</span>
                    </Link>
                    <Link to="/admin/analytics" className="admin-nav-item">
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </Link>
                    <Link to="/admin/users" className="admin-nav-item">
                        <Users size={20} />
                        <span>Users</span>
                    </Link>
                    <Link to="/admin/tickets" className="admin-nav-item">
                        <MessageCircle size={20} />
                        <span>Tickets</span>
                    </Link>
                    <Link to="/admin/support-settings" className="admin-nav-item">
                        <Settings size={20} />
                        <span>Support Widget</span>
                    </Link>
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/" className="admin-nav-item">
                        <FileText size={20} />
                        <span>View Site</span>
                    </Link>
                    <button onClick={logout} className="admin-nav-item admin-logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <div className="admin-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                    <h1>Dashboard</h1>
                    <div className="admin-header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="admin-btn"
                            style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', fontWeight: 'bold' }}
                        >
                            {isPublishing ? '⏳ Publishing...' : '🚀 Publish to Live Website'}
                        </button>
                        <Link to="/admin/questions/new" className="admin-btn admin-btn-primary">
                            <Plus size={18} />
                            New Question
                        </Link>
                    </div>
                    {publishMessage && (
                        <div style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#e3f2fd', color: '#000', borderRadius: '4px', borderLeft: '4px solid #2196f3' }}>
                            {publishMessage}
                        </div>
                    )}
                </div>

                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: '#e3f2fd' }}>
                            <FolderOpen size={24} color="#1976d2" />
                        </div>
                        <div className="admin-stat-content">
                            <span className="admin-stat-value">{stats.categories}</span>
                            <span className="admin-stat-label">Categories</span>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: '#fff3e0' }}>
                            <HelpCircle size={24} color="#f57c00" />
                        </div>
                        <div className="admin-stat-content">
                            <span className="admin-stat-value">{stats.questions}</span>
                            <span className="admin-stat-label">Total Questions</span>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: '#e8f5e9' }}>
                            <CheckCircle size={24} color="#388e3c" />
                        </div>
                        <div className="admin-stat-content">
                            <span className="admin-stat-value">{stats.published}</span>
                            <span className="admin-stat-label">Published</span>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: '#fce4ec' }}>
                            <TrendingUp size={24} color="#c2185b" />
                        </div>
                        <div className="admin-stat-content">
                            <span className="admin-stat-value">{stats.drafts}</span>
                            <span className="admin-stat-label">Drafts</span>
                        </div>
                    </div>
                </div>

                <div className="admin-quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="admin-actions-grid">
                        <Link to="/admin/categories" className="admin-action-card">
                            <FolderOpen size={32} />
                            <span>Manage Categories</span>
                        </Link>
                        <Link to="/admin/questions" className="admin-action-card">
                            <HelpCircle size={32} />
                            <span>Manage Questions</span>
                        </Link>
                        <Link to="/admin/questions/new" className="admin-action-card">
                            <Plus size={32} />
                            <span>Add New Question</span>
                        </Link>
                        <Link to="/admin/users" className="admin-action-card">
                            <Users size={32} />
                            <span>Manage Users</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
