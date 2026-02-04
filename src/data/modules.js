import { Smartphone, MonitorPlay, Globe, QrCode, CreditCard, LayoutGrid, Ticket, Calendar, Clock, Tv, CheckSquare, UtensilsCrossed, Settings, Printer, BarChart3, Box, FileText, User } from 'lucide-react';

export const modules = [
    {
        id: 'sales-channels',
        title: 'Sales Channels',
        icon: Tv,
        items: [
            { id: 'qpos', name: 'Q POS', description: 'Main terminal', icon: Smartphone, status: 'active', to: '/module/qpos' },
            { id: 'mpos', name: 'MPOS', description: 'Handheld ordering', icon: Smartphone, to: '/module/mpos' },
            { id: 'webstore', name: 'Webstore', description: 'Online ordering', icon: Globe, status: 'beta', to: '/module/webstore' },
            { id: 'scan-to-order', name: 'Scan-to-Order', description: 'QR ordering', icon: QrCode, to: '/module/scan-to-order' },
            { id: 'tablet-ordering', name: 'Tablet Ordering', description: 'Legacy tablets', icon: MonitorPlay, status: 'obsolete', to: '/module/tablet-ordering' },
            { id: 'kiosk', name: 'Q Kiosk', description: 'Self-service', icon: LayoutGrid, to: '/module/kiosk' }
        ]
    },
    {
        id: 'customer-modules',
        title: 'Customer Modules',
        icon: User,
        items: [
            { id: 'qms-checkin', name: 'QMS Check-In', description: 'Queue management', icon: Ticket, to: '/module/qms-checkin' },
            { id: 'booking', name: 'Q Booking', description: 'Reservation system', icon: Calendar, to: '/module/booking' },
            { id: 'ticketing', name: 'Q Ticketing', description: 'Event ticketing', icon: Ticket, to: '/module/ticketing' },
            { id: 'live-display', name: 'Live Display', description: 'Customer facing', icon: Tv, to: '/module/live-display' }
        ]
    },
    {
        id: 'operations',
        title: 'Operations',
        icon: Settings,
        items: [
            { id: 'kitchen-display', name: 'Kitchen Display', description: 'Kitchen screens', icon: UtensilsCrossed, to: '/module/kitchen-display' },
            { id: 'qms-control', name: 'QMS Control', description: 'Queue control', icon: Settings, to: '/module/qms-control' },
            { id: 'validator', name: 'Validator App', description: 'Ticket validation', icon: CheckSquare, to: '/module/validator' }
        ]
    }
];

export const categories = [
    { id: 'getting-started', title: 'Getting Started', description: 'First steps to set up your POS', icon: '🚀' },
    { id: 'pos-orders', title: 'POS & Orders', description: 'Taking orders and managing sales', icon: '💳' },
    { id: 'payments', title: 'Payments', description: 'Payment methods and transactions', icon: '💰' },
    { id: 'products', title: 'Products & Modifiers', description: 'Menu items and variations', icon: '📦' },
    { id: 'qr-ordering', title: 'QR Ordering', description: 'Customer self-ordering setup', icon: '📱' },
    { id: 'kitchen-display', title: 'Kitchen Display', description: 'Kitchen order management', icon: '🍳' },
    { id: 'inventory', title: 'Inventory', description: 'Stock tracking and management', icon: '📊' },
    { id: 'loyalty', title: 'Loyalty & Rewards', description: 'Customer loyalty programs', icon: '⭐' },
    { id: 'reports', title: 'Reports & Analytics', description: 'Sales reports and insights', icon: '📈' },
    { id: 'hardware', title: 'Hardware & Printing', description: 'Printers, tablets, accessories', icon: '🖨️' },
    { id: 'troubleshooting', title: 'Troubleshooting', description: 'Common issues and fixess', icon: '🔧' },
    { id: 'account', title: 'Account & Billing', description: 'Your account and subscriptions', icon: '👤' }
];
