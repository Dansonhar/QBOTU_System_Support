import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            "nav": {
                "home": "Home",
                "search_placeholder": "Search for articles...",
                "no_results": "No articles found for \"{{query}}\"",
                "solutions_title": "Solutions at Your Fingertips"
            },
            "common": {
                "loading": "Loading...",
                "view_site": "View Site",
                "copyright": "© 2026 QPOS. All rights reserved."
            },
            "categories": {
                "title": "Browse by Category",
                "view_articles": "{{count}} articles",
                "setting_up": "Setting Up",
                "setting_up_desc": "Your step-by-step guide to setting up and using the system effectively.",
                "pos_system": "Point of Sale (POS) System",
                "pos_system_desc": "Transform your checkout process with our POS system. Learn how to configure and integrate all necessary components.",
                "point_of_sale_pos_system": "Point of Sale (POS) System",
                "point_of_sale_pos_system_desc": "Transform your checkout process with our POS system. Learn how to configure and integrate all necessary components.",
                "hardware": "Hardware",
                "hardware_desc": "Ensure your hardware is set up correctly for efficient business operations.",
                "troubleshooting": "Troubleshooting",
                "troubleshooting_desc": "Having issues? Our troubleshooting guide provides solutions for common problems.",
                "integrations": "External Integrations",
                "integrations_desc": "Find out more about how our ecosystem can integrate with supported malls & other applications!",
                "external_integrations": "External Integrations",
                "external_integrations_desc": "Find out more about how our ecosystem can integrate with supported malls & other applications!",
                "backoffice": "BackOffice",
                "backoffice_desc": "Your central hub for business management. Monitor performance, update settings, and access key insights.",
                "online_orders": "Online Orders",
                "online_orders_desc": "Effortlessly manage and process online orders. Track sales, handle deliveries, and manage customer orders.",
                "reports": "Reports",
                "reports_desc": "Access and generate detailed reports in the BackOffice.",
                "tax_guides": "Tax Guides",
                "tax_guides_desc": "Access essential tax guides in the BackOffice to help you stay compliant.",
                "getting_started": "Getting Started",
                "getting_started_desc": "Set up your store, products, and POS system to start managing sales, inventory, and performance!",
                "quick_help": "Quick Help",
                "quick_help_desc": "Looking for quick answers? Our Quick Help guide provides fast solutions to get you up and running.",
                "no_categories": "No Categories Yet"
            },
            "footer": {
                "contact_us": "Contact Us",
                "privacy": "Privacy Policy"
            },
            "article": {
                "loading": "Loading article...",
                "not_found": "Article Not Found",
                "not_found_desc": "Sorry, we couldn't find the article you're looking for.",
                "back_home": "Back to Help Center",
                "steps_count": "{{count}} steps",
                "updated": "Updated {{date}}",
                "on_this_page": "On this page",
                "overview": "Overview",
                "need_help": "Need more help?",
                "watch_video": "Watch Video Guide",
                "no_steps": "No steps added yet for this article.",
                "feedback_question": "Was this article helpful?",
                "yes": "Yes",
                "no": "No",
                "feedback_thanks": "Thanks for the feedback! Glad this helped. 😊",
                "feedback_sorry": "Sorry to hear that. Please contact support if you need more help.",
                "still_need_help": "Still need help?",
                "contact_support_desc": "Contact our support team for personalized assistance.",
                "contact_support_btn": "Contact Support"
            },
            "category": {
                "not_found": "Category not found",
                "all_collections": "All Collections",
                "no_articles": "No published articles in this category yet.",
                "add_article": "Add Question in Admin →",
                "all_articles": "All Articles"
            },
            "articles": {
                // POS System articles
                "pos_how_to_merge_tables_and_orders": "POS: How to Merge Tables and Orders",
                "pos_how_to_merge_tables_and_orders_desc": "From section: Basic Set Up",
                "pos_how_to_split_bill_orders_items": "POS: How to Split Bill/Orders / Items",
                "pos_how_to_split_bill_orders_items_desc": "From section: Basic Set Up",
                "pos_how_to_clear_unpaid_orders": "POS: How to Clear Unpaid Orders",
                "pos_how_to_add_edit_product_quantity": "POS: How to Add / Edit Product Quantity",
                "pos_how_to_edit_order_floor_table": "POS: How to Edit Order & Floor Table",
                "pos_how_to_check_order_history": "POS: How to Check Order History",
                "pos_how_to_add_edit_customers_on_pos": "POS: How to Add/Edit Customers on POS",
                "pos_how_to_use_time_clock": "POS: How to Use Time Clock",
                "pos_how_to_view_sales_summary": "POS: How to View Sales Summary",
                "pos_how_to_use_the_cash_drawer": "POS: How to Use the Cash Drawer",
                // Setting Up articles - BackOffice
                "how_to_manage_your_stores": "How to Manage Your Stores",
                "how_to_manage_your_stores_desc": "From section: BackOffice",
                "how_to_manage_your_pos_registers": "How to Manage Your POS Registers",
                "how_to_manage_your_products": "How to Manage Your Products",
                "how_to_manage_your_tax_codes": "How to Manage Your Tax Codes",
                "how_to_manage_your_pos_layouts": "How to Manage Your POS Layouts",
                "how_to_manage_your_payment_options": "How to Manage Your Payment Options",
                "how_to_manage_receipt_settings": "How to Manage Receipt Settings",
                // Setting Up articles - QPOS POS App
                "how_to_set_up_your_superpos_pos_register_download": "How to Set Up Your QPOS POS Register (Download, Activate, Deactivate)",
                "how_to_set_up_your_superpos_pos_register_download_activate_deactivate": "How to Set Up Your QPOS POS Register (Download, Activate, Deactivate)",
                "how_to_arrange_your_product_layouts_on_the_superpo": "How to Arrange Your Product Layouts on the QPOS POS App",
                "how_to_arrange_your_product_layouts_on_the_superpos_pos_app": "How to Arrange Your Product Layouts on the QPOS POS App",
                // Setting Up articles - QPOS Manager App
                "superpos_manager_app_how_to_use": "QPOS Manager App: How to Use",
                "superpos_manager_app_how_to_manage_beep_delivery_o": "QPOS Manager App: How to Manage Beep Delivery Orders",
                "superpos_manager_app_how_to_manage_beep_delivery_orders": "QPOS Manager App: How to Manage Beep Delivery Orders",
                "superpos_manager_app_how_to_mark_beep_menu_items_a": "QPOS Manager App: How to Mark Beep Menu Items as In Stock or Out of Stock",
                "superpos_manager_app_how_to_perform_stock_take_usi": "QPOS Manager App: How to Perform Stock Take using Scanner",
                // Setting Up articles - POS Hardware
                "hardware_how_to_perform_basic_set_up": "Hardware: How to Perform Basic Set Up",
                "hardware_how_to_set_up_sunmi_android_t2c": "Hardware: How to Set Up Sunmi & Android T2C",
                "hardware_ipad_how_to_set_up_register": "Hardware: [iPad] How to Set Up Register",
                "hardware_mini_set_up_guide_and_user_manuals": "Hardware: [Mini] Set Up Guide and User Manuals",
                // Step labels
                "step": "Step",
                "step_1": "Step 1",
                "step_2": "Step 2",
                "step_3": "Step 3",
                "step_4": "Step 4",
                "step_5": "Step 5",
                // Overview text
                "overview": "Overview",
                "this_article_covers": "This article covers:",
                "section": "Section:",
                "add_content_instruction": "Add detailed content and images here via the Admin Panel.",
                "from_section": "From section:"
            },
            "contact": {
                "title": "Get in Touch",
                "subtitle": "Our support team is here to help you succeed",
                "chat_title": "Live Chat",
                "chat_desc": "Chat with our support team in real-time. Available Mon-Fri, 9AM-6PM.",
                "start_chat": "Start Chat",
                "email_title": "Email Support",
                "email_desc": "Send us a detailed message. We respond within 24 hours.",
                "email_btn": "Email Us",
                "phone_title": "WhatsApp Support",
                "phone_desc": "WhatsApp us for urgent issues. Available Mon-Fri, 9AM-6PM.",
                "call_now": "WhatsApp Now",
                "form_title": "Send Us a Message",
                "name_label": "Your Name",
                "name_placeholder": "Enter your name",
                "email_label": "Email Address",
                "email_placeholder": "you@example.com",
                "topic_label": "Topic",
                "topic_placeholder": "Select a topic",
                "topic_general": "General Inquiry",
                "topic_tech": "Technical Support",
                "topic_billing": "Billing",
                "topic_feature": "Feature Request",
                "message_label": "Message",
                "message_placeholder": "How can we help you?",
                "send_btn": "Send Message",
                "success_alert": "Message sent! (Simulation)"
            },
            "privacy": {
                "title": "Privacy Policy",
                "last_updated": "Last updated: {{date}}",
                "intro": "At QPOS, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our point-of-sale services.",
                "s1_title": "1. Information We Collect",
                "s1_intro": "We collect information that you strictly provide to us. This includes:",
                "s1_l1": "Personal Data: Name, email address, phone number, and business details when you register or contact support.",
                "s1_l2": "Transaction Data: Details about payments to and from you and other details of products and services you have purchased from us.",
                "s1_l3": "Technical Data: Internet protocol (IP) address, your login data, browser type and version, time zone setting and location.",
                "s2_title": "2. How We Use Your Information",
                "s2_intro": "We use the information we collect for various purposes, including to:",
                "s2_l1": "Provide, operate, and maintain our website and services.",
                "s2_l2": "Improve, personalize, and expand our website.",
                "s2_l3": "Understand and analyze how you use our website.",
                "s2_l4": "Develop new products, services, features, and functionality.",
                "s2_l5": "Communicate with you, either directly or through one of our partners, including for customer service.",
                "s3_title": "3. Data Security",
                "s3_desc": "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.",
                "s4_title": "4. Third-Party Privacy Policies",
                "s4_desc": "QPOS's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.",
                "s5_title": "5. Contact Us",
                "s5_desc": "If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us."
            }
        }
    },
    ms: {
        translation: {
            "nav": {
                "home": "Utama",
                "search_placeholder": "Cari artikel...",
                "no_results": "Tiada artikel dijumpai untuk \"{{query}}\"",
                "solutions_title": "Penyelesaian di Hujung Jari Anda"
            },
            "common": {
                "loading": "Memuatkan...",
                "view_site": "Lihat Laman",
                "copyright": "© 2026 QPOS. Hak cipta terpelihara."
            },
            "categories": {
                "title": "Semak Mengikut Kategori",
                "view_articles": "{{count}} artikel",
                "setting_up": "Persediaan",
                "setting_up_desc": "Panduan langkah demi langkah anda untuk menyediakan dan menggunakan sistem dengan berkesan.",
                "pos_system": "Sistem Pusat Jualan (POS)",
                "pos_system_desc": "Transformasikan proses pembayaran anda dengan sistem POS kami. Ketahui cara mengkonfigurasi dan mengintegrasikan semua komponen.",
                "point_of_sale_pos_system": "Sistem Pusat Jualan (POS)",
                "point_of_sale_pos_system_desc": "Transformasikan proses pembayaran anda dengan sistem POS kami. Ketahui cara mengkonfigurasi dan mengintegrasikan semua komponen.",
                "hardware": "Perkakasan",
                "hardware_desc": "Pastikan perkakasan anda disediakan dengan betul untuk operasi perniagaan yang cekap.",
                "troubleshooting": "Penyelesaian Masalah",
                "troubleshooting_desc": "Mempunyai masalah? Panduan penyelesaian masalah kami menyediakan penyelesaian untuk masalah biasa.",
                "integrations": "Integrasi Luaran",
                "integrations_desc": "Ketahui lebih lanjut mengenai bagaimana ekosistem kami boleh berintegrasi dengan pusat membeli-belah & aplikasi lain!",
                "external_integrations": "Integrasi Luaran",
                "external_integrations_desc": "Ketahui lebih lanjut mengenai bagaimana ekosistem kami boleh berintegrasi dengan pusat membeli-belah & aplikasi lain!",
                "backoffice": "BackOffice",
                "backoffice_desc": "Hab pusat anda untuk pengurusan perniagaan. Pantau prestasi, kemaskini tetapan, dan akses pandangan utama.",
                "online_orders": "Pesanan Dalam Talian",
                "online_orders_desc": "Urus dan proses pesanan dalam talian dengan mudah. Jejak jualan, kendalikan penghantaran, dan urus pesanan pelanggan.",
                "reports": "Laporan",
                "reports_desc": "Akses dan janakan laporan terperinci dalam BackOffice.",
                "tax_guides": "Panduan Cukai",
                "tax_guides_desc": "Akses panduan cukai penting dalam BackOffice untuk membantu anda kekal patuh.",
                "getting_started": "Bermula",
                "getting_started_desc": "Sediakan kedai, produk, dan sistem POS anda untuk mula mengurus jualan, inventori, dan prestasi!",
                "quick_help": "Bantuan Pantas",
                "quick_help_desc": "Mencari jawapan pantas? Panduan Bantuan Pantas kami menyediakan penyelesaian pantas untuk membolehkan anda beroperasi.",
                "no_categories": "Tiada Kategori Lagi"
            },
            "footer": {
                "contact_us": "Hubungi Kami",
                "privacy": "Dasar Privasi"
            },
            "article": {
                "loading": "Memuatkan artikel...",
                "not_found": "Artikel Tidak Ditemui",
                "not_found_desc": "Maaf, kami tidak dapat mencari artikel yang anda cari.",
                "back_home": "Kembali ke Pusat Bantuan",
                "steps_count": "{{count}} langkah",
                "updated": "Dikemaskini {{date}}",
                "on_this_page": "Pada halaman ini",
                "overview": "Gambaran Keseluruhan",
                "need_help": "Perlukan bantuan lanjut?",
                "watch_video": "Tonton Panduan Video",
                "no_steps": "Tiada langkah ditambah untuk artikel ini.",
                "feedback_question": "Adakah artikel ini membantu?",
                "yes": "Ya",
                "no": "Tidak",
                "feedback_thanks": "Terima kasih atas maklum balas! Gembira membantu. 😊",
                "feedback_sorry": "Maaf mendengarnya. Sila hubungi sokongan jika anda perlukan bantuan.",
                "still_need_help": "Masih perlukan bantuan?",
                "contact_support_desc": "Hubungi pasukan sokongan kami untuk bantuan peribadi.",
                "contact_support_btn": "Hubungi Sokongan"
            },
            "category": {
                "not_found": "Kategori tidak ditemui",
                "all_collections": "Semua Koleksi",
                "no_articles": "Tiada artikel diterbitkan dalam kategori ini lagi.",
                "add_article": "Tambah Soalan dalam Admin →",
                "all_articles": "Semua Artikel"
            },
            "articles": {
                // POS System articles
                // POS System - General
                "pos_how_to_merge_tables_and_orders": "POS: Cara Menggabungkan Meja dan Pesanan",
                "pos_how_to_merge_tables_and_orders_desc": "Dari bahagian: Persediaan Asas",
                "pos_how_to_split_bill_orders_items": "POS: Cara Membahagikan Bil/Pesanan/Item",
                "pos_how_to_split_bill_orders_items_desc": "Dari bahagian: Persediaan Asas",
                "pos_how_to_merge_tables_and_orders": "POS: Cara Menggabungkan Meja dan Pesanan",
                "pos_how_to_merge_tables_and_orders_desc": "Dari bahagian: Persediaan Asas",
                "pos_how_to_split_bill_orders_items": "POS: Cara Membahagikan Bil/Pesanan/Item",
                "pos_how_to_split_bill_orders_items_desc": "Dari bahagian: Persediaan Asas",

                // KDS
                "kds_how_to_set_up_kitchen_display_system": "KDS: Cara Menyediakan Sistem Paparan Dapur",
                "kds_how_to_find_and_install_kds_kitchen_display_sy": "KDS: Cara Mencari dan Memasang KDS (Sistem Paparan Dapur)",
                "kds_how_to_enable_kds_service_in_the_app": "KDS: Cara Mengaktifkan Perkhidmatan KDS dalam Aplikasi",
                "kds_how_to_set_up_kds_number_via_backoffice": "KDS: Cara Menetapkan Nombor KDS melalui BackOffice",
                "kds_firing_course_via_android": "KDS: Menghantar Arahan Hidangan melalui Android",
                "kds_how_to_update_kitchen_status_via_app_and_force": "KDS: Cara Mengemaskini Status Dapur melalui Aplikasi dan Kosongkan Skrin",

                // MRS (Multiple Register Sync)
                "mrs_how_to_enable_the_mrs_system": "MRS: Cara Mengaktifkan Sistem MRS",
                "mrs_how_to_enable_multiple_register_sync": "MRS: Cara Mengaktifkan Sinkronisasi Pelbagai Daftar",
                "mrs_android_how_to_main_register_sync": "MRS: [Android] Cara Sinkronisasi Daftar Utama",
                "mrs_android_troubleshoot_multiple_register_issues": "MRS: [Android] Penyelesaian Masalah Pelbagai Daftar",

                // Hardware
                "hardware_android_pos_sim_card_sd_card": "Perkakasan: [Android] Kad SIM POS / Kad SD",
                "hardware_android_how_to_set_up_cloud_printing_for_": "Perkakasan: [Android] Cara Menyediakan Percetakan Awan untuk Pesanan",
                "customer_facing_display_cfd_how_to_set_up": "Paparan Pelanggan (CFD): Cara Menyediakan",
                "customer_facing_display_cfd_android_setup": "Paparan Pelanggan (CFD): Persediaan Android",

                // Promotion
                "promotion_how_to_set_up_basic_percentage_off": "Promosi: Cara Menetapkan Diskaun Peratus Asas",
                "promotion_how_to_set_up_take_set_as_off": "Promosi: Cara Menetapkan Ambil Set Sebagai Diskaun",
                "promotion_how_to_set_up_buy_x_free_x-item": "Promosi: Cara Menetapkan Beli X Percuma X",
                "promotion_how_to_set_up_combo_a_b_c_away_price": "Promosi: Cara Menetapkan Harga Kombo (A+B+C)",
                "promotion_how_to_set_up_overwrite_combo_price": "Promosi: Cara Menetapkan Harga Kombo Ganti",
                "promotion_how_to_set_up_order_on_my_ebe": "Promosi: Cara Menetapkan Pesanan di My_eBe",
                "promotion_how_to_set_free_items": "Promosi: Cara Menetapkan Item Percuma",
                "promotion_how_to_set_limited_shipping": "Promosi: Cara Menetapkan Penghantaran Terhad",
                "promotion_how_to_handle_keyed_plan_discount_with_m": "Promosi: Cara Mengendalikan Diskaun Pelan Kunci dengan Promosi Bertingkat",
                "promotion_how_to_set_up_specific_product-purchase": "Promosi: Cara Menetapkan Pembelian Produk Tertentu",

                // Tax Guides
                "tax_guides_ph_how_to_apply_tax_vat_in_the_superpos": "Panduan Cukai: [PH] Cara Menggunakan Cukai (VAT) di BackOffice QPOS",

                // POS Troubleshooting
                "pos_troubleshooting_i_cannot_perform_pos_app_troub": "Penyelesaian Masalah POS: Saya tidak dapat melakukan penyelesaian masalah Aplikasi POS",
                "pos_troubleshooting_i_cannot_see_pos_login_id_emai": "Penyelesaian Masalah POS: Saya tidak dapat melihat ID log masuk / e-mel POS",
                "pos_troubleshooting_issues_for_scanning_and_pos_fe": "Penyelesaian Masalah POS: Isu untuk Pengimbasan dan Ciri POS",
                "pos_troubleshooting_saving_changes_on_your_price_c": "Penyelesaian Masalah POS: Menyimpan Perubahan pada Pusat Harga anda",
                "pos_troubleshooting_inventory_not_reflecting_manua": "Penyelesaian Masalah POS: Inventori tidak mencerminkan secara Manual pada Item",

                // New iOS
                "new_ios_intro": "iOS Baru: Pengenalan",
                "new_ios_features": "iOS Baru: Ciri-ciri",
                "new_ios_cancellation_refund": "iOS Baru: Pembatalan & Bayaran Balik",
                "new_ios_cashier": "iOS Baru: Juruwang",
                "new_ios_products": "iOS Baru: Produk",
                "new_ios_payment": "iOS Baru: Pembayaran",

                // Setting Up - BackOffice
                "how_to_manage_your_stores": "Cara Menguruskan Kedai Anda",
                "how_to_manage_your_stores_desc": "Dari bahagian: BackOffice",
                "how_to_manage_your_pos_registers": "Cara Menguruskan Daftar POS Anda",
                "how_to_manage_your_products": "Cara Menguruskan Produk Anda",
                "how_to_manage_your_tax_codes": "Cara Menguruskan Kod Cukai Anda",
                "how_to_manage_your_pos_layouts": "Cara Menguruskan Susun Atur POS Anda",
                "how_to_manage_your_payment_options": "Cara Menguruskan Pilihan Pembayaran Anda",
                "how_to_manage_receipt_settings": "Cara Menguruskan Tetapan Resit",

                // BackOffice General
                "backoffice_how_to_sign_up_log_in": "BackOffice: Cara Mendaftar & Log Masuk",
                "backoffice_disclosure_for_backoffice_access": "BackOffice: Pendedahan untuk Akses BackOffice",
                "backoffice_how_to_export_accounting_systems_sales_": "BackOffice: Cara Mengeksport Data Jualan Sistem Perakaunan",
                "backoffice_how_to_change_language": "BackOffice: Cara Menukar Bahasa",
                "backoffice_how_to_transfer_superpos_account_owners": "BackOffice: Cara Memindahkan Pemilikan Akaun QPOS",
                "backoffice_how_to_print_multiple_kitchen_dockets": "BackOffice: Cara Mencetak Pelbagai Dapur Docket",
                "backoffice_how_to_reset_account_data": "BackOffice: Cara Menetapkan Semula Data Akaun",
                "backoffice_supported_browser_versions": "BackOffice: Versi Pelayar yang Disokong",
                "backoffice_dashboard_sales_comparisons": "BackOffice: Perbandingan Jualan Papan Pemuka",

                // Setting Up - App & Hardware
                "how_to_set_up_your_superpos_pos_register_download": "Cara Menyediakan Daftar POS QPOS Anda (Muat Turun, Aktifkan, Nyahaktifkan)",
                "how_to_set_up_your_superpos_pos_register_download_activate_deactivate": "Cara Menyediakan Daftar POS QPOS Anda (Muat Turun, Aktifkan, Nyahaktifkan)",
                "how_to_arrange_your_product_layouts_on_the_superpo": "Cara Menyusun Susun Atur Produk Anda pada Aplikasi POS QPOS",
                "how_to_arrange_your_product_layouts_on_the_superpos_pos_app": "Cara Menyusun Susun Atur Produk Anda pada Aplikasi POS QPOS",
                "superpos_manager_app_how_to_use": "Aplikasi Pengurus QPOS: Cara Menggunakan",
                "superpos_manager_app_how_to_manage_beep_delivery_o": "Aplikasi Pengurus QPOS: Cara Menguruskan Pesanan Penghantaran Beep",
                "superpos_manager_app_how_to_manage_beep_delivery_orders": "Aplikasi Pengurus QPOS: Cara Menguruskan Pesanan Penghantaran Beep",
                "superpos_manager_app_how_to_mark_beep_menu_items_a": "Aplikasi Pengurus QPOS: Cara Menandakan Item Menu Beep sebagai Ada Stok atau Habis Stok",
                "superpos_manager_app_how_to_perform_stock_take_usi": "Aplikasi Pengurus QPOS: Cara Melakukan Pengambilan Stok menggunakan Pengimbas",
                "hardware_how_to_perform_basic_set_up": "Perkakasan: Cara Melakukan Persediaan Asas",
                "hardware_how_to_set_up_sunmi_android_t2c": "Perkakasan: Cara Menyediakan Sunmi & Android T2C",
                "hardware_ipad_how_to_set_up_register": "Perkakasan: [iPad] Cara Menyediakan Daftar",
                "hardware_mini_set_up_guide_and_user_manuals": "Perkakasan: [Mini] Panduan Persediaan dan Manual Pengguna",

                // Product Mgmt
                "product_setting_up": "Produk: Menetapkan",
                "product_stock_management": "Produk: Pengurusan Stok",
                "product_inventory_management": "Produk: Pengurusan Inventori",

                // Customer
                "customer_data_communication": "Pelanggan: Data & Komunikasi",
                "customer_handling_transactions": "Pelanggan: Pengendalian Transaksi",

                // Membership
                "membership_how_to_get_started": "Keahlian: Cara Bermula",
                "membership_go_live": "Keahlian: Siarkan Langsung",
                "membership_how_to_enroll_customers-to-membership": "Keahlian: Cara Mendaftarkan Pelanggan ke Keahlian",
                "membership_how_to_review_customer-points-and-detai": "Keahlian: Cara Menyemak Mata dan Butiran Pelanggan",
                "membership_navigation_on_the_membership-pages-and-": "Keahlian: Navigasi pada Halaman Keahlian dan Daftar POS",
                "membership_how_to_monitor_performance-and-insights": "Keahlian: Cara Memantau Prestasi dan Pandangan",
                "membership_how_to_set_up_membership-tier-rewards": "Keahlian: Cara Menetapkan Tahap & Ganjaran Keahlian",
                "membership_how_to_import_your-existing-loyalty-dat": "Keahlian: Cara Mengimport Data Kesetiaan Anda yang Ada",
                "membership_faq": "Keahlian: Soalan Lazim",

                // Beep Delivery
                "beep_delivery_general": "Penghantaran Beep: Umum",
                "beep_delivery_functions_in_the_backoffice": "Penghantaran Beep: Fungsi dalam BackOffice",
                "beep_delivery_pre_orders": "Penghantaran Beep: Prah-Pesanan",
                "beep_delivery_logistics": "Penghantaran Beep: Logistik",
                "beep_delivery_troubleshooting": "Penghantaran Beep: Penyelesaian Masalah",

                // Misc
                "superpos_engage": "Penglibatan QPOS",
                "superpos_engage_malaysia": "Penglibatan QPOS: Malaysia",
                "superpos_engage_philippines": "Penglibatan QPOS: Filipina",
                "superpos_engage_thailand": "Penglibatan QPOS: Thailand",
                "boost_google_review_malaysia": "Tingkatkan Ulasan Google: Malaysia",
                "boost_google_review_philippines": "Tingkatkan Ulasan Google: Filipina",
                "boost_google_review_thailand": "Tingkatkan Ulasan Google: Thailand",
                "qr_order_pay_pos_app": "Pesanan & Bayar QR: Aplikasi POS",
                "qr_order_pay_functions_in_the_backoffice": "Pesanan & Bayar QR: Fungsi dalam BackOffice",

                // Step Content (for verified articles)
                "how_to_manage_your_stores_step_1_content": "Pastikan untuk menguji bahagian depan dan belakang terlebih dahulu sebelum memproses ke tahap pembaikan yang lain.",
                "how_to_manage_your_stores_step_2_content": "Pastikan untuk menguji bahagian depan dan belakang terlebih dahulu sebelum memproses ke tahap pembaikan yang lain.",
                "how_to_manage_your_stores_step_3_content": "Pastikan untuk menguji bahagian depan dan belakang terlebih dahulu sebelum memproses ke tahap pembaikan yang lain.",

                // Additional Articles from data/articles.js
                // QR Payment
                "my_superpos_qr_payment_maybank_qrpay": "[MY] Pembayaran QR QPOS: Maybank QRPay",
                "th_superpos_qr_payment_ghl_payment": "[TH] Pembayaran QR QPOS: GHL Payment",

                // Cashback
                "cashback_how_does_it_work": "Pulangan Tunai: Bagaimana Ia Berfungsi",
                "cashback_how_to_manage_settings": "Pulangan Tunai: Cara Mengurus Tetapan",
                "cashback_monitoring_performance_with_cashback_report": "Pulangan Tunai: Memantau Prestasi dengan Laporan Pulangan Tunai",
                "cashback_ph_beep_cashback_for_bir_enabled_account": "Pulangan Tunai: [PH] Pulangan Tunai Beep untuk Akaun Dayakan BIR",
                "cashback_faq": "Pulangan Tunai: Soalan Lazim",

                // Webstore
                "webstore_setting_up": "Kedai Web: Menyediakan",
                "webstore_payment_methods": "Kedai Web: Kaedah Pembayaran",
                "webstore_selling_on_facebook": "Kedai Web: Menjual di Facebook",
                "webstore_tax_settings": "Kedai Web: Tetapan Cukai",

                // Payouts
                "payouts_how_to_receive": "Pembayaran: Cara Menerima",

                // Hardware Printers & Routers
                "how_to_set_up_your_superpos_printer": "Cara Menyediakan Pencetak QPOS Anda",
                "how_to_manage_network_settings_for_your_superpos_pos_and_printer": "Cara Mengurus Tetapan Rangkaian untuk POS dan Pencetak QPOS Anda",
                "how_to_troubleshoot_common_superpos_printer_issues": "Cara Menyelesaikan Masalah Pencetak QPOS Biasa",
                "how_to_set_up_your_bixolon_label_printer_and_print_barcodes_desktop": "Cara Menyediakan Pencetak Label Bixolon Anda dan Mencetak Kod Bar (Desktop)",
                "how_to_use_the_bixolon_label_artist_mobile_app_to_print_barcodes": "Cara Menggunakan Aplikasi Mudah Alih Bixolon Label Artist untuk Mencetak Kod Bar",
                "cash_drawer_how_to_troubleshoot": "Laci Tunai: Cara Penyelesaian Masalah",
                "cash_drawer_how_to_open": "Laci Tunai: Cara Membuka",
                "router_troubleshooting_how_to_configure_tp_link_archer_c6": "Penyelesaian Masalah Router: Cara Konfigurasi TP-Link Archer C6",
                "router_troubleshooting_how_to_reset_configure_asus_rt_ax56u_router": "Penyelesaian Masalah Router: Cara Tetapkan Semula & Konfigurasi Router ASUS RT-AX56U",
                "router_troubleshooting_how_to_identify_mikrotik_routers": "Penyelesaian Masalah Router: Cara Mengenal Pasti Router Mikrotik",
                "faq_pos_hardware_supplementary_device_support": "Soalan Lazim: Perkakasan POS & Sokongan Peranti Tambahan",
                "faq_hardware_delivery_issues": "Soalan Lazim: Isu Penghantaran Perkakasan",
                "tablet_stand_how_to_install_heckler_windfall_ipad_stand": "Pendirian Tablet: Cara Memasang Pendirian iPad Heckler Windfall",
                "tablet_stand_how_to_install_pr_ts201": "Pendirian Tablet: Cara Memasang PR-TS201",

                // External Integrations
                "external_integration_logging_into_backoffice_with_single_sign_on_sso": "Integrasi Luaran: Log Masuk ke BackOffice dengan Log Masuk Tunggal (SSO)",

                // Step labels
                "step_1": "Langkah 1",
                "step_2": "Langkah 2",
                "step_3": "Langkah 3",
                "step_4": "Langkah 4",
                "step_5": "Langkah 5",
                // Overview text
                "overview": "Gambaran Keseluruhan",
                "this_article_covers": "Artikel ini merangkumi:",
                "section": "Bahagian:",
                "add_content_instruction": "Tambah kandungan terperinci dan imej melalui Panel Admin.",
                "from_section": "Dari bahagian:"
            },
            "contact": {
                "title": "Hubungi Kami",
                "subtitle": "Pasukan sokongan kami sedia membantu anda berjaya",
                "chat_title": "Sembang Langsung",
                "chat_desc": "Berbual dengan pasukan sokongan kami dalam masa nyata. Isnin-Jumaat, 9AM-6PM.",
                "start_chat": "Mula Sembang",
                "email_title": "Sokongan E-mel",
                "email_desc": "Hantar mesej terperinci. Kami balas dalam masa 24 jam.",
                "email_btn": "E-mel Kami",
                "phone_title": "WhatsApp Support",
                "phone_desc": "WhatsApp us for urgent issues. Available Mon-Fri, 9AM-6PM.",
                "call_now": "WhatsApp Now",
                "form_title": "Hantar Mesej",
                "name_label": "Nama Anda",
                "name_placeholder": "Masukkan nama anda",
                "email_label": "Alamat E-mel",
                "email_placeholder": "anda@contoh.com",
                "topic_label": "Topik",
                "topic_placeholder": "Pilih topik",
                "topic_general": "Pertanyaan Umum",
                "topic_tech": "Sokongan Teknikal",
                "topic_billing": "Pebilan",
                "topic_feature": "Permintaan Ciri",
                "message_label": "Mesej",
                "message_placeholder": "Bagaimana kami boleh bantu anda?",
                "send_btn": "Hantar Mesej",
                "success_alert": "Mesej dihantar! (Simulasi)"
            },
            "privacy": {
                "title": "Dasar Privasi",
                "last_updated": "Terakhir dikemaskini: {{date}}",
                "intro": "Di QPOS, kami mengambil serius privasi anda. Dasar Privasi ini menjelaskan bagaimana kami mengumpul, menggunakan, mendedahkan, dan melindungi maklumat anda apabila anda melawat laman web kami atau menggunakan perkhidmatan tempat jualan kami.",
                "s1_title": "1. Maklumat yang Kami Kumpul",
                "s1_intro": "Kami mengumpul maklumat yang anda berikan secara langsung kepada kami. Ini termasuk:",
                "s1_l1": "Data Peribadi: Nama, alamat e-mel, nombor telefon, dan butiran perniagaan apabila anda mendaftar atau menghubungi sokongan.",
                "s1_l2": "Data Transaksi: Butiran mengenai pembayaran kepada dan daripada anda dan butiran lain mengenai produk dan perkhidmatan yang anda beli daripada kami.",
                "s1_l3": "Data Teknikal: Alamat protokol internet (IP), data log masuk anda, jenis dan versi pelayar, tetapan zon masa dan lokasi.",
                "s2_title": "2. Bagaimana Kami Menggunakan Maklumat Anda",
                "s2_intro": "Kami menggunakan maklumat yang kami kumpul untuk pelbagai tujuan, termasuk untuk:",
                "s2_l1": "Menyediakan, mengendalikan, dan mengekalkan laman web dan perkhidmatan kami.",
                "s2_l2": "Memperbaiki, memperibadikan, dan mengembangkan laman web kami.",
                "s2_l3": "Memahami dan menganalisis bagaimana anda menggunakan laman web kami.",
                "s2_l4": "Membangunkan produk, perkhidmatan, ciri, dan fungsi baru.",
                "s2_l5": "Berkomunikasi dengan anda, sama ada secara langsung atau melalui rakan kongsi kami, termasuk untuk perkhidmatan pelanggan.",
                "s3_title": "3. Keselamatan Data",
                "s3_desc": "Kami menggunakan langkah keselamatan pentadbiran, teknikal, dan fizikal untuk membantu melindungi maklumat peribadi anda. Walaupun kami telah mengambil langkah yang munasabah untuk melindungi maklumat peribadi yang anda berikan, sila sedar bahawa tiada langkah keselamatan yang sempurna, dan tiada kaedah penghantaran data boleh dijamin.",
                "s4_title": "4. Dasar Privasi Pihak Ketiga",
                "s4_desc": "Dasar Privasi QPOS tidak terpakai kepada pengiklan atau laman web lain. Oleh itu, kami menasihatkan anda untuk merujuk Dasar Privasi pelayan iklan pihak ketiga ini untuk maklumat lebih terperinci.",
                "s5_title": "5. Hubungi Kami",
                "s5_desc": "Jika anda mempunyai sebarang soalan tentang Dasar Privasi kami, jangan ragu untuk menghubungi kami."
            }
        }
    },
    zh: {
        translation: {
            "nav": {
                "home": "主页",
                "search_placeholder": "搜索文章...",
                "no_results": "未找到关于 \"{{query}}\" 的文章",
                "solutions_title": "解决方案尽在指尖"
            },
            "common": {
                "loading": "加载中...",
                "view_site": "查看网站",
                "copyright": "© 2026 QPOS. 版权所有。"
            },
            "categories": {
                "title": "按类别浏览",
                "view_articles": "{{count}} 篇文章",
                "setting_up": "设置与安装",
                "setting_up_desc": "您的分步指南，帮助您有效地设置和使用系统。",
                "pos_system": "销售点 (POS) 系统",
                "pos_system_desc": "通过我们的POS系统改变您的结账流程。了解如何配置和集成所有必要的组件。",
                "point_of_sale_pos_system": "销售点 (POS) 系统",
                "point_of_sale_pos_system_desc": "通过我们的POS系统改变您的结账流程。了解如何配置和集成所有必要的组件。",
                "hardware": "硬件设备",
                "hardware_desc": "确保您的硬件设置正确，以实现高效的业务运营。",
                "troubleshooting": "故障排除",
                "troubleshooting_desc": "遇到问题？我们的故障排除指南提供了常见问题的解决方案。",
                "integrations": "外部集成",
                "integrations_desc": "了解更多关于我们的生态系统如何与支持的商场和其他应用程序集成的信息！",
                "external_integrations": "外部集成",
                "external_integrations_desc": "了解更多关于我们的生态系统如何与支持的商场和其他应用程序集成的信息！",
                "backoffice": "后台管理",
                "backoffice_desc": "您的业务管理中心枢纽。监控绩效，更新设置，并获取关键见解。",
                "online_orders": "在线订单",
                "online_orders_desc": "轻松管理和处理在线订单。跟踪销售，处理配送，并管理客户订单。",
                "reports": "报表",
                "reports_desc": "在后台访问并生成详细报告。",
                "tax_guides": "税务指南",
                "tax_guides_desc": "在后台访问重要的税务指南，帮助您保持合规。",
                "getting_started": "入门指南",
                "getting_started_desc": "设置您的商店、产品和POS系统，开始管理销售、库存和绩效！",
                "quick_help": "快速帮助",
                "quick_help_desc": "寻找快速解答？我们的快速帮助指南提供快速解决方案，帮助您顺利运行。",
                "no_categories": "暂无分类"
            },
            "footer": {
                "contact_us": "联系我们",
                "privacy": "隐私政策"
            },
            "article": {
                "loading": "文章加载中...",
                "not_found": "未找到文章",
                "not_found_desc": "抱歉，我们也无法找到您查找的文章。",
                "back_home": "返回帮助中心",
                "steps_count": "{{count}} 个步骤",
                "updated": "更新于 {{date}}",
                "on_this_page": "本页内容",
                "overview": "概览",
                "need_help": "需要更多帮助？",
                "watch_video": "观看视频指南",
                "no_steps": "此文章暂无步骤。",
                "feedback_question": "这篇文章有帮助吗？",
                "yes": "是",
                "no": "否",
                "feedback_thanks": "感谢反馈！很高兴能帮到您。😊",
                "feedback_sorry": "很抱歉。如需帮助请联系客服。",
                "still_need_help": "仍需帮助？",
                "contact_support_desc": "联系我们的支持团队获取个性化帮助。",
                "contact_support_btn": "联系支持"
            },
            "category": {
                "not_found": "未找到分类",
                "all_collections": "所有分类",
                "no_articles": "此分类暂无已发布文章。",
                "add_article": "在管理后台添加问题 →",
                "all_articles": "所有文章"
            },
            "articles": {
                // POS System articles
                // POS System - General
                "pos_how_to_merge_tables_and_orders": "POS：如何合并餐桌和订单",
                "pos_how_to_merge_tables_and_orders_desc": "来自章节：基础设置",
                "pos_how_to_split_bill_orders_items": "POS：如何拆单/分账",
                "pos_how_to_split_bill_orders_items_desc": "来自章节：基础设置",

                // KDS
                "kds_how_to_set_up_kitchen_display_system": "KDS：如何设置厨房显示系统",
                "kds_how_to_find_and_install_kds_kitchen_display_sy": "KDS：如何查找并安装 KDS（厨房显示系统）",
                "kds_how_to_enable_kds_service_in_the_app": "KDS：如何在应用中启用 KDS 服务",
                "kds_how_to_set_up_kds_number_via_backoffice": "KDS：如何通过后台设置 KDS 编号",
                "kds_firing_course_via_android": "KDS：通过 Android 发送上菜指令",
                "kds_how_to_update_kitchen_status_via_app_and_force": "KDS：如何通过应用更新厨房状态并强制清除屏幕",

                // MRS (Multiple Register Sync)
                "mrs_how_to_enable_the_mrs_system": "MRS：如何启用 MRS 系统",
                "mrs_how_to_enable_multiple_register_sync": "MRS：如何启用多收银机同步",
                "mrs_android_how_to_main_register_sync": "MRS：[Android] 如何进行主收银机同步",
                "mrs_android_troubleshoot_multiple_register_issues": "MRS：[Android] 多收银机问题故障排除",

                // Hardware
                "hardware_android_pos_sim_card_sd_card": "硬件：[Android] POS SIM 卡 / SD 卡",
                "hardware_android_how_to_set_up_cloud_printing_for_": "硬件：[Android] 如何设置订单云打印",
                "customer_facing_display_cfd_how_to_set_up": "客显 (CFD)：如何设置",
                "customer_facing_display_cfd_android_setup": "客显 (CFD)：Android 设置",

                // Promotion
                "promotion_how_to_set_up_basic_percentage_off": "促销：如何设置基本百分比折扣",
                "promotion_how_to_set_up_take_set_as_off": "促销：如何设置“以...价格购买”折扣",
                "promotion_how_to_set_up_buy_x_free_x-item": "促销：如何设置买 X 送 X",
                "promotion_how_to_set_up_combo_a_b_c_away_price": "促销：如何设置套餐 (A+B+C) 价格",
                "promotion_how_to_set_up_overwrite_combo_price": "促销：如何设置覆盖套餐价格",
                "promotion_how_to_set_up_order_on_my_ebe": "促销：如何设置 My_eBe 订单",
                "promotion_how_to_set_free_items": "促销：如何设置免费商品",
                "promotion_how_to_set_limited_shipping": "促销：如何设置有限运费",
                "promotion_how_to_handle_keyed_plan_discount_with_m": "促销：如何处理多层级促销的键入计划折扣",
                "promotion_how_to_set_up_specific_product-purchase": "促销：如何设置特定商品购买",

                // Tax Guides
                "tax_guides_ph_how_to_apply_tax_vat_in_the_superpos": "税务指南：[PH] 如何在 QPOS 后台应用税费 (VAT)",

                // POS Troubleshooting
                "pos_troubleshooting_i_cannot_perform_pos_app_troub": "POS 故障排除：无法执行 POS 应用故障排除",
                "pos_troubleshooting_i_cannot_see_pos_login_id_emai": "POS 故障排除：无法看到 POS 登录 ID / 邮箱",
                "pos_troubleshooting_issues_for_scanning_and_pos_fe": "POS 故障排除：扫描和 POS 功能问题",
                "pos_troubleshooting_saving_changes_on_your_price_c": "POS 故障排除：保存价格中心更改",
                "pos_troubleshooting_inventory_not_reflecting_manua": "POS 故障排除：库存未在商品上手动反映",

                // New iOS
                "new_ios_intro": "新 iOS：简介",
                "new_ios_features": "新 iOS：功能",
                "new_ios_cancellation_refund": "新 iOS：取消与退款",
                "new_ios_cashier": "新 iOS：收银员",
                "new_ios_products": "新 iOS：商品",
                "new_ios_payment": "新 iOS：支付",

                // Setting Up - BackOffice
                "how_to_manage_your_stores": "如何管理您的门店",
                "how_to_manage_your_stores_desc": "来自章节：后台管理",
                "how_to_manage_your_pos_registers": "如何管理您的 POS 收银台",
                "how_to_manage_your_products": "如何管理您的商品",
                "how_to_manage_your_tax_codes": "如何管理您的税码",
                "how_to_manage_your_pos_layouts": "如何管理您的 POS 布局",
                "how_to_manage_your_payment_options": "如何管理您的支付方式",
                "how_to_manage_receipt_settings": "如何管理收据设置",

                // BackOffice General
                "backoffice_how_to_sign_up_log_in": "后台：如何注册和登录",
                "backoffice_disclosure_for_backoffice_access": "后台：后台访问披露",
                "backoffice_how_to_export_accounting_systems_sales_": "后台：如何导出会计系统销售数据",
                "backoffice_how_to_change_language": "后台：如何更改语言",
                "backoffice_how_to_transfer_superpos_account_owners": "后台：如何转让 QPOS 账户所有权",
                "backoffice_how_to_print_multiple_kitchen_dockets": "后台：如何打印多张厨房单据",
                "backoffice_how_to_reset_account_data": "后台：如何重置账户数据",
                "backoffice_supported_browser_versions": "后台：支持的浏览器版本",
                "backoffice_dashboard_sales_comparisons": "后台：仪表板销售对比",

                // Setting Up - App & Hardware
                "how_to_set_up_your_superpos_pos_register_download": "如何设置您的 QPOS POS 收银机（下载、激活、停用）",
                "how_to_set_up_your_superpos_pos_register_download_activate_deactivate": "如何设置您的 QPOS POS 收银机（下载、激活、停用）",
                "how_to_arrange_your_product_layouts_on_the_superpo": "如何在 QPOS POS 应用上排列商品布局",
                "how_to_arrange_your_product_layouts_on_the_superpos_pos_app": "如何在 QPOS POS 应用上排列商品布局",
                "superpos_manager_app_how_to_use": "QPOS 管理应用：如何使用",
                "superpos_manager_app_how_to_manage_beep_delivery_o": "QPOS 管理应用：如何管理 Beep 外卖订单",
                "superpos_manager_app_how_to_manage_beep_delivery_orders": "QPOS 管理应用：如何管理 Beep 外卖订单",
                "superpos_manager_app_how_to_mark_beep_menu_items_a": "QPOS 管理应用：如何标记 Beep 菜单商品为有货或缺货",
                "superpos_manager_app_how_to_perform_stock_take_usi": "QPOS 管理应用：如何使用扫描仪进行盘点",
                "hardware_how_to_perform_basic_set_up": "硬件：如何进行基本设置",
                "hardware_how_to_set_up_sunmi_android_t2c": "硬件：如何设置 Sunmi & Android T2C",
                "hardware_ipad_how_to_set_up_register": "硬件：[iPad] 如何设置收银台",
                "hardware_mini_set_up_guide_and_user_manuals": "硬件：[Mini] 设置指南和用户手册",

                // Product Mgmt
                "product_setting_up": "商品：设置",
                "product_stock_management": "商品：库存管理",
                "product_inventory_management": "商品：存货管理",

                // Customer
                "customer_data_communication": "客户：数据与沟通",
                "customer_handling_transactions": "客户：处理交易",

                // Membership
                "membership_how_to_get_started": "会员：如何开始",
                "membership_go_live": "会员：上线",
                "membership_how_to_enroll_customers-to-membership": "会员：如何注册客户为会员",
                "membership_how_to_review_customer-points-and-detai": "会员：如何查看客户积分和详情",
                "membership_navigation_on_the_membership-pages-and-": "会员：会员页面和 POS 收银台导航",
                "membership_how_to_monitor_performance-and-insights": "会员：如何监控表现和洞察",
                "membership_how_to_set_up_membership-tier-rewards": "会员：如何设置会员等级和奖励",
                "membership_how_to_import_your-existing-loyalty-dat": "会员：如何导入现有忠诚度数据",
                "membership_faq": "会员：常见问题",

                // Beep Delivery
                "beep_delivery_general": "Beep 外卖：通用",
                "beep_delivery_functions_in_the_backoffice": "Beep 外卖：后台功能",
                "beep_delivery_pre_orders": "Beep 外卖：预订",
                "beep_delivery_logistics": "Beep 外卖：物流",
                "beep_delivery_troubleshooting": "Beep 外卖：故障排除",

                // Misc
                "superpos_engage": "QPOS 互动",
                "superpos_engage_malaysia": "QPOS 互动：马来西亚",
                "superpos_engage_philippines": "QPOS 互动：菲律宾",
                "superpos_engage_thailand": "QPOS 互动：泰国",
                "boost_google_review_malaysia": "提升谷歌评价：马来西亚",
                "boost_google_review_philippines": "提升谷歌评价：菲律宾",
                "boost_google_review_thailand": "提升谷歌评价：泰国",
                "qr_order_pay_pos_app": "二维码点餐支付：POS 应用",
                "qr_order_pay_functions_in_the_backoffice": "二维码点餐支付：后台功能",

                // Step Content (for verified articles)
                "how_to_manage_your_stores_step_1_content": "确保在进行下一级修复之前先测试前端和后端。",
                "how_to_manage_your_stores_step_2_content": "确保在进行下一级修复之前先测试前端和后端。",
                "how_to_manage_your_stores_step_3_content": "确保在进行下一级修复之前先测试前端和后端。",

                // Additional Articles from data/articles.js
                // QR Payment
                "my_superpos_qr_payment_maybank_qrpay": "[MY] QPOS 扫码支付：Maybank QRPay",
                "th_superpos_qr_payment_ghl_payment": "[TH] QPOS 扫码支付：GHL Payment",

                // Cashback
                "cashback_how_does_it_work": "返现：如何运作",
                "cashback_how_to_manage_settings": "返现：如何管理设置",
                "cashback_monitoring_performance_with_cashback_report": "返现：使用返现报告监控表现",
                "cashback_ph_beep_cashback_for_bir_enabled_account": "返现：[PH] 启用 BIR 账户的 Beep 返现",
                "cashback_faq": "返现：常见问题",

                // Webstore
                "webstore_setting_up": "网店：设置",
                "webstore_payment_methods": "网店：支付方式",
                "webstore_selling_on_facebook": "网店：在 Facebook 上销售",
                "webstore_tax_settings": "网店：税务设置",

                // Payouts
                "payouts_how_to_receive": "提现：如何接收",

                // Hardware Printers & Routers
                "how_to_set_up_your_superpos_printer": "如何设置您的 QPOS 打印机",
                "how_to_manage_network_settings_for_your_superpos_pos_and_printer": "如何管理 QPOS POS 和打印机的网络设置",
                "how_to_troubleshoot_common_superpos_printer_issues": "如何排除常见的 QPOS 打印机问题",
                "how_to_set_up_your_bixolon_label_printer_and_print_barcodes_desktop": "如何设置 Bixolon 标签打印机并打印条形码（桌面版）",
                "how_to_use_the_bixolon_label_artist_mobile_app_to_print_barcodes": "如何使用 Bixolon Label Artist 移动应用打印条形码",
                "cash_drawer_how_to_troubleshoot": "钱箱：如何故障排除",
                "cash_drawer_how_to_open": "钱箱：如何打开",
                "router_troubleshooting_how_to_configure_tp_link_archer_c6": "路由器故障排除：如何配置 TP-Link Archer C6",
                "router_troubleshooting_how_to_reset_configure_asus_rt_ax56u_router": "路由器故障排除：如何重置和配置 ASUS RT-AX56U 路由器",
                "router_troubleshooting_how_to_identify_mikrotik_routers": "路由器故障排除：如何识别 Mikrotik 路由器",
                "faq_pos_hardware_supplementary_device_support": "常见问题：POS 硬件及辅助设备支持",
                "faq_hardware_delivery_issues": "常见问题：硬件配送问题",
                "tablet_stand_how_to_install_heckler_windfall_ipad_stand": "平板支架：如何安装 Heckler Windfall iPad 支架",
                "tablet_stand_how_to_install_pr_ts201": "平板支架：如何安装 PR-TS201",

                // External Integrations
                "external_integration_logging_into_backoffice_with_single_sign_on_sso": "外部集成：使用单点登录 (SSO) 登录后台",

                // Step labels
                "step_1": "步骤 1",
                "step_2": "步骤 2",
                "step_3": "步骤 3",
                "step_4": "步骤 4",
                "step_5": "步骤 5",
                "overview": "概览",
                "this_article_covers": "本文章涵盖：",
                "section": "章节：",
                "add_content_instruction": "请通过管理后台添加详细内容和图片。",
                "from_section": "来自章节："
            },
            "contact": {
                "title": "联系我们",
                "subtitle": "我们的支持团队随时为您提供帮助",
                "chat_title": "在线聊天",
                "chat_desc": "与我们的支持团队实时聊天。周一至周五，上午9点至下午6点。",
                "start_chat": "开始聊天",
                "email_title": "邮件支持",
                "email_desc": "发送详细信息。我们在24小时内回复。",
                "email_btn": "发送邮件",
                "phone_title": "WhatsApp Support",
                "phone_desc": "WhatsApp us for urgent issues. Available Mon-Fri, 9AM-6PM.",
                "call_now": "WhatsApp Now",
                "form_title": "发送留言",
                "name_label": "您的姓名",
                "name_placeholder": "输入您的姓名",
                "email_label": "电子邮件",
                "email_placeholder": "you@example.com",
                "topic_label": "主题",
                "topic_placeholder": "选择主题",
                "topic_general": "一般咨询",
                "topic_tech": "技术支持",
                "topic_billing": "账单",
                "topic_feature": "功能建议",
                "message_label": "留言内容",
                "message_placeholder": "我们需要如何帮助您？",
                "send_btn": "发送留言",
                "success_alert": "留言已发送！（模拟）"
            },
            "privacy": {
                "title": "隐私政策",
                "last_updated": "最后更新：{{date}}",
                "intro": "在QPOS，我们非常重视您的隐私。本隐私政策说明了当您访问我们的网站或使用我们的POS服务时，我们要如何收集、使用、披露和保护您的信息。",
                "s1_title": "1. 我们收集的信息",
                "s1_intro": "我们仅收集您直接提供给我们的信息。这包括：",
                "s1_l1": "个人数据：注册或联系支持时的姓名、电子邮箱、电话号码和业务详情。",
                "s1_l2": "交易数据：关于进出款项的详情以及您购买的产品和服务的其他详情。",
                "s1_l3": "技术数据：互联网协议（IP）地址、登录数据、浏览器类型和版本、时区设置和位置。",
                "s2_title": "2. 我们如何使用您的信息",
                "s2_intro": "我们将收集的信息用于各种目的，包括：",
                "s2_l1": "提供、运营和维护我们的网站和服务。",
                "s2_l2": "改进、个性化和扩展我们的网站。",
                "s2_l3": "了解和分析您如何使用我们的网站。",
                "s2_l4": "开发新产品、服务、功能和特性。",
                "s2_l5": "与您沟通，包括客户服务。",
                "s3_title": "3. 数据安全",
                "s3_desc": "我们采用行政、技术和物理安全措施来保护您的个人信息。尽管我们已采取合理措施，但请注意没有任何安全措施是完美的，也没有数据传输方法可以保证绝对安全。",
                "s4_title": "4. 第三方隐私政策",
                "s4_desc": "QPOS的隐私政策不适用于其他广告商或网站。因此，我们建议您咨询这些第三方广告服务器的隐私政策以获取更详细的信息。",
                "s5_title": "5. 联系我们",
                "s5_desc": "如果您对我们的隐私政策有任何疑问，请随时联系我们。"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Force English
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already safes from xss
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
