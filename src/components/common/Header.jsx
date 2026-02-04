import React from 'react';
import { Package, HelpCircle, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <HelpCircle size={18} />
          </div>
          <span>QueueMaster Help</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Help Center
          </Link>
          <Link to="/modules" className={`nav-link ${isActive('/modules')}`}>
            Products
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
