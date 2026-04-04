'use client';

import { useState, useEffect } from 'react';
import { Plus, Target, AlertCircle, CheckCircle2, MoreVertical, Trash2, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/Modal';
import PageWrapper from '@/components/PageWrapper';
import Skeleton from '@/components/Skeleton';
import Select from '@/components/Select';
import MonthPicker from '@/components/MonthPicker';

const CATEGORIES = [
    'Food & Dining', 'Shopping', 'Transport', 'Rent', 'Bills & Utilities',
    'Entertainment', 'Health', 'Education', 'Other'
];

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [limit, setLimit] = useState('');
    const [durationMonths, setDurationMonths] = useState('1');
    const [monthOffset, setMonthOffset] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchBudgets();
    }, [monthOffset]);

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/budgets?monthOffset=${monthOffset}`);
            const data = await res.json();
            setBudgets(data);
        } catch (err) {
            toast.error('Failed to fetch budgets');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, limit: limit === '' ? 0 : Number(limit), targetMonths: Number(durationMonths), monthOffset })
            });

            if (res.ok) {
                toast.success('Budget saved');
                setIsModalOpen(false);
                setLimit('');
                setDurationMonths('1');
                fetchBudgets();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to save budget');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    const handleEditBudget = (budget: any) => {
        setCategory(budget.category);
        setLimit(budget.limit > 0 ? String(budget.limit) : '');
        setDurationMonths('1');
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDeleteBudget = async (id: string) => {
        if (!confirm('Are you sure you want to delete this budget?')) return;
        try {
            const res = await fetch('/api/budgets', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                toast.success('Budget deleted');
                fetchBudgets();
            }
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const getProgressColor = (percent: number) => {
        if (percent >= 100) return 'bg-destructive';
        if (percent >= 80) return 'bg-amber-500';
        return 'bg-primary';
    };

    const getRemainingText = (budget: any) => {
        if (budget.limit === 0) return 'No limit set';
        const remaining = budget.limit - budget.spent;
        if (remaining > 0) return `৳${remaining.toLocaleString()} remaining`;
        return `৳${Math.abs(remaining).toLocaleString()} over budget`;
    };

    return (
        <PageWrapper>
            <div className="flex justify-between items-start md:items-center gap-3 flex-col md:flex-row mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Monthly Budgets</h2>

                </div>
                <div className="flex items-center justify-between gap-3 w-full md:w-auto">
                    <MonthPicker monthOffset={monthOffset} onChange={setMonthOffset} />
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setCategory(CATEGORIES[0]);
                            setLimit('');
                            setDurationMonths('1');
                            setIsModalOpen(true);
                        }}
                        className="btn-primary flex items-center gap-2 px-5 py-2.5"
                    >
                        <Plus size={18} />
                        <span className='hidden md:block'>Set Budget</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-3xl" />)}
                </div>
            ) : budgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card/30 rounded-3xl border border-dashed border-border">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Target size={32} />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No Budgets Set</h3>
                    <p className="text-muted-foreground text-center max-w-xs mb-6">
                        Set a budget for your spending categories to stay on track.
                    </p>
                    <button onClick={() => {
                        setIsEditing(false);
                        setCategory(CATEGORIES[0]);
                        setLimit('');
                        setDurationMonths('1');
                        setIsModalOpen(true);
                    }} className="btn-primary px-6 py-2">
                        Get Started
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {budgets.map((budget, index) => {
                            const percent = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
                            const isOver = percent >= 100;
                            const isWarning = percent >= 80 && !isOver;

                            return (
                                <motion.div
                                    key={budget._id || budget.category}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                                >
                                    {/* Progress Background */}
                                    <div className="absolute inset-0 bg-primary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${isOver ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                                {isOver ? <AlertCircle size={20} /> : <Target size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground">{budget.category}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {budget.isUnbudgeted ? 'Unbudgeted spending' : budget.limit === 0 ? 'Tracking Only' : `Limit: ৳${budget.limit.toLocaleString()}`}
                                                </p>
                                            </div>
                                        </div>
                                        {budget._id && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEditBudget(budget)}
                                                    title="Edit Budget"
                                                    className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                {/* <button
                                                    onClick={() => handleDeleteBudget(budget._id)}
                                                    title="Delete Budget"
                                                    className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button> */}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 relative z-10">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>৳{budget.spent.toLocaleString()} spent</span>
                                            {budget.limit > 0 && (
                                                <span className={isOver ? 'text-destructive' : isWarning ? 'text-amber-500' : 'text-muted-foreground'}>
                                                    {Math.round(percent)}%
                                                </span>
                                            )}
                                        </div>

                                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(percent, 100)}%` }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                                className={`h-full rounded-full ${getProgressColor(percent)} transition-colors duration-500`}
                                            />
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs">
                                            {budget.limit === 0 ? (
                                                <Target size={14} className="text-muted-foreground" />
                                            ) : isOver ? (
                                                <AlertCircle size={14} className="text-destructive" />
                                            ) : (
                                                <CheckCircle2 size={14} className="text-success" />
                                            )}
                                            <span className={isOver && budget.limit > 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                                                {getRemainingText(budget)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Manage Budget"
            >
                <form onSubmit={handleSaveBudget} className="space-y-6 pt-2">
                    <div>
                        <label className="text-sm font-semibold mb-2 block">Category</label>
                        <Select
                            value={category}
                            onChange={(val) => setCategory(val)}
                            options={CATEGORIES.map(c => ({ value: c, label: c }))}
                            disabled={isEditing}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-2 block">Monthly Limit (৳) - Optional</label>
                        <input
                            type="number"
                            min="0"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            placeholder="Leave empty to set limit later"
                            className="input-field"
                        />
                        <p className="text-[10px] text-muted-foreground mt-2 px-1">
                            Set a realistic limit based on your past spending, or leave empty to just track it as a preset.
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-2 block">Apply for Duration</label>
                        <Select
                            value={durationMonths}
                            onChange={(val) => setDurationMonths(val)}
                            options={[
                                { value: '1', label: 'Only viewing month' },
                                { value: '2', label: 'Viewing + 1 month' },
                                { value: '3', label: 'Next 3 months' },
                                { value: '6', label: 'Next 6 months' },
                                { value: '12', label: 'Next 12 months' },
                            ]}
                        />
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="btn-primary w-full py-3 text-sm font-bold">
                            Save Budget
                        </button>
                    </div>
                </form>
            </Modal>
        </PageWrapper>
    );
}
