import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Rocket, Monitor, LayoutGrid, ShoppingCart, FileText, Receipt, Printer, Link2, Wrench, HelpCircle } from 'lucide-react';
import { articlesByCategory } from '../data/articles';
import { categories } from '../data/modules';

// Icon mapping
const iconMap = {
    Rocket,
    Monitor,
    LayoutGrid,
    ShoppingCart,
    FileText,
    Receipt,
    Printer,
    Link2,
    Wrench,
    HelpCircle
};

const Category = () => {
    const { categoryId } = useParams();
    const categoryData = articlesByCategory[categoryId];
    const categoryMeta = categories.find(c => c.id === categoryId);

    if (!categoryData) {
        return (
            <div className="container" style={{ padding: '48px', textAlign: 'center' }}>
                <h1>Category not found</h1>
                <Link to="/">← Back to Home</Link>
            </div>
        );
    }

    const IconComponent = categoryMeta?.icon || Rocket;
    const totalArticles = categoryData.sections.reduce(
        (sum, section) => sum + section.articles.length,
        0
    );

    return (
        <div className="category-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/" className="breadcrumb-link">All Collections</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">{categoryData.title}</span>
                </nav>

                {/* Category Header */}
                <div className="category-header">
                    <div className="category-header-icon">
                        <IconComponent />
                    </div>
                    <h1 className="category-page-title">{categoryData.title}</h1>
                    <p className="category-page-description">{categoryData.description}</p>
                    <p className="category-article-count">{totalArticles} articles</p>
                </div>

                {/* Article Sections */}
                <div className="article-sections">
                    {categoryData.sections.map((section, index) => (
                        <div key={index} className="article-section">
                            <h2 className="section-heading">{section.title}</h2>
                            <ul className="article-list">
                                {section.articles.map((article) => (
                                    <li key={article.id}>
                                        <Link to={`/article/${article.id}`} className="article-list-item">
                                            <span className="article-list-title">{article.title}</span>
                                            <ChevronRight size={16} className="article-list-arrow" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category;
