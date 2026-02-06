import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../database.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/auth/me - Get current user
router.get('/me', (req, res) => {
    // This would normally use authenticateToken middleware
    res.json({ message: 'Auth endpoint working' });
});

export default router;
