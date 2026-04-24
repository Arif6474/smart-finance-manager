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
    Sparkles,
    Bell,
    Shield,
    CreditCard,
    Users,
    Zap,
    LogOut,
    HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/lib/adminUtils';
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
    { name: 'Reminders', icon: Bell, href: '/reminders' },
    { name: 'Health', icon: HeartPulse, href: '/health' },
];

const adminItems = [
    { name: 'Payments', icon: CreditCard, href: '/admin-payments' },
    { name: 'Users', icon: Users, href: '/admin-users' },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    
    const [showMore, setShowMore] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);
    const userIsAdmin = isAdmin(user?.level);

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

    const isMoreActive = moreItems.some(item => item.href === pathname) || 
                        (userIsAdmin && adminItems.some(item => item.href === pathname));

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
                            className="absolute bottom-[88px] right-2 bg-card border border-border shadow-2xl rounded-2xl p-2 w-56 z-50 overflow-hidden"
                        >
                            <div className="flex flex-col gap-1">
                                {user?.subscription && (
                                    <div className="px-1 mb-2">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Plan</span>
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                                    user.subscription.currentPlan === 'pro' ? 'bg-success/10 text-success' :
                                                    user.subscription.currentPlan === 'free-trial' ? 'bg-warning/10 text-warning' :
                                                    user.subscription.currentPlan === 'admin' ? 'bg-shield/10 text-shield' :
                                                    'bg-destructive/10 text-destructive'
                                                }`}>
                                                    {user.subscription.currentPlan.replace('-', ' ')}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-xs truncate">
                                                {user.subscription.currentPlan === 'admin' ? 'Administrator' :
                                                 user.subscription.currentPlan === 'pro' ? 'Pro Member' :
                                                 user.subscription.currentPlan === 'free-trial' ? 'Free Trial' :
                                                 'Free Account'}
                                            </h4>
                                            {user.subscription.daysRemaining > 0 && user.subscription.currentPlan !== 'admin' && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(100, (user.subscription.daysRemaining / (user.subscription.currentPlan === 'pro' ? 30 : 14)) * 100)}%` }}
                                                            className={`h-full ${user.subscription.daysRemaining < 3 ? 'bg-destructive' : 'bg-primary'}`}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] font-bold">
                                                        {user.subscription.daysRemaining}d
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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

                                {/* Admin Section */}
                                {userIsAdmin && (
                                    <>
                                        <div className="h-px bg-border my-1" />
                                        <div className="px-4 py-2">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase">Admin</p>
                                        </div>
                                        {adminItems.map((item) => {
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

                                        {/* More Actions */}
                                        <div className="h-px bg-border my-1" />
                                        <Link
                                            href="/upgrade"
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-primary/10 font-medium text-primary"
                                        >
                                            <Zap size={18} />
                                            <span className="text-sm">Upgrade</span>
                                        </Link>
                                    </>
                                )}

                                {/* Non-admin Upgrade Option */}
                                {!userIsAdmin && (
                                    <>
                                        <div className="h-px bg-border my-1" />
                                        <Link
                                            href="/upgrade"
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-primary/10 font-medium text-primary"
                                        >
                                            <Zap size={18} />
                                            <span className="text-sm">Upgrade to Pro</span>
                                        </Link>
                                    </>
                                )}

                                {/* Logout Option */}
                                <div className="h-px bg-border my-1" />
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowMore(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all hover:bg-destructive/10 font-medium text-destructive"
                                >
                                    <LogOut size={18} />
                                    <span className="text-sm">Logout</span>
                                </button>
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
