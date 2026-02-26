import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Helper to format ticket number
const generateTicketNumber = (id) => {
    const year = new Date().getFullYear();
    const paddedId = String(id).padStart(6, '0');
    return `SPT-${year}-${paddedId}`;
};

// ══════════════════════════════════════════
// AI AUTO-REPLY — searches FAQ for answers
// ══════════════════════════════════════════
const generateAIReply = (userMessage, topic) => {
    try {
        // Search the questions database for relevant answers
        const keywords = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);

        let bestMatch = null;
        let bestScore = 0;

        if (keywords.length > 0) {
            const questions = db.prepare(`
                SELECT q.title, q.description, c.name as category_name
                FROM questions q
                LEFT JOIN categories c ON q.category_id = c.id
                WHERE q.status = 'published'
            `).all();

            for (const q of questions) {
                const haystack = `${q.title} ${q.description || ''}`.toLowerCase();
                let score = 0;
                for (const kw of keywords) {
                    if (haystack.includes(kw)) score++;
                }
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = q;
                }
            }
        }

        if (bestMatch && bestScore >= 2) {
            return `Thanks for reaching out! 🤖\n\nBased on your question, I found a relevant article that might help:\n\n📄 **${bestMatch.title}**\n${bestMatch.description ? `${bestMatch.description}\n` : ''}\nYou can find this under the "${bestMatch.category_name}" section in our Help Center.\n\nIf this doesn't resolve your issue, just type **"connect to agent"** and I'll connect you with a real person! 🙋`;
        }

        // Topic-based fallback responses
        const topicResponses = {
            'Technical Support': `Thanks for contacting us! 🤖\n\nI understand you're having a technical issue. Here are some quick things to try:\n\n1. Clear your browser cache and cookies\n2. Try using a different browser\n3. Check your internet connection\n\nIf the issue persists, type **"connect to agent"** and a support specialist will assist you shortly!`,
            'Billing': `Thanks for reaching out about billing! 🤖\n\nFor billing inquiries, I can help with general questions. For specific account changes, a real agent can assist you better.\n\nType **"connect to agent"** to speak with our billing team!`,
            'Bug Report': `Thank you for reporting this bug! 🤖\n\nOur team will review this report. To help us investigate faster:\n\n1. What steps led to the issue?\n2. What browser/device are you using?\n3. Do you see any error messages?\n\nA support agent will follow up soon, or type **"connect to agent"** for immediate help!`,
            'Feature Request': `Thanks for your feature suggestion! 🤖\n\nWe love hearing from our users! Your feedback has been recorded and will be reviewed by our product team.\n\nIs there anything else I can help with? Type **"connect to agent"** if you'd like to discuss this further!`,
        };

        if (topicResponses[topic]) return topicResponses[topic];

        return `Thanks for your message! 🤖\n\nI'm the SUPERPOS AI Assistant. I've received your inquiry and I'm looking into it.\n\nIn the meantime, you can:\n• Browse our Help Center for quick answers\n• Type **"connect to agent"** to chat with a real person\n\nA support agent will be notified of your message!`;
    } catch (err) {
        console.error('AI reply generation error:', err);
        return `Thanks for reaching out! 🤖\n\nYour message has been received. A support agent will reply shortly.\n\nType **"connect to agent"** if you need immediate assistance!`;
    }
};

// ══════════════════════════════════════════
// PUBLIC ENDPOINTS
// ══════════════════════════════════════════

