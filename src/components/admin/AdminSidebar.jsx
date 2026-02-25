import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FolderOpen, HelpCircle, Users, LogOut,
    BarChart3, MessageCircle, Settings, FileText, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useTicketNotifications from '../../hooks/useTicketNotifications';

export default function AdminSidebar() {
    const { token, logout } = useAuth();
    const location = useLocation();
    const { pendingCount, newTicketAlert, dismissAlert } = useTicketNotifications(token);

    const navItems = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', match: (p) => p === '/admin/dashboard' },
        { to: '/admin/categories', icon: FolderOpen, label: 'Categories', match: (p) => p === '/admin/categories' },
        { to: '/admin/questions', icon: HelpCircle, label: 'Questions', match: (p) => p.startsWith('/admin/questions') },
        { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', match: (p) => p === '/admin/analytics' },
        { to: '/admin/users', icon: Users, label: 'Users', match: (p) => p === '/admin/users' },
        { to: '/admin/tickets', icon: MessageCircle, label: 'Tickets', match: (p) => p.startsWith('/admin/tickets'), badge: pendingCount },
        { to: '/admin/support-settings', icon: Settings, label: 'Support Widget', match: (p) => p === '/admin/support-settings' },
    ];

    return (
        <>
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>SUPERPOS</h2>
                    <span>Admin Panel</span>
                </div>
                <nav className="admin-nav">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = item.match(location.pathname);
                        return (
                            <Link key={item.to} to={item.to} className={`admin-nav-item ${isActive ? 'active' : ''}`}>
                                <Icon size={20} />
                                <span>{item.label}</span>
                                {item.badge > 0 && (
                                    <span style={{
                                        marginLeft: 'auto',
                                        background: '#ef5350',
                                        color: '#fff',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        borderRadius: '10px',
                                        padding: '2px 8px',
                                        minWidth: '20px',
                                        textAlign: 'center',
                                        animation: 'pulse-badge 2s infinite'
                                    }}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
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

            {/* Floating notification toast */}
            {newTicketAlert && (
                <div
                    onClick={dismissAlert}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 9999,
                        background: '#fff',
                        border: '1px solid #e0e0e0',
                        borderLeft: '4px solid #F7941D',
                        borderRadius: '10px',
                        padding: '14px 20px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        animation: 'slideInRight 0.4s ease-out',
                        maxWidth: '380px'
                    }}
                >
                    <div style={{
                        background: '#FFF3E0', borderRadius: '50%', width: 40, height: 40,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <Bell size={20} color="#F7941D" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#333' }}>🔔 New Ticket!</div>
                        <div style={{ fontSize: '13px', color: '#666', marginTop: 2 }}>{newTicketAlert.message}</div>
                    </div>
                    <span style={{ fontSize: '18px', color: '#ccc', marginLeft: 'auto', cursor: 'pointer' }}>&times;</span>
                </div>
            )}

            <style>{`
                @keyframes pulse-badge {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
                @keyframes slideInRight {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </>
    );
}
