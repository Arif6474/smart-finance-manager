'use client';

import { useState, useEffect } from 'react';
import {
    Plus, HandCoins, Calendar, CheckCircle2, Circle, AlertCircle,
    Trash2, Clock, Zap, Home, Tv, User, CreditCard, MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import DatePicker from '@/components/DatePicker';
import PageWrapper from '@/components/PageWrapper';
import Skeleton from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import Select from '@/components/Select';
import EmiCalculator from '@/components/EmiCalculator';

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
    const [accountId, setAccountId] = useState('');
    const [accounts, setAccounts] = useState<any[]>([]);

    // Loan specific state
    const [isLoan, setIsLoan] = useState(false);
    const [totalPrincipal, setTotalPrincipal] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [termMonths, setTermMonths] = useState('');

    useEffect(() => {
        fetchItems();
        fetchAccounts();
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

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/accounts');
            const data = await res.json();
            setAccounts(data);
            if (data.length > 0) setAccountId(data[0]._id);
        } catch (err) {
            console.error('Failed to fetch accounts', err);
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
                    dueDate: dueDate ? new Date(dueDate) : undefined,
                    accountId,
                    isLoan,
                    totalPrincipal: parseFloat(totalPrincipal),
                    interestRate: parseFloat(interestRate),
                    termMonths: parseInt(termMonths),
                    startDate: isLoan && dueDate ? new Date(dueDate) : undefined
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
        setIsLoan(false);
        setTotalPrincipal('');
        setInterestRate('');
        setTermMonths('');
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
            .reduce((acc, curr) => {
                const itemAmount = curr.isLoan ? (curr.emiAmount || 0) : (curr.amount || 0);
                return acc + itemAmount;
            }, 0);
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
                        <div key={item._id} className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-300 flex flex-col gap-4 group relative overflow-hidden">
                            {isOverdue(item.dueDate) && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                            )}
                            <div className="flex justify-between items-start">
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
                                            {item.isLoan && (
                                                <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Loan</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span className="font-medium">{item.category}</span>
                                            {item.description && <span>• {item.description}</span>}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {item.isLoan && (
                                        <p className={`text-xl font-bold ${itemType === 'Payable' ? 'text-red-500' : 'text-emerald-500'}`}>
                                            ৳{item.emiAmount.toLocaleString()}
                                        </p>
                                    )}
                                    {!item.isLoan && (
                                        <p className={`text-xl font-bold ${itemType === 'Payable' ? 'text-red-500' : 'text-emerald-500'}`}>
                                            ৳{item.amount.toLocaleString()}
                                        </p>
                                    )}
                                    <div className={`flex items-center text-xs mt-1 font-medium justify-end ${isOverdue(item.dueDate) ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        <Calendar size={12} className="mr-1" />
                                        {item.dueDate ? format(new Date(item.dueDate), 'MMM d, yyyy') : 'No Date'}
                                    </div>
                                </div>
                            </div>

                            {item.isLoan && (
                                <div className="pt-2">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1.5">
                                        <span>Repayment Progress</span>
                                        <span>{Math.round(((item.totalPrincipal - item.remainingPrincipal) / item.totalPrincipal) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-1000"
                                            style={{ width: `${((item.totalPrincipal - item.remainingPrincipal) / item.totalPrincipal) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                                        <span>Paid: ৳{(item.totalPrincipal - item.remainingPrincipal).toLocaleString()}</span>
                                        <span>Remaining: ৳{item.remainingPrincipal.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-border/50">
                                <button
                                    onClick={() => handleToggleStatus(item)}
                                    className="text-[10px] font-bold text-muted-foreground hover:text-emerald-500 flex items-center gap-1 transition-colors uppercase tracking-tight"
                                >
                                    <CheckCircle2 size={12} /> Mark {item.status === 'Paid' ? 'Pending' : 'Paid'}
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
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
                                    {item.isLoan && (
                                        <p className={`text-xl font-bold ${itemType === 'Payable' ? 'text-red-500' : 'text-emerald-500'}`}>
                                            ৳{item.totalPrincipal.toLocaleString()}
                                        </p>
                                    )}
                                    {!item.isLoan && (
                                        <span className="text-sm font-bold line-through">৳{item.amount.toLocaleString()}</span>
                                    )}
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

            {/* EMI Calculator Section */}
            <div className="pt-8 mt-8 border-t border-border">
                <EmiCalculator />
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
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                            <div>
                                <h4 className="text-sm font-bold">Loan / EMI Mode</h4>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Amortized tracking</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsLoan(!isLoan)}
                                className={`w-12 h-6 rounded-full transition-all relative ${isLoan ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${isLoan ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{type === 'Payable' ? 'Lender / Entity' : 'Borrower Name'}</label>
                            <input
                                type="text"
                                required
                                value={person}
                                onChange={(e) => setPerson(e.target.value)}
                                placeholder="E.g. HDFC Bank, John..."
                                className="input-field"
                            />
                        </div>

                        {isLoan ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Principal</label>
                                        <input
                                            type="number"
                                            required
                                            value={totalPrincipal}
                                            onChange={(e) => setTotalPrincipal(e.target.value)}
                                            placeholder="৳0"
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interest (%)</label>
                                        <input
                                            type="number"
                                            required
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(e.target.value)}
                                            placeholder="9"
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tenor (Months)</label>
                                    <input
                                        type="number"
                                        required
                                        value={termMonths}
                                        onChange={(e) => setTermMonths(e.target.value)}
                                        placeholder="24"
                                        className="input-field"
                                    />
                                </div>
                            </>
                        ) : (
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
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Link Account (Optional)</label>
                            <Select
                                value={accountId}
                                onChange={(val) => setAccountId(val)}
                                options={accounts.map(acc => ({
                                    value: acc._id,
                                    label: `${acc.name} (৳${acc.balance})`
                                }))}
                                placeholder="Select Account for Auto-Payment"
                            />
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
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{isLoan ? 'Start Date' : 'Due Date'}</label>
                            <DatePicker
                                value={dueDate}
                                onChange={setDueDate}
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
