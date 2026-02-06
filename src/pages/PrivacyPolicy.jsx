import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="article-page">
            <div className="container">
                <header className="article-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '2rem', marginBottom: '2rem' }}>
                    <h1 className="article-title">{t('privacy.title')}</h1>
                    <div className="article-meta">
                        <span className="article-meta-item">
                            <Shield size={16} />
                            {t('privacy.last_updated', { date: 'February 6, 2026' })}
                        </span>
                    </div>
                </header>

                <div className="article-content-main" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="privacy-section">
                        <p className="lead" style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2rem' }}>
                            {t('privacy.intro')}
                        </p>

                        <div className="policy-block" style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                <FileText size={24} className="text-primary" />
                                {t('privacy.s1_title')}
                            </h2>
                            <p>{t('privacy.s1_intro')}</p>
                            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li><strong>{t('privacy.s1_l1').split(':')[0]}:</strong> {t('privacy.s1_l1').split(':')[1]}</li>
                                <li><strong>{t('privacy.s1_l2').split(':')[0]}:</strong> {t('privacy.s1_l2').split(':')[1]}</li>
                                <li><strong>{t('privacy.s1_l3').split(':')[0]}:</strong> {t('privacy.s1_l3').split(':')[1]}</li>
                            </ul>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                <Eye size={24} className="text-primary" />
                                {t('privacy.s2_title')}
                            </h2>
                            <p>{t('privacy.s2_intro')}</p>
                            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li>{t('privacy.s2_l1')}</li>
                                <li>{t('privacy.s2_l2')}</li>
                                <li>{t('privacy.s2_l3')}</li>
                                <li>{t('privacy.s2_l4')}</li>
                                <li>{t('privacy.s2_l5')}</li>
                            </ul>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                <Lock size={24} className="text-primary" />
                                {t('privacy.s3_title')}
                            </h2>
                            <p>{t('privacy.s3_desc')}</p>
                        </div>

                        <div className="policy-block" style={{ marginBottom: '2.5rem' }}>
                            <h2>{t('privacy.s4_title')}</h2>
                            <p>{t('privacy.s4_desc')}</p>
                        </div>

                        <div className="policy-block">
                            <h2>{t('privacy.s5_title')}</h2>
                            <p>{t('privacy.s5_desc')}</p>
                            <p style={{ marginTop: '1rem' }}>
                                <strong>Email:</strong> support@superpos.com<br />
                                <strong>Phone:</strong> +60 3-1234 5678
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
