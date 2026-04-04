'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    HandCoins,
    BarChart3,
    Target,
    Goal
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
    { name: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Accounts', icon: Wallet, href: '/accounts' },
    { name: 'Trans', icon: Receipt, href: '/transactions' },
    { name: 'Budgets', icon: Target, href: '/budgets' },
    { name: 'Payables', icon: HandCoins, href: '/payables' },
    { name: 'Goals', icon: Goal, href: '/goals' },
    { name: 'Reports', icon: BarChart3, href: '/reports' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 dark:bg-card/80 backdrop-blur-2xl border-t border-border md:hidden pb-safe transition-colors duration-500">
            <div className="flex items-center justify-around py-2 px-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${isActive
                                ? 'text-primary'
                                : 'text-muted-foreground'
                                }`}
                        >
                            <div className="relative">
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-active"
                                        className="absolute -inset-2 bg-primary/10 rounded-xl"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <Icon
                                    size={20}
                                    className={`relative z-10 transition-all duration-300 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
                                />
                            </div>
                            <span className={`text-[10px] mt-1 transition-all duration-300 ${isActive ? 'font-bold text-primary' : 'font-medium'
                                }`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
