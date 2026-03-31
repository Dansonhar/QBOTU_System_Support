import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext }) {
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && currentIndex > 0) onPrev();
            if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNext();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKey);
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [currentIndex, images.length]);

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <button className="lightbox-close" onClick={onClose} aria-label="Close">
                <X size={24} />
            </button>

            {currentIndex > 0 && (
                <button
                    className="lightbox-nav lightbox-prev"
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    aria-label="Previous image"
                >
                    <ChevronLeft size={36} />
                </button>
            )}

            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
                {images.length > 1 && (
                    <div className="lightbox-counter">{currentIndex + 1} / {images.length}</div>
                )}
            </div>

            {currentIndex < images.length - 1 && (
                <button
                    className="lightbox-nav lightbox-next"
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    aria-label="Next image"
                >
                    <ChevronRight size={36} />
                </button>
            )}
        </div>
    );
}
