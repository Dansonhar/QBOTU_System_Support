import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ThumbsUp, ThumbsDown, MessageCircle, Clock, BookOpen } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

const Article = () => {
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [helpful, setHelpful] = useState(null);

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

    if (loading) {
        return (
            <div className="article-page">
                <div className="container">
                    <div className="loading-state">Loading article...</div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="article-page">
                <div className="container">
                    <div className="article-not-found">
                        <h1>Article Not Found</h1>
                        <p>Sorry, we couldn't find the article you're looking for.</p>
                        <Link to="/" className="back-home-btn">← Back to Help Center</Link>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="article-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/" className="breadcrumb-link">All Collections</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <Link to={`/category/${article.category_id}`} className="breadcrumb-link">
                        {article.category_name}
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">{article.title}</span>
                </nav>

                {/* Article Content */}
                <article className="article-content">
                    {/* Article Header */}
                    <header className="article-header">
                        <h1 className="article-title">{article.title}</h1>
                        <div className="article-meta">
                            <span className="article-meta-item">
                                <Clock size={14} />
                                {article.steps?.length || 0} steps
                            </span>
                            <span className="article-meta-item">
                                <BookOpen size={14} />
                                Updated {formatDate(article.updated_at || article.created_at)}
                            </span>
                        </div>
                    </header>

                    {/* Summary */}
                    {article.description && (
                        <div className="article-summary">
                            <p>{article.description}</p>
                        </div>
                    )}

                    {/* Steps from Database */}
                    <div className="article-steps">
                        {article.steps && article.steps.length > 0 ? (
                            article.steps.map((step, index) => (
                                <div key={step.id} className="step-block">
                                    <h2 className="step-title">{step.step_title}</h2>

                                    {step.content && (
                                        <div
                                            className="step-content"
                                            dangerouslySetInnerHTML={{ __html: step.content }}
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
                                                🎬 Watch Video Guide
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No steps added yet for this article.</p>
                            </div>
                        )}
                    </div>

                    {/* Feedback Section */}
                    <div className="article-feedback">
                        <div className="feedback-question">
                            <span>Was this article helpful?</span>
                            <div className="feedback-buttons">
                                <button
                                    className={`feedback-btn ${helpful === true ? 'active' : ''}`}
                                    onClick={() => setHelpful(true)}
                                >
                                    <ThumbsUp size={18} />
                                    <span>Yes</span>
                                </button>
                                <button
                                    className={`feedback-btn ${helpful === false ? 'active' : ''}`}
                                    onClick={() => setHelpful(false)}
                                >
                                    <ThumbsDown size={18} />
                                    <span>No</span>
                                </button>
                            </div>
                        </div>

                        {helpful !== null && (
                            <p className="feedback-thanks">
                                {helpful
                                    ? 'Thanks for the feedback! Glad this helped. 😊'
                                    : 'Sorry to hear that. Please contact support if you need more help.'
                                }
                            </p>
                        )}
                    </div>

                    {/* Contact Support */}
                    <div className="article-support">
                        <MessageCircle size={20} />
                        <div className="support-text">
                            <strong>Still need help?</strong>
                            <span>Contact our support team for personalized assistance.</span>
                        </div>
                        <Link to="/contact" className="support-link">Contact Support →</Link>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default Article;
