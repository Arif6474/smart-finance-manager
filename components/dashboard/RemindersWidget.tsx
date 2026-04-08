'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronRight, Check } from 'lucide-react';
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

export default function RemindersWidget() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReminders = async () => {
        try {
            const res = await fetch('/api/reminders?limit=3');
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
    }, []);

    const markAsCompleted = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
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

    if (loading) {
        return <div className="h-48 bg-card border border-border rounded-3xl animate-pulse mt-6" />;
    }

    if (reminders.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-6 mt-6 shadow-sm overflow-hidden relative group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Bell size={20} className="animate-wiggle" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold">Upcoming Reminders</h3>
                        <p className="text-xs text-muted-foreground">Don't miss your financial tasks</p>
                    </div>
                </div>
                <Link href="/reminders" className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
                    View All <ChevronRight size={14} />
                </Link>
            </div>

            <div className="space-y-3">
                {reminders.map((reminder, index) => (
                    <motion.div
                        key={reminder._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all group"
                    >
                        <div className={`p-2 rounded-xl ${
                            reminder.type === 'Bill' ? 'bg-red-500/10 text-red-500' :
                            reminder.type === 'Goal' ? 'bg-emerald-500/10 text-emerald-500' :
                            'bg-primary/10 text-primary'
                        }`}>
                            <Calendar size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate">{reminder.title}</h4>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(reminder.remindAt), 'EEE, MMM d • h:mm a')}
                            </p>
                        </div>
                        <button
                            onClick={(e) => markAsCompleted(reminder._id, e)}
                            className="bg-background border border-border p-2 rounded-xl text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all shadow-sm"
                            title="Mark as completed"
                        >
                            <Check size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
