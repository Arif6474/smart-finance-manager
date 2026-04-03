'use client';

import { useState, useEffect } from 'react';
import { Plus, Wallet, CreditCard, Landmark, MoreVertical, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // New account form state
    const [name, setName] = useState('');
    const [type, setType] = useState('Cash');
    const [balance, setBalance] = useState('');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/accounts');
            const data = await res.json();
            setAccounts(data);
        } catch (err) {
            console.error('Failed to fetch accounts', err);
        } finally {
            setLoading(false);
        }
    };

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
                fetchAccounts();
            }
        } catch (err) {
            console.error('Failed to add account', err);
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Accounts</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-primary/30"
                >
                    <Plus size={20} />
                    <span>Add Account</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="glass p-6 rounded-2xl animate-pulse h-32 bg-slate-200 dark:bg-slate-800"></div>
                    ))
                ) : (
                    accounts.map((acc) => (
                        <div key={acc._id} className="glass p-6 rounded-2xl group hover:border-primary/50 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                    {getIcon(acc.type)}
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-bold truncate">{acc.name}</h3>
                                <p className="text-slate-500 text-sm">{acc.type}</p>
                                <div className="mt-4 flex items-end justify-between">
                                    <span className="text-2xl font-bold">৳{acc.balance.toLocaleString()}</span>
                                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Default</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

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
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2">Account Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank</option>
                            <option value="Mobile Banking">Mobile Banking</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2">Initial Balance</label>
                        <input
                            type="number"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary py-3 rounded-xl text-white font-bold mt-4 shadow-lg shadow-primary/30"
                    >
                        Create Account
                    </button>
                </form>
            </Modal>
        </div>
    );
}
