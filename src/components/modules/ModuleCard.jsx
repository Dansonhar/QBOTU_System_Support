import React from 'react';
import { Link } from 'react-router-dom';

const StatusTag = ({ status }) => {
    if (!status) return null;

    const statusMap = {
        active: { label: 'Active', className: 'status-active' },
        beta: { label: 'Beta', className: 'status-beta' },
        obsolete: { label: 'Obsolete', className: 'status-obsolete' }
    };

    const config = statusMap[status.toLowerCase()];
    if (!config) return null;

    return (
        <span className={`status-tag ${config.className}`}>
            {config.label}
        </span>
    );
};

const ModuleCard = ({ name, description, icon: Icon, status, to }) => {
    return (
        <Link to={to} className="module-card">
            <StatusTag status={status} />
            <div className="module-icon">
                {Icon && <Icon size={20} />}
            </div>
            <div className="module-info">
                <div className="module-name">{name}</div>
                <div className="module-desc">{description}</div>
            </div>
        </Link>
    );
};

export default ModuleCard;
