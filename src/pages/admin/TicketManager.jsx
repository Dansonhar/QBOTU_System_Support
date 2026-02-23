import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, FolderOpen, HelpCircle, Users, LogOut,
    BarChart3, MessageCircle, MoreHorizontal, Search, Settings
} from 'lucide-react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function TicketManager() {
    const [tickets, setTickets] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { logout, token, getAuthHeaders } = useAuth();
    const navigate = useNavigate();

    const fetchTickets = async (page = 1) => {
        try {
            setLoading(true);
            let url = `${API_BASE_URL}/tickets?page=${page}&limit=10`;
            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to fetch tickets');

            const data = await response.json();
            setTickets(data.tickets);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets(1);
    }, [search, statusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTickets(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchTickets(newPage);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return { background: '#f5f5f5', color: '#666', border: '1px solid #ddd' };
            case 'Open': return { background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' };
            case 'In Progress': return { background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' };
            case 'Waiting for Customer': return { background: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff' };
            case 'Solved': return { background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' };
            case 'Closed': return { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };
            default: return { background: '#fff', color: '#333' };
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin" className="admin-nav-item">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/categories" className="admin-nav-item">
                        <FolderOpen size={20} /> Categories
                    </Link>
                    <Link to="/admin/questions" className="admin-nav-item">
                        <HelpCircle size={20} /> Questions
                    </Link>
                    <Link to="/admin/analytics" className="admin-nav-item">
                        <BarChart3 size={20} /> Analytics
                    </Link>
                    <Link to="/admin/users" className="admin-nav-item">
                        <Users size={20} /> Users
                    </Link>
                    <Link to="/admin/tickets" className="admin-nav-item active">
                        <MessageCircle size={20} /> Tickets
                    </Link>
                    <Link to="/admin/support-settings" className="admin-nav-item">
                        <Settings size={20} /> Support Widget
                    </Link>
                    <button onClick={logout} className="admin-nav-item admin-nav-logout">
                        <LogOut size={20} /> Logout
                    </button>
                </nav>
            </aside>

            <main className="admin-main">
                <div className="admin-main-header">
                    <h1>Manage Tickets</h1>
                </div>

                <div className="admin-card">
                    <div className="admin-filters" style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Search by ID, Name or Email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #ddd' }}
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #ddd' }}
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Waiting for Customer">Waiting for Customer</option>
                            <option value="Solved">Solved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Ticket ID</th>
                                    <th>Name</th>
                                    <th>Topic</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading tickets...</td>
                                    </tr>
                                ) : tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No tickets found</td>
                                    </tr>
                                ) : (
                                    tickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td style={{ fontWeight: 600 }}>{ticket.ticket_number}</td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{ticket.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{ticket.email}</div>
                                            </td>
                                            <td>{ticket.topic}</td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: 12,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    ...getStatusStyle(ticket.status)
                                                }}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: 12,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: ticket.priority === 'Urgent' ? '#fee2e2' : ticket.priority === 'High' ? '#ffedd5' : '#f1f5f9',
                                                    color: ticket.priority === 'Urgent' ? '#991b1b' : ticket.priority === 'High' ? '#9a3412' : '#475569'
                                                }}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                                <br />
                                                <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                                                    className="admin-btn-secondary"
                                                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!loading && pagination.totalPages > 1 && (
                        <div className="admin-pagination">
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
