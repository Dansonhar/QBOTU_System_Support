import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Mail, Phone } from 'lucide-react';

const Contact = () => {
    const { t } = useTranslation();
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
        alert(t('contact.success_alert'));
        setFormData({ name: '', email: '', topic: '', message: '' });
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

                <form onSubmit={handleSubmit}>
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
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn btn-primary">
                        {t('contact.send_btn')}
                    </button>
                </form>
            </div>
        </div>
    );

};

export default Contact;
