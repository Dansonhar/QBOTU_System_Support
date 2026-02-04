import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        topic: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message sent! (Simulation)');
        setFormData({ name: '', email: '', topic: '', message: '' });
    };

    return (
        <div className="container" style={{ paddingBottom: '48px' }}>
            <section className="hero" style={{ borderBottom: 'none' }}>
                <h1 className="hero-title">Get in Touch</h1>
                <p className="hero-subtitle">Our support team is here to help you succeed</p>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>

                {/* Live Chat Card */}
                <div className="category-card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div className="category-icon" style={{ margin: '0 auto 16px', fontSize: '32px' }}>💬</div>
                    <h3 className="category-title">Live Chat</h3>
                    <p className="category-description">Chat with our support team in real-time. Available Mon-Fri, 9AM-6PM.</p>
                    <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => alert('Live chat!')}>
                        Start Chat
                    </button>
                </div>

                {/* Email Card */}
                <div className="category-card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div className="category-icon" style={{ margin: '0 auto 16px', fontSize: '32px' }}>📧</div>
                    <h3 className="category-title">Email Support</h3>
                    <p className="category-description">Send us a detailed message. We respond within 24 hours.</p>
                    <a href="mailto:support@queuemaster.com" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        Email Us
                    </a>
                </div>

                {/* Phone Card */}
                <div className="category-card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div className="category-icon" style={{ margin: '0 auto 16px', fontSize: '32px' }}>📞</div>
                    <h3 className="category-title">Phone Support</h3>
                    <p className="category-description">Call us for urgent issues. Available Mon-Fri, 9AM-6PM.</p>
                    <a href="tel:+60123456789" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        Call Now
                    </a>
                </div>
            </div>

            {/* Contact Form */}
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                <h2 className="section-title" style={{ justifyContent: 'center' }}>Send Us a Message</h2>

                <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg-surface)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="search-input"
                            style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', width: '100%' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="search-input"
                            style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', width: '100%' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Topic</label>
                        <select
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', background: 'white' }}
                        >
                            <option value="">Select a topic...</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing Question</option>
                            <option value="feature">Feature Request</option>
                            <option value="general">General Inquiry</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Describe your issue or question..."
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
