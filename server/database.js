import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'faq.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Categories table
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Questions table
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  -- Question steps table
  CREATE TABLE IF NOT EXISTS question_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    step_order INTEGER NOT NULL,
    step_title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    video_url TEXT,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
  );

  -- Admin users table
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK(role IN ('admin', 'staff')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add role column if it doesn't exist (migration for existing databases)
try {
  db.exec('ALTER TABLE admin_users ADD COLUMN role TEXT DEFAULT "staff" CHECK(role IN ("admin", "staff"))');
} catch (e) {
  // Column already exists
}
try {
  db.exec('ALTER TABLE admin_users ADD COLUMN status TEXT DEFAULT "active" CHECK(status IN ("active", "inactive"))');
} catch (e) {
  // Column already exists
}

// Seed default admin user if not exists
const existingAdmin = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!existingAdmin) {
  const passwordHash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash, role, status) VALUES (?, ?, ?, ?)').run('admin', passwordHash, 'admin', 'active');
  console.log('Default admin user created: admin / admin123');
} else {
  // Update existing admin to have admin role if not set
  db.prepare("UPDATE admin_users SET role = ?, status = ? WHERE username = ? AND (role IS NULL OR role != 'admin')").run('admin', 'active', 'admin');
}

export default db;
