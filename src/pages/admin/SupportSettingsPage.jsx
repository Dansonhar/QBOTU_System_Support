import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Settings, Save, Eye, EyeOff, MessageCircle, Plus, Trash2, Image
} from 'lucide-react';
import { API_BASE_URL, IMAGE_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { StorehubIcon } from '../../components/common/FloatingSupportWidget';
import AdminSidebar from '../../components/admin/AdminSidebar';



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
    const [homeSlides, setHomeSlides] = useState([]);
    const [slideUploading, setSlideUploading] = useState(false);
    const slideInputRef = useRef(null);

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
                try { setHomeSlides(JSON.parse(data.home_slides || '[]')); } catch(_) {}
            }
        } catch (error) {
            console.error('Error fetching support settings:', error);
        }
    };

    const handleSlideImageUpload = async (file) => {
        if (!file) return;
        setSlideUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setHomeSlides(prev => [...prev, { src: data.url, caption: '' }]);
            }
        } catch (e) {
            alert('Upload failed');
        } finally {
            setSlideUploading(false);
        }
    };

    const removeSlide = (i) => setHomeSlides(prev => prev.filter((_, idx) => idx !== i));
    const updateCaption = (i, val) => setHomeSlides(prev => prev.map((s, idx) => idx === i ? { ...s, caption: val } : s));

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/support-settings`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ ...settings, home_slides: homeSlides })
            });
            if (res.ok) {
                // Re-fetch to confirm what was saved
                await fetchSettings();
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                const err = await res.json().catch(() => ({}));
                alert('Failed to save: ' + (err.error || res.status));
            }
        } catch (error) {
            alert('Failed to save settings. Is the server running?');
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
            <AdminSidebar />

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

                        {/* Home Slides */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3><Image size={18} style={{ marginRight: 6 }} />Home Tab Images</h3>
                                <button className="admin-btn admin-btn-secondary" onClick={() => slideInputRef.current?.click()} disabled={slideUploading}>
                                    <Plus size={16} /> {slideUploading ? 'Uploading...' : 'Add Image'}
                                </button>
                                <input ref={slideInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) { handleSlideImageUpload(e.target.files[0]); e.target.value = ''; } }} />
                            </div>
                            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: 12 }}>Images shown in the widget's Home tab slideshow.</p>
                            {homeSlides.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '24px', color: '#999', border: '2px dashed #ddd', borderRadius: 8 }}>
                                    No images yet. Click "Add Image" to upload.
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {homeSlides.map((slide, i) => (
                                    <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                                        <img src={`${IMAGE_BASE_URL}${slide.src}`} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                                        <button onClick={() => removeSlide(i)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <Trash2 size={13} color="#fff" />
                                        </button>
                                        <div style={{ padding: '6px 8px' }}>
                                            <input type="text" value={slide.caption} onChange={e => updateCaption(i, e.target.value)} placeholder="Caption (optional)" style={{ width: '100%', fontSize: '0.8rem', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 6px' }} />
                                        </div>
                                    </div>
                                ))}
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
