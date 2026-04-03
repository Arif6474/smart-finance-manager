'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    HandCoins,
    BarChart3
} from 'lucide-react';

const menuItems = [
    { name: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Accounts', icon: Wallet, href: '/accounts' },
    { name: 'Trans', icon: Receipt, href: '/transactions' },
    { name: 'Payables', icon: HandCoins, href: '/payables' },
    { name: 'Reports', icon: BarChart3, href: '/reports' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t md:hidden pb-safe">
            <div className="flex items-center justify-around p-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-[72px] h-14 rounded-xl transition-all duration-300 ${isActive
                                    ? 'text-primary scale-105'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                        >
                            <div className={`p-1.5 rounded-2xl ${isActive ? 'bg-primary/20 shadow-md shadow-primary/20' : ''}`}>
                                <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'} />
                            </div>
                            <span className={`text-[10px] sm:text-xs mt-1 transition-all ${isActive ? 'font-extrabold' : 'font-medium'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
