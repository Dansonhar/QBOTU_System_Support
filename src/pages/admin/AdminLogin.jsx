import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-header">
                    <div className="admin-login-icon">
                        <Lock size={32} />
                    </div>
                    <h1>Admin Login</h1>
                    <p>Sign in to manage FAQ content</p>
                </div>

                {error && (
                    <div className="admin-alert admin-alert-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-form-group">
                        <label>Username</label>
                        <div className="admin-input-wrapper">
                            <User size={18} className="admin-input-icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label>Password</label>
                        <div className="admin-input-wrapper">
                            <Lock size={18} className="admin-input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>Default credentials: <strong>admin</strong> / <strong>admin123</strong></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
