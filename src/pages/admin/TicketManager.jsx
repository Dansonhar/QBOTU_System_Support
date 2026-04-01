import React, { useState, useEffect } from 'react';
import {
    MessageCircle, Trash2,
    Clock, CheckCircle, AlertCircle, Loader, Eye, ChevronDown
} from 'lucide-react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const STATUSES = ['Pending', 'Open', 'In Progress', 'Waiting for Customer', 'Solved', 'Closed'];

const STATUS_CONFIG = {
    'Pending': { bg: '#f0f0f0', color: '#555', border: '#ddd', icon: Clock },
    'Open': { bg: '#e8e8e8', color: '#222', border: '#ccc', icon: AlertCircle },
    'In Progress': { bg: '#ddd', color: '#111', border: '#bbb', icon: Loader },
    'Waiting for Customer': { bg: '#ebebeb', color: '#444', border: '#ccc', icon: Clock },
    'Solved': { bg: '#222', color: '#fff', border: '#333', icon: CheckCircle },
    'Closed': { bg: '#f5f5f5', color: '#888', border: '#e0e0e0', icon: CheckCircle },
};

const PRIORITY_CONFIG = {
    'Low': { bg: '#f5f5f5', color: '#777' },
    'Normal': { bg: '#ebebeb', color: '#444' },
    'High': { bg: '#d0d0d0', color: '#111' },
    'Urgent': { bg: '#111', color: '#fff' },
};

