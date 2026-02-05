// Articles organized by category, with sections within each category

export const articlesByCategory = {
    'setting-up': {
        title: 'Setting Up',
        description: 'Your step-by-step guide to setting up and using the system effectively.',
        icon: 'Rocket',
        sections: [
            {
                title: 'BackOffice',
                articles: [
                    { id: 'manage-stores', title: 'How to Manage Your Stores' },
                    { id: 'manage-registers', title: 'How to Manage Your POS Registers' },
                    { id: 'manage-products', title: 'How to Manage Your Products' },
                    { id: 'manage-tax-codes', title: 'How to Manage Your Tax Codes' },
                    { id: 'manage-layouts', title: 'How to Manage Your POS Layouts' },
                    { id: 'manage-payments', title: 'How to Manage Your Payment Options' },
                    { id: 'manage-receipts', title: 'How to Manage Receipt Settings' }
                ]
            },
            {
                title: 'SUPERPOS POS App',
                articles: [
                    { id: 'setup-pos-register', title: 'How to Set Up Your SUPERPOS POS Register (Download, Activate, Deactivate)' },
                    { id: 'arrange-layouts', title: 'How to Arrange Your Product Layouts on the SUPERPOS POS App' }
                ]
            },
            {
                title: 'SUPERPOS Manager App',
                articles: [
                    { id: 'manager-app-use', title: 'SUPERPOS Manager App: How to Use' },
                    { id: 'manager-beep-orders', title: 'SUPERPOS Manager App: How to Manage Beep Delivery Orders' },
                    { id: 'manager-stock-status', title: 'SUPERPOS Manager App: How to Mark Beep Menu Items as In Stock or Out of Stock' },
                    { id: 'manager-stock-take', title: 'SUPERPOS Manager App: How to Perform Stock Take using Scanner' }
                ]
            },
            {
                title: 'POS Hardware',
                articles: [
                    { id: 'hardware-basic', title: 'Hardware: How to Perform Basic Set Up' },
                    { id: 'hardware-sunmi', title: 'Hardware: How to Set Up Sunmi & Android T2C' },
                    { id: 'hardware-ipad', title: 'Hardware: [iPad] How to Set Up Register' },
                    { id: 'hardware-mini', title: 'Hardware: [Mini] Set Up Guide and User Manuals' }
                ]
            }
        ]
    },
    'pos-system': {
        title: 'Point of Sale (POS) System',
        description: 'Transform your checkout process with our POS system.',
        icon: 'Monitor',
        sections: [
            {
                title: 'Basic Set Up',
                articles: [
                    { id: 'pos-merge-tables', title: 'POS: How to Merge Tables and Orders' },
                    { id: 'pos-split-bill', title: 'POS: How to Split Bill/Orders / Items' },
                    { id: 'pos-change-table', title: 'POS: How to Change Table for POS with Layout' },
                    { id: 'pos-layout-app', title: 'POS: How to Provide Other Tablet Layout on POS' },
                    { id: 'pos-menu-types', title: 'POS: How to View Menu Types on your POS layout 5.0 (with Video)' },
                    { id: 'pos-enable-deposit', title: 'POS: How to Enable Deposit on S1 & S2 Devices' },
                    { id: 'pos-move-orders', title: 'POS: How to Move Orders Between Customers' },
                    { id: 'pos-unsynced-orders', title: 'POS: [Android] How to retry unsynced Offline Transactions & Order Summary' },
                    { id: 'pos-cash-in-out', title: 'POS: How to Cash In-Out for Shift Changes' },
                    { id: 'pos-open-shift', title: 'POS: How to Open Shift, Close Shift, Reprint Pre-Settlement' },
                    { id: 'pos-custom-payment-tracking', title: 'POS: [Android] How to track custom payment methods differences tracking' },
                    { id: 'pos-hold-orders', title: 'POS: [Android] How to Hold & Retrieve Orders / POS & Kitchen Sync Turning' }
                ]
            },
            {
                title: 'QR Payment',
                articles: [
                    { id: 'qr-maybank', title: '[MY] SUPERPOS QR Payment: Maybank QRPay' },
                    { id: 'qr-global', title: '[TH] SUPERPOS QR Payment: GHL Payment' }
                ]
            },
            {
                title: 'Kitchen Display System (KDS)',
                articles: [
                    { id: 'kds-intro', title: 'KDS: How to set up Kitchen Display System' },
                    { id: 'kds-install', title: 'KDS: How to Find and Install KDS (Kitchen Display System)' },
                    { id: 'kds-enable', title: 'KDS: How to Enable KDS Service in the App' },
                    { id: 'kds-number', title: 'KDS: How to Set Up KDS Number via BackOffice' },
                    { id: 'kds-fire-course', title: 'KDS: Firing Course via Android' },
                    { id: 'kds-status', title: 'KDS: How to Update Kitchen Status via app and force clearing Screens as inactive' }
                ]
            },
            {
                title: 'Multiple Register Sync (MRS)',
                articles: [
                    { id: 'mrs-setup', title: 'MRS: How to Enable The MRS System' },
                    { id: 'mrs-multiple', title: 'MRS: How to Enable Multiple Register Sync' },
                    { id: 'mrs-sync', title: 'MRS: [Android] How to Main Register Sync' },
                    { id: 'mrs-troubleshoot', title: 'MRS: [Android] Troubleshoot Multiple Register Issues' }
                ]
            },
            {
                title: 'POS: Android - Hardware & Product',
                articles: [
                    { id: 'pos-sim', title: 'Hardware: [Android] POS Sim Card / SD Card' },
                    { id: 'hardware-printing', title: 'Hardware: [Android] How to Set Up Cloud Printing for Orders' }
                ]
            },
            {
                title: 'POS: Customer Facing Display (CFD)',
                articles: [
                    { id: 'cfd-set-up', title: 'Customer Facing Display (CFD): How to Set Up' },
                    { id: 'cfd-android', title: 'Customer Facing Display (CFD): Android Setup' },
                    { id: 'cfd-features', title: 'Customer Facing Display (CFD): How to Set Up' }
                ]
            },
            {
                title: 'POS: Promotion',
                articles: [
                    { id: 'promo-basic', title: 'Promotion: How to Set Up Basic Percentage Off' },
                    { id: 'promo-set', title: 'Promotion: How to Set Up Take Set as Off' },
                    { id: 'promo-buy-x-free-x', title: 'Promotion: How to Set Up Buy X Free X Item' },
                    { id: 'promo-combo', title: 'Promotion: How to Set Up Combo (A+B+C) Away Price' },
                    { id: 'promo-overwrite', title: 'Promotion: How to Set Up Overwrite Combo Price' },
                    { id: 'promo-my-cde', title: 'Promotion: How to Set Up Order on My_eBe' },
                    { id: 'promo-free-item', title: 'Promotion: How to Set Free Items' },
                    { id: 'promo-limited', title: 'Promotion: How to Set Limited Shipping' },
                    { id: 'promo-multi-tier', title: 'Promotion: How to Handle Keyed Plan discount with Multi Tier Promotion' },
                    { id: 'promo-specific', title: 'Promotion: How to Set Up Specific Product Purchase' }
                ]
            },
            {
                title: 'POS: Tax Guides',
                articles: [
                    { id: 'tax-guide-ph', title: 'Tax Guides: [PH] How to Apply Tax (VAT) in the SUPERPOS BackOffice' }
                ]
            },
            {
                title: 'POS: Troubleshooting',
                articles: [
                    { id: 'pos-troubleshoot-payment', title: 'POS Troubleshooting: I cannot perform POS App troubleshooting' },
                    { id: 'pos-troubleshoot-login', title: 'POS Troubleshooting: I cannot see POS login ID / email address' },
                    { id: 'pos-troubleshoot-network', title: 'POS Troubleshooting: Issues for Scanning and POS Features' },
                    { id: 'pos-troubleshoot-change', title: 'POS Troubleshooting: Saving Changes on your Price Center' },
                    { id: 'pos-troubleshoot-inventory', title: 'POS Troubleshooting: Inventory not reflecting Manually on Items' }
                ]
            },
            {
                title: 'POS: New iOS',
                articles: [
                    { id: 'ios-intro', title: 'New iOS: Intro' },
                    { id: 'ios-features', title: 'New iOS: Features' },
                    { id: 'ios-cancellation', title: 'New iOS: Cancellation & Refund' },
                    { id: 'ios-cashier', title: 'New iOS: Cashier' },
                    { id: 'ios-products', title: 'New iOS: Products' },
                    { id: 'ios-payment', title: 'New iOS: Payment' }
                ]
            }
        ]
    },
    'backoffice': {
        title: 'BackOffice',
        description: 'Your central hub for business management.',
        icon: 'LayoutGrid',
        sections: [
            {
                title: 'BackOffice: General Settings',
                articles: [
                    { id: 'bo-signup', title: 'BackOffice: How to Sign Up & Log In' },
                    { id: 'bo-disclosure', title: 'BackOffice: Disclosure for BackOffice Access' },
                    { id: 'bo-export-sales', title: 'BackOffice: How to Export Accounting Systems Sales Data' },
                    { id: 'bo-change-lang', title: 'BackOffice: How to Change Language' },
                    { id: 'bo-transfer-ownership', title: 'BackOffice: How to Transfer SUPERPOS Account Ownership' },
                    { id: 'bo-kitchen-dockets', title: 'BackOffice: How to Print Multiple Kitchen Dockets' },
                    { id: 'bo-reset-data', title: 'BackOffice: How to Reset Account Data' },
                    { id: 'bo-browsers', title: 'BackOffice: Supported Browser Versions' },
                    { id: 'bo-sales-comparisons', title: 'BackOffice: Dashboard Sales Comparisons' }
                ]
            },
            {
                title: 'BackOffice: Product',
                articles: [
                    { id: 'prod-setting-up', title: 'Product: Setting Up' },
                    { id: 'prod-stock-mgmt', title: 'Product: Stock Management' },
                    { id: 'prod-inventory', title: 'Product: Inventory Management' }
                ]
            },
            {
                title: 'BackOffice: Customer',
                articles: [
                    { id: 'cust-data', title: 'Customer: Data & Communication' },
                    { id: 'cust-transactions', title: 'Customer: Handling Transactions' }
                ]
            },
            {
                title: 'BackOffice: SUPERPOS Engage',
                articles: [
                    { id: 'engage-intro', title: 'SUPERPOS Engage' },
                    { id: 'engage-my', title: 'SUPERPOS Engage: Malaysia' },
                    { id: 'engage-ph', title: 'SUPERPOS Engage: Philippines' },
                    { id: 'engage-th', title: 'SUPERPOS Engage: Thailand' }
                ]
            },
            {
                title: 'BackOffice: Membership',
                articles: [
                    { id: 'memb-start', title: 'Membership: How to Get Started' },
                    { id: 'memb-live', title: 'Membership: Go Live' },
                    { id: 'memb-enroll', title: 'Membership: How to Enroll Customers to Membership' },
                    { id: 'memb-review', title: 'Membership: How to Review Customer Points and Details' },
                    { id: 'memb-nav', title: 'Membership: Navigation on the Membership Pages and POS Register' },
                    { id: 'memb-monitor', title: 'Membership: How to Monitor Performance and Insights' },
                    { id: 'memb-tier', title: 'Membership: How to set up Membership Tier & Rewards' },
                    { id: 'memb-import', title: 'Membership: How to Import Your Existing Loyalty Data' },
                    { id: 'memb-faq', title: 'Membership: FAQ' }
                ]
            },
            {
                title: 'BackOffice: Boost Google Review',
                articles: [
                    { id: 'review-my', title: 'Boost Google Review: Malaysia' },
                    { id: 'review-ph', title: 'Boost Google Review: Philippines' },
                    { id: 'review-th', title: 'Boost Google Review: Thailand' }
                ]
            }
        ]
    },
    'online-orders': {
        title: 'Online Orders',
        description: 'Effortlessly manage and process online orders.',
        icon: 'ShoppingCart',
        sections: [
            {
                title: 'Online Orders: QR Order & Pay',
                articles: [
                    { id: 'qr-pos-app', title: 'QR Order & Pay: POS App' },
                    { id: 'qr-bo-functions', title: 'QR Order & Pay: Functions in the BackOffice' }
                ]
            },
            {
                title: 'Online Orders: Beep Delivery',
                articles: [
                    { id: 'beep-general', title: 'Beep Delivery: General' },
                    { id: 'beep-bo-functions', title: 'Beep Delivery: Functions in the BackOffice' },
                    { id: 'beep-pre-orders', title: 'Beep Delivery: Pre-Orders' },
                    { id: 'beep-logistics', title: 'Beep Delivery: Logistics' },
                    { id: 'beep-troubleshoot', title: 'Beep Delivery: Troubleshooting' }
                ]
            },
            {
                title: 'Online Orders: Beep Cashback',
                articles: [
                    { id: 'cashback-work', title: 'Cashback: How Does It Work' },
                    { id: 'cashback-manage', title: 'Cashback: How to Manage Settings' },
                    { id: 'cashback-monitor', title: 'Cashback: Monitoring Performance with Cashback Report' },
                    { id: 'cashback-bir', title: 'Cashback: [PH] Beep Cashback for BIR Enabled Account' },
                    { id: 'cashback-faq', title: 'Cashback: FAQ' }
                ]
            },
            {
                title: 'Online Orders: Webstore',
                articles: [
                    { id: 'web-setup', title: 'Webstore: Setting Up' },
                    { id: 'web-pay', title: 'Webstore: Payment Methods' },
                    { id: 'web-fb', title: 'Webstore: Selling on Facebook' },
                    { id: 'web-tax', title: 'Webstore: Tax Settings' }
                ]
            },
            {
                title: 'Online Orders: Payouts',
                articles: [
                    { id: 'payouts-receive', title: 'Payouts: How to Receive' }
                ]
            }
        ]
    },
    'reports': {
        title: 'Reports',
        description: 'Access and generate detailed reports in the BackOffice.',
        icon: 'FileText',
        sections: [
            {
                title: 'Operational Reports',
                articles: [
                    { id: 'report-understand', title: 'How to Understand and Customize Your SUPERPOS Reports' },
                    { id: 'report-tax', title: 'How to Understand Your Tax Report' },
                    { id: 'report-shift', title: 'How to Understand Your Shift Report' }
                ]
            },
            {
                title: 'Sales Reports',
                articles: [
                    { id: 'sales-understand', title: 'How to Understand Your SUPERPOS Sales Reports' },
                    { id: 'sales-view', title: 'How to View and Customize Your SUPERPOS Sales Reports' },
                    { id: 'sales-diff', title: 'How to Understand Differences in Sales Reports' }
                ]
            }
        ]
    },
    'tax-guides': {
        title: 'Tax Guides',
        description: 'Access essential tax guides in the BackOffice to help you stay compliant.',
        icon: 'Receipt',
        sections: [
            {
                title: '[PH] Bureau Of Internal Revenue (BIR) Guides',
                articles: [
                    { id: 'bir-acct-settings', title: '[PH] BIR: How to Perform Account Settings' },
                    { id: 'bir-tax-settings', title: '[PH] BIR: How to Perform Tax and Product Settings' },
                    { id: 'bir-special-disc', title: '[PH] BIR: How to Control Special Discounts with Manager Approval' },
                    { id: 'bir-memc', title: '[PH] BIR: How to Set Up and Apply MEMC Discounts for Senior Citizens and PWDs' },
                    { id: 'bir-apply-disc', title: '[PH] BIR: How to Apply Discount' },
                    { id: 'bir-z-reading', title: '[PH] BIR: Accessing POS, Z-Reading, and E-Journal Reports in BackOffice' },
                    { id: 'bir-view-reports', title: '[PH] BIR: How to View F&B and Retail POS Reports' },
                    { id: 'bir-food-del', title: '[PH] BIR: How Does Food Delivery Integration Work' }
                ]
            },
            {
                title: '[PH] Amusement Tax',
                articles: [
                    { id: 'amuse-setup', title: '[PH] How to Set Up and Manage Amusement Tax' }
                ]
            },
            {
                title: '[MY] E-Invoice',
                articles: [
                    { id: 'einv-intro', title: 'SUPERPOS e-Invoice: Your Quick Start Guide to Compliance' },
                    { id: 'einv-setup', title: 'How to Set Up & Manage e-Invoice Settings' },
                    { id: 'einv-txn', title: 'How to Manage e-Invoice Transactions' },
                    { id: 'einv-expense', title: 'How to Get SUPERPOS e-Invoices for Expenses' },
                    { id: 'einv-status', title: 'Understand e-Invoice Status & Consolidation' }
                ]
            },
            {
                title: '[MY] SUPERPOS Transaction Fees and Taxation',
                articles: [
                    { id: 'tax-fees', title: '[MY] SUPERPOS Transaction Fees & Taxation' }
                ]
            }
        ]
    },
    'hardware': {
        title: 'Hardware',
        description: 'Ensure your hardware is set up correctly for efficient business operations.',
        icon: 'Printer',
        sections: [
            {
                title: 'Printer Set Up',
                articles: [
                    { id: 'printer-setup', title: 'How to Set Up Your SUPERPOS Printer' },
                    { id: 'printer-network', title: 'How to Manage Network Settings for Your SUPERPOS POS and Printer' },
                    { id: 'printer-troubleshoot', title: 'How to Troubleshoot Common SUPERPOS Printer Issues' }
                ]
            },
            {
                title: 'Label & Barcode Printer',
                articles: [
                    { id: 'label-setup', title: 'How to Set Up Your Bixolon Label Printer and Print Barcodes (Desktop)' },
                    { id: 'label-mobile', title: 'How to Use the Bixolon Label Artist Mobile App to Print Barcodes' }
                ]
            },
            {
                title: 'Hardware: Cash Drawer Troubleshooting',
                articles: [
                    { id: 'cash-troubleshoot', title: 'Cash Drawer: How to Troubleshoot' },
                    { id: 'cash-open', title: 'Cash Drawer: How to Open' }
                ]
            },
            {
                title: 'Hardware: Router Troubleshooting',
                articles: [
                    { id: 'router-tplink', title: 'Router Troubleshooting: How to Configure TP-Link Archer C6' },
                    { id: 'router-asus', title: 'Router Troubleshooting: How to Reset & Configure ASUS RT-AX56U Router' },
                    { id: 'router-mikrotik', title: 'Router Troubleshooting: How to Identify Mikrotik Routers' }
                ]
            },
            {
                title: 'FAQs: Hardware',
                articles: [
                    { id: 'faq-hardware-support', title: 'FAQ: POS Hardware & Supplementary Device Support' },
                    { id: 'faq-hardware-delivery', title: 'FAQ: Hardware Delivery Issues' }
                ]
            },
            {
                title: 'Tablet Stand',
                articles: [
                    { id: 'stand-heckler', title: 'Tablet Stand: How to Install Heckler Windfall iPad Stand' },
                    { id: 'stand-pr', title: 'Tablet Stand: How to Install PR-TS201' }
                ]
            }
        ]
    },
    'integrations': {
        title: 'External Integrations',
        description: 'Find out more about how our ecosystem can integrate with supported malls & other applications!',
        icon: 'Link2',
        sections: [
            {
                title: 'External Integration: SSO',
                articles: [
                    { id: 'sso-login', title: 'External Integration: Logging into BackOffice with Single Sign-On (SSO)' }
                ]
            },
            {
                title: 'External Integrations: Food Delivery Integration',
                articles: [
                    { id: 'food-start', title: 'Food Delivery Integration: Getting Started' },
                    { id: 'food-setup', title: 'Food Delivery Integration: How to Setup Store Menu & Collections' },
                    { id: 'food-product', title: 'Food Delivery Integration: Product Setup' },
                    { id: 'food-addons', title: 'Food Delivery Integration: Enable Add-Ons' },
                    { id: 'food-stock', title: 'Food Delivery Integration: How to Mark Out of Stock' },
                    { id: 'food-live', title: 'Food Delivery Integration: Go Live!' },
                    { id: 'food-orders', title: 'Food Delivery Integration: Handling Orders via POS' },
                    { id: 'food-grab', title: 'Food Delivery Integration: [PH] How to Connect Your Store to GrabFood' }
                ]
            },
            {
                title: 'External Integrations: Mall Integration',
                articles: [
                    { id: 'mall-general', title: 'Mall Integration: General' },
                    { id: 'mall-list', title: 'Mall Integration: List of Supported Malls' }
                ]
            },
            {
                title: 'External Integrations: Marketplace Integration',
                articles: [
                    { id: 'market-setup', title: 'Marketplace Integration: How to Set Up' },
                    { id: 'market-products', title: 'Marketplace Integration: Getting Your Products Ready in Sellercraft' }
                ]
            },
            {
                title: 'External Integrations: QR Ph Integration',
                articles: [
                    { id: 'qr-ph-enable', title: '[PH] Enable QR Ph Payments' }
                ]
            },
            {
                title: 'External Integrations: Data Extractions & Accounting',
                articles: [
                    { id: 'acc-qbo', title: 'Accounting: QuickBooks Online Integration' },
                    { id: 'acc-qbo-troubleshoot', title: 'Accounting: QuickBooks Online Troubleshooting' },
                    { id: 'acc-xero', title: 'Accounting: Xero Integration' },
                    { id: 'acc-financio', title: 'Accounting: Financio Integration' },
                    { id: 'data-autocount', title: 'Data Extractions: AutoCount' },
                    { id: 'data-sql', title: 'Data Extractions: SQL' }
                ]
            }
        ]
    },
    'getting-started': {
        title: 'Getting Started',
        description: 'Set up your store, products, and POS system to start managing sales, inventory, and performance!',
        icon: 'Rocket',
        sections: [
            {
                title: 'Getting Started: F&B',
                articles: [
                    { id: 'fb-video', title: 'F&B: Video Guide' },
                    { id: 'fb-store', title: 'F&B: Store Settings' },
                    { id: 'fb-product', title: 'F&B: Product Settings' },
                    { id: 'fb-qr-basic', title: 'F&B: QR Order & Pay Basic Set Up' },
                    { id: 'fb-qr-advance', title: 'F&B: QR Order & Pay Advance Set Up' },
                    { id: 'fb-beep', title: 'F&B: Beep Delivery' }
                ]
            },
            {
                title: 'Getting Started: Retail & Service',
                articles: [
                    { id: 'retail-video', title: 'Retail & Service: Video Guide' },
                    { id: 'retail-product', title: 'Retail & Service: Product Set Up' },
                    { id: 'retail-hardware', title: 'Retail & Service: Hardware Set Up' },
                    { id: 'retail-web-basic', title: 'Retail & Service: Webstore Basic Set Up' },
                    { id: 'retail-web-advance', title: 'Retail & Service: Webstore Advance Set Up' }
                ]
            }
        ]
    },
    'troubleshooting': {
        title: 'Troubleshooting',
        description: 'Having issues? Our troubleshooting guide provides solutions for common problems.',
        icon: 'Wrench',
        sections: [
            {
                title: 'Troubleshooting: POS Apps',
                articles: [
                    { id: 'tr-android', title: 'POS Apps: Android Troubleshooting' },
                    { id: 'tr-others', title: 'POS Apps: Others Troubleshooting' }
                ]
            }
        ]
    },
    'quick-help': {
        title: 'Quick Help',
        description: 'Looking for quick answers? Our Quick Help guide provides fast solutions to get you up and running.',
        icon: 'HelpCircle',
        sections: [
            {
                title: 'Quick Help: Contact Us',
                articles: [
                    { id: 'contact-details', title: 'Contact Us: SUPERPOS Contact Details' },
                    { id: 'contact-livechat', title: 'Contact Us: How to Contact Us via Live Chat' },
                    { id: 'contact-compromised', title: 'Emergency Guide: What to Do If Your Account Is Compromised' }
                ]
            },
            {
                title: 'Quick Help: FAQs',
                articles: [
                    { id: 'faq-online', title: 'FAQs: Online Orders' },
                    { id: 'faq-others', title: 'FAQs: Others' }
                ]
            }
        ]
    }
};
