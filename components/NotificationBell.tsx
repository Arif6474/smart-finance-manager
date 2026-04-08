'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, BellOff, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';

interface Reminder {
    _id: string;
    title: string;
    description?: string;
    remindAt: string;
    type: string;
    status: string;
}

export default function NotificationBell() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchReminders = async () => {
        try {
            const res = await fetch('/api/reminders?limit=5');
            if (res.ok) {
                const data = await res.json();
                setReminders(data);
            }
        } catch (error) {
            console.error('Error fetching reminders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
        // Refresh every 5 minutes
        const interval = setInterval(fetchReminders, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const markAsCompleted = async (id: string) => {
        try {
            const res = await fetch(`/api/reminders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Completed' })
            });
            if (res.ok) {
                setReminders(reminders.filter(r => r._id !== id));
            }
        } catch (error) {
            console.error('Error updating reminder:', error);
        }
    };

    const pendingCount = reminders.length;

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 md:p-2.5 hover:bg-muted rounded-xl transition-all duration-300 border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground relative group"
            >
                <Bell size={20} className={pendingCount > 0 ? 'animate-wiggle' : ''} />
                {pendingCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-background shadow-sm shadow-primary/40">
                        {pendingCount}
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50 origin-top-right px-1 py-1"
                    >
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                            <h3 className="text-sm font-bold">Upcoming Reminders</h3>
                            <Link href="/reminders" onClick={() => setIsOpen(false)} className="text-xs text-primary hover:underline font-medium">
                                View all
                            </Link>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">Checking reminders...</p>
                                </div>
                            ) : reminders.length === 0 ? (
                                <div className="p-10 text-center">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                        <BellOff size={20} className="text-muted-foreground/50" />
                                    </div>
                                    <p className="text-sm font-medium">All caught up!</p>
                                    <p className="text-xs text-muted-foreground mt-1">No upcoming reminders found.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/50">
                                    {reminders.map((reminder) => (
                                        <div key={reminder._id} className="p-3 hover:bg-muted/30 transition-colors group flex gap-3 items-start">
                                            <div className={`mt-1 p-2 rounded-lg ${
                                                reminder.type === 'Bill' ? 'bg-amber-500/10 text-amber-500' :
                                                reminder.type === 'Goal' ? 'bg-emerald-500/10 text-emerald-500' :
                                                reminder.type === 'EMI' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-primary/10 text-primary'
                                            }`}>
                                                <Calendar size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate pr-6">{reminder.title}</p>
                                                {reminder.description && (
                                                    <p className="text-xs text-muted-foreground truncate mb-1">{reminder.description}</p>
                                                )}
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {format(new Date(reminder.remindAt), 'MMM d, h:mm a')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => markAsCompleted(reminder._id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-primary/20 text-primary rounded-lg transition-all"
                                                title="Mark as completed"
                                            >
                                                <Check size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-2 border-t border-border bg-muted/20">
                            <Link
                                href="/reminders"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center py-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                            >
                                Manage Reminders
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
