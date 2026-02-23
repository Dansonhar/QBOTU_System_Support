import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'superpos-admin-secret-key-2024';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        // If no role check needed or user role matches, proceed
        if (!roles || roles.length === 0) return next();
        // All authenticated admin users can access for now (admin + staff)
        // Future: check req.user.role against specific roles list
        next();
    };
};

export const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
};

export { JWT_SECRET };
