'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    HandCoins,
    BarChart3,
    Target,
    LogOut,
    Sparkles,
    Goal
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Accounts', icon: Wallet, href: '/accounts' },
    { name: 'Transactions', icon: Receipt, href: '/transactions' },
    { name: 'Budgets', icon: Target, href: '/budgets' },
    { name: 'Payables', icon: HandCoins, href: '/payables' },
    { name: 'Goals', icon: Goal, href: '/goals' },
    { name: 'Reports', icon: BarChart3, href: '/reports' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card/90 dark:bg-card/80 backdrop-blur-2xl border-r border-border z-50 hidden md:flex flex-col transition-colors duration-500">
            {/* Logo */}
            <div className="p-6 pb-2">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <Image
                        src="/icons/icon-192x192.png"
                        alt="SmartFinance Logo"
                        width={32}
                        height={32}
                        className="w-9 h-9 rounded-xl object-contain shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-shadow duration-300"
                    />
                    <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        SmartFinance
                    </span>
                </Link>
            </div>

            <div className="px-4 py-2">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 mt-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <Icon size={19} className={isActive ? 'text-primary' : 'group-hover:text-foreground transition-colors'} />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-3" />
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 text-sm"
                >
                    <LogOut size={19} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
