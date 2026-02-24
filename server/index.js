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
import analyticsRoutes from './routes/analytics.js';
import supportSettingsRoutes from './routes/supportSettings.js';
import ticketsRoutes from './routes/tickets.js';

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

import fs from 'fs';

// Serve uploaded files
const uploadDir = process.env.RENDER ? '/opt/render/project/src/data/uploads' : path.join(__dirname, '../uploads');
const initialUploadDir = path.join(__dirname, '../uploads');

if (process.env.RENDER) {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    // Copy existing images to persistent disk
    if (fs.existsSync(initialUploadDir)) {
        const files = fs.readdirSync(initialUploadDir);
        files.forEach(file => {
            const destFile = path.join(uploadDir, file);
            if (!fs.existsSync(destFile)) {
                fs.copyFileSync(path.join(initialUploadDir, file), destFile);
                console.log(`Copied initial image to ${destFile}`);
            }
        });
    }
}
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api', stepsRoutes); // Steps routes are prefixed differently
app.use('/api/upload', uploadRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/support-settings', supportSettingsRoutes);
app.use('/api/tickets', ticketsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React App (Production)
// 1. Serve static files from 'dist' directory
app.use('/QBOTU_System_Support_Web', express.static(path.join(__dirname, '../dist')));

// Redirect root to the Vite base path
app.get('/', (req, res) => {
    res.redirect('/QBOTU_System_Support_Web/');
});

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
