import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import {
    LayoutDashboard, FolderOpen, HelpCircle, LogOut, Plus,
    Save, ArrowLeft, Trash2, FileText, GripVertical, Image, Video, X, Users
} from 'lucide-react';

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

            setSteps(data.steps || []);
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
            video_url: ''
        }]);
    };

    const updateStep = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
    };

    const removeStep = (index) => {
        if (!confirm('Remove this step?')) return;

        const stepToRemove = steps[index];
        if (stepToRemove.id && !String(stepToRemove.id).startsWith('new-')) {
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

    const handleImageUpload = async (index, file) => {
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
                updateStep(index, 'image_url', data.url);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
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
                // Navigate back
                const categoryToReturn = formData.category_id || returnCategory;
                navigate(categoryToReturn ? `/admin/questions?category=${categoryToReturn}` : '/admin/questions');
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
                    <Link to="/admin/users" className="admin-nav-item">
                        <Users size={20} />
                        <span>Users</span>
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
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the question"
                                    rows="2"
                                />
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3>Answer Steps</h3>
                                <button onClick={addStep} className="admin-btn admin-btn-secondary">
                                    <Plus size={18} />
                                    Add Step
                                </button>
                            </div>

                            <div className="admin-steps-list">
                                {steps.length === 0 ? (
                                    <div className="admin-empty-steps">
                                        <p>No steps added yet. Click "Add Step" to begin.</p>
                                    </div>
                                ) : (
                                    steps.map((step, index) => (
                                        <div
                                            key={step.id || index}
                                            className={`admin-step-item ${draggedStep === index ? 'dragging' : ''}`}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <div className="admin-step-header">
                                                <div className="admin-step-drag">
                                                    <GripVertical size={20} />
                                                </div>
                                                <span className="admin-step-number">Step {index + 1}</span>
                                                <button
                                                    onClick={() => removeStep(index)}
                                                    className="admin-step-remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="admin-step-content">
                                                <div className="admin-form-group">
                                                    <label>Step Title</label>
                                                    <input
                                                        type="text"
                                                        value={step.step_title}
                                                        onChange={(e) => updateStep(index, 'step_title', e.target.value)}
                                                        placeholder="Enter step title"
                                                    />
                                                </div>

                                                <div className="admin-form-group">
                                                    <label>Content</label>
                                                    <textarea
                                                        value={step.content || ''}
                                                        onChange={(e) => updateStep(index, 'content', e.target.value)}
                                                        placeholder="Enter step content (HTML supported)"
                                                        rows="4"
                                                    />
                                                </div>

                                                <div className="admin-step-media">
                                                    <div className="admin-form-group">
                                                        <label><Image size={16} /> Image</label>
                                                        <div className="admin-media-input">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    if (e.target.files[0]) {
                                                                        handleImageUpload(index, e.target.files[0]);
                                                                    }
                                                                }}
                                                            />
                                                            {step.image_url && (
                                                                <div className="admin-media-preview">
                                                                    <img src={`http://localhost:3001${step.image_url}`} alt="Preview" />
                                                                    <button onClick={() => updateStep(index, 'image_url', '')}>
                                                                        <X size={14} />
                                                                    </button>
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
                                            </div>
                                        </div>
                                    ))
                                )}
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
                                <label>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuestionEditor;
