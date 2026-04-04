'use client';

import { useState, useEffect } from 'react';
import { Plus, ArrowUpRight, ArrowDownRight, Search, Filter, Edit2, Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import DatePicker from '@/components/DatePicker';
import Select from '@/components/Select';
import PageWrapper from '@/components/PageWrapper';
import Skeleton from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { format, addDays } from 'date-fns';

const CATEGORIES = {
    Income: ['Salary', 'Business', 'Investment', 'Freelance', 'Gift', 'Other'],
    Expense: ['Food & Dining', 'Shopping', 'Transport', 'Rent', 'Bills & Utilities', 'Entertainment', 'Health', 'Education', 'Other']
};

const ALL_CATEGORIES = Array.from(new Set([...CATEGORIES.Income, ...CATEGORIES.Expense])).sort();

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [editId, setEditId] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [type, setType] = useState('Expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [accountId, setAccountId] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterAccountId, setFilterAccountId] = useState('All');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editId ? `/api/transactions?id=${editId}` : '/api/transactions';
        const method = editId ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    amount: parseFloat(amount),
                    category,
                    accountId,
                    description,
                    date: new Date(date)
                }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                toast.success(editId ? 'Transaction updated' : 'Transaction saved');
                fetchData();
            } else {
                toast.error('Failed to save transaction');
            }
        } catch (err) {
            console.error('Failed to save transaction', err);
            toast.error('An error occurred');
        }
    };

    const resetForm = () => {
        setEditId(null);
        setAmount('');
        setCategory('');
        setDescription('');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        if (accounts.length > 0) setAccountId(accounts[0]._id);
    };

    const handleEdit = (tx: any) => {
        setEditId(tx._id);
        setType(tx.type);
        setAmount(tx.amount.toString());
        setCategory(tx.category);
        setAccountId(tx.accountId._id);
        setDescription(tx.description || '');
        setDate(format(new Date(tx.date), 'yyyy-MM-dd'));
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(`/api/transactions?id=${itemToDelete}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Transaction deleted');
                fetchData();
            } else {
                toast.error('Failed to delete');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setItemToDelete(null);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('All');
        setFilterCategory('All');
        setFilterAccountId('All');
    };

    const hasActiveFilters = searchTerm !== '' || filterType !== 'All' || filterCategory !== 'All' || filterAccountId !== 'All';

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch =
            tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.category?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'All' || tx.type === filterType;
        const matchesCategory = filterCategory === 'All' || tx.category === filterCategory;
        const matchesAccount = filterAccountId === 'All' || tx.accountId?._id === filterAccountId;

        return matchesSearch && matchesType && matchesCategory && matchesAccount;
    });

    return (
        <PageWrapper className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">Transactions</h1>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-xs font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="btn-primary px-5 py-2.5 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                >
                    <Plus size={20} />
                    <span>Add Transaction</span>
                </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-slate-900/50">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search transactions..."
                            className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="flex flex-row gap-2 w-full sm:w-auto min-w-[200px]">
                        <Select
                            value={filterType}
                            onChange={(val) => {
                                setFilterType(val);
                                setFilterCategory('All');
                            }}
                            options={[
                                { value: 'All', label: 'Type' },
                                { value: 'Income', label: 'Income' },
                                { value: 'Expense', label: 'Expense' }
                            ]}
                            className="w-full sm:w-40"
                        />
                        <Select
                            value={filterCategory}
                            onChange={(val) => setFilterCategory(val)}
                            options={[
                                { value: 'All', label: 'Category' },
                                ...(filterType === 'All' ? ALL_CATEGORIES : (filterType === 'Income' ? CATEGORIES.Income : CATEGORIES.Expense)).map(cat => ({
                                    value: cat,
                                    label: cat
                                }))
                            ]}
                            className="w-full sm:w-48"
                        />
                        <Select
                            value={filterAccountId}
                            onChange={(val) => setFilterAccountId(val)}
                            options={[
                                { value: 'All', label: 'Account' },
                                ...accounts.map(acc => ({
                                    value: acc._id,
                                    label: acc.name
                                }))
                            ]}
                            className="w-full sm:w-48"
                        />
                    </div>
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
                                <th className="px-6 py-4 text-right">Actions</th>
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
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <EmptyState
                                            title="No results found"
                                            description="Try adjusting your search or filters to find what you're looking for."
                                        />
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
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
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(tx)}
                                                    className="p-2 hover:bg-primary/10 text-slate-400 hover:text-primary transition-colors rounded-lg"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tx._id)}
                                                    className="p-2 hover:bg-destructive/10 text-slate-400 hover:text-destructive transition-colors rounded-lg"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
                onClose={() => {
                    setIsModalOpen(false);
                    resetForm();
                }}
                title={editId ? "Edit Transaction" : "Add Transaction"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Account</label>
                        <Select
                            value={accountId}
                            onChange={(val) => setAccountId(val)}
                            options={accounts.map(acc => ({
                                value: acc._id,
                                label: `${acc.name} (৳${acc.balance})`
                            }))}
                            placeholder="Select Account"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Category</label>
                        <Select
                            value={category}
                            onChange={(val) => setCategory(val)}
                            options={(type === 'Income' ? CATEGORIES.Income : CATEGORIES.Expense).map(cat => ({
                                value: cat,
                                label: cat
                            }))}
                            placeholder="Select Category"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Date</label>
                        <DatePicker value={date} onChange={setDate} />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-2">Description (Optional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed description"
                            className="input-field"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-3 mt-4 text-sm"
                    >
                        {editId ? 'Update Transaction' : 'Save Transaction'}
                    </button>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Transaction?"
                description="This will permanently delete this transaction and revert its impact on your account balance. This action cannot be undone."
                confirmText="Delete Transaction"
            />
        </PageWrapper>
    );
}
