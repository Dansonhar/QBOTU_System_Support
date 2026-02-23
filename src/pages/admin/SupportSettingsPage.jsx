import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Settings, MessageCircle, Save, Eye, EyeOff,
    LayoutDashboard, FolderOpen, HelpCircle, Users, LogOut, BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorehubIcon } from '../../components/common/FloatingSupportWidget';

const API_BASE_URL = 'http://localhost:3001/api';

export default function SupportSettingsPage() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [settings, setSettings] = useState({
        greeting_text: 'How can we help?',
        button_color: '#F7941D',
        whatsapp_number: '',
        email: '',
        messenger_url: '',
        is_enabled: 1
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/support-settings`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching support settings:', error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/support-settings`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
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
                    <h1><Settings size={28} style={{ marginRight: 8 }} /> Floating Support Widget</h1>
                    <div className="admin-header-actions">
                        <button
                            onClick={handleSave}
                            className="admin-btn admin-btn-primary"
                            disabled={saving}
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="admin-editor-grid">
                    <div className="admin-editor-main">
                        {/* Enable/Disable */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3>Widget Status</h3>
                                <button
                                    onClick={() => setSettings({ ...settings, is_enabled: settings.is_enabled ? 0 : 1 })}
                                    className={`admin-btn ${settings.is_enabled ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                                >
                                    {settings.is_enabled ? <><Eye size={16} /> Enabled</> : <><EyeOff size={16} /> Disabled</>}
                                </button>
                            </div>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                {settings.is_enabled
                                    ? 'The floating support button is visible on your help center.'
                                    : 'The floating support button is hidden from visitors.'}
                            </p>
                        </div>

                        {/* Greeting */}
                        <div className="admin-card">
                            <h3>Greeting Message</h3>
                            <div className="admin-form-group">
                                <label>Greeting Text</label>
                                <input
                                    type="text"
                                    value={settings.greeting_text}
                                    onChange={(e) => setSettings({ ...settings, greeting_text: e.target.value })}
                                    placeholder="How can we help?"
                                />
                            </div>
                        </div>

                        {/* Appearance */}
                        <div className="admin-card">
                            <h3>Appearance</h3>
                            <div className="admin-form-group">
                                <label>Button Color</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <input
                                        type="color"
                                        value={settings.button_color}
                                        onChange={(e) => setSettings({ ...settings, button_color: e.target.value })}
                                        style={{ width: 48, height: 48, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        value={settings.button_color}
                                        onChange={(e) => setSettings({ ...settings, button_color: e.target.value })}
                                        style={{ width: 120 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Channels */}
                        <div className="admin-card">
                            <h3>Contact Channels</h3>
                            <div className="admin-form-group">
                                <label><MessageCircle size={16} /> WhatsApp Number</label>
                                <input
                                    type="text"
                                    value={settings.whatsapp_number}
                                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                    placeholder="e.g. +60123456789"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>📧 Email Address</label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    placeholder="e.g. support@example.com"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>💬 Messenger URL</label>
                                <input
                                    type="text"
                                    value={settings.messenger_url}
                                    onChange={(e) => setSettings({ ...settings, messenger_url: e.target.value })}
                                    placeholder="e.g. https://m.me/yourpage"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div className="admin-editor-sidebar">
                        <div className="admin-card">
                            <h3>Preview</h3>
                            <div className="support-preview-container">
                                <div className="support-preview-widget" style={{ background: settings.button_color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <StorehubIcon size={32} color="white" bgColor={settings.button_color} />
                                </div>
                                <div className="support-preview-popup">
                                    <div className="support-preview-header">
                                        <strong>{settings.greeting_text || 'How can we help?'}</strong>
                                    </div>
                                    <div className="support-preview-channels">
                                        {settings.whatsapp_number && <div className="support-preview-channel">💬 WhatsApp</div>}
                                        {settings.email && <div className="support-preview-channel">📧 Email</div>}
                                        {settings.messenger_url && <div className="support-preview-channel">💬 Messenger</div>}
                                        {!settings.whatsapp_number && !settings.email && !settings.messenger_url && (
                                            <div style={{ color: '#999', fontSize: '0.8rem', padding: 8, textAlign: 'center' }}>Add at least one contact channel</div>
                                        )}
                                    </div>
                                    <div className="support-preview-tabs">
                                        <div className="support-preview-tab">Home</div>
                                        <div className="support-preview-tab">News</div>
                                        <div className="support-preview-tab" style={{ color: settings.button_color || '#F7941D' }}>Messages</div>
                                        <div className="support-preview-tab">Help</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
