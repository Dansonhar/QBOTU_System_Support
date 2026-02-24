import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper function to generate slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now().toString(36);
};

// GET /api/questions - List questions with pagination, search, filter
router.get('/', (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category_id,
            status
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = `
      SELECT q.*, c.name as category_name 
      FROM questions q 
      LEFT JOIN categories c ON q.category_id = c.id 
      WHERE 1=1
    `;
        let countQuery = 'SELECT COUNT(*) as total FROM questions WHERE 1=1';
        const params = [];
        const countParams = [];

        if (search) {
            query += ' AND q.title LIKE ?';
            countQuery += ' AND title LIKE ?';
            params.push(`%${search}%`);
            countParams.push(`%${search}%`);
        }

        if (category_id) {
            query += ' AND q.category_id = ?';
            countQuery += ' AND category_id = ?';
            params.push(category_id);
            countParams.push(category_id);
        }

        if (status) {
            query += ' AND q.status = ?';
            countQuery += ' AND status = ?';
            params.push(status);
            countParams.push(status);

            // If fetching published questions (public view), also ensure category is active
            if (status === 'published') {
                query += " AND c.status = 'active'";
                countQuery += " AND category_id IN (SELECT id FROM categories WHERE status = 'active')";
            }
        }

        query += ' ORDER BY q.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const questions = db.prepare(query).all(...params);
        const totalResult = db.prepare(countQuery).get(...countParams);

        // Get step count for each question
        const questionsWithSteps = questions.map(q => {
            const stepCount = db.prepare('SELECT COUNT(*) as count FROM question_steps WHERE question_id = ?').get(q.id);
            return { ...q, stepCount: stepCount.count };
        });

        res.json({
            questions: questionsWithSteps,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalResult.total,
                totalPages: Math.ceil(totalResult.total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// GET /api/questions/:id - Get single question with steps
router.get('/:id', (req, res) => {
    try {
        const question = db.prepare(`
      SELECT q.*, c.name as category_name, c.status as category_status
      FROM questions q 
      LEFT JOIN categories c ON q.category_id = c.id 
      WHERE q.id = ?
    `).get(req.params.id);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const stepsRows = db.prepare(
            'SELECT * FROM question_steps WHERE question_id = ? ORDER BY step_order ASC'
        ).all(req.params.id);

        const steps = stepsRows.map(step => {
            const images = db.prepare('SELECT image_url FROM step_images WHERE step_id = ? ORDER BY image_order').all(step.id);
            return {
                ...step,
                images: images.map(img => img.image_url)
            };
        });

        res.json({ ...question, steps });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
});

// GET /api/questions/slug/:slug - Get question by slug (for public pages)
router.get('/slug/:slug', (req, res) => {
    try {
        const question = db.prepare(`
      SELECT q.*, c.name as category_name 
      FROM questions q 
      LEFT JOIN categories c ON q.category_id = c.id 
      WHERE q.slug = ? AND q.status = 'published'
    `).get(req.params.slug);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const stepsRows = db.prepare(
            'SELECT * FROM question_steps WHERE question_id = ? ORDER BY step_order ASC'
        ).all(question.id);

        const steps = stepsRows.map(step => {
            const images = db.prepare('SELECT image_url FROM step_images WHERE step_id = ? ORDER BY image_order').all(step.id);
            return {
                ...step,
                images: images.map(img => img.image_url)
            };
        });

        res.json({ ...question, steps });
    } catch (error) {
        console.error('Error fetching question by slug:', error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
});

// POST /api/questions - Create question (protected)
router.post('/', authenticateToken, (req, res) => {
    try {
        const { category_id, title, description, status = 'draft', steps = [] } = req.body;

        if (!category_id || !title) {
            return res.status(400).json({ error: 'Category and title are required' });
        }

        // Check category exists
        const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
        if (!category) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        const slug = generateSlug(title);

        const result = db.prepare(
            'INSERT INTO questions (category_id, title, slug, description, status) VALUES (?, ?, ?, ?, ?)'
        ).run(category_id, title, slug, description || null, status);

        const questionId = result.lastInsertRowid;

        // Insert steps if provided
        if (steps.length > 0) {
            const insertStep = db.prepare(
                'INSERT INTO question_steps (question_id, step_order, step_title, content, image_url, video_url, block_type) VALUES (?, ?, ?, ?, ?, ?, ?)'
            );
            const insertStepImage = db.prepare(
                'INSERT INTO step_images (step_id, image_url, image_order) VALUES (?, ?, ?)'
            );

            steps.forEach((step, index) => {
                const stepResult = insertStep.run(
                    questionId,
                    index + 1,
                    step.step_title || (step.block_type === 'section_title' ? 'New Section' : `Step ${index + 1}`),
                    step.content || null,
                    step.image_url || null,
                    step.video_url || null,
                    step.block_type || 'step'
                );

                const stepId = stepResult.lastInsertRowid;

                if (step.images && Array.isArray(step.images)) {
                    step.images.forEach((img, imgIdx) => {
                        insertStepImage.run(stepId, img, imgIdx);
                    });
                } else if (step.image_url) {
                    insertStepImage.run(stepId, step.image_url, 0);
                }
            });
        }

        const newQuestion = db.prepare('SELECT * FROM questions WHERE id = ?').get(questionId);
        const newStepsRows = db.prepare('SELECT * FROM question_steps WHERE question_id = ? ORDER BY step_order').all(questionId);

        const newSteps = newStepsRows.map(step => {
            const images = db.prepare('SELECT image_url FROM step_images WHERE step_id = ? ORDER BY image_order').all(step.id);
            return {
                ...step,
                images: images.map(img => img.image_url)
            };
        });

        res.status(201).json({ ...newQuestion, steps: newSteps });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
});

// PUT /api/questions/:id - Update question (protected)
router.put('/:id', authenticateToken, (req, res) => {
    try {
        const { category_id, title, description, status } = req.body;
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Question not found' });
        }

        db.prepare(`
      UPDATE questions 
      SET category_id = ?, title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(
            category_id || existing.category_id,
            title || existing.title,
            description !== undefined ? description : existing.description,
            status || existing.status,
            id
        );

        const updated = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
        const stepsRows = db.prepare('SELECT * FROM question_steps WHERE question_id = ? ORDER BY step_order').all(id);

        const steps = stepsRows.map(step => {
            const images = db.prepare('SELECT image_url FROM step_images WHERE step_id = ? ORDER BY image_order').all(step.id);
            return {
                ...step,
                images: images.map(img => img.image_url)
            };
        });

        res.json({ ...updated, steps });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Failed to update question' });
    }
});

// DELETE /api/questions/:id - Delete question (protected)
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Steps will be deleted automatically due to CASCADE
        db.prepare('DELETE FROM questions WHERE id = ?').run(id);

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

export default router;
