'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    HandCoins,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Accounts', icon: Wallet, href: '/accounts' },
    { name: 'Transactions', icon: Receipt, href: '/transactions' },
    { name: 'Payables', icon: HandCoins, href: '/payables' },
    { name: 'Reports', icon: BarChart3, href: '/reports' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass border-r z-50 hidden md:flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    SmartFinance
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
