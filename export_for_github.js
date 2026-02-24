
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Paths
const DB_PATH = './server/faq.db';
const EXPORT_DIR = './public/data';

function export_data() {
    if (!fs.existsSync(DB_PATH)) {
        console.log("Database not found!");
        return;
    }

    // Ensure export directory exists
    if (fs.existsSync(EXPORT_DIR)) {
        fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
    fs.mkdirSync(path.join(EXPORT_DIR, 'questions'), { recursive: true });
    fs.mkdirSync(path.join(EXPORT_DIR, 'categories'), { recursive: true });

    const db = new Database(path.join(__dirname, 'server/faq.db'));

    // 1. Export Categories
    const categories = db.prepare("SELECT * FROM categories WHERE status = 'active'").all();
    for (const cat of categories) {
        const count = db.prepare("SELECT COUNT(*) as count FROM questions WHERE category_id = ? AND status = 'published'").get(cat.id);
        cat.questionCount = count.count;
    }
    fs.writeFileSync(path.join(EXPORT_DIR, 'categories.json'), JSON.stringify(categories, null, 2));

    // 2. Export Question Lists per category
    for (const cat of categories) {
        const questions = db.prepare("SELECT id, title, category_id, status FROM questions WHERE category_id = ? AND status = 'published'").all(cat.id);
        fs.writeFileSync(path.join(EXPORT_DIR, 'categories', `${cat.id}.json`), JSON.stringify({ questions }, null, 2));
    }

    // 3. Export Individual Articles
    const all_questions = db.prepare("SELECT * FROM questions WHERE status = 'published'").all();
    for (const q of all_questions) {
        const steps = db.prepare("SELECT * FROM question_steps WHERE question_id = ? ORDER BY step_order").all(q.id);
        for (const step of steps) {
            const imgs = db.prepare("SELECT image_url FROM step_images WHERE step_id = ? ORDER BY image_order").all(step.id);
            step.images = imgs.map(i => i.image_url);
        }
        const data = { ...q, steps };
        fs.writeFileSync(path.join(EXPORT_DIR, 'questions', `${q.id}.json`), JSON.stringify(data, null, 2));
    }

    console.log(`✅ Success! Exported ${all_questions.length} articles to ${EXPORT_DIR}`);
    db.close();
}

export_data();
