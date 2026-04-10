'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PaymentFormProps {
    paymentMethod: string;
    onBack: () => void;
    onSuccess: () => void;
}

export default function PaymentForm({ paymentMethod, onBack, onSuccess }: PaymentFormProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [senderNumber, setSenderNumber] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!transactionId.trim()) {
            setError('Transaction ID is required');
            setLoading(false);
            return;
        }

        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');

            const res = await fetch('/api/payments/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    paymentMethod,
                    transactionId: transactionId.trim(),
                    senderNumber: senderNumber.trim(),
                    userEmail: user?.email,
                    userName: user?.name,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit payment');
            }

            toast.success('Payment submitted successfully!');
            onSuccess();
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm flex items-start gap-3"
                >
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                </motion.div>
            )}

            <div>
                <label className="block text-sm font-medium mb-2">Transaction ID *</label>
                <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter your transaction ID from your payment provider"
                    className="w-full bg-card border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                />
                <p className="text-xs text-muted-foreground mt-2">
                    This is the confirmation ID you received from your payment provider
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Sender Number (Optional)</label>
                <input
                    type="tel"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="Your phone number (for verification)"
                    className="w-full bg-card border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <p className="text-xs text-muted-foreground mt-2">
                    Helps us verify your payment faster
                </p>
            </div>

            <div className="bg-info/10 border border-info/20 rounded-xl p-4">
                <p className="text-sm">
                    <strong>What happens next?</strong>
                </p>
                <ul className="text-sm text-muted-foreground mt-3 space-y-2">
                    <li>✓ We&apos;ll verify your payment within a few hours</li>
                    <li>✓ Your account will be upgraded to Pro</li>
                    <li>✓ You&apos;ll receive a confirmation email</li>
                </ul>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="flex-1 btn-secondary py-3 rounded-xl disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Payment'
                    )}
                </button>
            </div>
        </form>
    );
}
