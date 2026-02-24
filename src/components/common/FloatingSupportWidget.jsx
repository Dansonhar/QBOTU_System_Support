import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle, ArrowLeft, User, Bot, Headphones } from 'lucide-react';
import { API_BASE_URL, DATA_MODE } from '../../config';

export const StorehubIcon = ({ size = 28, color = 'white', bgColor = '#F7941D' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M5 6C5 4.34315 6.34315 3 8 3H16C17.6569 3 19 4.34315 19 6V14C19 15.6569 17.6569 17 16 17H15.0001L15.0006 20.2195C15.0008 20.8927 14.1825 21.2227 13.7226 20.735L10.1911 17H8C6.34315 17 5 15.6569 5 14V6Z"
            fill={color} />
        <path d="M8 10C9.5 12.5 14.5 12.5 16 10" stroke={bgColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function FloatingSupportWidget() {
    const [settings, setSettings] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('Messages');
    const [searchQuery, setSearchQuery] = useState('');

    // Chat state
    const [chatSession, setChatSession] = useState(null); // { ticket_number, email, name }
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatView, setChatView] = useState('welcome'); // 'welcome' | 'chat' | 'startForm'
    const [sending, setSending] = useState(false);
    const [startForm, setStartForm] = useState({ name: '', email: '', topic: 'General Inquiry' });
    const chatEndRef = useRef(null);
    const pollRef = useRef(null);
    const lastMsgCountRef = useRef(0);

    // Load settings & categories
    useEffect(() => {
        const settingsUrl = DATA_MODE === 'static' ? `${API_BASE_URL}/support-settings.json` : `${API_BASE_URL}/support-settings`;
        fetch(settingsUrl)
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(d => { if (!d || d.error) throw new Error(); setSettings(d); setLoaded(true); })
            .catch(() => { setSettings(null); setLoaded(true); });

        const catUrl = DATA_MODE === 'static' ? `${API_BASE_URL}/categories.json` : `${API_BASE_URL}/categories?status=active`;
        fetch(catUrl)
            .then(r => r.json()).then(d => setCategories(d || [])).catch(() => { });

        // Restore chat session from localStorage
        const saved = localStorage.getItem('superpos_chat_session');
        if (saved) {
            try {
                const session = JSON.parse(saved);
                setChatSession(session);
                setChatView('chat');
                // Load existing messages
                loadMessages(session.ticket_number, session.email);
            } catch (e) { localStorage.removeItem('superpos_chat_session'); }
        }
    }, []);

    // Polling for new messages
    useEffect(() => {
        if (chatSession && chatView === 'chat' && isOpen) {
            pollRef.current = setInterval(() => {
                loadMessages(chatSession.ticket_number, chatSession.email, true);
            }, 4000);
            return () => clearInterval(pollRef.current);
        }
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [chatSession, chatView, isOpen]);

    // Auto-scroll
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const loadMessages = async (ticketNum, email, silent = false) => {
        try {
            const r = await fetch(`${API_BASE_URL}/tickets/messages?ticket_number=${encodeURIComponent(ticketNum)}&email=${encodeURIComponent(email)}`);
            if (!r.ok) return;
            const data = await r.json();
            // Only update if new messages arrived (avoid flicker)
            if (data.replies && data.replies.length !== lastMsgCountRef.current) {
                lastMsgCountRef.current = data.replies.length;
                setMessages(data.replies);
            }
        } catch (e) { /* silently fail on poll */ }
    };

    const startChat = async (e) => {
        e.preventDefault();
        if (!startForm.name || !startForm.email) return;
        setSending(true);

        try {
            const r = await fetch(`${API_BASE_URL}/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: startForm.name,
                    email: startForm.email,
                    topic: startForm.topic,
                    message: `New chat started — Topic: ${startForm.topic}`
                })
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error);

            const session = { ticket_number: data.ticket_number, email: startForm.email, name: startForm.name };
            setChatSession(session);
            localStorage.setItem('superpos_chat_session', JSON.stringify(session));
            setMessages(data.replies || []);
            lastMsgCountRef.current = (data.replies || []).length;
            setChatView('chat');
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !chatSession) return;
        const msg = chatInput.trim();
        setChatInput('');
        setSending(true);

        // Optimistic update
        setMessages(prev => [...prev, {
            id: Date.now(),
            sender_type: 'user',
            message: msg,
            created_at: new Date().toISOString()
        }]);

        try {
            const r = await fetch(`${API_BASE_URL}/tickets/user-reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticket_number: chatSession.ticket_number,
                    email: chatSession.email,
                    message: msg
                })
            });
            const data = await r.json();
            if (r.ok && data.replies) {
                setMessages(data.replies);
                lastMsgCountRef.current = data.replies.length;
            }
        } catch (err) { console.error(err); }
        finally { setSending(false); }
    };

    const endChat = () => {
        setChatSession(null);
        setMessages([]);
        setChatView('welcome');
        lastMsgCountRef.current = 0;
        localStorage.removeItem('superpos_chat_session');
    };

    if (!loaded) return null;

    const activeSettings = settings || { greeting_text: 'How can we help?', button_color: '#F7941D', is_enabled: 1 };
    if (activeSettings.is_enabled === 0 || activeSettings.is_enabled === false) return null;

    const accent = activeSettings.button_color || '#F7941D';

    // ────── WELCOME VIEW ──────
    const renderWelcome = () => (
        <div className="chat-welcome">
            <div className="chat-welcome-hero" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
                <div className="chat-welcome-icon">
                    <StorehubIcon size={40} color="white" bgColor={accent} />
                </div>
                <h3>Hi there! 👋</h3>
                <p>{activeSettings.greeting_text || 'How can we help you today?'}</p>
            </div>
            <div className="chat-welcome-actions">
                <button className="chat-welcome-btn chat-welcome-btn-primary" style={{ background: accent }}
                    onClick={() => setChatView('startForm')}>
                    <Send size={18} /> Start a Conversation
                </button>

                {activeSettings.whatsapp_number && (
                    <a href={`https://wa.me/${activeSettings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                        target="_blank" rel="noopener noreferrer" className="chat-welcome-btn chat-welcome-btn-secondary">
                        💬 Chat on WhatsApp
                    </a>
                )}
                {activeSettings.email && (
                    <a href={`mailto:${activeSettings.email}`} className="chat-welcome-btn chat-welcome-btn-secondary">
                        📧 Send Email
                    </a>
                )}
            </div>
            <div className="chat-welcome-footer">
                <span>Powered by <strong>SUPERPOS</strong> AI Support</span>
            </div>
        </div>
    );

    // ────── START FORM ──────
    const renderStartForm = () => (
        <div className="chat-start-form">
            <button className="chat-back-btn" onClick={() => setChatView('welcome')}>
                <ArrowLeft size={16} /> Back
            </button>
            <h4>Start a conversation</h4>
            <p>Please fill in your details to begin chatting with our support team.</p>
            <form onSubmit={startChat}>
                <input type="text" placeholder="Your name *" required value={startForm.name}
                    onChange={(e) => setStartForm({ ...startForm, name: e.target.value })} />
                <input type="email" placeholder="Your email *" required value={startForm.email}
                    onChange={(e) => setStartForm({ ...startForm, email: e.target.value })} />
                <select value={startForm.topic} onChange={(e) => setStartForm({ ...startForm, topic: e.target.value })}>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing">Billing</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Other">Other</option>
                </select>
                <button type="submit" className="chat-submit-btn" style={{ background: accent }} disabled={sending}>
                    {sending ? 'Starting...' : 'Start Chat'} <Send size={16} />
                </button>
            </form>
        </div>
    );

    // ────── LIVE CHAT VIEW ──────
    const renderChat = () => (
        <div className="chat-live">
            {/* Chat header with session info */}
            <div className="chat-live-header">
                <div className="chat-live-header-info">
                    <div className="chat-live-avatar" style={{ background: accent }}>
                        <Headphones size={16} color="white" />
                    </div>
                    <div>
                        <strong>SUPERPOS Support</strong>
                        <span className="chat-live-status">
                            <span className="chat-live-status-dot"></span> Online
                        </span>
                    </div>
                </div>
                <div className="chat-live-header-actions">
                    <span className="chat-ticket-badge">{chatSession?.ticket_number}</span>
                    <button className="chat-end-btn" onClick={endChat} title="End conversation">✕</button>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-live-messages">
                {messages.map((msg, i) => (
                    <div key={msg.id || i} className={`chat-bubble ${msg.sender_type === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'} ${msg.sender_type === 'bot' ? 'chat-bubble-bot' : ''}`}>
                        {msg.sender_type !== 'user' && (
                            <div className="chat-bubble-avatar">
                                {msg.sender_type === 'bot' ? (
                                    <div className="chat-avatar-icon chat-avatar-bot"><Bot size={14} /></div>
                                ) : (
                                    <div className="chat-avatar-icon chat-avatar-admin" style={{ background: accent }}><Headphones size={14} /></div>
                                )}
                            </div>
                        )}
                        <div className="chat-bubble-content">
                            <div className="chat-bubble-sender">
                                {msg.sender_type === 'user' ? 'You' : msg.sender_type === 'bot' ? 'AI Assistant' : 'Support Agent'}
                            </div>
                            <div className="chat-bubble-text">{msg.message}</div>
                            <div className="chat-bubble-time">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Message input */}
            <form className="chat-live-input" onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={sending}
                    autoFocus
                />
                <button type="submit" disabled={!chatInput.trim() || sending} style={{ background: accent }}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );

    // ────── MESSAGES TAB ──────
    const renderMessagesTab = () => {
        if (chatView === 'chat') return renderChat();
        if (chatView === 'startForm') return renderStartForm();
        return renderWelcome();
    };

    // ────── HELP TAB ──────
    const renderHelpTab = () => {
        const filtered = categories.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        return (
            <div className="support-view-help">
                <div className="support-view-help-search">
                    <div className="search-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Search for help" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <div className="support-view-help-content">
                    <div className="support-collections-header">{filtered.length} {filtered.length === 1 ? 'collection' : 'collections'}</div>
                    {filtered.map(cat => (
                        <a key={cat.id} href={`/QBOTU_System_Support_Web/category/${cat.id}`} className="support-collection-item">
                            <div className="support-collection-info">
                                <h4>{cat.name}</h4>
                                {cat.description && <p>{cat.description}</p>}
                                <span>{cat.questionCount || 0} articles</span>
                            </div>
                            <div className="support-collection-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                        </a>
                    ))}
                    {filtered.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#999' }}>No categories found.</div>}
                </div>
            </div>
        );
    };

    // ────── MAIN RENDER ──────
    return (
        <div style={{ position: 'fixed', bottom: 84, right: 24, zIndex: 9999 }}>
            {isOpen && (
                <div className="floating-support-popup">
                    <div className="floating-support-popup-header" style={{ background: activeTab === 'Messages' && chatView === 'chat' ? 'transparent' : undefined, padding: activeTab === 'Messages' && chatView === 'chat' ? 0 : undefined, display: activeTab === 'Messages' && chatView === 'chat' ? 'none' : undefined }}>
                        <div className="floating-support-popup-title" style={{ justifyContent: 'center', width: '100%', marginLeft: 30 }}>
                            {activeTab}
                        </div>
                        <button className="floating-support-close" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="floating-support-popup-body" style={{ padding: activeTab === 'Messages' ? 0 : undefined }}>
                        {activeTab === 'Messages' && renderMessagesTab()}
                        {activeTab === 'Help' && renderHelpTab()}
                        {['Home', 'News'].includes(activeTab) && (
                            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>{activeTab} coming soon.</div>
                        )}
                    </div>

                    {!(activeTab === 'Messages' && chatView === 'chat') && (
                        <div className="floating-support-popup-footer">
                            {['Home', 'News', 'Messages', 'Help'].map(tab => (
                                <button key={tab}
                                    className={`floating-support-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                    style={{ color: activeTab === tab ? accent : undefined }}
                                >
                                    {tab === 'Home' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
                                    {tab === 'News' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>}
                                    {tab === 'Messages' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
                                    {tab === 'Help' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
                                    {tab}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <button
                className={`floating-support-btn ${isOpen ? 'floating-support-btn--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{ background: accent, position: 'absolute', bottom: 0, right: 0 }}
                aria-label="Support"
            >
                {isOpen ? <X size={24} color="white" /> : <StorehubIcon size={32} color="white" bgColor={accent} />}
            </button>
        </div>
    );
}
