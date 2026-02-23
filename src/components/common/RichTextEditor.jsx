import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['clean']
];

// Strip &nbsp; / non-breaking spaces so text wraps normally when displayed
const cleanHtml = (html) => {
    if (!html) return '';
    return html.replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ');
};

// Normalize to empty string for blank-editor comparison
const normalizeEmpty = (html) =>
    !html || html === '<p><br></p>' || html.trim() === '' ? '' : html;

const RichTextEditor = ({ value, onChange, placeholder = 'Enter content here...' }) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const onChangeRef = useRef(onChange);
    // Track that the last state update came from typing (internal), so we
    // don't let the sync-effect re-inject content and destroy the cursor.
    const lastEmittedHtmlRef = useRef('');

    // Keep onChange ref up to date without re-running effects
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Initialize Quill exactly once
    useEffect(() => {
        if (quillRef.current) return;

        const quill = new Quill(containerRef.current, {
            theme: 'snow',
            placeholder,
            modules: { toolbar: toolbarOptions }
        });

        quill.on('text-change', () => {
            const raw = quill.getSemanticHTML();
            const html = cleanHtml(raw);
            const isEmpty = quill.getText().trim().length === 0;
            const emitted = isEmpty ? '' : html;

            // Remember what we just emitted so the sync-effect can skip it
            lastEmittedHtmlRef.current = emitted;
            onChangeRef.current(emitted);
        });

        quillRef.current = quill;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync external value → Quill, but ONLY for external changes (e.g. initial
    // data load), never for changes that Quill itself just emitted.
    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;

        const cleanedValue = cleanHtml(value || '');

        // If this matches what we last emitted, Quill already has it — skip.
        if (cleanedValue === lastEmittedHtmlRef.current) return;

        const currentHtml = cleanHtml(quill.getSemanticHTML());

        // Only re-inject if content is genuinely different (e.g. initial load)
        if (normalizeEmpty(currentHtml) !== normalizeEmpty(cleanedValue)) {
            const sel = quill.getSelection(); // save cursor
            const delta = quill.clipboard.convert({ html: cleanedValue });
            quill.setContents(delta, 'silent');
            if (sel) quill.setSelection(sel, 'silent'); // restore cursor
        }
    }, [value]);

    return (
        <div className="rich-editor-wrapper">
            <div ref={containerRef} />
        </div>
    );
};

export default RichTextEditor;
