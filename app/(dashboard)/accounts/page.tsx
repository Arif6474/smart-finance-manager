'use client';

import { useState, useEffect } from 'react';
import { Plus, Wallet, CreditCard, Landmark, MoreVertical, Trash2, Eye, EyeOff, ArrowRightLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useBalance } from '@/context/BalanceContext';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import PageWrapper from '@/components/PageWrapper';
import Skeleton from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';

export default function AccountsPage() {
    const router = useRouter();
    const { showBalance, toggleBalance } = useBalance();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // New account form state
    const [name, setName] = useState('');
    const [type, setType] = useState('Cash');
    const [balance, setBalance] = useState('');

    // Transfer form state
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferDescription, setTransferDescription] = useState('');
    const [transferLoading, setTransferLoading] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/accounts');
            const data = await res.json();
            setAccounts(data);
            if (data.length > 0) {
                setFromAccount(data[0]._id);
                if (data.length > 1) {
                    setToAccount(data[1]._id);
                }
            }
        } catch (err) {
            console.error('Failed to fetch accounts', err);
        } finally {
            setLoading(false);
        }
    };

    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, balance: parseFloat(balance) || 0 }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setName('');
                setBalance('');
                toast.success('Account created successfully');
                fetchAccounts();
            } else {
                toast.error('Failed to create account');
            }
        } catch (err) {
            console.error('Failed to add account', err);
            toast.error('An error occurred');
        }
    };

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (fromAccount === toAccount) {
            toast.error('Source and destination accounts must be different');
            return;
        }

        try {
            setTransferLoading(true);
            const res = await fetch('/api/accounts/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromAccountId: fromAccount,
                    toAccountId: toAccount,
                    amount: parseFloat(transferAmount),
                    description: transferDescription
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsTransferModalOpen(false);
                setTransferAmount('');
                setTransferDescription('');
                toast.success('Transfer successful');
                fetchAccounts();
            } else {
                toast.error(data.error || 'Transfer failed');
            }
        } catch (err) {
            console.error('Failed to perform transfer', err);
            toast.error('An error occurred');
        } finally {
            setTransferLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'Bank': return <Landmark size={24} />;
            case 'Mobile Banking': return <CreditCard size={24} />;
            default: return <Wallet size={24} />;
        }
    };

    return (
        <PageWrapper className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    {accounts.length > 0 && (
                        <p className="text-muted-foreground text-sm font-medium">
                            Total Balance: <span className="font-bold text-foreground">
                                {showBalance ? `৳${totalBalance.toLocaleString()}` : '৳ ******'}
                            </span>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => toggleBalance()}
                        className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title={showBalance ? "Hide Balances" : "Show Balances"}
                    >
                        {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                        onClick={() => setIsTransferModalOpen(true)}
                        className="btn-secondary px-5 py-2.5 flex items-center gap-2 text-sm border border-border bg-card hover:bg-muted"
                    >
                        <ArrowRightLeft size={18} />
                        <span>Transfer</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary px-5 py-2.5 flex items-center gap-2 text-xs"
                    >
                        <Plus size={20} />
                        <span>Add Account</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-44" />
                    ))
                ) : accounts.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyState
                            title="No accounts found"
                            description="Create your first account to start tracking your balance."
                        />
                    </div>
                ) : (
                    accounts.map((acc) => (
                        <div key={acc._id} className="glass p-6 rounded-3xl group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-44">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                    {getIcon(acc.type)}
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{acc.type}</p>
                                    <h3 className="text-lg font-black truncate max-w-[150px]">{acc.name}</h3>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Current Balance</p>
                                    <span className="text-2xl font-black tracking-tighter">
                                        {showBalance ? `৳${acc.balance.toLocaleString()}` : '৳ ******'}
                                    </span>
                                </div>
                                {/* <button
                                    onClick={() => router.push(`/transactions?accountId=${acc._id}`)}
                                    className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <Eye size={18} />
                                </button> */}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Account Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Account"
            >
                <form onSubmit={handleAddAccount} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium block mb-2">Account Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Dutch Bangla Bank"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2">Account Type</label>
                        <Select
                            value={type}
                            onChange={(val) => setType(val)}
                            options={[
                                { value: 'Cash', label: 'Cash' },
                                { value: 'Bank', label: 'Bank' },
                                { value: 'Mobile Banking', label: 'Mobile Banking' },
                                { value: 'Other', label: 'Other' }
                            ]}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2">Initial Balance</label>
                        <input
                            type="number"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            placeholder="0.00"
                            className="input-field"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full btn-primary py-3.5 rounded-2xl mt-4 text-sm font-bold shadow-lg shadow-primary/20"
                    >
                        Create Account
                    </button>
                </form>
            </Modal>

            {/* Transfer Fund Modal */}
            <Modal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                title="Transfer Fund"
            >
                <form onSubmit={handleTransfer} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium block mb-2">From Account</label>
                            <Select
                                value={fromAccount}
                                onChange={(val) => setFromAccount(val)}
                                options={accounts.map(acc => ({ value: acc._id, label: `${acc.name} (৳${acc.balance.toLocaleString()})` }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-2">To Account</label>
                            <Select
                                value={toAccount}
                                onChange={(val) => setToAccount(val)}
                                options={accounts.map(acc => ({ value: acc._id, label: `${acc.name} (৳${acc.balance.toLocaleString()})` }))}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2">Amount</label>
                        <input
                            type="number"
                            required
                            min="0.01"
                            step="0.01"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="0.00"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2">Description (Optional)</label>
                        <input
                            type="text"
                            value={transferDescription}
                            onChange={(e) => setTransferDescription(e.target.value)}
                            placeholder="Reason for transfer"
                            className="input-field"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={transferLoading}
                        className="w-full btn-primary py-3.5 rounded-2xl mt-4 text-sm font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {transferLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {transferLoading ? 'Processing...' : 'Transfer Fund'}
                    </button>
                </form>
            </Modal>
        </PageWrapper>
    );
}
