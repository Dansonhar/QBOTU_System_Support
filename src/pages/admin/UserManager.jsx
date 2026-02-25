import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import {
    Plus, Edit, Trash2, Shield, User, Eye, EyeOff, X
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const UserManager = () => {
    const { logout, getAuthHeaders } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'staff',
        status: 'active'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/users`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username) {
            setError('Username is required');
            return;
        }

        if (!editingUser && !formData.password) {
            setError('Password is required for new users');
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            const url = editingUser
                ? `${API_BASE_URL}/users/${editingUser.id}`
                : `${API_BASE_URL}/users`;

            const body = { ...formData };
            if (editingUser && !formData.password) {
                delete body.password; // Don't send empty password on edit
            }

            const res = await fetch(url, {
                method: editingUser ? 'PUT' : 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchUsers();
                closeModal();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save user');
            }
        } catch (error) {
            setError('Failed to save user');
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (id, username) => {
        if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

        try {
            const res = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const openModal = (user = null) => {
        setEditingUser(user);
        setFormData(user ? {
            username: user.username,
            password: '', // Don't prefill password
            role: user.role || 'staff',
            status: user.status || 'active'
        } : {
            username: '',
            password: '',
            role: 'staff',
            status: 'active'
        });
        setShowPassword(false);
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            username: '',
            password: '',
            role: 'staff',
            status: 'active'
        });
        setError('');
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">
                <div className="admin-header">
                    <h1>User Management</h1>
                    <div className="admin-header-actions">
                        <button onClick={() => openModal()} className="admin-btn admin-btn-primary">
                            <Plus size={18} />
                            Add User
                        </button>
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="admin-loading">Loading...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="5" className="admin-empty">No users found</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {user.role === 'admin' ? (
                                                    <Shield size={16} style={{ color: '#F7941D' }} />
                                                ) : (
                                                    <User size={16} style={{ color: '#666' }} />
                                                )}
                                                <strong>{user.username}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button
                                                    onClick={() => openModal(user)}
                                                    className="admin-action-btn"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.username)}
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
            </main>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                            <button onClick={closeModal} className="admin-modal-close">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="admin-error-message">
                                    {error}
                                </div>
                            )}

                            <div className="admin-form-group">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>
                                    Password {editingUser ? '(leave blank to keep current)' : '*'}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={editingUser ? 'Enter new password' : 'Enter password'}
                                        style={{ paddingRight: '40px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#666'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Role *</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="admin-form-group">
                                    <label>Status *</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" onClick={closeModal} className="admin-btn admin-btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {editingUser ? 'Update' : 'Create'} User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;
