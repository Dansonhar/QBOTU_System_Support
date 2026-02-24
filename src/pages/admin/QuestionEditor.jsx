import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import {
    LayoutDashboard, FolderOpen, HelpCircle, LogOut, Plus,
    Save, ArrowLeft, Trash2, FileText, GripVertical, Image, Video, X, Users, BarChart3, Settings, MessageCircle
} from 'lucide-react';
import RichTextEditor from '../../components/common/RichTextEditor';

const QuestionEditor = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const { logout, getAuthHeaders, token } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnCategory = searchParams.get('category');

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        category_id: '',
        title: '',
        description: '',
        status: 'draft'
    });

    const [steps, setSteps] = useState([]);
    const [deletedStepIds, setDeletedStepIds] = useState([]);
    const [draggedStep, setDraggedStep] = useState(null);

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchQuestion();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/categories?status=active`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/questions/${id}`);
            const data = await res.json();

            setFormData({
                category_id: data.category_id,
                title: data.title,
                description: data.description || '',
                status: data.status
            });

            // Migrate single image_url into images array if needed
            const migratedSteps = (data.steps || []).map(s => ({
                ...s,
                images: s.images && s.images.length > 0
                    ? s.images
                    : s.image_url ? [s.image_url] : []
            }));
            setSteps(migratedSteps);
        } catch (error) {
            console.error('Error fetching question:', error);
        } finally {
            setLoading(false);
        }
    };

    const addStep = () => {
        setSteps([...steps, {
            id: `new-${Date.now()}`,
            step_title: `Step ${steps.length + 1}`,
            content: '',
            image_url: '',
            images: [],
            video_url: '',
            block_type: 'step'
        }]);
    };

    const addSectionTitle = () => {
        setSteps([...steps, {
            id: `new-${Date.now()}`,
            step_title: 'New Section',
            content: '',
            image_url: '',
            images: [],
            video_url: '',
            block_type: 'section_title'
        }]);
    };

    const updateStep = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
    };

    const removeStep = (index) => {
        const stepToRemove = steps[index];
        const isNew = stepToRemove.id && String(stepToRemove.id).startsWith('new-');

        // Only confirm for existing steps that already exist in DB
        if (!isNew && !confirm('Permanently remove this existing step from the question?')) {
            return;
        }

        if (stepToRemove.id && !isNew) {
            setDeletedStepIds([...deletedStepIds, stepToRemove.id]);
        }

        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleDragStart = (index) => {
        setDraggedStep(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedStep === null || draggedStep === index) return;

        const newSteps = [...steps];
        const draggedItem = newSteps[draggedStep];
        newSteps.splice(draggedStep, 1);
        newSteps.splice(index, 0, draggedItem);

        setSteps(newSteps);
        setDraggedStep(index);
    };

    const handleDragEnd = () => {
        setDraggedStep(null);
    };

    const handleMultiImageUpload = async (stepIndex, files) => {
        const fileArray = Array.from(files);
        for (const file of fileArray) {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            try {
                const res = await fetch(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formDataUpload
                });

                if (res.ok) {
                    const data = await res.json();
                    setSteps(prev => {
                        const newSteps = [...prev];
                        const currentImages = newSteps[stepIndex].images || [];
                        newSteps[stepIndex] = {
                            ...newSteps[stepIndex],
                            images: [...currentImages, data.url],
                            image_url: currentImages.length === 0 ? data.url : newSteps[stepIndex].image_url
                        };
                        return newSteps;
                    });
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const removeImage = (stepIndex, imgIndex) => {
        setSteps(prev => {
            const newSteps = [...prev];
            const newImages = [...(newSteps[stepIndex].images || [])];
            newImages.splice(imgIndex, 1);
            newSteps[stepIndex] = {
                ...newSteps[stepIndex],
                images: newImages,
                image_url: newImages[0] || ''
            };
            return newSteps;
        });
    };

    const handleImageDragStart = (e, stepIndex, imgIndex) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ stepIndex, imgIndex }));
    };

    const handleImageDragOver = (e) => {
        e.preventDefault();
    };

    const handleImageDrop = (e, stepIndex, dropImgIndex) => {
        e.preventDefault();
        try {
            const { stepIndex: srcStepIdx, imgIndex: srcImgIdx } = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (srcStepIdx !== stepIndex) return;

            setSteps(prev => {
                const newSteps = [...prev];
                const imgs = [...(newSteps[stepIndex].images || [])];
                const [moved] = imgs.splice(srcImgIdx, 1);
                imgs.splice(dropImgIndex, 0, moved);
                newSteps[stepIndex] = { ...newSteps[stepIndex], images: imgs, image_url: imgs[0] || '' };
                return newSteps;
            });
        } catch (err) {
            // ignore
        }
    };

    const handleSubmit = async (saveStatus) => {
        if (!formData.title || !formData.category_id) {
            alert('Please fill in required fields');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                status: saveStatus,
                steps: steps.map((step, index) => ({
                    ...step,
                    step_order: index + 1
                }))
            };

            let res;
            if (isEditing) {
                // Update question
                res = await fetch(`${API_BASE_URL}/questions/${id}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload)
                });

                // Update steps separately
                if (res.ok) {
                    // 1. Delete steps that were removed
                    for (const stepId of deletedStepIds) {
                        try {
                            await fetch(`${API_BASE_URL}/steps/${stepId}`, {
                                method: 'DELETE',
                                headers: getAuthHeaders()
                            });
                        } catch (err) {
                            console.error(`Failed to delete step ${stepId}:`, err);
                        }
                    }

                    // 2. Update existing and create new steps
                    const finalStepIds = [];
                    for (let i = 0; i < steps.length; i++) {
                        const step = steps[i];
                        try {
                            if (step.id && !String(step.id).startsWith('new-')) {
                                // Update existing step
                                await fetch(`${API_BASE_URL}/steps/${step.id}`, {
                                    method: 'PUT',
                                    headers: getAuthHeaders(),
                                    body: JSON.stringify(step)
                                });
                                finalStepIds.push(step.id);
                            } else {
                                // Add new step
                                const addRes = await fetch(`${API_BASE_URL}/questions/${id}/steps`, {
                                    method: 'POST',
                                    headers: getAuthHeaders(),
                                    body: JSON.stringify(step)
                                });
                                if (addRes.ok) {
                                    const newStep = await addRes.json();
                                    finalStepIds.push(newStep.id);
                                }
                            }
                        } catch (err) {
                            console.error('Failed to update/create step:', err);
                        }
                    }

                    // 3. Final Reorder to match UI exactly
                    if (finalStepIds.length > 0) {
                        try {
                            await fetch(`${API_BASE_URL}/questions/${id}/steps/reorder`, {
                                method: 'PUT',
                                headers: getAuthHeaders(),
                                body: JSON.stringify({ stepIds: finalStepIds })
                            });
                        } catch (err) {
                            console.error('Failed to reorder steps:', err);
                        }
                    }
                }
            } else {
                // Create new question with steps
                res = await fetch(`${API_BASE_URL}/questions`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                const saved = await res.json();
                if (isEditing) {
                    // Stay on the same page, just re-fetch fresh data
                    setDeletedStepIds([]);
                    fetchQuestion();
                    alert('Saved successfully!');
                } else {
                    // For new questions, navigate to edit the newly created one
                    navigate(`/admin/questions/${saved.id}`);
                }
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving question:', error);
            alert('Failed to save question');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="admin-loading-page">Loading...</div>;
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>SUPERPOS</h2>
                    <span>Admin Panel</span>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className="admin-nav-item">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/categories" className="admin-nav-item">
                        <FolderOpen size={20} />
                        <span>Categories</span>
                    </Link>
                    <Link to="/admin/questions" className="admin-nav-item active">
                        <HelpCircle size={20} />
                        <span>Questions</span>
                    </Link>
                    <Link to="/admin/analytics" className="admin-nav-item">
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </Link>
                    <Link to="/admin/users" className="admin-nav-item">
                        <Users size={20} />
                        <span>Users</span>
                    </Link>
                    <Link to="/admin/tickets" className="admin-nav-item">
                        <MessageCircle size={20} />
                        <span>Tickets</span>
                    </Link>
                    <Link to="/admin/support-settings" className="admin-nav-item">
                        <Settings size={20} />
                        <span>Support Widget</span>
                    </Link>
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/" className="admin-nav-item">
                        <FileText size={20} />
                        <span>View Site</span>
                    </Link>
                    <button onClick={logout} className="admin-nav-item admin-logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <div className="admin-header">
                    <div className="admin-header-back">
                        <Link to={returnCategory ? `/admin/questions?category=${returnCategory}` : '/admin/questions'} className="admin-back-btn">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1>{isEditing ? 'Edit Question' : 'New Question'}</h1>
                    </div>
                    <div className="admin-header-actions">
                        <button
                            onClick={() => handleSubmit('draft')}
                            className="admin-btn admin-btn-secondary"
                            disabled={saving}
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={() => handleSubmit('published')}
                            className="admin-btn admin-btn-primary"
                            disabled={saving}
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Publish'}
                        </button>
                    </div>
                </div>

                <div className="admin-editor-grid">
                    {/* Main Content */}
                    <div className="admin-editor-main">
                        <div className="admin-card">
                            <h3>Question Details</h3>

                            <div className="admin-form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter question title"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Short Description</label>
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(html) => setFormData({ ...formData, description: html })}
                                    placeholder="Brief description of the question"
                                />
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3>Answer Steps</h3>
                            </div>

                            <div className="admin-steps-list">
                                {steps.length === 0 ? (
                                    <div className="admin-empty-steps">
                                        <p>No blocks added yet. Use the buttons below to add a Section Title or a Step.</p>
                                    </div>
                                ) : (
                                    steps.map((step, index) => (
                                        <div
                                            key={step.id || `temp-${index}`}
                                            className={`admin-step-item ${step.block_type === 'section_title' ? 'admin-step-item--title' : ''} ${draggedStep === index ? 'dragging' : ''}`}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <div className="admin-step-header">
                                                <div className="admin-step-drag">
                                                    <GripVertical size={20} />
                                                </div>
                                                <span className="admin-step-number">
                                                    {step.block_type === 'section_title' ? '📌 Section' : `Step ${index + 1}`}
                                                </span>
                                                <button
                                                    onClick={() => removeStep(index)}
                                                    className="admin-step-remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="admin-step-content">
                                                <div className="admin-form-group">
                                                    <label>{step.block_type === 'section_title' ? 'Section Heading' : 'Step Title'}</label>
                                                    <input
                                                        type="text"
                                                        value={step.step_title}
                                                        onChange={(e) => updateStep(index, 'step_title', e.target.value)}
                                                        placeholder={step.block_type === 'section_title' ? 'Enter section heading...' : 'Enter step title'}
                                                        className={step.block_type === 'section_title' ? 'admin-section-title-input' : ''}
                                                    />
                                                </div>

                                                {step.block_type !== 'section_title' && (
                                                    <>
                                                        <div className="admin-form-group">
                                                            <label>Content</label>
                                                            <RichTextEditor
                                                                value={step.content || ''}
                                                                onChange={(html) => updateStep(index, 'content', html)}
                                                                placeholder="Enter step content..."
                                                            />
                                                        </div>

                                                        <div className="admin-step-media">
                                                            <div className="admin-form-group">
                                                                <label><Image size={16} /> Images (drag to reorder)</label>
                                                                <div className="admin-media-input">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*,.gif"
                                                                        multiple
                                                                        onChange={(e) => {
                                                                            if (e.target.files.length > 0) {
                                                                                handleMultiImageUpload(index, e.target.files);
                                                                            }
                                                                        }}
                                                                    />
                                                                    {(step.images && step.images.length > 0) && (
                                                                        <div className="admin-multi-image-grid">
                                                                            {step.images.map((imgUrl, imgIdx) => (
                                                                                <div
                                                                                    key={imgIdx}
                                                                                    className="admin-multi-image-item"
                                                                                    draggable
                                                                                    onDragStart={(e) => handleImageDragStart(e, index, imgIdx)}
                                                                                    onDragOver={handleImageDragOver}
                                                                                    onDrop={(e) => handleImageDrop(e, index, imgIdx)}
                                                                                >
                                                                                    <img src={`http://localhost:3001${imgUrl}`} alt={`Step image ${imgIdx + 1}`} />
                                                                                    <span className="admin-multi-image-order">{imgIdx + 1}</span>
                                                                                    <button
                                                                                        className="admin-multi-image-remove"
                                                                                        onClick={() => removeImage(index, imgIdx)}
                                                                                        type="button"
                                                                                    >
                                                                                        <X size={12} />
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="admin-form-group">
                                                                <label><Video size={16} /> Video URL</label>
                                                                <input
                                                                    type="text"
                                                                    value={step.video_url || ''}
                                                                    onChange={(e) => updateStep(index, 'video_url', e.target.value)}
                                                                    placeholder="YouTube or Vimeo URL"
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* ── Add Block Bar (bottom) ── */}
                            <div className="admin-add-block-bar">
                                <span className="admin-add-block-label">Add block:</span>
                                <button onClick={addSectionTitle} className="admin-btn admin-btn-block-type">
                                    <span>T</span> Section Title
                                </button>
                                <button onClick={addStep} className="admin-btn admin-btn-primary admin-btn-block-type">
                                    <Plus size={16} /> Step
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="admin-editor-sidebar">
                        <div className="admin-card">
                            <h3>Settings</h3>

                            <div className="admin-form-group">
                                <label>Category *</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label>Current Status</label>
                                <div style={{ marginTop: '8px' }}>
                                    <span className={`admin-badge ${formData.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                        {formData.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '8px' }}>
                                    Use the buttons at the top to change status.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuestionEditor;
