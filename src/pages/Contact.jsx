import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Mail, Phone, CheckCircle, Loader } from 'lucide-react';
import { API_BASE_URL, DATA_MODE } from '../config';

const Contact = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        topic: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [ticketNumber, setTicketNumber] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        // Map topic values to proper labels
        const topicMap = {
            'general': 'General Inquiry',
            'tech': 'Technical Support',
            'billing': 'Billing',
            'feature': 'Feature Request'
        };

        try {
            // If we're in static mode (GitHub Pages), just show a success message
            if (DATA_MODE === 'static') {
                setSubmitted(true);
                setTicketNumber('(Offline Mode)');
                setFormData({ name: '', email: '', topic: '', message: '' });
                setSubmitting(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    topic: topicMap[formData.topic] || formData.topic,
                    message: formData.message
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to submit');
            }

            const data = await response.json();
            setTicketNumber(data.ticket_number);
            setSubmitted(true);
            setFormData({ name: '', email: '', topic: '', message: '' });
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container contact-page">
            <section className="header contact-header">
                <div className="container header-inner" style={{ alignItems: 'center' }}>
                    <h1 className="hero-title">{t('contact.title')}</h1>
                    <p>{t('contact.subtitle')}</p>
                </div>
            </section>

            <div className="contact-options">

                {/* Live Chat Card */}
                <div className="contact-card">
                    <div className="contact-card-icon">
                        <MessageSquare size={32} />
                    </div>
                    <h3>{t('contact.chat_title')}</h3>
                    <p>{t('contact.chat_desc')}</p>
                    <button className="contact-card-btn" onClick={() => alert('Live chat!')}>
                        {t('contact.start_chat')}
                    </button>
                </div>

                {/* Email Card */}
                <div className="contact-card">
                    <div className="contact-card-icon">
                        <Mail size={32} />
                    </div>
                    <h3>{t('contact.email_title')}</h3>
                    <p>{t('contact.email_desc')}</p>
                    <a href="mailto:support@superpos.com" className="contact-card-btn">
                        {t('contact.email_btn')}
                    </a>
                </div>

                {/* Phone Card */}
                <div className="contact-card">
                    <div className="contact-card-icon">
                        <Phone size={32} />
                    </div>
                    <h3>{t('contact.phone_title')}</h3>
                    <p>{t('contact.phone_desc')}</p>
                    <a href="tel:+60123456789" className="contact-card-btn">
                        {t('contact.call_now')}
                    </a>
                </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
                <h2 className="contact-section-title">{t('contact.form_title')}</h2>

                {submitted ? (
                    <div style={{
                        textAlign: 'center', padding: '40px 20px',
                        background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0'
                    }}>
                        <CheckCircle size={48} color="#22c55e" style={{ marginBottom: 16 }} />
                        <h3 style={{ color: '#15803d', marginBottom: 8 }}>Message Sent Successfully!</h3>
                        <p style={{ color: '#666', marginBottom: 12 }}>
                            Your support ticket has been created. Our team will get back to you shortly.
                        </p>
                        {ticketNumber && ticketNumber !== '(Offline Mode)' && (
                            <div style={{
                                display: 'inline-block', background: '#fff', border: '1px solid #ddd',
                                borderRadius: '8px', padding: '12px 24px', marginTop: 8
                            }}>
                                <span style={{ color: '#888', fontSize: '13px' }}>Your Ticket ID:</span>
                                <br />
                                <strong style={{ fontSize: '18px', color: '#F7941D' }}>{ticketNumber}</strong>
                            </div>
                        )}
                        <br />
                        <button
                            onClick={() => { setSubmitted(false); setTicketNumber(''); }}
                            style={{
                                marginTop: '20px', padding: '10px 28px', borderRadius: '8px',
                                border: '1px solid #ddd', background: '#fff', color: '#333',
                                cursor: 'pointer', fontSize: '14px', fontWeight: 500
                            }}
                        >
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
                                padding: '12px 16px', marginBottom: '16px', color: '#dc2626', fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">{t('contact.name_label')}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('contact.name_placeholder')}
                                className="form-control"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('contact.email_label')}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={t('contact.email_placeholder')}
                                className="form-control"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('contact.topic_label')}</label>
                            <select
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                className="form-control"
                                required
                                disabled={submitting}
                            >
                                <option value="">{t('contact.topic_placeholder')}</option>
                                <option value="general">{t('contact.topic_general')}</option>
                                <option value="tech">{t('contact.topic_tech')}</option>
                                <option value="billing">{t('contact.topic_billing')}</option>
                                <option value="feature">{t('contact.topic_feature')}</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('contact.message_label')}</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                placeholder={t('contact.message_placeholder')}
                                className="form-control"
                                required
                                disabled={submitting}
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn btn-primary" disabled={submitting}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                        >
                            {submitting ? (
                                <>
                                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    Sending...
                                </>
                            ) : (
                                t('contact.send_btn')
                            )}
                        </button>
                    </form>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

};

export default Contact;
