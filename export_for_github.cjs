
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Paths
const currentDir = process.cwd();
const DB_PATH = path.join(currentDir, 'server/faq.db');
const EXPORT_DIR = path.join(currentDir, 'public/data');

function export_data() {
    if (!fs.existsSync(DB_PATH)) {
        console.log("Database not found at: " + DB_PATH);
        return;
    }

    console.log("Exporting data from database...");

    // Ensure export directory exists
    if (fs.existsSync(EXPORT_DIR)) {
        fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
    fs.mkdirSync(path.join(EXPORT_DIR, 'questions'), { recursive: true });
    fs.mkdirSync(path.join(EXPORT_DIR, 'categories'), { recursive: true });

    const db = new Database(DB_PATH);

    // Build category name lookup
    const allCats = db.prepare("SELECT * FROM categories").all();
    const catNameMap = {};
    for (const c of allCats) {
        catNameMap[c.id] = c.name;
    }

    // 1. Export Categories (only active ones)
    const categories = allCats.filter(c => c.status === 'active');
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

    // 3. Export Individual Articles (with category_name and category_status)
    const all_questions = db.prepare("SELECT * FROM questions WHERE status = 'published'").all();
    for (const q of all_questions) {
        const steps = db.prepare("SELECT * FROM question_steps WHERE question_id = ? ORDER BY step_order").all(q.id);
        for (const step of steps) {
            const imgs = db.prepare("SELECT image_url FROM step_images WHERE step_id = ? ORDER BY image_order").all(step.id);
            step.images = imgs.map(i => i.image_url);
        }
        const cat = allCats.find(c => c.id === q.category_id);
        const data = {
            ...q,
            category_name: cat ? cat.name : 'Unknown',
            category_status: cat ? cat.status : 'inactive',
            steps
        };
        fs.writeFileSync(path.join(EXPORT_DIR, 'questions', `${q.id}.json`), JSON.stringify(data, null, 2));
    }

    console.log(`✅ Exported ${all_questions.length} articles to ${EXPORT_DIR}`);

    // 4. Export support settings
    try {
        const settings = db.prepare("SELECT * FROM support_settings WHERE id = 1").get();
        if (settings) {
            fs.writeFileSync(path.join(EXPORT_DIR, 'support-settings.json'), JSON.stringify(settings, null, 2));
            console.log('⚙️  Exported support settings');
        }
    } catch (e) {
        console.log('⚠️  No support_settings table, skipping');
    }

    // 5. Export all published questions as a searchable list for client-side search
    const searchList = all_questions.map(q => ({
        id: q.id,
        title: q.title,
        category_id: q.category_id,
        category_name: catNameMap[q.category_id] || 'Unknown',
        description: q.description || ''
    }));
    fs.writeFileSync(path.join(EXPORT_DIR, 'search.json'), JSON.stringify({ questions: searchList }, null, 2));
    console.log(`🔍 Exported search index with ${searchList.length} articles`);

    // 6. Copy uploads folder to public so images are included in the build
    const uploadsDir = path.join(currentDir, 'uploads');
    const publicUploadsDir = path.join(currentDir, 'public/uploads');
    if (fs.existsSync(uploadsDir)) {
        if (fs.existsSync(publicUploadsDir)) {
            fs.rmSync(publicUploadsDir, { recursive: true, force: true });
        }
        fs.cpSync(uploadsDir, publicUploadsDir, { recursive: true });
        const fileCount = fs.readdirSync(publicUploadsDir).length;
        console.log(`📷 Copied ${fileCount} image files to ${publicUploadsDir}`);
    } else {
        console.log('⚠️  No uploads folder found, skipping image copy');
    }

    db.close();
    console.log('🎉 Export complete! Run "npm run build" next.');
}

export_data();
