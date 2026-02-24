import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Rocket, Monitor, LayoutGrid, ShoppingCart, FileText, Receipt, Printer, Link2, Wrench, HelpCircle, FolderOpen } from 'lucide-react';
import { API_BASE_URL, DATA_MODE } from '../config';



// Icon mapping for visual display
const iconMap = {
    Rocket, Monitor, LayoutGrid, ShoppingCart, FileText, Receipt, Printer, Link2, Wrench, HelpCircle, FolderOpen
};

const Home = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const endpoint = DATA_MODE === 'static' ? `${API_BASE_URL}/categories.json` : `${API_BASE_URL}/categories?status=active`;
            const res = await fetch(endpoint);
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
                    <div className="loading-state">{t('common.loading')}</div>
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
                        <h2>{t('categories.no_categories')}</h2>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="category-section">
            <div className="container">
                <h2 className="section-title">{t('categories.title')}</h2>

                <div className="category-grid">
                    {categories.map(category => {
                        const IconComponent = iconMap[category.icon] || FolderOpen;
                        return (
                            <Link to={`/category/${category.id}`} key={category.id} className="category-card">
                                <div className="category-icon">
                                    <IconComponent size={32} />
                                </div>
                                <div className="category-title">{category.name}</div>
                                <div className="category-description">{category.description}</div>
                                <div className="category-count">{t('categories.view_articles', { count: category.questionCount || 0 })}</div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Home;
