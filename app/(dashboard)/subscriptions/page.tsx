'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Bell, Settings, CreditCard, RotateCw, CheckCircle2, ChevronRight, X, Trash2 } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import ConfirmModal from '@/components/ConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        frequency: 'Monthly',
        nextBillingDate: '',
        accountId: '',
        category: 'Bills & Utilities',
        autoPay: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [subsRes, accRes] = await Promise.all([
                fetch('/api/subscriptions'),
                fetch('/api/accounts')
            ]);

            if (subsRes.ok) setSubscriptions(await subsRes.json());
            if (accRes.ok) {
                const accData = await accRes.json();
                setAccounts(accData);
                if (accData.length > 0) {
                    setFormData(prev => ({ ...prev, accountId: accData[0]._id }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            amount: Number(formData.amount)
        };

        const method = editingId ? 'PATCH' : 'POST';
        const url = editingId ? `/api/subscriptions/${editingId}` : '/api/subscriptions';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({
                    name: '', amount: '', frequency: 'Monthly', nextBillingDate: '', accountId: accounts[0]?._id || '', category: 'Utilities', autoPay: true
                });
                fetchData();
            }
        } catch (error) {
            console.error('Failed to save', error);
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(`/api/subscriptions/${itemToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                setSubscriptions(subscriptions.filter(s => s._id !== itemToDelete));
                setIsConfirmOpen(false);
                setItemToDelete(null);
            }
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setItemToDelete(id);
        setIsConfirmOpen(true);
    };

    const openEdit = (sub: any) => {
        setEditingId(sub._id);
        setFormData({
            name: sub.name,
            amount: sub.amount.toString(),
            frequency: sub.frequency,
            nextBillingDate: new Date(sub.nextBillingDate).toISOString().split('T')[0],
            accountId: sub.accountId?._id || sub.accountId,
            category: sub.category,
            autoPay: sub.autoPay
        });
        setIsModalOpen(true);
    };

    // Derived Metrics
    const activeSubs = subscriptions.filter(s => s.isActive);
    let monthlyCost = 0;
    activeSubs.forEach(s => {
        if (s.frequency === 'Monthly') monthlyCost += s.amount;
        else if (s.frequency === 'Yearly') monthlyCost += s.amount / 12;
        else if (s.frequency === 'Weekly') monthlyCost += s.amount * 4.33;
    });

    const getDaysUntil = (dateStr: string) => {
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    return (
        <PageWrapper className="space-y-6 pb-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <RotateCw className="text-primary" size={32} />
                        Subscriptions
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Track recurring bills and automate payments</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        const today = new Date().toISOString().split('T')[0];
                        setFormData(prev => ({ ...prev, nextBillingDate: today, name: '', amount: '' }));
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center p-2"
                >
                    <Plus size={18} />
                    Add New
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6 rounded-3xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Monthly Cost</p>
                        <h2 className="text-4xl font-black tracking-tight">৳{monthlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 w-max px-3 py-1.5 rounded-full">
                            <CreditCard size={14} />
                            {activeSubs.length} Active Subscriptions
                        </div>
                    </div>
                    <RotateCw className="absolute -bottom-6 -right-6 w-32 h-32 text-primary/10 rotate-12" />
                </div>

                <div className="bg-card border border-border p-6 rounded-3xl flex flex-col justify-center">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Upcoming Due Dates</h3>
                            <p className="text-sm text-muted-foreground mt-1">We will automatically execute payments for subscriptions with <span className="font-semibold text-foreground">AutoPay</span> enabled on their due date.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/20">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <CalendarIcon size={18} className="text-primary" /> Upcoming Bills
                    </h3>
                </div>

                <div className="divide-y divide-border/50">
                    {loading ? (
                        <div className="p-12 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
                    ) : subscriptions.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <RotateCw size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No active subscriptions found.</p>
                        </div>
                    ) : (
                        subscriptions.map((sub) => {
                            const daysUntil = getDaysUntil(sub.nextBillingDate);
                            const isDueSoon = daysUntil <= 3 && daysUntil >= 0;
                            const isOverdue = daysUntil < 0;

                            return (
                                <div
                                    key={sub._id}
                                    onClick={() => openEdit(sub)}
                                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isOverdue ? 'bg-destructive/10 text-destructive' :
                                            isDueSoon ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-primary/10 text-primary'
                                            }`}>
                                            <RotateCw size={24} className={isDueSoon ? 'animate-pulse' : ''} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-lg">{sub.name}</h4>
                                                {sub.autoPay && (
                                                    <span className="px-2 py-0.5 rounded-md bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">AutoPay</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1"><CreditCard size={12} /> {sub.accountId?.name || 'Unknown Account'}</span>
                                                <span className="w-1 h-1 rounded-full bg-border"></span>
                                                <span>{sub.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                                        <div className="text-left sm:text-right">
                                            <p className="font-bold text-lg">৳{sub.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">{sub.frequency}</p>
                                        </div>

                                        <div className={`text-right w-24 ${isOverdue ? 'text-destructive font-bold' : isDueSoon ? 'text-amber-500 font-bold' : 'text-muted-foreground'}`}>
                                            <p className="text-sm">
                                                {isOverdue ? 'Overdue' : daysUntil === 0 ? 'Due Today' : `In ${daysUntil} days`}
                                            </p>
                                            <p className="text-[10px]">{new Date(sub.nextBillingDate).toLocaleDateString()}</p>
                                        </div>

                                        <button
                                            onClick={(e) => handleDeleteClick(sub._id, e)}
                                            className="opacity-70 group-hover:opacity-100 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-card w-full max-w-lg rounded-3xl shadow-2xl relative z-10 border border-border"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <h2 className="text-xl font-bold">{editingId ? 'Edit Subscription' : 'New Subscription'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Service Name</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="Netflix, Gym, Internet..." />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Amount</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">৳</div>
                                            <input type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="input-field pl-8" placeholder="0" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Frequency</label>
                                        <select required value={formData.frequency} onChange={e => setFormData({ ...formData, frequency: e.target.value })} className="input-field">
                                            <option>Monthly</option>
                                            <option>Yearly</option>
                                            <option>Weekly</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Next Bill Date</label>
                                        <input type="date" required value={formData.nextBillingDate} onChange={e => setFormData({ ...formData, nextBillingDate: e.target.value })} className="input-field" />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Pay From</label>
                                        <select required value={formData.accountId} onChange={e => setFormData({ ...formData, accountId: e.target.value })} className="input-field">
                                            {accounts.map(acc => (
                                                <option key={acc._id} value={acc._id}>{acc.name} (৳{acc.balance})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-3 p-4 border border-border rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.autoPay}
                                            onChange={e => setFormData({ ...formData, autoPay: e.target.checked })}
                                            className="w-5 h-5 rounded border-primary text-primary focus:ring-primary/20 bg-card"
                                        />
                                        <div>
                                            <p className="font-bold text-sm">Enable AutoPay</p>
                                            <p className="text-xs text-muted-foreground">Automatically log this expense on the due date</p>
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="submit" className="btn-primary flex-1 py-3">Save Subscription</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => {
                    setIsConfirmOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Subscription"
                description="Are you sure you want to delete this subscription? The system will no longer check for its due dates or automatically log transactions."
                confirmText="Delete"
                variant="danger"
            />
        </PageWrapper>
    );
}
