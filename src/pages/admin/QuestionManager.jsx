import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import {
    LayoutDashboard, FolderOpen, HelpCircle, LogOut, Plus,
    Edit, Trash2, FileText, Search, Filter, Eye, Users
} from 'lucide-react';

const QuestionManager = () => {
    const { logout, getAuthHeaders } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

    // Initialize filters from URL params
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category_id: searchParams.get('category') || '',
        status: searchParams.get('status') || ''
    });

    useEffect(() => {
        fetchCategories();
        fetchQuestions();
    }, [pagination.page, filters]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.category_id) params.set('category', filters.category_id);
        if (filters.status) params.set('status', filters.status);
        if (filters.search) params.set('search', filters.search);
        setSearchParams(params, { replace: true });
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.search && { search: filters.search }),
                ...(filters.category_id && { category_id: filters.category_id }),
                ...(filters.status && { status: filters.status })
            });

            const res = await fetch(`${API_BASE_URL}/questions?${params}`);
            const data = await res.json();
            setQuestions(data.questions || []);
            setPagination(prev => ({ ...prev, ...data.pagination }));
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this question?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                fetchQuestions();
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchQuestions();
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>SUPERPOS</h2>
                    <span>Admin Panel</span>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className="admin-nav-item">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/categories" className="admin-nav-item">
                        <FolderOpen size={20} />
                        <span>Categories</span>
                    </Link>
                    <Link to="/admin/questions" className="admin-nav-item active">
                        <HelpCircle size={20} />
                        <span>Questions</span>
                    </Link>
                    <Link to="/admin/users" className="admin-nav-item">
                        <Users size={20} />
                        <span>Users</span>
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
                <div className="admin-header">
                    <h1>Questions</h1>
                    <div className="admin-header-actions">
                        <Link to="/admin/questions/new" className="admin-btn admin-btn-primary">
                            <Plus size={18} />
                            Add Question
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="admin-filters">
                    <form onSubmit={handleSearch} className="admin-search-form">
                        <div className="admin-search-input">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                    </form>

                    <select
                        value={filters.category_id}
                        onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                        className="admin-filter-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="admin-filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Steps</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="admin-loading">Loading...</td></tr>
                            ) : questions.length === 0 ? (
                                <tr><td colSpan="6" className="admin-empty">No questions found</td></tr>
                            ) : (
                                questions.map(q => (
                                    <tr key={q.id}>
                                        <td><strong>{q.title}</strong></td>
                                        <td>{q.category_name}</td>
                                        <td>{q.stepCount} steps</td>
                                        <td>
                                            <span className={`admin-badge ${q.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                                {q.status}
                                            </span>
                                        </td>
                                        <td>{new Date(q.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button
                                                    onClick={() => navigate(`/admin/questions/${q.id}?category=${filters.category_id || q.category_id}`)}
                                                    className="admin-action-btn"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(q.id)}
                                                    className="admin-action-btn danger"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="admin-pagination">
                        <button
                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="admin-btn admin-btn-secondary"
                        >
                            Previous
                        </button>
                        <span>Page {pagination.page} of {pagination.totalPages}</span>
                        <button
                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                            disabled={pagination.page === pagination.totalPages}
                            className="admin-btn admin-btn-secondary"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default QuestionManager;