// POST /api/tickets — Create ticket + AI auto-reply (Public)
router.post('/', (req, res) => {
    try {
        const { name, email, topic, message } = req.body;

        if (!name || !email || !topic || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const tempTicketNum = `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const insert = db.prepare(`
            INSERT INTO tickets (ticket_number, name, email, topic, message)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = insert.run(tempTicketNum, name, email, topic, message);
        const newId = result.lastInsertRowid;
        const finalTicketNum = generateTicketNumber(newId);
        db.prepare('UPDATE tickets SET ticket_number = ? WHERE id = ?').run(finalTicketNum, newId);

        // Add the user's original message as the first reply in the thread
        db.prepare(`
            INSERT INTO ticket_replies (ticket_id, sender_type, message, is_internal)
            VALUES (?, 'user', ?, 0)
        `).run(newId, message);

        // Generate and add AI auto-reply
        const aiReply = generateAIReply(message, topic);
        db.prepare(`
            INSERT INTO ticket_replies (ticket_id, sender_type, message, is_internal)
            VALUES (?, 'bot', ?, 0)
        `).run(newId, aiReply);

        const newTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(newId);
        const replies = db.prepare('SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY created_at ASC').all(newId);

        res.status(201).json({ ...newTicket, replies });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

// POST /api/tickets/user-reply — User sends a message in existing chat (Public)
router.post('/user-reply', (req, res) => {
    try {
        const { ticket_number, email, message } = req.body;
        if (!ticket_number || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_number = ? AND email = ?').get(ticket_number, email);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        // Add user reply
        db.prepare(`
            INSERT INTO ticket_replies (ticket_id, sender_type, message, is_internal)
            VALUES (?, 'user', ?, 0)
        `).run(ticket.id, message);

        // Check if user wants to connect to a real agent
        const lowerMsg = message.toLowerCase();
        const wantsAgent = lowerMsg.includes('connect to agent') || lowerMsg.includes('real agent') ||
            lowerMsg.includes('talk to human') || lowerMsg.includes('real person') ||
            lowerMsg.includes('speak to agent') || lowerMsg.includes('live agent');

        if (wantsAgent && ticket.status !== 'In Progress' && ticket.status !== 'Open') {
            // Escalate ticket
            db.prepare('UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('Open', ticket.id);

            db.prepare(`
                INSERT INTO ticket_replies (ticket_id, sender_type, message, is_internal)
                VALUES (?, 'bot', ?, 0)
            `).run(ticket.id, `Connecting you to a real agent now! 🙋‍♂️\n\nA support agent has been notified and will join this conversation shortly. Please hold on — average response time is under 5 minutes.\n\nYour ticket has been escalated to priority support.`);
        } else if (ticket.status === 'Waiting for Customer') {
            // If admin was waiting for customer, change back to In Progress
            db.prepare('UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('In Progress', ticket.id);
        } else {
            db.prepare('UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(ticket.id);
        }

        const replies = db.prepare('SELECT * FROM ticket_replies WHERE ticket_id = ? AND is_internal = 0 ORDER BY created_at ASC').all(ticket.id);
        const updated = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticket.id);

        res.json({ ...updated, replies });
    } catch (error) {
        console.error('Error adding user reply:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// GET /api/tickets/messages — Poll for messages (Public, auth by ticket_number + email)
router.get('/messages', (req, res) => {
    try {
        const { ticket_number, email } = req.query;
        if (!ticket_number || !email) {
            return res.status(400).json({ error: 'Ticket number and email required' });
        }

        const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_number = ? AND email = ?').get(ticket_number, email);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        const replies = db.prepare(`
            SELECT id, sender_type, message, created_at 
            FROM ticket_replies 
            WHERE ticket_id = ? AND is_internal = 0
            ORDER BY created_at ASC
        `).all(ticket.id);

        res.json({
            ticket_number: ticket.ticket_number,
            status: ticket.status,
            replies
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed' });
    }
});

// GET /api/tickets/track — Track ticket (Public)
router.get('/track', (req, res) => {
    try {
        const { ticket_number, email } = req.query;
        if (!ticket_number || !email) {
            return res.status(400).json({ error: 'Ticket number and email are required' });
        }
        const ticket = db.prepare(`
            SELECT id, ticket_number, topic, status, updated_at 
            FROM tickets WHERE ticket_number = ? AND email = ?
        `).get(ticket_number, email);

        if (!ticket) return res.status(404).json({ error: 'Ticket not found. Please check your Ticket ID and email.' });

        const replies = db.prepare(`
            SELECT message, sender_type, created_at 
            FROM ticket_replies WHERE ticket_id = ? AND is_internal = 0
            ORDER BY created_at ASC
        `).all(ticket.id);

        res.json({ ...ticket, replies });
    } catch (error) {
        res.status(500).json({ error: 'Failed to track ticket' });
    }
});

// ══════════════════════════════════════════
// ADMIN ENDPOINTS (Protected)
// ══════════════════════════════════════════

// GET /api/tickets — List tickets
router.get('/', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    try {
        const { page = 1, limit = 20, status, priority, assigned_to, search, unread } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = `SELECT t.*, u.username as assigned_username FROM tickets t LEFT JOIN admin_users u ON t.assigned_to = u.id WHERE 1=1`;
        let countQuery = 'SELECT COUNT(*) as total FROM tickets WHERE 1=1';
        const params = [];
        const countParams = [];

        if (status) { query += ' AND t.status = ?'; countQuery += ' AND status = ?'; params.push(status); countParams.push(status); }
        if (priority) { query += ' AND t.priority = ?'; countQuery += ' AND priority = ?'; params.push(priority); countParams.push(priority); }
        if (assigned_to) { query += ' AND t.assigned_to = ?'; countQuery += ' AND assigned_to = ?'; params.push(assigned_to); countParams.push(assigned_to); }
        if (search) {
            query += ' AND (t.ticket_number LIKE ? OR t.email LIKE ? OR t.name LIKE ?)';
            countQuery += ' AND (ticket_number LIKE ? OR email LIKE ? OR name LIKE ?)';
            const s = `%${search}%`; params.push(s, s, s); countParams.push(s, s, s);
        }
        if (unread === '1') {
            query += ' AND t.is_unread = 1';
            countQuery += ' AND is_unread = 1';
        }

        query += ' ORDER BY t.is_unread DESC, t.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const tickets = db.prepare(query).all(...params);
        const totalResult = db.prepare(countQuery).get(...countParams);

        res.json({
            tickets,
            pagination: { page: parseInt(page), limit: parseInt(limit), total: totalResult.total, totalPages: Math.ceil(totalResult.total / parseInt(limit)) }
        });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Failed' });
    }
});

// GET /api/tickets/stats
router.get('/stats', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    try {
        const pendingCount = db.prepare("SELECT COUNT(*) as count FROM tickets WHERE is_unread = 1").get().count;
        res.json({ pendingCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// GET /api/tickets/:id — Ticket detail
router.get('/:id', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    try {
        const ticket = db.prepare(`
            SELECT t.*, u.username as assigned_username 
            FROM tickets t LEFT JOIN admin_users u ON t.assigned_to = u.id WHERE t.id = ?
        `).get(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        // Mark as read when opened
        if (ticket.is_unread === 1) {
            db.prepare('UPDATE tickets SET is_unread = 0 WHERE id = ?').run(ticket.id);
            ticket.is_unread = 0;
        }

        const replies = db.prepare('SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY created_at ASC').all(ticket.id);
        res.json({ ...ticket, replies });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// PUT /api/tickets/:id — Update ticket
router.put('/:id', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    try {
        const { status, priority, assigned_to } = req.body;
        const ticketId = req.params.id;
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        db.prepare(`
            UPDATE tickets SET status = COALESCE(?, status), priority = COALESCE(?, priority), 
            assigned_to = COALESCE(?, assigned_to), updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).run(status, priority, assigned_to, ticketId);

        const updated = db.prepare(`
            SELECT t.*, u.username as assigned_username FROM tickets t LEFT JOIN admin_users u ON t.assigned_to = u.id WHERE t.id = ?
        `).get(ticketId);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/tickets/:id/replies — Admin reply
router.post('/:id/replies', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    try {
        const { message, is_internal } = req.body;
        const ticketId = req.params.id;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        db.prepare(`
            INSERT INTO ticket_replies (ticket_id, sender_type, message, is_internal)
            VALUES (?, 'admin', ?, ?)
        `).run(ticketId, message, is_internal ? 1 : 0);

        // Auto-status transitions
        let newStatus = ticket.status;
        if (!is_internal) {
            if (ticket.status === 'Pending') newStatus = 'Open';
            if (ticket.status === 'Open' || ticket.status === 'Waiting for Customer') newStatus = 'In Progress';
        }
        db.prepare('UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, ticketId);

        const updatedTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
        const replies = db.prepare('SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY created_at ASC').all(ticketId);
        res.json({ ...updatedTicket, replies });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// DELETE /api/tickets/:id — Delete a ticket
router.delete('/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
    try {
        const ticketId = req.params.id;
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        db.prepare('DELETE FROM ticket_replies WHERE ticket_id = ?').run(ticketId);
        db.prepare('DELETE FROM tickets WHERE id = ?').run(ticketId);

        res.json({ success: true, message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

export default router;
