import React from 'react';
import SearchBar from '../components/common/SearchBar';
import { categories } from '../data/modules';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 className="hero-title">How can we help you today?</h1>
                    <p className="hero-subtitle">Search our knowledge base or browse categories below</p>

                    <div className="search-container" style={{ margin: '0 auto', maxWidth: '640px' }}>
                        <SearchBar />
                    </div>

                    <div className="quick-links" style={{ justifyContent: 'center' }}>
                        <Link to="/article/setup-pos" className="quick-link">How to set up your first POS</Link>
                        <Link to="/article/qr-ordering" className="quick-link">How QR ordering works</Link>
                        <Link to="/article/printer-fix" className="quick-link">Printer not printing?</Link>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="container" style={{ paddingBottom: '48px' }}>
                <h2 className="section-title">Browse by Category</h2>
                <div className="category-grid">
                    {categories.map((cat) => (
                        <Link to={`/category/${cat.id}`} key={cat.id} className="category-card">
                            <div className="category-icon" style={{ fontSize: '24px' }}>{cat.icon}</div>
                            <div className="category-title">{cat.title}</div>
                            <div className="category-description">{cat.description}</div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Home;
