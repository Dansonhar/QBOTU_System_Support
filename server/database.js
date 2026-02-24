import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Render, we want to store the DB in a persistent disk mounted at /opt/render/project/src/data
const dataDir = process.env.RENDER ? '/opt/render/project/src/data' : __dirname;
const dbPath = path.join(dataDir, 'faq.db');
const initialDbPath = path.join(__dirname, 'faq.db');

// Ensure the directory exists
if (process.env.RENDER && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// If persistent DB doesn't exist but local/initial one does, copy it over
if (process.env.RENDER && !fs.existsSync(dbPath) && fs.existsSync(initialDbPath)) {
  fs.copyFileSync(initialDbPath, dbPath);
  console.log(`Copied initial database to ${dbPath}`);
}

const db = new Database(dbPath);

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
    block_type TEXT DEFAULT 'step',
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

  -- Analytics events table
  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    question_id INTEGER,
    search_query TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL
  );

  -- Step images table (multiple images per step)
  CREATE TABLE IF NOT EXISTS step_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    step_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    image_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (step_id) REFERENCES question_steps(id) ON DELETE CASCADE
  );

  -- Support settings table
  CREATE TABLE IF NOT EXISTS support_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    greeting_text TEXT DEFAULT 'How can we help?',
    button_color TEXT DEFAULT '#F7941D',
    whatsapp_number TEXT DEFAULT '',
    email TEXT DEFAULT '',
    messenger_url TEXT DEFAULT '',
    is_enabled INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tickets table
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Open', 'In Progress', 'Waiting for Customer', 'Solved', 'Closed')),
    priority TEXT DEFAULT 'Normal' CHECK(priority IN ('Low', 'Normal', 'High', 'Urgent')),
    assigned_to INTEGER,
    source TEXT DEFAULT 'Web Support Form',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL
  );
  
  CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
  CREATE INDEX IF NOT EXISTS idx_tickets_number ON tickets(ticket_number);

  -- Ticket Replies table
  CREATE TABLE IF NOT EXISTS ticket_replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    sender_type TEXT NOT NULL CHECK(sender_type IN ('admin', 'user', 'bot')),
    message TEXT NOT NULL,
    is_internal INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
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

// Add block_type to question_steps
try {
  db.exec('ALTER TABLE question_steps ADD COLUMN block_type TEXT DEFAULT "step"');
} catch (e) {
  // Column already exists
}

// Migration: Ensure ticket_replies supports 'bot' sender_type
try {
  const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='ticket_replies'").get();
  const newTableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='ticket_replies_new'").get();

  if (newTableInfo && !tableInfo) {
    // Previous migration left ticket_replies_new but failed to rename
    db.exec("ALTER TABLE ticket_replies_new RENAME TO ticket_replies");
    console.log('Completed interrupted migration: renamed ticket_replies_new to ticket_replies');
  } else if (!tableInfo && !newTableInfo) {
    // Table was dropped completely, recreate it
    db.exec(`
      CREATE TABLE ticket_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id INTEGER NOT NULL,
        sender_type TEXT NOT NULL CHECK(sender_type IN ('admin', 'user', 'bot')),
        message TEXT NOT NULL,
        is_internal INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
      )
    `);
    console.log('Recreated ticket_replies table with bot support');
  } else if (tableInfo) {
    const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='ticket_replies'").get();
    if (schema && schema.sql && !schema.sql.includes('bot')) {
      db.exec(`CREATE TABLE ticket_replies_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id INTEGER NOT NULL,
        sender_type TEXT NOT NULL CHECK(sender_type IN ('admin', 'user', 'bot')),
        message TEXT NOT NULL,
        is_internal INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
      )`);
      db.exec("INSERT INTO ticket_replies_new SELECT * FROM ticket_replies");
      db.exec("DROP TABLE ticket_replies");
      db.exec("ALTER TABLE ticket_replies_new RENAME TO ticket_replies");
      console.log('Migrated ticket_replies to support bot sender_type');
    }
  }
} catch (e) {
  console.error('Migration error:', e.message);
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

// Seed default support settings if not exists
const existingSupport = db.prepare('SELECT id FROM support_settings LIMIT 1').get();
if (!existingSupport) {
  db.prepare(`INSERT INTO support_settings (greeting_text, button_color, whatsapp_number, email, messenger_url, is_enabled) VALUES (?, ?, ?, ?, ?, ?)`).run(
    'How can we help?', '#F7941D', '', '', '', 1
  );
}

export default db;
