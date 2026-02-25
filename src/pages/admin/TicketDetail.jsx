import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Send, AlertCircle
} from 'lucide-react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, getAuthHeaders, logout } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [replyMessage, setReplyMessage] = useState('');
    const [isInternal, setIsInternal] = useState(false);

    // Admins to assign
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        fetchTicket();
        fetchAdmins();
        // Auto-refresh every 5 seconds for real-time chat
        const interval = setInterval(() => { fetchTicket(true); }, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchTicket = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch ticket');
            const data = await response.json();
            setTicket({
                ...data,
                replies: undefined
            });
            setReplies(data.replies || []);
        } catch (error) {
            console.error(error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchAdmins = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: getAuthHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setAdmins(data);
            }
        } catch (error) {
            console.error("Failed to fetch admins");
        }
    };

    const handleUpdate = async (field, value) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ [field]: value })
            });
            if (response.ok) {
                const updated = await response.json();
                setTicket(updated);
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/tickets/${id}/replies`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ message: replyMessage, is_internal: isInternal })
            });

            if (response.ok) {
                const data = await response.json();
                setTicket({
                    ...data,
                    replies: undefined
                });
                setReplies(data.replies || []);
                setReplyMessage('');
                setIsInternal(false);
            }
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading ticket...</div>;
    }

    if (!ticket) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Ticket not found</div>;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">
                <div className="admin-main-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button onClick={() => navigate('/admin/tickets')} className="admin-btn-secondary" style={{ padding: 8 }}>
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                                {ticket.ticket_number}
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: 12,
                                    fontSize: '0.8rem',
                                    background: ticket.priority === 'Urgent' ? '#fee2e2' : '#f1f5f9',
                                    color: ticket.priority === 'Urgent' ? '#991b1b' : '#333'
                                }}>
                                    {ticket.priority} Priority
                                </span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="admin-editor-layout">
                    {/* Left content area for conversation thread */}
                    <div className="admin-editor-main" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="admin-card">
                            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 16, marginBottom: 16, marginTop: 0 }}>
                                {ticket.topic}: {ticket.name}
                            </h3>
                            <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
                                <strong>Original Message:</strong>
                                <br /><br />
                                {ticket.message}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 12 }}>
                                Created: {new Date(ticket.created_at).toLocaleString()} via {ticket.source}
                            </div>
                        </div>

                        {replies.length > 0 && (
                            <div className="admin-card" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
                                <h3>Conversation</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                                    {replies.map(r => (
                                        <div key={r.id} style={{
                                            background: r.is_internal ? '#fffbe6' : 'white',
                                            border: r.is_internal ? '1px solid #ffe58f' : '1px solid #ebebeb',
                                            padding: 16,
                                            borderRadius: 8,
                                            marginLeft: r.sender_type === 'admin' ? 32 : 0,
                                            marginRight: r.sender_type === 'user' ? 32 : 0,
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: r.is_internal ? '#faad14' : '#666', fontSize: '0.85rem' }}>
                                                <strong>
                                                    {r.sender_type === 'admin' ? 'Support Agent' : ticket.name}
                                                    {r.is_internal && ' (Internal Note)'}
                                                </strong>
                                                <span>{new Date(r.created_at).toLocaleString()}</span>
                                            </div>
                                            <div style={{ whiteSpace: 'pre-wrap' }}>{r.message}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="admin-card">
                            <h3>Add Reply</h3>
                            <form onSubmit={handleReply}>
                                <div className="admin-form-group">
                                    <textarea
                                        rows="5"
                                        placeholder="Type your response here..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ddd' }}
                                    ></textarea>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={isInternal}
                                            onChange={(e) => setIsInternal(e.target.checked)}
                                        />
                                        <span style={{ color: '#666', fontSize: '0.9rem' }}>Internal Note (User won't see this)</span>
                                    </label>
                                    <button
                                        type="submit"
                                        className="admin-btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: isInternal ? '#faad14' : undefined }}
                                    >
                                        <Send size={16} />
                                        {isInternal ? 'Add Note' : 'Send Reply'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right sidebar for properties */}
                    <div className="admin-editor-sidebar">
                        <div className="admin-card">
                            <h3>Ticket Properties</h3>
                            <div className="admin-form-group">
                                <label>Status</label>
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleUpdate('status', e.target.value)}
                                    style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Waiting for Customer">Waiting for Customer</option>
                                    <option value="Solved">Solved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label>Priority</label>
                                <select
                                    value={ticket.priority}
                                    onChange={(e) => handleUpdate('priority', e.target.value)}
                                    style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label>Assign To</label>
                                <select
                                    value={ticket.assigned_to || ''}
                                    onChange={(e) => handleUpdate('assigned_to', e.target.value ? parseInt(e.target.value) : null)}
                                    style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
                                >
                                    <option value="">Unassigned</option>
                                    {admins.map(admin => (
                                        <option key={admin.id} value={admin.id}>{admin.username}</option>
                                    ))}
                                </select>
                            </div>

                            <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid #eee' }} />

                            <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div><strong>Customer:</strong> {ticket.name}</div>
                                <div><strong>Email:</strong> {ticket.email}</div>
                                <div><strong>Last Updated:</strong> {new Date(ticket.updated_at).toLocaleString()}</div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
