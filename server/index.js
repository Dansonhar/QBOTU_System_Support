import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import questionsRoutes from './routes/questions.js';
import stepsRoutes from './routes/steps.js';
import uploadRoutes from './routes/upload.js';
import usersRoutes from './routes/users.js';

// Initialize database (this runs schema creation)
import './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api', stepsRoutes); // Steps routes are prefixed differently
app.use('/api/upload', uploadRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React App (Production)
// 1. Serve static files from 'dist' directory
app.use('/QBOTU_System_Support_Web', express.static(path.join(__dirname, '../dist')));

// 2. Handle SPA routing - return index.html for all non-API routes matching the base path
// 2. Handle SPA routing - return index.html for all non-API routes matching the base path
// Using Regex to avoid Express 5 string path syntax issues
app.get(/\/QBOTU_System_Support_Web(\/.*)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Also handle the exact base path
app.get('/QBOTU_System_Support_Web', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Redirect root to the app base path (optional, for convenience)
app.get('/', (req, res) => {
    res.redirect('/QBOTU_System_Support_Web/');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 FAQ Backend Server running on http://localhost:${PORT}`);
    console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
