import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bug, X } from 'lucide-react';

const DebugInfo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="debug-container">
            <button
                className="debug-toggle"
                onClick={() => setIsOpen(!isOpen)}
                title="Debug Info"
            >
                {isOpen ? <X size={16} /> : <Bug size={16} />}
            </button>

            {isOpen && (
                <div className="debug-panel">
                    <div className="debug-row">
                        <span className="debug-label">Path:</span>
                        <code>{location.pathname}</code>
                    </div>
                    <div className="debug-row">
                        <span className="debug-label">Full URL:</span>
                        <code>{window.location.href}</code>
                    </div>
                    {location.search && (
                        <div className="debug-row">
                            <span className="debug-label">Query:</span>
                            <code>{location.search}</code>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DebugInfo;
