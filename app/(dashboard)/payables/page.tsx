'use client';

import { useState, useEffect } from 'react';
import {
    Plus, HandCoins, Calendar, CheckCircle2, Circle, AlertCircle,
    Trash2, Clock, Zap, Home, Tv, User, CreditCard, MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import PageWrapper from '@/components/PageWrapper';
import Skeleton from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const categories = [
    { name: 'Bill', icon: Zap, color: 'bg-yellow-500/10 text-yellow-500' },
    { name: 'Rent', icon: Home, color: 'bg-blue-500/10 text-blue-500' },
    { name: 'Loan', icon: CreditCard, color: 'bg-indigo-500/10 text-indigo-500' },
    { name: 'EMI', icon: Clock, color: 'bg-purple-500/10 text-purple-500' },
    { name: 'Subscription', icon: Tv, color: 'bg-red-500/10 text-red-500' },
    { name: 'Personal', icon: User, color: 'bg-green-500/10 text-green-500' },
    { name: 'Other', icon: MoreHorizontal, color: 'bg-slate-500/10 text-slate-500' }
];

export default function PayablesPage() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [type, setType] = useState<'Payable' | 'Receivable'>('Payable');
    const [person, setPerson] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Bill');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/payables');
            const data = await res.json();
            if (Array.isArray(data)) {
                setItems(data);
            }
        } catch (err) {
            console.error('Failed to fetch payables', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/payables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    person,
                    amount: parseFloat(amount),
                    category,
                    description,
                    dueDate: dueDate ? new Date(dueDate) : undefined
                }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                toast.success('Entry added successfully');
                fetchItems();
            } else {
                toast.error('Failed to add entry');
            }
        } catch (err) {
            console.error('Failed to add entry', err);
            toast.error('An error occurred');
        }
    };

    const resetForm = () => {
        setPerson('');
        setAmount('');
        setDescription('');
        setDueDate('');
        setCategory('Bill');
        setType('Payable');
    };

    const handleToggleStatus = async (item: any) => {
        const newStatus = item.status === 'Paid' ? 'Pending' : 'Paid';
        try {
            const res = await fetch(`/api/payables?id=${item._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                toast.success(`Marked as ${newStatus}`);
                fetchItems();
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        setItemToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(`/api/payables?id=${itemToDelete}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Entry deleted');
                fetchItems();
            }
        } catch (err) {
            toast.error('Failed to delete entry');
        } finally {
            setItemToDelete(null);
        }
    };

    const getTotal = (t: 'Payable' | 'Receivable') => {
        return items
            .filter(i => i.type === t && i.status !== 'Paid')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const getIcon = (catName: string) => {
        const cat = categories.find(c => c.name === catName) || categories[categories.length - 1];
        return <cat.icon size={18} />;
    };

    const getCatColor = (catName: string) => {
        const cat = categories.find(c => c.name === catName) || categories[categories.length - 1];
        return cat.color;
    };

    const isOverdue = (date: any) => {
        if (!date) return false;
        return isBefore(new Date(date), new Date()) && !isAfter(new Date(date), addDays(new Date(), -1));
    };

    const renderItems = (itemType: 'Payable' | 'Receivable') => {
        const filtered = items.filter(i => i.type === itemType);
        const pending = filtered.filter(i => i.status !== 'Paid');
        const paid = filtered.filter(i => i.status === 'Paid');

        if (loading) {
            return [1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" />);
        }

        if (filtered.length === 0) {
            return <EmptyState title={itemType === 'Payable' ? "All Caught Up" : "No Receivables"} description={itemType === 'Payable' ? "You don't owe money to anyone right now." : "Nobody owes you money at the moment."} />;
        }

        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    {pending.map(item => (
                        <div key={item._id} className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-300 flex justify-between items-center group relative overflow-hidden">
                            {isOverdue(item.dueDate) && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                            )}
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${getCatColor(item.category)}`}>
                                    {getIcon(item.category)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg leading-tight">{item.person}</h3>
                                        {isOverdue(item.dueDate) && (
                                            <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Overdue</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <span className="font-medium">{item.category}</span>
                                        {item.description && <span>• {item.description}</span>}
                                    </p>
                                    {item.dueDate && (
                                        <div className={`flex items-center text-xs mt-2 font-medium ${isOverdue(item.dueDate) ? 'text-red-500' : 'text-muted-foreground'}`}>
                                            <Calendar size={12} className="mr-1" />
                                            Due: {format(new Date(item.dueDate), 'MMM d, yyyy')}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                <p className={`text-xl font-bold ${itemType === 'Payable' ? 'text-red-500' : 'text-emerald-500'}`}>
                                    ৳{item.amount.toLocaleString()}
                                </p>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleToggleStatus(item)}
                                        className="text-[10px] font-bold text-muted-foreground hover:text-emerald-500 flex items-center gap-1 transition-colors uppercase tracking-tight"
                                    >
                                        <Circle size={12} /> Mark Paid
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {paid.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border">
                        <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-2">Recently Resolved</h4>
                        {paid.slice(0, 3).map(item => (
                            <div key={item._id} className="p-3 rounded-xl bg-muted/30 border border-dashed border-border flex justify-between items-center opacity-70">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    <span className="text-sm font-medium">{item.person}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold line-through">৳{item.amount.toLocaleString()}</span>
                                    <button onClick={() => handleDelete(item._id)} className="p-1 hover:text-red-500">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <PageWrapper className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Payables & Receivables</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your debts and collections elegantly</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary px-6 py-2.5 flex items-center justify-center gap-2 text-sm w-full sm:w-auto shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    <span>New Entry</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-between">
                    <div>
                        <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">Upcoming Payables</p>
                        <h2 className="text-3xl font-bold tracking-tight">৳{getTotal('Payable').toLocaleString()}</h2>
                    </div>
                    <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                        <HandCoins size={24} />
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                    <div>
                        <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-1">Expected Receivables</p>
                        <h2 className="text-3xl font-bold tracking-tight">৳{getTotal('Receivable').toLocaleString()}</h2>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <HandCoins size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 px-2">
                        <AlertCircle className="text-red-500" size={20} /> I Owe Money
                    </h2>
                    {renderItems('Payable')}
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 px-2">
                        <HandCoins className="text-emerald-500" size={20} /> Money Owed to Me
                    </h2>
                    {renderItems('Receivable')}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={type === 'Payable' ? "New Debt Entry" : "New Collection Entry"}
            >
                <form onSubmit={handleAdd} className="space-y-5">
                    <div className="p-1 bg-muted rounded-xl flex items-center gap-1">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${type === 'Payable' ? 'bg-card text-red-500 shadow-sm' : 'text-muted-foreground'}`}
                            onClick={() => setType('Payable')}
                        >
                            I Owe
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${type === 'Receivable' ? 'bg-card text-emerald-500 shadow-sm' : 'text-muted-foreground'}`}
                            onClick={() => setType('Receivable')}
                        >
                            Owes Me
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Person / Entity</label>
                            <input
                                type="text"
                                required
                                value={person}
                                onChange={(e) => setPerson(e.target.value)}
                                placeholder="E.g. Electricity Board, John..."
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">৳</span>
                                <input
                                    type="number"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="input-field pl-8 font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => setCategory(cat.name)}
                                        className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${category === cat.name ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-muted opacity-60'}`}
                                    >
                                        <cat.icon size={16} />
                                        <span className="text-[10px] font-medium">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Details about this entry..."
                                className="input-field min-h-[80px]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-4 mt-2 text-sm shadow-lg shadow-primary/20"
                    >
                        Save Entry
                    </button>
                </form>
            </Modal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Entry?"
                description="This action cannot be undone. This entry will be permanently removed from your records."
                confirmText="Delete Entry"
            />
        </PageWrapper>
    );
}
