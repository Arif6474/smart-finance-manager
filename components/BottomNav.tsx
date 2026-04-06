'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    HandCoins,
    BarChart3,
    Target,
    Goal,
    MoreHorizontal,
    RotateCw,
    HeartPulse,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mainItems = [
    { name: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Accounts', icon: Wallet, href: '/accounts' },
    { name: 'Trans', icon: Receipt, href: '/transactions' },
    { name: 'Budgets', icon: Target, href: '/budgets' },
];

const moreItems = [
    { name: 'Payables', icon: HandCoins, href: '/payables' },
    { name: 'Goals', icon: Goal, href: '/goals' },
    { name: 'Subscriptions', icon: RotateCw, href: '/subscriptions' },
    { name: 'Reports', icon: BarChart3, href: '/reports' },
    { name: 'AI Assistant', icon: Sparkles, href: '/ai-assistant' },
    { name: 'Health', icon: HeartPulse, href: '/health' },
];

export default function BottomNav() {
    const pathname = usePathname();
    const [showMore, setShowMore] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    // Close on route change
    useEffect(() => {
        setShowMore(false);
    }, [pathname]);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setShowMore(false);
            }
        }
        if (showMore) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMore]);

    const isMoreActive = moreItems.some(item => item.href === pathname);

    return (
        <>
            {/* Overlay for More Menu */}
            <AnimatePresence>
                {showMore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-background/20 backdrop-blur-sm md:hidden"
                    />
                )}
            </AnimatePresence>

            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 dark:bg-card/80 backdrop-blur-2xl border-t border-border md:hidden pb-safe transition-colors duration-500">

                {/* More Menu Popover */}
                <AnimatePresence>
                    {showMore && (
                        <motion.div
                            ref={moreMenuRef}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="absolute bottom-[88px] right-2 bg-card border border-border shadow-2xl rounded-2xl p-2 w-48 z-50"
                        >
                            <div className="flex flex-col gap-1">
                                {moreItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted font-medium text-muted-foreground'
                                                }`}
                                        >
                                            <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
                                            <span className="text-sm">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-around py-2 px-1 relative">
                    {/* Main Nav Items */}
                    {mainItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center w-[20%] h-14 rounded-2xl transition-all duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground'
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
                                <span className={`text-[10px] mt-1 transition-all duration-300 ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More Button */}
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className={`relative flex flex-col items-center justify-center w-[20%] h-14 rounded-2xl transition-all duration-300 ${isMoreActive || showMore ? 'text-primary' : 'text-muted-foreground'
                            }`}
                    >
                        <div className="relative">
                            {(isMoreActive || showMore) && (
                                <motion.div
                                    layoutId="bottom-nav-more"
                                    className="absolute -inset-2 bg-primary/10 rounded-xl"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <MoreHorizontal
                                size={20}
                                className={`relative z-10 transition-all duration-300 ${(isMoreActive || showMore) ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
                            />
                        </div>
                        <span className={`text-[10px] mt-1 transition-all duration-300 ${(isMoreActive || showMore) ? 'font-bold text-primary' : 'font-medium'}`}>
                            More
                        </span>
                    </button>
                </div>
            </nav>
        </>
    );
}