export default function TicketManager() {
    const [tickets, setTickets] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null); // ticket ID of open status dropdown
    const [tabCounts, setTabCounts] = useState({ total: 0, unread: 0, byStatus: {} });
    const { logout, token, getAuthHeaders } = useAuth();
    const navigate = useNavigate();

    const fetchCounts = async (headers) => {
        try {
            const res = await fetch(`${API_BASE_URL}/tickets/stats`, { headers });
            if (res.ok) {
                const data = await res.json();
                setTabCounts({ total: data.total || 0, unread: data.unread || 0, byStatus: data.byStatus || {} });
            }
        } catch (err) { /* silent */ }
    };

    const fetchTickets = async (page = 1) => {
        try {
            setLoading(true);
            const headers = getAuthHeaders();
            let url = `${API_BASE_URL}/tickets?page=${page}&limit=10`;
            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (statusFilter === 'Unread') {
                url += `&unread=1`;
            } else if (statusFilter) {
                url += `&status=${encodeURIComponent(statusFilter)}`;
            }

            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error('Failed to fetch tickets');

            const data = await response.json();
            setTickets(data.tickets);
            setPagination(data.pagination);
            // Always refresh counts alongside tickets using the same auth headers
            fetchCounts(headers);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets(1);
    }, [search, statusFilter]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClick = () => setOpenDropdown(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchTickets(newPage);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
                fetchCounts(headers);
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
        setOpenDropdown(null);
    };

    const handleDelete = async (ticketId, ticketNumber) => {
        if (!window.confirm(`Are you sure you want to permanently delete ticket ${ticketNumber}? This cannot be undone.`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                setTickets(prev => prev.filter(t => t.id !== ticketId));
                setPagination(prev => ({ ...prev, total: prev.total - 1 }));
                fetchCounts(getAuthHeaders());
            }
        } catch (err) {
            console.error('Error deleting ticket:', err);
        }
    };

    // Count tickets by status
    const statusCounts = {};
    STATUSES.forEach(s => { statusCounts[s] = 0; });
    tickets.forEach(t => { if (statusCounts[t.status] !== undefined) statusCounts[t.status]++; });

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString();
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">
                <div className="admin-main-header">
                    <h1>Manage Tickets</h1>
                </div>

                {/* ===== Status Summary Tabs ===== */}
                <div style={{
                    display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => setStatusFilter('')}
                        style={{
                            padding: '8px 18px', borderRadius: '20px', cursor: 'pointer',
                            border: statusFilter === '' ? '2px solid #000' : '1px solid #ddd',
                            background: statusFilter === '' ? '#000' : '#fff',
                            color: statusFilter === '' ? '#fff' : '#666',
                            fontWeight: statusFilter === '' ? '700' : '400',
                            fontSize: '13px', transition: 'all .2s',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        All
                        <span style={{
                            background: statusFilter === '' ? '#fff' : '#ddd',
                            color: statusFilter === '' ? '#000' : '#555',
                            borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 700
                        }}>{tabCounts.total}</span>
                    </button>
                    <button
                        onClick={() => setStatusFilter('Unread')}
                        style={{
                            padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                            border: statusFilter === 'Unread' ? `2px solid #000` : `1px solid #ddd`,
                            background: statusFilter === 'Unread' ? '#000' : '#fff',
                            color: statusFilter === 'Unread' ? '#fff' : '#555',
                            fontWeight: statusFilter === 'Unread' ? '700' : '500',
                            fontSize: '13px', transition: 'all .2s',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        Unread NEW
                        {tabCounts.unread > 0 && (
                            <span style={{
                                background: statusFilter === 'Unread' ? '#fff' : '#111', color: statusFilter === 'Unread' ? '#000' : '#fff',
                                borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 700
                            }}>{tabCounts.unread}</span>
                        )}
                    </button>
                    {STATUSES.map(s => {
                        const cfg = STATUS_CONFIG[s];
                        const isActive = statusFilter === s;
                        const count = tabCounts.byStatus[s] || 0;
                        return (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(isActive ? '' : s)}
                                style={{
                                    padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                                    border: isActive ? `2px solid ${cfg.color}` : `1px solid ${cfg.border}`,
                                    background: isActive ? cfg.bg : '#fff',
                                    color: isActive ? cfg.color : '#888',
                                    fontWeight: isActive ? '700' : '400',
                                    fontSize: '13px', transition: 'all .2s',
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}
                            >
                                {s}
                                <span style={{
                                    background: isActive ? cfg.color : '#e5e7eb',
                                    color: isActive ? '#fff' : '#555',
                                    borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 700
                                }}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="admin-card">
                    {/* Search */}
                    <div style={{ marginBottom: 20 }}>
                        <input
                            type="text"
                            placeholder="🔍 Search by Ticket ID, Name, or Email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '8px',
                                border: '1px solid #ddd', fontSize: '14px'
                            }}
                        />
                    </div>

                    {/* Ticket Cards */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>Loading tickets...</div>
                    ) : tickets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                            <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                            <p>No tickets found</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {tickets.map((ticket) => {
                                const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG['Pending'];
                                const priorityCfg = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG['Normal'];
                                const StatusIcon = statusCfg.icon;

                                return (
                                    <div
                                        key={ticket.id}
                                        style={{
                                            background: '#fff', border: '1px solid #eee', borderRadius: '10px',
                                            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
                                            transition: 'box-shadow .2s, border-color .2s',
                                            borderLeft: `4px solid ${statusCfg.color}`,
                                            cursor: 'default'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        {/* Ticket info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 700, fontSize: '14px', color: '#333' }}>{ticket.ticket_number}</span>
                                                {ticket.is_unread === 1 && (
                                                    <span style={{
                                                        padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800,
                                                        background: '#111', color: '#fff', letterSpacing: '0.5px'
                                                    }}>
                                                        NEW
                                                    </span>
                                                )}
                                                <span style={{
                                                    padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                                                    background: priorityCfg.bg, color: priorityCfg.color
                                                }}>
                                                    {ticket.priority}
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#999' }}>{formatDate(ticket.created_at)}</span>
                                            </div>
                                            <div style={{ fontSize: '14px', fontWeight: ticket.is_unread === 1 ? 700 : 500, color: '#333', marginBottom: 4 }}>
                                                {ticket.topic}
                                            </div>
                                            <div style={{ fontSize: '13px', color: ticket.is_unread === 1 ? '#555' : '#888' }}>
                                                {ticket.name} · <span style={{ color: '#aaa' }}>{ticket.email}</span>
                                            </div>
                                        </div>

                                        {/* Status dropdown button */}
                                        <div style={{ position: 'relative' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdown(openDropdown === ticket.id ? null : ticket.id);
                                                }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                                                    background: statusCfg.bg, color: statusCfg.color,
                                                    border: `1px solid ${statusCfg.border}`,
                                                    fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
                                                    transition: 'all .15s'
                                                }}
                                            >
                                                <StatusIcon size={13} />
                                                {ticket.status}
                                                <ChevronDown size={12} />
                                            </button>

                                            {/* Dropdown */}
                                            {openDropdown === ticket.id && (
                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        position: 'absolute', right: 0, top: '110%', zIndex: 100,
                                                        background: '#fff', borderRadius: '10px',
                                                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                                        border: '1px solid #eee', minWidth: '200px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0', fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>
                                                        Change Status
                                                    </div>
                                                    {STATUSES.map(s => {
                                                        const cfg = STATUS_CONFIG[s];
                                                        const Icon = cfg.icon;
                                                        const isCurrentStatus = ticket.status === s;
                                                        return (
                                                            <button
                                                                key={s}
                                                                onClick={() => handleStatusChange(ticket.id, s)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                                    width: '100%', padding: '10px 14px', border: 'none',
                                                                    background: isCurrentStatus ? cfg.bg : 'transparent',
                                                                    color: isCurrentStatus ? cfg.color : '#333',
                                                                    fontWeight: isCurrentStatus ? 700 : 400,
                                                                    cursor: 'pointer', fontSize: '13px', textAlign: 'left',
                                                                    transition: 'background .15s'
                                                                }}
                                                                onMouseEnter={(e) => { if (!isCurrentStatus) e.target.style.background = '#f8f8f8'; }}
                                                                onMouseLeave={(e) => { if (!isCurrentStatus) e.target.style.background = 'transparent'; }}
                                                            >
                                                                <Icon size={14} color={cfg.color} />
                                                                {s}
                                                                {isCurrentStatus && <span style={{ marginLeft: 'auto', fontSize: '11px' }}>✓</span>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* View button */}
                                        <button
                                            onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '5px',
                                                padding: '8px 14px', borderRadius: '8px',
                                                border: '1px solid #ddd', background: '#fff',
                                                color: '#555', fontSize: '13px', fontWeight: 500,
                                                cursor: 'pointer', transition: 'all .15s'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#ddd'; }}
                                        >
                                            <Eye size={14} /> View
                                        </button>

                                        {/* Delete button */}
                                        <button
                                            onClick={() => handleDelete(ticket.id, ticket.ticket_number)}
                                            title="Delete ticket"
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                width: '34px', height: '34px', borderRadius: '8px',
                                                border: '1px solid #fecaca', background: '#fff',
                                                color: '#ef5350', cursor: 'pointer',
                                                transition: 'all .15s'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#ef5350'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#ef5350'; }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && pagination.totalPages > 1 && (
                        <div className="admin-pagination" style={{ marginTop: '20px' }}>
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="admin-btn-secondary"
                            >
                                Previous
                            </button>
                            <span>
                                Page {pagination.page} of {pagination.totalPages}
                                <span className="admin-pagination-total"> ({pagination.total} tickets)</span>
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="admin-btn-secondary"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
