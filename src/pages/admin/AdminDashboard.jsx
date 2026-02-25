import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import {
    FolderOpen, HelpCircle, Plus,
    TrendingUp, CheckCircle, Users
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminDashboard = () => {
    const { getAuthHeaders } = useAuth();
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
            const catRes = await fetch(`${API_BASE_URL}/categories`);
            const categories = await catRes.json();

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

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">
                <div className="admin-header">
                    <h1>Dashboard</h1>
                    <div className="admin-header-actions">
                        <Link to="/admin/questions/new" className="admin-btn admin-btn-primary">
                            <Plus size={18} />
                            New Question
                        </Link>
                    </div>
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
