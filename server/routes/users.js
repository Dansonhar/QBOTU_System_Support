import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users - List all users (protected)
router.get('/', authenticateToken, (req, res) => {
    try {
        const users = db.prepare(`
            SELECT id, username, role, status, created_at 
            FROM admin_users 
            ORDER BY created_at DESC
        `).all();

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /api/users/:id - Get single user (protected)
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const user = db.prepare(`
            SELECT id, username, role, status, created_at 
            FROM admin_users 
            WHERE id = ?
        `).get(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// POST /api/users - Create new user (protected)
router.post('/', authenticateToken, (req, res) => {
    try {
        const { username, password, role = 'staff', status = 'active' } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if username already exists
        const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(username);
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        const result = db.prepare(
            'INSERT INTO admin_users (username, password_hash, role, status) VALUES (?, ?, ?, ?)'
        ).run(username, passwordHash, role, status);

        const newUser = db.prepare('SELECT id, username, role, status, created_at FROM admin_users WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// PUT /api/users/:id - Update user (protected)
router.put('/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, role, status } = req.body;

        const existing = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check username uniqueness if changing username
        if (username && username !== existing.username) {
            const duplicate = db.prepare('SELECT id FROM admin_users WHERE username = ? AND id != ?').get(username, id);
            if (duplicate) {
                return res.status(400).json({ error: 'Username already exists' });
            }
        }

        // Build update query
        let updateQuery = 'UPDATE admin_users SET ';
        const params = [];

        if (username) {
            updateQuery += 'username = ?, ';
            params.push(username);
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }
            updateQuery += 'password_hash = ?, ';
            params.push(bcrypt.hashSync(password, 10));
        }

        if (role) {
            updateQuery += 'role = ?, ';
            params.push(role);
        }

        if (status) {
            updateQuery += 'status = ?, ';
            params.push(status);
        }

        // Remove trailing comma and add WHERE clause
        updateQuery = updateQuery.slice(0, -2) + ' WHERE id = ?';
        params.push(id);

        db.prepare(updateQuery).run(...params);

        const updated = db.prepare('SELECT id, username, role, status, created_at FROM admin_users WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE /api/users/:id - Delete user (protected)
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deleting the last admin
        if (existing.role === 'admin') {
            const adminCount = db.prepare("SELECT COUNT(*) as count FROM admin_users WHERE role = 'admin'").get();
            if (adminCount.count <= 1) {
                return res.status(400).json({ error: 'Cannot delete the last admin user' });
            }
        }

        db.prepare('DELETE FROM admin_users WHERE id = ?').run(id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
