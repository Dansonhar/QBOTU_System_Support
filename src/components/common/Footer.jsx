import React from 'react';
import logo from '../../assets/superpos-logo.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-logo">
                    <img src={logo} alt="SUPERPOS" className="logo-img" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
