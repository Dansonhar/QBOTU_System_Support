import React, { useState } from 'react';
import { MessageSquare, Mail, Phone } from 'lucide-react';

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
        <div className="container contact-page">
            <section className="header contact-header">
                <div className="container header-inner" style={{ alignItems: 'center' }}>
                    <h1 className="hero-title">Get in Touch</h1>
                    <p>Our support team is here to help you succeed</p>
                </div>
            </section>

            <div className="contact-options">

                {/* Live Chat Card */}
                <div className="contact-card">
                    <div className="contact-card-icon">
                        <MessageSquare size={32} />
                    </div>
                    <h3>Live Chat</h3>
                    <p>Chat with our support team in real-time. Available Mon-Fri, 9AM-6PM.</p>
                    <button className="contact-card-btn" onClick={() => alert('Live chat!')}>
                        Start Chat
                    </button>
                </div>

                {/* Email Card */}
                <div className="contact-card">
                    <div className="contact-card-icon">
                        <Mail size={32} />
                    </div>
                    <h3>Email Support</h3>
                    <p>Send us a detailed message. We respond within 24 hours.</p>
                    <a href="mailto:support@superpos.com" className="contact-card-btn">
                        Email Us
                    </a>
                </div>

                {/* Phone Card */}
                <div className="contact-card">
                    <div className="contact-card-icon">
                        <Phone size={32} />
                    </div>
                    <h3>Phone Support</h3>
                    <p>Call us for urgent issues. Available Mon-Fri, 9AM-6PM.</p>
                    <a href="tel:+60123456789" className="contact-card-btn">
                        Call Now
                    </a>
                </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
                <h2 className="contact-section-title">Send Us a Message</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Topic</label>
                        <select
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">Select a topic...</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing Question</option>
                            <option value="feature">Feature Request</option>
                            <option value="general">General Inquiry</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Describe your issue or question..."
                            className="form-control"
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="form-submit-btn">Send Message</button>
                </form>
            </div>
        </div>
    );

};

export default Contact;
