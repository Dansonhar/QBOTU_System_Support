import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/support-settings - Get support settings (public)
router.get('/', (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM support_settings LIMIT 1').get();
        res.json(settings || {
            greeting_text: 'How can we help?',
            button_color: '#F7941D',
            whatsapp_number: '',
            email: '',
            messenger_url: '',
            is_enabled: 1
        });
    } catch (error) {
        console.error('Error fetching support settings:', error);
        res.status(500).json({ error: 'Failed to fetch support settings' });
    }
});

// PUT /api/support-settings - Update support settings (protected)
router.put('/', authenticateToken, (req, res) => {
    try {
        const { greeting_text, button_color, whatsapp_number, email, messenger_url, is_enabled } = req.body;

        const existing = db.prepare('SELECT * FROM support_settings LIMIT 1').get();

        if (existing) {
            db.prepare(`
                UPDATE support_settings 
                SET greeting_text = ?, button_color = ?, whatsapp_number = ?, email = ?, messenger_url = ?, is_enabled = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(
                greeting_text !== undefined ? greeting_text : existing.greeting_text,
                button_color !== undefined ? button_color : existing.button_color,
                whatsapp_number !== undefined ? whatsapp_number : existing.whatsapp_number,
                email !== undefined ? email : existing.email,
                messenger_url !== undefined ? messenger_url : existing.messenger_url,
                is_enabled !== undefined ? is_enabled : existing.is_enabled,
                existing.id
            );
        } else {
            db.prepare(`
                INSERT INTO support_settings (greeting_text, button_color, whatsapp_number, email, messenger_url, is_enabled)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(
                greeting_text || 'How can we help?',
                button_color || '#F7941D',
                whatsapp_number || '',
                email || '',
                messenger_url || '',
                is_enabled !== undefined ? is_enabled : 1
            );
        }

        const updated = db.prepare('SELECT * FROM support_settings LIMIT 1').get();
        res.json(updated);
    } catch (error) {
        console.error('Error updating support settings:', error);
        res.status(500).json({ error: 'Failed to update support settings' });
    }
});

export default router;
