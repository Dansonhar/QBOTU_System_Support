import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
                    <div>
                        <h4 style={{ marginBottom: '16px', fontWeight: 600 }}>Help Center</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Getting Started</a></li>
                            <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Troubleshooting</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '16px', fontWeight: 600 }}>Products</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Q POS</a></li>
                            <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Kitchen Display</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '16px', fontWeight: 600 }}>Company</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>About Us</a></li>
                            <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    <p>&copy; 2025 QueueMaster. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
