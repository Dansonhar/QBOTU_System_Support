import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ThumbsUp, ThumbsDown, MessageCircle, Clock, BookOpen } from 'lucide-react';
import { articlesByCategory } from '../data/articles';

// Sample article content - in a real app, this would come from a CMS or API
const articleContent = {
    'setup-pos-register': {
        title: 'How to Set Up Your SUPERPOSE Register (Download, Activate, Deactivate)',
        category: 'setting-up',
        readTime: '5 min read',
        lastUpdated: 'January 2025',
        summary: 'This guide walks you through setting up your POS register from scratch. Don\'t worry — it\'s easier than you think!',
        steps: [
            {
                title: 'Step 1: Download the POS App',
                content: 'Go to your device\'s app store (Google Play Store or Apple App Store) and search for "Q POS". Download and install the app on your device.',
                tip: 'Make sure you have a stable internet connection during the download.'
            },
            {
                title: 'Step 2: Open the App and Sign In',
                content: 'Launch the Q POS app. You\'ll see a login screen. Enter the email and password you used to create your account in the BackOffice.',
            },
            {
                title: 'Step 3: Select Your Store',
                content: 'If you have multiple stores, you\'ll be asked to select which store this register belongs to. Choose the correct store from the list.',
                warning: 'Make sure to select the right store. This affects which products, prices, and settings appear on this register.'
            },
            {
                title: 'Step 4: Activate the Register',
                content: 'Give your register a name (e.g., "Front Counter", "Kitchen", "Bar"). This helps you identify the register in reports. Tap "Activate" to complete the setup.',
            },
            {
                title: 'Step 5: Start Selling!',
                content: 'Your register is now ready. You\'ll see your products on the screen. Tap any product to add it to the cart, then tap "Pay" to complete transactions.'
            }
        ],
        relatedArticles: [
            { id: 'manage-stores', title: 'How to Manage Your Stores', category: 'setting-up' },
            { id: 'manage-registers', title: 'How to Manage Your POS Registers', category: 'setting-up' },
            { id: 'hardware-basic', title: 'Hardware: How to Perform Basic Set Up', category: 'setting-up' }
        ]
    },
    'manage-stores': {
        title: 'How to Manage Your Stores',
        category: 'setting-up',
        readTime: '4 min read',
        lastUpdated: 'January 2025',
        summary: 'Learn how to add, edit, and manage your store locations in the BackOffice.',
        steps: [
            {
                title: 'Step 1: Go to BackOffice',
                content: 'Log in to your BackOffice account at backoffice.qontak.com using your admin credentials.'
            },
            {
                title: 'Step 2: Navigate to Stores',
                content: 'From the left sidebar, click on "Settings" then select "Stores" from the dropdown menu.'
            },
            {
                title: 'Step 3: Add a New Store',
                content: 'Click the "Add Store" button. Fill in your store details including name, address, operating hours, and contact information.',
                tip: 'You can add multiple stores and manage them all from one BackOffice account.'
            },
            {
                title: 'Step 4: Configure Store Settings',
                content: 'Set up your store\'s timezone, currency, tax settings, and receipt preferences. These settings apply to all registers in this store.'
            }
        ],
        relatedArticles: [
            { id: 'manage-registers', title: 'How to Manage Your POS Registers', category: 'setting-up' },
            { id: 'manage-products', title: 'How to Manage Your Products', category: 'setting-up' }
        ]
    },
    // Default fallback for articles without specific content
    'default': {
        title: 'Article',
        category: 'setting-up',
        readTime: '3 min read',
        lastUpdated: 'January 2025',
        summary: 'This guide will help you understand and use this feature effectively.',
        steps: [
            {
                title: 'Step 1: Access the Feature',
                content: 'Navigate to the relevant section in your BackOffice or POS app.'
            },
            {
                title: 'Step 2: Configure Settings',
                content: 'Adjust the settings according to your business needs.'
            },
            {
                title: 'Step 3: Save and Apply',
                content: 'Click Save to apply your changes. Your settings will sync across all connected devices.'
            }
        ],
        relatedArticles: []
    }
};

// Find article info from articlesByCategory
const findArticleInfo = (articleId) => {
    for (const [categoryId, categoryData] of Object.entries(articlesByCategory)) {
        for (const section of categoryData.sections) {
            const article = section.articles.find(a => a.id === articleId);
            if (article) {
                return { ...article, categoryId, categoryTitle: categoryData.title };
            }
        }
    }
    return null;
};

const Article = () => {
    const { articleId } = useParams();
    const [helpful, setHelpful] = React.useState(null);

    const articleInfo = findArticleInfo(articleId);
    const content = articleContent[articleId] || {
        ...articleContent['default'],
        title: articleInfo?.title || 'Article Not Found'
    };

    if (!articleInfo) {
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

    return (
        <div className="article-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/" className="breadcrumb-link">All Collections</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <Link to={`/category/${articleInfo.categoryId}`} className="breadcrumb-link">
                        {articleInfo.categoryTitle}
                    </Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">{content.title}</span>
                </nav>

                {/* Article Content */}
                <article className="article-content">
                    {/* Article Header */}
                    <header className="article-header">
                        <h1 className="article-title">{content.title}</h1>
                        <div className="article-meta">
                            <span className="article-meta-item">
                                <Clock size={14} />
                                {content.readTime}
                            </span>
                            <span className="article-meta-item">
                                <BookOpen size={14} />
                                Updated {content.lastUpdated}
                            </span>
                        </div>
                    </header>

                    {/* Summary */}
                    <div className="article-summary">
                        <p>{content.summary}</p>
                    </div>

                    {/* Steps */}
                    <div className="article-steps">
                        {content.steps.map((step, index) => (
                            <div key={index} className="step-block">
                                <h2 className="step-title">{step.title}</h2>
                                <p className="step-content">{step.content}</p>

                                {/* Screenshot placeholder */}
                                <div className="screenshot-placeholder">
                                    <div className="screenshot-inner">
                                        <span>📸 Screenshot placeholder</span>
                                        <small>Visual guide for this step</small>
                                    </div>
                                </div>

                                {step.tip && (
                                    <div className="step-tip">
                                        <span className="tip-icon">💡</span>
                                        <span className="tip-text"><strong>Tip:</strong> {step.tip}</span>
                                    </div>
                                )}

                                {step.warning && (
                                    <div className="step-warning">
                                        <span className="warning-icon">⚠️</span>
                                        <span className="warning-text"><strong>Important:</strong> {step.warning}</span>
                                    </div>
                                )}
                            </div>
                        ))}
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

                {/* Related Articles */}
                {content.relatedArticles && content.relatedArticles.length > 0 && (
                    <aside className="related-articles">
                        <h3 className="related-title">Related Articles</h3>
                        <ul className="related-list">
                            {content.relatedArticles.map((article) => (
                                <li key={article.id}>
                                    <Link to={`/article/${article.id}`} className="related-link">
                                        <span>{article.title}</span>
                                        <ChevronRight size={16} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default Article;
