import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories - List all categories
router.get('/', (req, res) => {
    try {
        const { status } = req.query;

        let query = 'SELECT * FROM categories';
        const params = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const categories = db.prepare(query).all(...params);

        // Get question count for each category
        const categoriesWithCount = categories.map(cat => {
            const count = db.prepare('SELECT COUNT(*) as count FROM questions WHERE category_id = ?').get(cat.id);
            return { ...cat, questionCount: count.count };
        });

        res.json(categoriesWithCount);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET /api/categories/:id - Get single category
router.get('/:id', (req, res) => {
    try {
        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

// POST /api/categories - Create category (protected)
router.post('/', authenticateToken, (req, res) => {
    try {
        const { name, description, status = 'active' } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const result = db.prepare(
            'INSERT INTO categories (name, description, status) VALUES (?, ?, ?)'
        ).run(name, description || null, status);

        const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// PUT /api/categories/:id - Update category (protected)
router.put('/:id', authenticateToken, (req, res) => {
    try {
        const { name, description, status } = req.body;
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Category not found' });
        }

        db.prepare(
            'UPDATE categories SET name = ?, description = ?, status = ? WHERE id = ?'
        ).run(
            name || existing.name,
            description !== undefined ? description : existing.description,
            status || existing.status,
            id
        );

        const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// DELETE /api/categories/:id - Delete category (protected)
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if category has questions (Removed check to allow CASCADE DELETE)
        // The database schema has ON DELETE CASCADE, so questions will be automatically removed

        db.prepare('DELETE FROM categories WHERE id = ?').run(id);

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
