'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink, Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import PageWrapper from '@/components/PageWrapper';
import Link from 'next/link';

interface PaymentRequest {
    _id: string;
    paymentMethod: string;
    transactionId: string;
    senderNumber: string;
    status: 'pending' | 'approved' | 'rejected';
    amount: number;
    createdAt: string;
    approvedAt?: string;
    rejectionReason?: string;
}

export default function PaymentHistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const [payments, setPayments] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && user) {
            fetchPayments();
        }
    }, [user, authLoading]);

    const fetchPayments = async () => {
        try {
            const res = await fetch('/api/payments');
            if (!res.ok) throw new Error('Failed to fetch payment history');
            const data = await res.json();
            setPayments(data.paymentRequests);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-success/10 text-success border-success/20';
            case 'rejected':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            default:
                return 'bg-warning/10 text-warning border-warning/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 size={16} />;
            case 'rejected':
                return <XCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const filteredPayments = payments.filter(p => 
        p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="space-y-8 max-w-5xl mx-auto pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <CreditCard size={28} />
                        </div>
                        Payment History
                    </h1>
                    <p className="text-muted-foreground">Track your subscription payments and plan status</p>
                </div>
                
                <Link 
                    href="/upgrade" 
                    className="btn-primary flex items-center gap-2 justify-center py-2.5 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold text-sm"
                >
                    Upgrade Now
                    <ExternalLink size={16} />
                </Link>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Requests', value: payments.length, icon: Calendar, color: 'text-primary bg-primary/10' },
                    { label: 'Approved', value: payments.filter(p => p.status === 'approved').length, icon: CheckCircle2, color: 'text-success bg-success/10' },
                    { label: 'Pending', value: payments.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-warning bg-warning/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border p-5 rounded-3xl flex items-center gap-4 transition-all hover:border-primary/30">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black tabular-nums">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by Transaction ID or Payment Method..." 
                    className="input-field pl-12 h-14 bg-card border-border/60 focus:bg-card/80 rounded-2xl shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* History Table/List */}
            <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border bg-muted/20">
                    <h3 className="font-bold flex items-center gap-2">
                        <Clock size={18} className="text-primary" /> Recent Requests
                    </h3>
                </div>

                <div className="divide-y divide-border/50">
                    <AnimatePresence mode="popLayout">
                        {filteredPayments.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-16 text-center space-y-4"
                            >
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                                    <CreditCard size={40} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold text-muted-foreground">No payments found</p>
                                    <p className="text-sm text-muted-foreground/70 max-w-xs mx-auto">
                                        You haven't made any payment requests yet or no results match your search.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            filteredPayments.map((payment, idx) => (
                                <motion.div 
                                    key={payment._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-muted/30 transition-all group"
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 duration-300 ${getStatusStyles(payment.status)}`}>
                                            {getStatusIcon(payment.status)}
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-black text-lg capitalize">{payment.paymentMethod}</h4>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current flex items-center gap-1 ${getStatusStyles(payment.status)}`}>
                                                    {getStatusIcon(payment.status)}
                                                    {payment.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <CreditCard size={14} /> 
                                                    TXN: <span className="font-mono text-foreground">{payment.transactionId}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={14} /> 
                                                    {new Date(payment.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:items-end justify-center gap-2">
                                        <div className="text-3xl font-black flex items-baseline gap-1">
                                            <span className="text-sm font-bold text-muted-foreground">৳</span>
                                            {payment.amount.toLocaleString()}
                                        </div>
                                        
                                        {payment.status === 'rejected' && payment.rejectionReason && (
                                            <div className="flex items-center gap-2 bg-destructive/5 text-destructive border border-destructive/10 px-3 py-1.5 rounded-xl max-w-xs transition-colors hover:bg-destructive/10">
                                                <AlertCircle size={14} className="shrink-0" />
                                                <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                                                    Reason: {payment.rejectionReason}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {payment.status === 'approved' && payment.approvedAt && (
                                            <p className="text-[11px] text-success font-bold bg-success/5 border border-success/10 px-3 py-1 rounded-full">
                                                Verified on {new Date(payment.approvedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Support Box */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8 rounded-[40px] relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="w-16 h-16 rounded-[24px] bg-white dark:bg-card shadow-xl flex items-center justify-center text-indigo-500 transition-transform duration-500 group-hover:rotate-12">
                        <AlertCircle size={32} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-black mb-1">Need help with a payment?</h3>
                        <p className="text-muted-foreground text-sm max-w-lg">If your payment is pending for more than 2 hours or was rejected unfairly, please contact our support team with your Transaction ID.</p>
                    </div>
                    <button className="btn-secondary whitespace-nowrap px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/5 group-hover:shadow-indigo-500/15 transition-all">Contact Support</button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full -ml-16 -mb-16 blur-3xl" />
            </div>
        </PageWrapper>
    );
}
