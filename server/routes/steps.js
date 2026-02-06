import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/questions/:questionId/steps - Add step to question
router.post('/questions/:questionId/steps', authenticateToken, (req, res) => {
    try {
        const { questionId } = req.params;
        const { step_title, content, image_url, video_url } = req.body;

        // Check question exists
        const question = db.prepare('SELECT id FROM questions WHERE id = ?').get(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Get next step order
        const maxOrder = db.prepare(
            'SELECT MAX(step_order) as max FROM question_steps WHERE question_id = ?'
        ).get(questionId);
        const nextOrder = (maxOrder.max || 0) + 1;

        const result = db.prepare(
            'INSERT INTO question_steps (question_id, step_order, step_title, content, image_url, video_url) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(questionId, nextOrder, step_title || `Step ${nextOrder}`, content || null, image_url || null, video_url || null);

        const newStep = db.prepare('SELECT * FROM question_steps WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(newStep);
    } catch (error) {
        console.error('Error adding step:', error);
        res.status(500).json({ error: 'Failed to add step' });
    }
});

// PUT /api/steps/:id - Update step
router.put('/steps/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const { step_title, content, image_url, video_url } = req.body;

        const existing = db.prepare('SELECT * FROM question_steps WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Step not found' });
        }

        db.prepare(`
      UPDATE question_steps 
      SET step_title = ?, content = ?, image_url = ?, video_url = ?
      WHERE id = ?
    `).run(
            step_title || existing.step_title,
            content !== undefined ? content : existing.content,
            image_url !== undefined ? image_url : existing.image_url,
            video_url !== undefined ? video_url : existing.video_url,
            id
        );

        const updated = db.prepare('SELECT * FROM question_steps WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating step:', error);
        res.status(500).json({ error: 'Failed to update step' });
    }
});

// DELETE /api/steps/:id - Delete step
router.delete('/steps/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM question_steps WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Step not found' });
        }

        db.prepare('DELETE FROM question_steps WHERE id = ?').run(id);

        // Reorder remaining steps
        const remainingSteps = db.prepare(
            'SELECT id FROM question_steps WHERE question_id = ? ORDER BY step_order'
        ).all(existing.question_id);

        remainingSteps.forEach((step, index) => {
            db.prepare('UPDATE question_steps SET step_order = ? WHERE id = ?').run(index + 1, step.id);
        });

        res.json({ message: 'Step deleted successfully' });
    } catch (error) {
        console.error('Error deleting step:', error);
        res.status(500).json({ error: 'Failed to delete step' });
    }
});

// PUT /api/questions/:questionId/steps/reorder - Reorder steps
router.put('/questions/:questionId/steps/reorder', authenticateToken, (req, res) => {
    try {
        const { questionId } = req.params;
        const { stepIds } = req.body; // Array of step IDs in new order

        if (!Array.isArray(stepIds)) {
            return res.status(400).json({ error: 'stepIds must be an array' });
        }

        // Update each step's order
        stepIds.forEach((stepId, index) => {
            db.prepare('UPDATE question_steps SET step_order = ? WHERE id = ? AND question_id = ?')
                .run(index + 1, stepId, questionId);
        });

        const steps = db.prepare(
            'SELECT * FROM question_steps WHERE question_id = ? ORDER BY step_order'
        ).all(questionId);

        res.json(steps);
    } catch (error) {
        console.error('Error reordering steps:', error);
        res.status(500).json({ error: 'Failed to reorder steps' });
    }
});

export default router;
