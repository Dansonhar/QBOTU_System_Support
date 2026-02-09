import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, FolderOpen } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

const Category = () => {
    const { t } = useTranslation();
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryData();
    }, [categoryId]);

    const fetchCategoryData = async () => {
        try {
            setLoading(true);

            // Fetch category info
            const catRes = await fetch(`${API_BASE}/categories/${categoryId}`);
            if (!catRes.ok) throw new Error('Category not found');
            const catData = await catRes.json();
            setCategory(catData);

            // Fetch questions for this category
            const qRes = await fetch(`${API_BASE}/questions?category_id=${categoryId}&status=published`);
            const qData = await qRes.json();
            setQuestions(qData.questions || []);
        } catch (error) {
            console.error('Error fetching category:', error);
            setCategory(null);
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <div className="category-page">
                <div className="container">
                    <div className="loading-state">{t('common.loading')}</div>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="container" style={{ padding: '48px', textAlign: 'center' }}>
                <h1>{t('category.not_found', { defaultValue: 'Category not found' })}</h1>
                <Link to="/">← {t('article.back_home')}</Link>
            </div>
        );
    }

    return (
        <div className="category-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/" className="breadcrumb-link">{t('category.all_collections', { defaultValue: 'All Collections' })}</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">{category.name}</span>
                </nav>

                {/* Category Header */}
                <div className="category-header">
                    <div className="category-header-icon">
                        <FolderOpen />
                    </div>
                    <h1 className="category-page-title">{category.name}</h1>
                    <p className="category-page-description">{category.description}</p>
                    <p className="category-article-count">{t('categories.view_articles', { count: questions.length })}</p>
                </div>

                {/* Questions List */}
                <div className="article-sections">
                    {questions.length === 0 ? (
                        <div className="empty-state">
                            <p>{t('category.no_articles', { defaultValue: 'No published articles in this category yet.' })}</p>
                            <Link to="/admin/questions/new" className="admin-link-btn">
                                {t('category.add_article', { defaultValue: 'Add Question in Admin →' })}
                            </Link>
                        </div>
                    ) : (
                        <div className="article-section">
                            <h2 className="section-heading">{t('category.all_articles', { defaultValue: 'All Articles' })}</h2>
                            <ul className="article-list">
                                {questions.map((question) => (
                                    <li key={question.id}>
                                        <Link to={`/article/${question.id}`} className="article-list-item">
                                            <span className="article-list-title">{question.title}</span>
                                            <ChevronRight size={16} className="article-list-arrow" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Category;

