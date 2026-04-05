'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { Plus, Target, CheckCircle2, TrendingUp, MoreVertical, Edit3, Trash2, Home, Car, Plane, Laptop, GraduationCap } from 'lucide-react';
import Modal from '@/components/Modal';
import Skeleton from '@/components/Skeleton';
import Select from '@/components/Select';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from '@/components/DatePicker';
import ConfirmModal from '@/components/ConfirmModal';

const PRESET_ICONS = [
    { label: 'Target', value: 'Target', icon: Target },
    { label: 'Home', value: 'Home', icon: Home },
    { label: 'Car', value: 'Car', icon: Car },
    { label: 'Travel', value: 'Plane', icon: Plane },
    { label: 'Gadget', value: 'Laptop', icon: Laptop },
    { label: 'Education', value: 'GraduationCap', icon: GraduationCap },
];

const PRESET_COLORS = [
    { label: 'Teal', value: '#14b8a6' },
    { label: 'Indigo', value: '#6366f1' },
    { label: 'Rose', value: '#f43f5e' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Blue', value: '#3b82f6' },
];

export default function GoalsPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Form state
    const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [color, setColor] = useState(PRESET_COLORS[0].value);
    const [icon, setIcon] = useState(PRESET_ICONS[0].value);

    // Funds Form
    const [addFundsAmount, setAddFundsAmount] = useState('');

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/goals');
            if (!res.ok) throw new Error('Failed to fetch goals');
            const data = await res.json();
            setGoals(data);
        } catch (error) {
            toast.error('Failed to load goals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const resetForm = () => {
        setActiveGoalId(null);
        setName('');
        setTargetAmount('');
        setCurrentAmount('0');
        setDeadline(null);
        setColor(PRESET_COLORS[0].value);
        setIcon(PRESET_ICONS[0].value);
    };

    const handleSaveGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                targetAmount: Number(targetAmount),
                currentAmount: Number(currentAmount),
                deadline: deadline ? deadline.toISOString() : null,
                color,
                icon
            };

            const url = activeGoalId ? `/api/goals/${activeGoalId}` : '/api/goals';
            const method = activeGoalId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save goal');
            }

            toast.success(activeGoalId ? 'Goal updated' : 'Goal created');
            setIsGoalModalOpen(false);
            fetchGoals();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeGoalId) return;

        const goal = goals.find(g => g._id === activeGoalId);
        if (!goal) return;

        try {
            const newTotal = goal.currentAmount + Number(addFundsAmount);

            const res = await fetch(`/api/goals/${activeGoalId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentAmount: newTotal })
            });

            if (!res.ok) throw new Error('Failed to add funds');

            toast.success('Funds allocated successfully');
            setIsAddFundsModalOpen(false);
            setAddFundsAmount('');
            fetchGoals();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        if (!activeGoalId) return;
        try {
            const res = await fetch(`/api/goals/${activeGoalId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete goal');
            toast.success('Goal deleted');
            setIsConfirmDeleteOpen(false);
            fetchGoals();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const renderIcon = (iconName: string) => {
        const IconComponent = PRESET_ICONS.find(i => i.value === iconName)?.icon || Target;
        return <IconComponent size={24} />;
    };

    return (
        <PageWrapper>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Savings Goals</h2>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsGoalModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2 px-5 py-2.5"
                >
                    <Plus size={18} />
                    <span className="hidden sm:block">Create Goal</span>
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
                </div>
            ) : goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-3xl">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Target size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Goals Set</h3>
                    <p className="text-muted-foreground text-center max-w-sm mb-6">
                        Set specific financial targets like an emergency fund, a new car, or a dream vacation.
                    </p>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsGoalModalOpen(true);
                        }}
                        className="btn-primary p-2"
                    >
                        Create Your First Goal
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                        const isCompleted = progress >= 100;

                        return (
                            <div key={goal._id} className="bg-card border border-border p-6 rounded-3xl relative group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
                                {/* Decorator Line */}
                                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: goal.color }} />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-2xl bg-opacity-10 flex items-center justify-center text-white" style={{ backgroundColor: goal.color }}>
                                            {renderIcon(goal.icon)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{goal.name}</h3>
                                            {goal.deadline && (
                                                <p className="text-xs text-muted-foreground">
                                                    Target: {new Date(goal.deadline).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                resetForm();
                                                setActiveGoalId(goal._id);
                                                setName(goal.name);
                                                setTargetAmount(goal.targetAmount.toString());
                                                setCurrentAmount(goal.currentAmount.toString());
                                                setDeadline(goal.deadline ? new Date(goal.deadline) : null);
                                                setColor(goal.color);
                                                setIcon(goal.icon);
                                                setIsGoalModalOpen(true);
                                            }}
                                            className="p-1.5 hover:bg-muted text-muted-foreground rounded-lg"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveGoalId(goal._id);
                                                setIsConfirmDeleteOpen(true);
                                            }}
                                            className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-2 flex items-end justify-between">
                                    <div>
                                        <h4 className="text-3xl font-bold tracking-tight">৳{goal.currentAmount.toLocaleString()}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">of ৳{goal.targetAmount.toLocaleString()}</p>
                                    </div>
                                    {isCompleted && (
                                        <div className="flex items-center gap-1 text-success text-sm font-medium bg-success/10 px-2 py-1 rounded-full">
                                            <CheckCircle2 size={14} /> Reached
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-5 mb-6">
                                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className="h-full rounded-full transition-all"
                                            style={{ backgroundColor: goal.color }}
                                        />
                                    </div>
                                    <p className="text-xs text-right mt-1.5 font-medium text-muted-foreground">
                                        {progress.toFixed(1)}% Completed
                                    </p>
                                </div>

                                <button
                                    disabled={isCompleted}
                                    onClick={() => {
                                        setActiveGoalId(goal._id);
                                        setAddFundsAmount('');
                                        setIsAddFundsModalOpen(true);
                                    }}
                                    className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${isCompleted
                                        ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                                        }`}
                                >
                                    <TrendingUp size={18} />
                                    Allocate Funds
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Goal Create/Edit Modal */}
            <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={activeGoalId ? "Edit Goal" : "Create New Goal"}>
                <form onSubmit={handleSaveGoal} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Goal Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="e.g. Dream Vacation"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Target Amount</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                className="input-field font-medium text-lg"
                                placeholder="৳0"
                            />
                        </div>
                        {activeGoalId && (
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Starting Amount</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={currentAmount}
                                    onChange={(e) => setCurrentAmount(e.target.value)}
                                    className="input-field font-medium text-lg"
                                    placeholder="৳0"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Target Date (Optional)</label>
                        <DatePicker
                            value={deadline ? deadline.toISOString() : ''}
                            onChange={(val) => setDeadline(val ? new Date(val) : null)}
                            placeholder="Select target date"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Theme Color</label>
                            <Select
                                options={PRESET_COLORS}
                                value={color}
                                onChange={setColor}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Icon</label>
                            <Select
                                options={PRESET_ICONS}
                                value={icon}
                                onChange={setIcon}
                            />
                        </div>
                    </div>


                    <div className="pt-2">
                        <button type="submit" className="btn-primary w-full py-3 text-sm font-bold">
                            Save Goal
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Allocate Funds Modal */}
            <Modal isOpen={isAddFundsModalOpen} onClose={() => setIsAddFundsModalOpen(false)} title="Allocate Funds">
                <form onSubmit={handleAddFunds} className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Add money towards your savings goal. This will increase the current accumulated amount.
                    </p>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Amount to Add (৳)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={addFundsAmount}
                            onChange={(e) => setAddFundsAmount(e.target.value)}
                            className="input-field font-bold text-2xl text-center"
                            placeholder="0"
                            autoFocus
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="btn-primary w-full py-3 text-sm font-bold">
                            Add Funds
                        </button>
                    </div>

                </form>
            </Modal>

            {/* Delete Confirm Modal */}
            <ConfirmModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Goal?"
                description="Are you sure you want to delete this savings goal? This action cannot be undone."
                confirmText="Yes, delete it"
                variant="danger"
            />
        </PageWrapper>
    );
}
