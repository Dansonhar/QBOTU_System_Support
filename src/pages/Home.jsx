import React from 'react';
import { categories } from '../data/modules';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <section className="category-section">
            <div className="container">
                <div className="category-grid">
                    {categories.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                            <Link to={`/category/${cat.id}`} key={cat.id} className="category-card">
                                <div className="category-icon">
                                    <IconComponent />
                                </div>
                                <div className="category-title">{cat.title}</div>
                                <div className="category-description">{cat.description}</div>
                                <div className="category-count">{cat.articleCount} articles</div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Home;
