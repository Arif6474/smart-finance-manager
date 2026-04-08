'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, LogOut, User, Settings, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    return (
        <header className="h-16 bg-card/80 dark:bg-card/60 backdrop-blur-2xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between border-b border-border md:ml-64 transition-colors duration-500">
            {/* Left — Welcome / Mobile Logo */}
            <div>
                <h2 className="text-base font-medium hidden md:block text-muted-foreground">
                    Welcome back, <span className="text-foreground font-semibold">{user?.name || 'User'}</span>
                </h2>
                <Link href="/dashboard" className="flex items-center gap-2 group md:hidden">
                    <Image
                        src="/icons/icon-192x192.png"
                        alt="SmartFinance Logo"
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-lg object-contain shadow-sm shadow-primary/20"
                    />
                    <span className="text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        SmartFinance
                    </span>
                </Link>
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                <Link
                    href="/ai-assistant"
                    className="p-2.5 hover:bg-primary/10 rounded-xl transition-all duration-300 border border-transparent hover:border-primary/20 text-primary group"
                    title="AI Assistant"
                >
                    <Sparkles size={18} className="transition-transform group-hover:rotate-12 group-hover:scale-110" />
                </Link>

                <NotificationBell />

                <motion.button
                    whileTap={{ scale: 0.9, rotate: theme === 'dark' ? -30 : 30 }}
                    onClick={toggleTheme}
                    className="p-2.5 hover:bg-muted rounded-xl transition-colors duration-300 border border-transparent hover:border-border/50"
                >
                    {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-500" />}
                </motion.button>

                <div className="h-6 w-px bg-border mx-1"></div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2.5 p-1.5 pr-2 sm:pr-3 rounded-full hover:bg-muted/60 transition-colors border border-transparent hover:border-border/50 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                            {user?.name?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="hidden sm:flex flex-col items-start pr-1">
                            <span className="text-sm font-bold leading-none">{user?.name || 'Guest'}</span>
                            <span className="text-[10px] text-muted-foreground mt-1">Personal Account</span>
                        </div>
                        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-56 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50 origin-top-right"
                            >
                                <div className="px-4 py-3 border-b border-border bg-muted/20">
                                    <p className="text-sm font-bold text-foreground truncate">{user?.name || 'Guest User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email || 'guest@example.com'}</p>
                                </div>
                                <div className="p-2 space-y-1">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <User size={16} />
                                        Profile Settings
                                    </Link>
                                </div>
                                <div className="p-2 border-t border-border">
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            logout();
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <LogOut size={16} className="text-destructive" />
                                        Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
