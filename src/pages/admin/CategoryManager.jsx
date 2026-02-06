import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import {
    LayoutDashboard, FolderOpen, HelpCircle, LogOut, Plus,
    Edit, Trash2, FileText, X, Users, Check, AlertTriangle
} from 'lucide-react';

const CategoryManager = () => {
    const { logout, getAuthHeaders, token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', status: 'active' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCategory
                ? `${API_BASE_URL}/categories/${editingCategory.id}`
                : `${API_BASE_URL}/categories`;

            const res = await fetch(url, {
                method: editingCategory ? 'PUT' : 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchCategories();
                closeModal();
            }
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        try {
            const res = await fetch(`${API_BASE_URL}/categories/${categoryToDelete.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                fetchCategories();
                setShowDeleteModal(false);
                setCategoryToDelete(null);
            } else {
                const error = await res.json();
                alert(error.error);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '', status: 'active' });
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            status: category.status
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', status: 'active' });
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
                    <Link to="/admin/categories" className="admin-nav-item active">
                        <FolderOpen size={20} />
                        <span>Categories</span>
                    </Link>
                    <Link to="/admin/questions" className="admin-nav-item">
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
                    <h1>Categories</h1>
                    <div className="admin-header-actions">
                        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
                            <Plus size={18} />
                            Add Category
                        </button>
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Questions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="admin-loading">Loading...</td></tr>
                            ) : categories.length === 0 ? (
                                <tr><td colSpan="5" className="admin-empty">No categories found</td></tr>
                            ) : (
                                categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td><strong>{cat.name}</strong></td>
                                        <td>{cat.description || '-'}</td>
                                        <td>
                                            <span className={`admin-badge ${cat.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                                                {cat.status}
                                            </span>
                                        </td>
                                        <td>{cat.questionCount}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button onClick={() => openEditModal(cat)} className="admin-action-btn">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => confirmDelete(cat)} className="admin-action-btn danger">
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
            </main>

            {/* Edit/Create Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={closeModal} className="admin-modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <label>Category Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" onClick={closeModal} className="admin-btn admin-btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    <Check size={18} />
                                    {editingCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && categoryToDelete && (
                <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="admin-modal-header">
                            <h2 style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertTriangle size={24} />
                                Delete Category?
                            </h2>
                            <button onClick={() => setShowDeleteModal(false)} className="admin-modal-close">
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '20px', color: '#4b5563' }}>
                            <p>Are you sure you want to delete <strong>{categoryToDelete.name}</strong>?</p>

                            {categoryToDelete.questionCount > 0 && (
                                <div style={{
                                    marginTop: '15px',
                                    padding: '12px',
                                    background: '#fee2e2',
                                    borderRadius: '8px',
                                    color: '#991b1b',
                                    fontSize: '0.9rem'
                                }}>
                                    <strong>Warning:</strong> This category contains {categoryToDelete.questionCount} questions.
                                    Deleting it will <strong>permanently delete all associated questions</strong>.
                                </div>
                            )}
                        </div>

                        <div className="admin-modal-footer">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="admin-btn admin-btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="admin-btn"
                                style={{ background: '#dc2626', color: 'white', border: 'none' }}
                            >
                                <Trash2 size={18} />
                                Delete Forever
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
