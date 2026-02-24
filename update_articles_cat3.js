import Database from 'better-sqlite3';

const db = new Database('./server/faq.db');

const articles = [
    {
        id: 3,
        description: '<p>Manage your business outlets and physical store locations.</p>',
        steps: [
            { type: 'section_title', title: 'Managing Your Outlets' },
            { type: 'step', title: 'Navigate to Outlets', content: 'Log into your Backoffice and navigate to <strong>SETTINGS > Outlets</strong> in the sidebar.', image_url: '/uploads/outlets-management.png' },
            { type: 'step', title: 'Edit or Add Outlets', content: 'You will see a list of all your outlets. You can click <strong>Edit</strong> to update store details like address and trading hours, or click <strong>+ Add Outlet</strong> in the top right corner to create a new location.' }
        ]
    },
    {
        id: 4,
        description: '<p>Register and manage your POS devices and registers.</p>',
        steps: [
            { type: 'section_title', title: 'Managing POS Registers' },
            { type: 'step', title: 'Navigate to Devices', content: 'Go to <strong>SETTINGS > Devices</strong> in the Backoffice sidebar.', image_url: '/uploads/devices-management.png' },
            { type: 'step', title: 'Register a New POS', content: 'Click <strong>+ Add POS</strong>. In the modal, enter your <strong>POS Name</strong>, <strong>POS Code</strong>, select the <strong>Outlet</strong> it belongs to, and choose a <strong>Config Template</strong>.' }
        ]
    },
    {
        id: 5,
        description: '<p>Create and manage your product catalog, categories, and stock.</p>',
        steps: [
            { type: 'section_title', title: 'Product Catalog Management' },
            { type: 'step', title: 'Navigate to Products', content: 'Go to <strong>CATALOG > Products</strong> in the sidebar.', image_url: '/uploads/products-management.png' },
            { type: 'step', title: 'View Product List', content: 'The dashboard shows your total products, active/hidden status, and low stock warnings. You can search products by name, SKU, or barcode.' },
            { type: 'step', title: 'Add New Product', content: 'Click <strong>+ Add Product</strong> to create a new item. You can set the image, category, price, and stock levels for each outlet.' }
        ]
    },
    {
        id: 6,
        description: '<p>Configure corporate tax names and percentages.</p>',
        steps: [
            { type: 'section_title', title: 'Tax Configuration' },
            { type: 'step', title: 'Navigate to Taxes', content: 'Go to <strong>REPORTS > Taxes</strong> (or click the Taxes link in the sidebar).', image_url: '/uploads/tax-configuration.png' },
            { type: 'step', title: 'Configure Tax Settings', content: 'Under <strong>Tax Configuration</strong>, click <strong>Edit Settings</strong>. Here you can toggle <strong>Tax Enabled</strong>, and set your business <strong>Tax Name</strong> and <strong>Tax Percentage (%)</strong>.' }
        ]
    },
    {
        id: 7,
        description: '<p>Arrange how products are displayed on your POS terminal.</p>',
        steps: [
            { type: 'section_title', title: 'Managing POS Layouts' },
            { type: 'step', title: 'Navigate to POS Configs', content: 'Go to <strong>SETTINGS > POS Configs</strong> (or POS Settings).', image_url: '/uploads/pos-configs.png' },
            { type: 'step', title: 'Edit Grid Layouts', content: 'Under <strong>Product Grid Layouts</strong>, find the layout you want to change and click <strong>Edit Layout</strong> to drag and drop products into your preferred arrangement.' }
        ]
    },
    {
        id: 8,
        description: '<p>Enable or disable payment methods across different ordering channels.</p>',
        steps: [
            { type: 'section_title', title: 'Payment Method Configuration' },
            { type: 'step', title: 'Navigate to Payment Methods', content: 'Go to <strong>SETTINGS > Payment Methods</strong>.', image_url: '/uploads/payment-options.png' },
            { type: 'step', title: 'Configure Channels', content: 'You can toggle specific payment methods (Cash, Card, Ewallets) <strong>On</strong> or <strong>Off</strong> for different devices like QPOS, MPOS, Kiosk, and Web store.' }
        ]
    },
    {
        id: 9,
        description: '<p>Customize your printed receipts with branding and store info.</p>',
        steps: [
            { type: 'section_title', title: 'Receipt Print Templates' },
            { type: 'step', title: 'Navigate to Print Templates', content: 'Go to <strong>SETTINGS > Print Templates</strong>.', image_url: '/uploads/print-templates.png' },
            { type: 'step', title: 'Configure Receipt', content: 'Under the <strong>Receipt</strong> section, click <strong>Configure</strong>. You can upload your business logo, adjust font sizes, and add custom header/footer text that will appear on customer receipts.' }
        ]
    },
    {
        id: 10,
        description: '<p>Steps to download, activate, and deactivate your SUPERPOS POS Register.</p>',
        steps: [
            { type: 'section_title', title: 'Setting Up Your POS Register' },
            { type: 'step', title: 'Download the App', content: 'Access the <strong>Splash Page</strong> via your device browser to download the SuperPOS or mPOS application.', image_url: '/uploads/splash-page.png' },
            { type: 'step', title: 'Activation', content: 'Open the app on your terminal. You will be prompted for an <strong>Activation Code</strong>. You can find or generate this code in the Backoffice under <strong>SETTINGS > Devices</strong>.' },
            { type: 'step', title: 'Deactivation', content: 'To move a license to a new device, you must first deactivate the old one in the Backoffice by clicking <strong>Edit</strong> on the device and toggling it to <strong>Inactive</strong> or removing it.' }
        ]
    },
    {
        id: 11,
        description: '<p>How to visually arrange products for faster checkout.</p>',
        steps: [
            { type: 'section_title', title: 'Arranging Product Layouts' },
            { type: 'step', title: 'Access Layout Editor', content: 'Navigate to <strong>SETTINGS > POS Configs</strong> and click <strong>Edit Layout</strong> on your active product grid.', image_url: '/uploads/pos-configs.png' },
            { type: 'step', title: 'Drag and Drop', content: 'In the editor, you can drag products into specific categories or grid positions. This layout will sync automatically to your POS app for faster order entry.' }
        ]
    },
    {
        id: 12,
        description: '<p>Monitor sales and manage staff from your mobile device.</p>',
        steps: [
            { type: 'section_title', title: 'SUPERPOS Manager App' },
            { type: 'step', title: 'Access for Managers', content: 'The Manager App functionality is built into the mobile-responsive Backoffice. Ensure your staff account has <strong>Manager</strong> or <strong>Admin</strong> permissions in <strong>EMPLOYEES > Staff</strong>.', image_url: '/uploads/outlets-management.png' },
            { type: 'step', title: 'Monitoring Sales', content: 'Use the <strong>AI Dashboard</strong> on your mobile browser to see real-time revenue, order counts, and average order value across all outlets.' }
        ]
    }
];

try {
    const updateQuestion = db.prepare('UPDATE questions SET description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const deleteSteps = db.prepare('DELETE FROM question_steps WHERE question_id = ?');
    const insertStep = db.prepare('INSERT INTO question_steps (question_id, step_order, step_title, content, image_url, block_type) VALUES (?, ?, ?, ?, ?, ?)');

    for (const article of articles) {
        console.log(`Updating article ${article.id}: ${article.description.substring(0, 30)}...`);

        // Update main description
        updateQuestion.run(article.description, article.id);

        // Delete existing steps
        deleteSteps.run(article.id);

        // Insert new steps
        article.steps.forEach((step, index) => {
            insertStep.run(article.id, index + 1, step.title, step.content || null, step.image_url || null, step.type);
        });
    }

    console.log('✅ Successfully updated all category 3 articles with images!');
} catch (error) {
    console.error('❌ Error updating articles:', error);
} finally {
    db.close();
}
