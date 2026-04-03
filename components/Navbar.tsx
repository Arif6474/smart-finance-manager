'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    return (
        <header className="h-16 glass sticky top-0 z-40 px-6 flex items-center justify-between border-b md:ml-64">
            <div>
                <h2 className="text-xl font-semibold hidden md:block">
                    Welcome back, <span className="text-primary">{user?.name || 'User'}</span>
                </h2>
                <h2 className="text-xl font-bold md:hidden bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    SmartFinance
                </h2>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center space-x-2 pl-4 border-l">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.[0].toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{user?.name || 'Guest'}</span>

                    <button
                        onClick={logout}
                        className="md:hidden ml-2 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                        aria-label="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
