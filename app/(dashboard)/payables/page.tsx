'use client';

import { useState, useEffect } from 'react';
import { Plus, HandCoins, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Modal from '@/components/Modal';
import PageWrapper from '@/components/PageWrapper';
import Skeleton from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { format } from 'date-fns';

export default function PayablesPage() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [type, setType] = useState('Payable'); // Payable = I owe, Receivable = owes me
    const [person, setPerson] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/payables');
            const data = await res.json();
            setItems(data);
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
                    description,
                    dueDate: dueDate ? new Date(dueDate) : undefined
                }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setPerson('');
                setAmount('');
                setDescription('');
                setDueDate('');
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

    return (
        <PageWrapper className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Payables & Receivables</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/30 w-full sm:w-auto"
                >
                    <Plus size={20} />
                    <span>Add New</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payables (I owe) */}
                <div className="glass p-6 rounded-2xl">
                    <h2 className="text-xl font-bold mb-4 flex items-center text-red-500">
                        <HandCoins className="mr-2" /> I Owe (Payables)
                    </h2>
                    <div className="space-y-4">
                        {loading ? (
                            [1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" />)
                        ) : items.filter(i => i.type === 'Payable').length === 0 ? (
                            <EmptyState title="All Caught Up" description="You don't owe money to anyone right now." />
                        ) : (
                            items.filter(i => i.type === 'Payable').map(item => (
                                <div key={item._id} className="p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border hover:-translate-y-1 hover:shadow-md hover:border-red-500/50 transition-all duration-300 flex justify-between items-center group">
                                    <div>
                                        <h3 className="font-bold text-lg">{item.person}</h3>
                                        <p className="text-sm text-slate-500">{item.description}</p>
                                        {item.dueDate && (
                                            <div className="flex items-center text-xs text-orange-500 mt-2 font-medium">
                                                <Calendar size={12} className="mr-1" />
                                                Due: {format(new Date(item.dueDate), 'MMM d, yyyy')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-red-500">৳{item.amount.toLocaleString()}</p>
                                        <button className="text-xs text-slate-500 flex items-center justify-end mt-2 hover:text-green-500 transition-colors">
                                            <Circle size={14} className="mr-1 mt-0.5" /> Mark Paid
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Receivables (Owed to me) */}
                <div className="glass p-6 rounded-2xl">
                    <h2 className="text-xl font-bold mb-4 flex items-center text-green-500">
                        <HandCoins className="mr-2" /> Owes Me (Receivables)
                    </h2>
                    <div className="space-y-4">
                        {loading ? (
                            [1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" />)
                        ) : items.filter(i => i.type === 'Receivable').length === 0 ? (
                            <EmptyState title="No Receivables" description="Nobody owes you money at the moment." />
                        ) : (
                            items.filter(i => i.type === 'Receivable').map(item => (
                                <div key={item._id} className="p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border hover:-translate-y-1 hover:shadow-md hover:border-green-500/50 transition-all duration-300 flex justify-between items-center group">
                                    <div>
                                        <h3 className="font-bold text-lg">{item.person}</h3>
                                        <p className="text-sm text-slate-500">{item.description}</p>
                                        {item.dueDate && (
                                            <div className="flex items-center text-xs text-orange-500 mt-2 font-medium">
                                                <Calendar size={12} className="mr-1" />
                                                Due: {format(new Date(item.dueDate), 'MMM d, yyyy')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-500">৳{item.amount.toLocaleString()}</p>
                                        <button className="text-xs text-slate-500 flex items-center justify-end mt-2 hover:text-green-500 transition-colors">
                                            <Circle size={14} className="mr-1 mt-0.5" /> Mark Received
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Payable/Receivable"
            >
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'Payable' ? 'bg-white dark:bg-slate-800 shadow text-red-500' : 'text-slate-500'}`}
                            onClick={() => setType('Payable')}
                        >
                            I Owe
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'Receivable' ? 'bg-white dark:bg-slate-800 shadow text-green-500' : 'text-slate-500'}`}
                            onClick={() => setType('Receivable')}
                        >
                            Owes Me
                        </button>
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Person Name</label>
                        <input
                            type="text"
                            required
                            value={person}
                            onChange={(e) => setPerson(e.target.value)}
                            placeholder="Who?"
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Amount</label>
                        <input
                            type="number"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Due Date (Optional)</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Description (Optional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What was this for?"
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary py-3 rounded-xl text-white font-bold mt-4 shadow-lg shadow-primary/30"
                    >
                        Save Entry
                    </button>
                </form>
            </Modal>
        </PageWrapper>
    );
}
