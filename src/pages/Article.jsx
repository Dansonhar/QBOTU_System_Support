import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ThumbsUp, ThumbsDown, MessageCircle, Clock, BookOpen } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

const Article = () => {
    const { t } = useTranslation();
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [helpful, setHelpful] = useState(null);

    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['overview', ...article?.steps?.map((_, i) => `step-${i}`) || [], 'help'];

            // Find the current section
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If element is near top of viewport (considering header offset)
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(sectionId);
                        break;
                    } else if (rect.top < 0 && rect.bottom > 100) {
                        // Element is covering the top area (user is "inside" this section)
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Call once on mount/update to set initial active section
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [article]);

    useEffect(() => {
        fetchArticle();
    }, [articleId]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/questions/${articleId}`);
            if (!res.ok) throw new Error('Article not found');
            const data = await res.json();
            setArticle(data);
        } catch (error) {
            console.error('Error fetching article:', error);
            setArticle(null);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get localized article title
    const getArticleTitle = (article) => {
        const key = (article.slug || article.title).toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');
        return t(`articles.${key}`, { defaultValue: article.title });
    };

    // Helper to get localized article description
    const getArticleDescription = (article) => {
        const key = (article.slug || article.title).toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');
        return t(`articles.${key}_desc`, { defaultValue: article.description });
    };

    // Helper to get localized category name
    const getCategoryName = (article) => {
        const key = (article.category_slug || article.category_name || '').toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');
        return t(`categories.${key}`, { defaultValue: article.category_name });
    };

    // Helper to get localized step title
    const getStepTitle = (article, step, index) => {
        const articleKey = (article.slug || article.title).toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');

        // First try article-specific step title translation
        const specificTranslation = t(`articles.${articleKey}_step_${index + 1}_title`, { defaultValue: '' });
        if (specificTranslation) return specificTranslation;

        // Check if step title follows "Step X" pattern and translate it
        const stepMatch = step.step_title?.match(/^Step\s+(\d+)$/i);
        if (stepMatch) {
            return t(`articles.step_${stepMatch[1]}`, { defaultValue: step.step_title });
        }

        return step.step_title;
    };

    // Helper to get localized step content
    const getStepContent = (article, step, index) => {
        const articleKey = (article.slug || article.title).toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');
        return t(`articles.${articleKey}_step_${index + 1}_content`, { defaultValue: step.content });
    };

    // Helper for localized date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="article-page">
                <div className="container">
                    <div className="loading-state">{t('article.loading')}</div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="article-page">
                <div className="container">
                    <div className="article-not-found">
                        <h1>{t('article.not_found')}</h1>
                        <p>{t('article.not_found_desc')}</p>
                        <Link to="/" className="back-home-btn">← {t('article.back_home')}</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="article-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/" className="breadcrumb-link">{t('nav.home')}</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <Link to={`/category/${article.category_id}`} className="breadcrumb-link">
                        {getCategoryName(article)}
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">{getArticleTitle(article)}</span>
                </nav>

                <div className="article-container-grid">
                    {/* Article Content - Left Side */}
                    <article className="article-content-main">
                        {/* Article Header */}
                        <header className="article-header" id="overview">
                            <h1 className="article-title">{getArticleTitle(article)}</h1>
                            <div className="article-meta">
                                <span className="article-meta-item">
                                    <Clock size={14} />
                                    {t('article.steps_count', { count: article.steps?.length || 0 })}
                                </span>
                                <span className="article-meta-item">
                                    <BookOpen size={14} />
                                    {t('article.updated', { date: formatDate(article.updated_at || article.created_at) })}
                                </span>
                            </div>
                        </header>

                        {/* Summary */}
                        {article.description && (
                            <div className="article-summary">
                                <p>{getArticleDescription(article)}</p>
                            </div>
                        )}

                        {/* Steps from Database */}
                        <div className="article-steps">
                            {article.steps && article.steps.length > 0 ? (
                                article.steps.map((step, index) => (
                                    <div key={step.id} className="step-block" id={`step-${index}`}>
                                        <h2 className="step-title">{getStepTitle(article, step, index)}</h2>

                                        {step.content && (
                                            <div
                                                className="step-content"
                                                dangerouslySetInnerHTML={{ __html: getStepContent(article, step, index) }}
                                            />
                                        )}

                                        {/* Step Image */}
                                        {step.image_url && (
                                            <div className="step-image">
                                                <img
                                                    src={`http://localhost:3001${step.image_url}`}
                                                    alt={step.step_title}
                                                />
                                            </div>
                                        )}

                                        {/* Step Video */}
                                        {step.video_url && (
                                            <div className="step-video">
                                                <a href={step.video_url} target="_blank" rel="noopener noreferrer">
                                                    🎬 {t('article.watch_video')}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>{t('article.no_steps')}</p>
                                </div>
                            )}
                        </div>

                        {/* Feedback Section */}
                        <div className="article-feedback" id="help">
                            <div className="feedback-question">
                                <span>{t('article.feedback_question')}</span>
                                <div className="feedback-buttons">
                                    <button
                                        className={`feedback-btn ${helpful === true ? 'active' : ''}`}
                                        onClick={() => setHelpful(true)}
                                    >
                                        <ThumbsUp size={18} />
                                        <span>{t('article.yes')}</span>
                                    </button>
                                    <button
                                        className={`feedback-btn ${helpful === false ? 'active' : ''}`}
                                        onClick={() => setHelpful(false)}
                                    >
                                        <ThumbsDown size={18} />
                                        <span>{t('article.no')}</span>
                                    </button>
                                </div>
                            </div>

                            {helpful !== null && (
                                <p className="feedback-thanks">
                                    {helpful
                                        ? t('article.feedback_thanks')
                                        : t('article.feedback_sorry')
                                    }
                                </p>
                            )}
                        </div>

                        {/* Contact Support */}
                        <div className="article-support">
                            <MessageCircle size={20} />
                            <div className="support-text">
                                <strong>{t('article.still_need_help')}</strong>
                                <span>{t('article.contact_support_desc')}</span>
                            </div>
                            <Link to="/contact" className="support-link">{t('article.contact_support_btn')} →</Link>
                        </div>
                    </article>

                    {/* Sidebar / Table of Contents - Right Side */}
                    <aside className="article-sidebar">
                        <div className="toc-sticky">
                            <div className="toc-divider-line"></div>
                            <h3 className="toc-title">{t('article.on_this_page')}</h3>
                            <ul className="toc-list">
                                <li>
                                    <a href="#overview" className={`toc-link ${activeSection === 'overview' ? 'active' : ''}`}>{t('article.overview')}</a>
                                </li>
                                {article.steps?.map((step, index) => (
                                    <li key={step.id}>
                                        <a href={`#step-${index}`} className={`toc-link ${activeSection === `step-${index}` ? 'active' : ''}`}>
                                            {getStepTitle(article, step, index)}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a href="#help" className={`toc-link ${activeSection === 'help' ? 'active' : ''}`}>{t('article.need_help')}</a>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Article;
