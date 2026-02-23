import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/analytics/track - Track an event (public)
router.post('/track', (req, res) => {
    try {
        const { event_type, question_id, search_query } = req.body;

        if (!event_type) {
            return res.status(400).json({ error: 'event_type is required' });
        }

        db.prepare(
            'INSERT INTO analytics_events (event_type, question_id, search_query) VALUES (?, ?, ?)'
        ).run(event_type, question_id || null, search_query || null);

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error tracking event:', error);
        res.status(500).json({ error: 'Failed to track event' });
    }
});

// GET /api/analytics/top-articles - Top clicked articles (protected)
router.get('/top-articles', authenticateToken, (req, res) => {
    try {
        const { days = 30, limit = 20 } = req.query;

        const results = db.prepare(`
            SELECT 
                ae.question_id,
                q.title,
                c.name as category_name,
                COUNT(*) as click_count
            FROM analytics_events ae
            LEFT JOIN questions q ON ae.question_id = q.id
            LEFT JOIN categories c ON q.category_id = c.id
            WHERE ae.event_type = 'article_click'
              AND ae.question_id IS NOT NULL
              AND ae.created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY ae.question_id
            ORDER BY click_count DESC
            LIMIT ?
        `).all(parseInt(days), parseInt(limit));

        res.json(results);
    } catch (error) {
        console.error('Error fetching top articles:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// GET /api/analytics/top-searches - Top search queries (protected)
router.get('/top-searches', authenticateToken, (req, res) => {
    try {
        const { days = 30, limit = 20 } = req.query;

        const results = db.prepare(`
            SELECT 
                search_query,
                COUNT(*) as search_count
            FROM analytics_events
            WHERE event_type = 'search'
              AND search_query IS NOT NULL
              AND search_query != ''
              AND created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY LOWER(search_query)
            ORDER BY search_count DESC
            LIMIT ?
        `).all(parseInt(days), parseInt(limit));

        res.json(results);
    } catch (error) {
        console.error('Error fetching top searches:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// GET /api/analytics/summary - Overview stats (protected)
router.get('/summary', authenticateToken, (req, res) => {
    try {
        const { days = 30 } = req.query;

        const totalClicks = db.prepare(`
            SELECT COUNT(*) as count FROM analytics_events 
            WHERE event_type = 'article_click' AND created_at >= datetime('now', '-' || ? || ' days')
        `).get(parseInt(days));

        const totalSearches = db.prepare(`
            SELECT COUNT(*) as count FROM analytics_events 
            WHERE event_type = 'search' AND created_at >= datetime('now', '-' || ? || ' days')
        `).get(parseInt(days));

        const uniqueArticles = db.prepare(`
            SELECT COUNT(DISTINCT question_id) as count FROM analytics_events 
            WHERE event_type = 'article_click' AND created_at >= datetime('now', '-' || ? || ' days')
        `).get(parseInt(days));

        const uniqueSearches = db.prepare(`
            SELECT COUNT(DISTINCT LOWER(search_query)) as count FROM analytics_events 
            WHERE event_type = 'search' AND search_query IS NOT NULL AND search_query != ''
            AND created_at >= datetime('now', '-' || ? || ' days')
        `).get(parseInt(days));

        res.json({
            totalClicks: totalClicks.count,
            totalSearches: totalSearches.count,
            uniqueArticles: uniqueArticles.count,
            uniqueSearches: uniqueSearches.count
        });
    } catch (error) {
        console.error('Error fetching analytics summary:', error);
        res.status(500).json({ error: 'Failed to fetch analytics summary' });
    }
});

export default router;
