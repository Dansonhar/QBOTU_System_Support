import {
    Monitor,
    Smartphone,
    LayoutGrid,
    ShoppingCart,
    FileText,
    Receipt,
    Printer,
    Link2,
    Rocket,
    Wrench,
    HelpCircle,
    QrCode,
    Tablet,
    Users,
    Calendar,
    Ticket,
    Tv,
    ChefHat,
    ListChecks,
    CheckCircle
} from 'lucide-react';

export const categories = [
    {
        id: 'setting-up',
        title: 'Setting Up',
        description: 'Your step-by-step guide to setting up and using the system effectively.',
        icon: Rocket,
        articleCount: 24
    },
    {
        id: 'pos-system',
        title: 'Point of Sale (POS) System',
        description: 'Transform your checkout process with our POS system. Learn how to configure and integrate all necessary components.',
        icon: Monitor,
        articleCount: 77
    },
    {
        id: 'backoffice',
        title: 'BackOffice',
        description: 'Your central hub for business management. Monitor performance, update settings, and access key insights.',
        icon: LayoutGrid,
        articleCount: 67
    },
    {
        id: 'online-orders',
        title: 'Online Orders',
        description: 'Effortlessly manage and process online orders. Track sales, handle deliveries, and manage customer orders.',
        icon: ShoppingCart,
        articleCount: 60
    },
    {
        id: 'reports',
        title: 'Reports',
        description: 'Access and generate detailed reports in the BackOffice.',
        icon: FileText,
        articleCount: 6
    },
    {
        id: 'tax-guides',
        title: 'Tax Guides',
        description: 'Access essential tax guides in the BackOffice to help you stay compliant.',
        icon: Receipt,
        articleCount: 14
    },
    {
        id: 'hardware',
        title: 'Hardware',
        description: 'Ensure your hardware is set up correctly for efficient business operations.',
        icon: Printer,
        articleCount: 14
    },
    {
        id: 'integrations',
        title: 'External Integrations',
        description: 'Find out more about how our ecosystem can integrate with supported malls & other applications!',
        icon: Link2,
        articleCount: 31
    },
    {
        id: 'getting-started',
        title: 'Getting Started',
        description: 'Set up your store, products, and POS system to start managing sales, inventory, and performance!',
        icon: Rocket,
        articleCount: 61
    },
    {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        description: 'Having issues? Our troubleshooting guide provides solutions for common problems.',
        icon: Wrench,
        articleCount: 5
    },
    {
        id: 'quick-help',
        title: 'Quick Help',
        description: 'Looking for quick answers? Our Quick Help guide provides fast solutions to get you up and running.',
        icon: HelpCircle,
        articleCount: 8
    }
];

// Module groups for the Modules page - organized by product area
export const modules = [
    {
        id: 'sales-channels',
        title: 'Sales Channels',
        icon: ShoppingCart,
        items: [
            {
                id: 'q-pos',
                name: 'Q POS',
                description: 'Main point of sale terminal',
                icon: Monitor,
                status: 'active',
                to: '/category/pos-system'
            },
            {
                id: 'mpos',
                name: 'MPOS',
                description: 'Mobile point of sale',
                icon: Smartphone,
                status: 'active',
                to: '/category/pos-system'
            },
            {
                id: 'webstore',
                name: 'Webstore',
                description: 'Online ordering website',
                icon: LayoutGrid,
                status: 'active',
                to: '/category/online-orders'
            },
            {
                id: 'scan-to-order',
                name: 'Scan-to-Order',
                description: 'QR code ordering',
                icon: QrCode,
                status: 'active',
                to: '/category/online-orders'
            },
            {
                id: 'tablet-ordering',
                name: 'Tablet Ordering',
                description: 'Table-side ordering',
                icon: Tablet,
                status: 'active',
                to: '/category/pos-system'
            },
            {
                id: 'q-kiosk',
                name: 'Q Kiosk',
                description: 'Self-service kiosk',
                icon: Monitor,
                status: 'active',
                to: '/category/pos-system'
            }
        ]
    },
    {
        id: 'customer-modules',
        title: 'Customer Modules',
        icon: Users,
        items: [
            {
                id: 'qms-checkin',
                name: 'QMS Check-In',
                description: 'Queue management check-in',
                icon: Users,
                status: 'active',
                to: '/category/setting-up'
            },
            {
                id: 'q-booking',
                name: 'Q Booking',
                description: 'Reservation system',
                icon: Calendar,
                status: 'active',
                to: '/category/setting-up'
            },
            {
                id: 'q-ticketing',
                name: 'Q Ticketing',
                description: 'Event ticketing',
                icon: Ticket,
                status: 'active',
                to: '/category/setting-up'
            },
            {
                id: 'live-display',
                name: 'Live Display',
                description: 'Customer-facing display',
                icon: Tv,
                status: 'active',
                to: '/category/hardware'
            }
        ]
    },
    {
        id: 'operations',
        title: 'Operations',
        icon: Wrench,
        items: [
            {
                id: 'kitchen-display',
                name: 'Kitchen Display',
                description: 'Kitchen order management',
                icon: ChefHat,
                status: 'active',
                to: '/category/pos-system'
            },
            {
                id: 'qms-control',
                name: 'QMS Control',
                description: 'Queue management control',
                icon: ListChecks,
                status: 'active',
                to: '/category/setting-up'
            },
            {
                id: 'validator-app',
                name: 'Validator App',
                description: 'Ticket/order validation',
                icon: CheckCircle,
                status: 'active',
                to: '/category/setting-up'
            }
        ]
    }
];

