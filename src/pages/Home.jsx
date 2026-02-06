import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Monitor, LayoutGrid, ShoppingCart, FileText, Receipt, Printer, Link2, Wrench, HelpCircle, FolderOpen } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

// Icon mapping for visual display
const iconMap = {
    Rocket, Monitor, LayoutGrid, ShoppingCart, FileText, Receipt, Printer, Link2, Wrench, HelpCircle, FolderOpen
};

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}/categories?status=active`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="category-section">
                <div className="container">
                    <div className="loading-state">Loading categories...</div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return (
            <section className="category-section">
                <div className="container">
                    <div className="empty-state">
                        <FolderOpen size={48} />
                        <h2>No Categories Yet</h2>
                        <p>Add categories from the admin panel to get started.</p>
                        <Link to="/admin" className="admin-link-btn">Go to Admin Panel →</Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="category-section">
            <div className="container">
                <div className="category-grid">
                    {categories.map((cat) => {
                        // Try to get icon from name, fallback to default
                        const iconName = cat.name.replace(/\s+/g, '');
                        const IconComponent = iconMap[iconName] || FolderOpen;

                        return (
                            <Link to={`/category/${cat.id}`} key={cat.id} className="category-card">
                                <div className="category-icon">
                                    <IconComponent />
                                </div>
                                <div className="category-title">{cat.name}</div>
                                <div className="category-description">{cat.description || 'Browse articles in this category'}</div>
                                <div className="category-count">{cat.questionCount} articles</div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Home;
