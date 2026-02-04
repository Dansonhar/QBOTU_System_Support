import React from 'react';
import ModuleCard from '../components/modules/ModuleCard';
import { modules } from '../data/modules';

const Modules = () => {
    return (
        <div className="container" style={{ paddingBottom: '48px' }}>
            <section className="hero" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                <h1 className="hero-title">Browse by Product</h1>
                <p className="hero-subtitle">Find help for specific products in our ecosystem</p>
            </section>

            {modules.map((group) => (
                <div key={group.id} className="module-group" style={{ marginBottom: '32px' }}>
                    <h3 className="section-title">
                        <group.icon size={20} className="logo-icon" />
                        {group.title}
                    </h3>
                    <div className="module-grid">
                        {group.items.map((item) => (
                            <ModuleCard
                                key={item.id}
                                name={item.name}
                                description={item.description}
                                icon={item.icon}
                                status={item.status}
                                to={item.to}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Modules;
