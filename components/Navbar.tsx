'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Bell, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-card/80 dark:bg-card/60 backdrop-blur-2xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between border-b border-border md:ml-64 transition-colors duration-500">
            {/* Left — Welcome / Mobile Logo */}
            <div>
                <h2 className="text-base font-medium hidden md:block text-muted-foreground">
                    Welcome back, <span className="text-foreground font-semibold">{user?.name || 'User'}</span>
                </h2>
                <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/20">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <span className="text-base font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        SmartFinance
                    </span>
                </Link>
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
                <motion.button
                    whileTap={{ scale: 0.9, rotate: theme === 'dark' ? -30 : 30 }}
                    onClick={toggleTheme}
                    className="p-2.5 hover:bg-muted rounded-xl transition-colors duration-300"
                >
                    {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-500" />}
                </motion.button>

                <button className="p-2.5 hover:bg-muted rounded-xl transition-colors duration-300 relative">
                    <Bell size={18} className="text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full ring-2 ring-card"></span>
                </button>

                <div className="flex items-center gap-2 pl-2 sm:pl-3 ml-1 sm:ml-2 border-l border-border">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-teal-500/20">
                        {user?.name?.[0].toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{user?.name || 'Guest'}</span>

                    <button
                        onClick={logout}
                        className="md:hidden ml-1 p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-all duration-300"
                        aria-label="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
