'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { Plus, Bell, Calendar, Check, Trash2, Clock, Info, AlertCircle } from 'lucide-react';
import Modal from '@/components/Modal';
import Skeleton from '@/components/Skeleton';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from '@/components/DatePicker';
import ConfirmModal from '@/components/ConfirmModal';
import { format } from 'date-fns';

const REMINDER_TYPES = [
    { label: 'General', value: 'General' },
    { label: 'Bill', value: 'Bill' },
    { label: 'EMI', value: 'EMI' },
    { label: 'Goal', value: 'Goal' },
    { label: 'Budget', value: 'Budget' },
];

export default function RemindersPage() {
    const [reminders, setReminders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [activeReminderId, setActiveReminderId] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [remindAt, setRemindAt] = useState<string>('');
    const [type, setType] = useState('General');

    const fetchReminders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reminders?all=true');
            if (res.ok) {
                const data = await res.json();
                setReminders(data);
            }
        } catch (error) {
            toast.error('Failed to load reminders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setRemindAt('');
        setType('General');
        setActiveReminderId(null);
    };

    const handleSaveReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { title, description, remindAt, type };
            const url = activeReminderId ? `/api/reminders/${activeReminderId}` : '/api/reminders';
            const method = activeReminderId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(activeReminderId ? 'Reminder updated' : 'Reminder created');
                setIsModalOpen(false);
                fetchReminders();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to save reminder');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const toggleStatus = async (reminder: any) => {
        const newStatus = reminder.status === 'Completed' ? 'Pending' : 'Completed';
        try {
            const res = await fetch(`/api/reminders/${reminder._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                toast.success(`Marked as ${newStatus.toLowerCase()}`);
                fetchReminders();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async () => {
        if (!activeReminderId) return;
        try {
            const res = await fetch(`/api/reminders/${activeReminderId}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Reminder deleted');
                setIsConfirmDeleteOpen(false);
                fetchReminders();
            }
        } catch (error) {
            toast.error('Failed to delete reminder');
        }
    };

    const pendingReminders = reminders.filter(r => r.status === 'Pending').sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime());
    const completedReminders = reminders.filter(r => r.status === 'Completed').sort((a, b) => new Date(b.remindAt).getTime() - new Date(a.remindAt).getTime());

    return (
        <PageWrapper>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Financial Reminders</h2>
                    <p className="text-sm text-muted-foreground mt-1">Never miss a bill or goal deadline again.</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2 px-5 py-2.5"
                >
                    <Plus size={18} />
                    <span>Set Reminder</span>
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl w-full" />)}
                </div>
            ) : reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-3xl">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 text-amber-500">
                        <Bell size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Reminders Yet</h3>
                    <p className="text-muted-foreground text-center max-w-sm mb-6">
                        Stay organized by setting reminders for your upcoming bills, EMI dates, or savings targets.
                    </p>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="btn-primary px-6 py-2.5"
                    >
                        Set Your First Reminder
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Pending Section */}
                    {pendingReminders.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Clock size={16} /> Upcoming
                            </h3>
                            <div className="grid gap-3">
                                {pendingReminders.map((reminder) => (
                                    <ReminderCard 
                                        key={reminder._id} 
                                        reminder={reminder} 
                                        onToggle={() => toggleStatus(reminder)}
                                        onEdit={() => {
                                            setActiveReminderId(reminder._id);
                                            setTitle(reminder.title);
                                            setDescription(reminder.description || '');
                                            setRemindAt(reminder.remindAt);
                                            setType(reminder.type);
                                            setIsModalOpen(true);
                                        }}
                                        onDelete={() => {
                                            setActiveReminderId(reminder._id);
                                            setIsConfirmDeleteOpen(true);
                                        }}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Completed Section */}
                    {completedReminders.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Check size={16} /> Completed
                            </h3>
                            <div className="grid gap-3 opacity-60">
                                {completedReminders.map((reminder) => (
                                    <ReminderCard 
                                        key={reminder._id} 
                                        reminder={reminder} 
                                        onToggle={() => toggleStatus(reminder)}
                                        onDelete={() => {
                                            setActiveReminderId(reminder._id);
                                            setIsConfirmDeleteOpen(true);
                                        }}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={activeReminderId ? "Edit Reminder" : "New Reminder"}>
                <form onSubmit={handleSaveReminder} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-field"
                            placeholder="e.g. Credit Card Bill"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field min-h-[80px] py-3"
                            placeholder="Add some details..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Remind At</label>
                            <DatePicker
                                value={remindAt}
                                onChange={setRemindAt}
                                placeholder="Select date & time"
                                showTime={true}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="input-field bg-card"
                            >
                                {REMINDER_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="btn-primary w-full py-3 text-sm font-bold">
                            {activeReminderId ? 'Update Reminder' : 'Set Reminder'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Reminder?"
                description="Are you sure you want to remove this reminder? This cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
        </PageWrapper>
    );
}

function ReminderCard({ reminder, onToggle, onEdit, onDelete }: any) {
    const isOverdue = new Date(reminder.remindAt) < new Date() && reminder.status === 'Pending';

    return (
        <motion.div
            layout
            className={`bg-card border ${isOverdue ? 'border-red-500/30 bg-red-500/5' : 'border-border'} p-4 rounded-2xl flex items-center justify-between gap-4 group transition-all hover:border-primary/30`}
        >
            <div className="flex items-start gap-4 flex-1">
                <button
                    onClick={onToggle}
                    className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        reminder.status === 'Completed'
                            ? 'bg-primary border-primary text-white'
                            : 'border-muted-foreground/30 hover:border-primary'
                    }`}
                >
                    {reminder.status === 'Completed' && <Check size={14} />}
                </button>

                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={`font-bold truncate ${reminder.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {reminder.title}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-colors ${
                            reminder.type === 'Bill' ? 'bg-amber-500/10 text-amber-500' :
                            reminder.type === 'EMI' ? 'bg-blue-500/10 text-blue-500' :
                            reminder.type === 'Goal' ? 'bg-emerald-500/10 text-emerald-500' :
                            'bg-primary/10 text-primary'
                        }`}>
                            {reminder.type}
                        </span>
                    </div>
                    {reminder.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{reminder.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                        <p className={`text-xs flex items-center gap-1.5 font-medium ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                            <Calendar size={12} />
                            {format(new Date(reminder.remindAt), 'MMM d, yyyy • h:mm a')}
                            {isOverdue && <span className="flex items-center gap-1 ml-1 bg-red-500/10 px-1.5 py-0.5 rounded uppercase text-[10px] font-bold tracking-tight"><AlertCircle size={10} /> Overdue</span>}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <button onClick={onEdit} className="p-2 hover:bg-muted text-muted-foreground rounded-xl transition-colors">
                        <Info size={18} />
                    </button>
                )}
                <button onClick={onDelete} className="p-2 hover:bg-destructive/10 text-destructive rounded-xl transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
}
