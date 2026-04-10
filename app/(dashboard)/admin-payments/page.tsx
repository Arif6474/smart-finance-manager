'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PageWrapper from '@/components/PageWrapper';
import { PAYMENT_CONFIG } from '@/lib/paymentConfig';

interface PaymentRequest {
    _id: string;
    userId: string;
    userEmail: string;
    userName: string;
    paymentMethod: string;
    transactionId: string;
    senderNumber: string;
    status: 'pending' | 'approved' | 'rejected';
    amount: number;
    createdAt: string;
    approvedAt?: string;
    rejectionReason?: string;
}

export default function AdminPaymentsPage() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectingId, setRejectingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/payments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to fetch payments');

            const data = await res.json();
            setPayments(data.paymentRequests);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (paymentId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/payments/${paymentId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to approve payment');

            toast.success('Payment approved! Pro plan activated for 30 days.');
            fetchPayments();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleReject = async (paymentId: string) => {
        if (!rejectionReason.trim()) {
            toast.error('Please enter a rejection reason');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/payments/${paymentId}/reject`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ rejectionReason }),
            });

            if (!res.ok) throw new Error('Failed to reject payment');

            toast.success('Payment rejected');
            setRejectingId(null);
            setRejectionReason('');
            fetchPayments();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const filteredPayments = payments.filter((p) => (filter === 'all' ? true : p.status === filter));

    const getPaymentMethodName = (methodId: string) => {
        return PAYMENT_CONFIG.methods[methodId as keyof typeof PAYMENT_CONFIG.methods]?.name || methodId;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="text-success" size={20} />;
            case 'rejected':
                return <XCircle className="text-destructive" size={20} />;
            default:
                return <Clock className="text-warning" size={20} />;
        }
    };

    if (loading) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center min-h-[500px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Payment Requests</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and verify user payments for Pro plan subscriptions
                </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                            filter === status
                                ? 'bg-primary text-white'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        {status} ({filteredPayments.filter((p) => p.status === status || status === 'all').length})
                    </button>
                ))}
            </div>

            {/* Payment Requests List */}
            {filteredPayments.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">No payment requests found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredPayments.map((payment) => (
                        <motion.div
                            key={payment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-2xl p-6 space-y-4"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{payment.userName}</h3>
                                    <p className="text-sm text-muted-foreground">{payment.userEmail}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(payment.status)}
                                    <span className="capitalize font-medium text-sm">
                                        {payment.status === 'pending' && 'Pending'}
                                        {payment.status === 'approved' && 'Approved'}
                                        {payment.status === 'rejected' && 'Rejected'}
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/50 rounded-xl p-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Payment Method</p>
                                    <p className="font-semibold text-sm">{getPaymentMethodName(payment.paymentMethod)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Amount</p>
                                    <p className="font-semibold text-sm">{PAYMENT_CONFIG.pricing.currency}{payment.amount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Transaction ID</p>
                                    <p className="font-mono text-sm break-all">{payment.transactionId}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Sender Number</p>
                                    <p className="font-semibold text-sm">{payment.senderNumber || '—'}</p>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p>Submitted: {new Date(payment.createdAt).toLocaleString()}</p>
                                {payment.approvedAt && (
                                    <p>Approved: {new Date(payment.approvedAt).toLocaleString()}</p>
                                )}
                                {payment.rejectionReason && (
                                    <p className="text-destructive">Reason: {payment.rejectionReason}</p>
                                )}
                            </div>

                            {/* Actions */}
                            {payment.status === 'pending' && (
                                <div className="flex gap-3 pt-4 border-t border-border">
                                    {rejectingId === payment._id ? (
                                        <div className="flex-1 space-y-3">
                                            <textarea
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                placeholder="Reason for rejection..."
                                                className="w-full bg-card border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setRejectingId(null);
                                                        setRejectionReason('');
                                                    }}
                                                    className="flex-1 btn-secondary py-2 rounded-lg text-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleReject(payment._id)}
                                                    className="flex-1 bg-destructive text-white py-2 rounded-lg font-medium text-sm hover:bg-destructive/90"
                                                >
                                                    Confirm Reject
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleApprove(payment._id)}
                                                className="flex-1 bg-success text-white py-3 rounded-lg font-medium hover:bg-success/90 transition-all"
                                            >
                                                Approve & Activate Pro
                                            </button>
                                            <button
                                                onClick={() => setRejectingId(payment._id)}
                                                className="flex-1 btn-secondary py-3 rounded-lg"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
}
