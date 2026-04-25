'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    HandCoins,
    BarChart3,
    Target,
    LogOut,
    Sparkles,
    Goal,
    RotateCw,
    Bell,
    Zap,
    ChevronDown,
    Shield,
    CreditCard,
    HelpCircle,
    HeartPulse,
    Calendar,
    Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/lib/adminUtils';
import { motion } from 'framer-motion';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Accounts', icon: Wallet, href: '/accounts' },
    { name: 'Transactions', icon: Receipt, href: '/transactions' },
    { name: 'Budgets', icon: Target, href: '/budgets' },
    { name: 'Payables', icon: HandCoins, href: '/payables' },
    { name: 'Goals', icon: Goal, href: '/goals' },
    { name: 'Subscriptions', icon: RotateCw, href: '/subscriptions' },
    { name: 'Reports', icon: BarChart3, href: '/reports' },
    { name: 'Reminders', icon: Bell, href: '/reminders' },
    { name: 'Health', icon: HeartPulse, href: '/health' },
];

const adminMenuItems = [
    { name: 'Payments', icon: CreditCard, href: '/admin-payments' },
    { name: 'Users', icon: Users, href: '/admin-users' },
    // contact messages
    { name: 'Contact Requests', icon: Users, href: '/admin-contact-requests' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [adminOpen, setAdminOpen] = useState(false);
    const userIsAdmin = isAdmin(user?.level);


    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card/90 dark:bg-card/80 backdrop-blur-2xl border-r border-border z-50 hidden md:flex flex-col transition-colors duration-500">
            {/* Logo */}
            <div className="p-6 pb-2">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <Image
                        src="/logo.png"
                        alt="TakaHisab Logo"
                        width={32}
                        height={32}
                        className="w-9 h-9 rounded-xl object-contain shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-shadow duration-300"
                    />
                    <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        TakaHisab
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

                {/* Admin Menu */}
                {userIsAdmin && (
                    <div className="mt-4 pt-4 border-t border-border">
                        <button
                            onClick={() => setAdminOpen(!adminOpen)}
                            className={`relative flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                                adminOpen ? 'bg-shield/10 text-shield' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Shield size={19} />
                                <span className="text-sm font-semibold">Admin</span>
                            </div>
                            <motion.div
                                animate={{ rotate: adminOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown size={16} />
                            </motion.div>
                        </button>

                        {/* Admin Submenu */}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: adminOpen ? 1 : 0, height: adminOpen ? 'auto' : 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-1 ml-4 pl-3 border-l border-border/50 space-y-1">
                                {adminMenuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                                                isActive
                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                        >
                                            <Icon size={16} />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </nav>

            {/* Subscription Status */}
            <div className="px-3 pb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />
                
                {user?.subscription && (
                    <div className="px-4 mb-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Current Plan</span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                    user.subscription.currentPlan === 'pro' ? 'bg-success/10 text-success' :
                                    user.subscription.currentPlan === 'free-trial' ? 'bg-warning/10 text-warning' :
                                    user.subscription.currentPlan === 'admin' ? 'bg-shield/10 text-shield' :
                                    'bg-destructive/10 text-destructive'
                                }`}>
                                    {user.subscription.currentPlan.replace('-', ' ')}
                                </span>
                            </div>
                            
                            <h4 className="font-bold text-sm mb-1">
                                {user.subscription.currentPlan === 'admin' ? 'System Administrator' :
                                 user.subscription.currentPlan === 'pro' ? 'Pro Membership' :
                                 user.subscription.currentPlan === 'free-trial' ? 'Free Trial' :
                                 'Free Account'}
                            </h4>
                            
                            {user.subscription.daysRemaining > 0 && user.subscription.currentPlan !== 'admin' && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (user.subscription.daysRemaining / (user.subscription.currentPlan === 'pro' ? 30 : 14)) * 100)}%` }}
                                            className={`h-full ${user.subscription.daysRemaining < 3 ? 'bg-destructive' : 'bg-primary'}`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold whitespace-nowrap">
                                        {user.subscription.daysRemaining} days left
                                    </span>
                                </div>
                            )}

                            {user.subscription.expiryDate && (
                                <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                                    <Calendar size={10} />
                                    Expires: {new Date(user.subscription.expiryDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {user?.subscription?.currentPlan !== 'pro' && user?.subscription?.currentPlan !== 'admin' && (
                    <Link
                        href="/upgrade"
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 text-sm font-semibold group"
                    >
                        <Zap size={19} className="group-hover:animate-pulse" />
                        <span>Upgrade to Pro</span>
                    </Link>
                )}
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 text-sm"
                >
                    <LogOut size={19} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
