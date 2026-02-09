import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Key } from 'lucide-react';
import logo from '../../assets/superpos-logo.png';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-logo">
                    <img src={logo} alt="SUPERPOS" className="logo-img" />
                </div>
                <div className="footer-links" style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                    <Link to="/contact" className="footer-link">{t('footer.contact_us')}</Link>
                    <Link to="/privacy" className="footer-link">{t('footer.privacy')}</Link>
                </div>
                <div className="footer-copyright" style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {t('common.copyright').replace('2026', currentYear)}

                    {/* Discreet Admin Login Link */}
                    <Link to="/admin/login" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', opacity: 0.5 }} title="Admin Access">
                        <Key size={14} />
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
