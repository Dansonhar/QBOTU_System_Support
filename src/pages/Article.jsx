import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ThumbsUp, ThumbsDown, MessageCircle, Clock, BookOpen } from 'lucide-react';
import { API_BASE_URL, IMAGE_BASE_URL, DATA_MODE } from '../config';



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
            const endpoint = DATA_MODE === 'static' ? `${API_BASE_URL}/questions/${articleId}.json` : `${API_BASE_URL}/questions/${articleId}`;
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error('Article not found');
            const data = await res.json();

            // Check for draft or inactive category in public view
            if (data.status === 'draft' || data.category_status === 'inactive') {
                throw new Error('This article is not available');
            }

            setArticle(data);
        } catch (error) {
            console.error('Error fetching article:', error);
            setArticle(null);
        } finally {
            setLoading(false);
        }
    };



    // Helper for localized date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    // Strip &nbsp; from Quill-generated HTML so text wraps normally
    const sanitizeHtml = (html) => {
        if (!html) return '';
        return html.replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ');
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
                        {article.category_name}
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">{article.title}</span>
                </nav>

                <div className="article-container-grid">
                    {/* Article Content - Left Side */}
                    <article className="article-content-main">
                        {/* Article Header */}
                        <header className="article-header" id="overview">
                            <h1 className="article-title">{article.title}</h1>
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
                            <div
                                className="article-summary rich-content"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.description) }}
                            />
                        )}

                        {/* Steps from Database */}
                        <div className="article-steps">
                            {article.steps && article.steps.length > 0 ? (
                                article.steps.map((step, index) => {
                                    if (step.block_type === 'section_title') {
                                        return (
                                            <h2 key={step.id} className="article-section-title" id={`step-${index}`}>
                                                {step.step_title}
                                            </h2>
                                        );
                                    }

                                    return (
                                        <div key={step.id} className="step-block" id={`step-${index}`}>
                                            <h2 className="step-title">{step.step_title}</h2>

                                            {step.content && (
                                                <div
                                                    className="step-content"
                                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(step.content) }}
                                                />
                                            )}

                                            {/* Step Images */}
                                            {step.images && step.images.length > 0 ? (
                                                <div className="step-images-gallery">
                                                    {step.images.map((imgUrl, imgIdx) => (
                                                        <div key={imgIdx} className="step-image">
                                                            <img
                                                                src={`${IMAGE_BASE_URL}${imgUrl}`}
                                                                alt={`${step.step_title} - image ${imgIdx + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : step.image_url && (
                                                <div className="step-image">
                                                    <img
                                                        src={`${IMAGE_BASE_URL}${step.image_url}`}
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
                                    );
                                })
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
                                    <li key={step.id} className={step.block_type === 'section_title' ? 'toc-item-section' : 'toc-item-step'}>
                                        <a href={`#step-${index}`} className={`toc-link ${activeSection === `step-${index}` ? 'active' : ''}`}>
                                            {step.step_title}
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
