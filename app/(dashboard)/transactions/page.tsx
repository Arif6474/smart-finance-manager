'use client';

import { useState, useEffect } from 'react';
import { Plus, ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Modal from '@/components/Modal';
import PageWrapper from '@/components/PageWrapper';
import Skeleton from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { format } from 'date-fns';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [type, setType] = useState('Expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [accountId, setAccountId] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [txRes, accRes] = await Promise.all([
                fetch('/api/transactions'),
                fetch('/api/accounts')
            ]);
            const txData = await txRes.json();
            const accData = await accRes.json();
            setTransactions(txData);
            setAccounts(accData);
            if (accData.length > 0) setAccountId(accData[0]._id);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    amount: parseFloat(amount),
                    category,
                    accountId,
                    description
                }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setAmount('');
                setCategory('');
                setDescription('');
                toast.success('Transaction saved');
                fetchData();
            } else {
                toast.error('Failed to save transaction');
            }
        } catch (err) {
            console.error('Failed to add transaction', err);
            toast.error('An error occurred');
        }
    };

    return (
        <PageWrapper className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/30 w-full sm:w-auto"
                >
                    <Plus size={20} />
                    <span>Add Transaction</span>
                </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-slate-900/50">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <button className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors w-full sm:w-auto justify-center border border-slate-200 dark:border-slate-700">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Transaction</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Account</th>
                                <th className="px-6 py-4 hidden md:table-cell">Category</th>
                                <th className="px-6 py-4 hidden lg:table-cell">Date</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                                        <td className="px-6 py-4 hidden sm:table-cell"><Skeleton className="h-6 w-24" /></td>
                                        <td className="px-6 py-4 hidden md:table-cell"><Skeleton className="h-6 w-16" /></td>
                                        <td className="px-6 py-4 hidden lg:table-cell"><Skeleton className="h-6 w-32" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12">
                                        <EmptyState
                                            title="No transactions yet"
                                            description="Record your first income or expense to see it here."
                                        />
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${tx.type === 'Income' ? 'bg-green-100 dark:bg-green-900/20 text-green-500' : 'bg-red-100 dark:bg-red-900/20 text-red-500'}`}>
                                                    {tx.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{tx.description || tx.category}</p>
                                                    <p className="text-xs text-slate-500 sm:hidden">{tx.accountId?.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell text-slate-600 dark:text-slate-300">
                                            {tx.accountId?.name}
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-medium">
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell text-slate-500 text-sm">
                                            {format(new Date(tx.date), 'MMM d, yyyy h:mm a')}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${tx.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                                            {tx.type === 'Income' ? '+' : '-'}৳{tx.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Transaction"
            >
                <form onSubmit={handleAddTransaction} className="space-y-4">
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'Expense' ? 'bg-white dark:bg-slate-800 shadow text-red-500' : 'text-slate-500'}`}
                            onClick={() => setType('Expense')}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'Income' ? 'bg-white dark:bg-slate-800 shadow text-green-500' : 'text-slate-500'}`}
                            onClick={() => setType('Income')}
                        >
                            Income
                        </button>
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
                        <label className="text-sm font-medium block mb-2">Account</label>
                        <select
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            required
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        >
                            {accounts.map(acc => (
                                <option key={acc._id} value={acc._id}>{acc.name} (৳{acc.balance})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Category</label>
                        <input
                            type="text"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Food, Salary, Rent"
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Description (Optional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed description"
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary py-3 rounded-xl text-white font-bold mt-4 shadow-lg shadow-primary/30"
                    >
                        Save Transaction
                    </button>
                </form>
            </Modal>
        </PageWrapper>
    );
}
