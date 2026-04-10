'use client';

import { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useAuth } from '@/context/AuthContext';
import { Copy, Check, Send, Building2, Smartphone, Loader2, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function UpgradePage() {
    const { user } = useAuth();
    const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'bank' | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form state
    const [transactionId, setTransactionId] = useState('');
    const [senderNumber, setSenderNumber] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);

    const payments = {
        bkash: {
            icon: Smartphone,
            title: 'bKash',
            number: '01820082894',
            instruction: 'Send ৳100 using "Send Money"',
            color: 'from-pink-600 to-pink-700',
        },
        nagad: {
            icon: Smartphone,
            title: 'Nagad',
            number: '01820082894',
            instruction: 'Send ৳100',
            color: 'from-orange-600 to-orange-700',
        },
        bank: {
            icon: Building2,
            title: 'BRAC Bank',
            details: {
                accountName: 'Md. Ariful Islam',
                accountNumber: '1062488210001',
                branch: 'Gulshan',
            },
            instruction: 'Transfer ৳100 and note the transaction ID',
            color: 'from-blue-600 to-blue-700',
        },
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        toast.success('Copied!');
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedMethod || !transactionId.trim()) {
            setError('Please select a payment method and enter transaction ID');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('method', selectedMethod);
            formData.append('transactionId', transactionId);
            formData.append('senderNumber', senderNumber);
            if (screenshot) {
                formData.append('screenshot', screenshot);
            }

            const res = await fetch('/api/payments', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Payment submission failed');
            }

            setSuccess(true);
            toast.success('Payment submitted! Admin will verify soon.');
            
            // Reset form
            setSelectedMethod(null);
            setTransactionId('');
            setSenderNumber('');
            setScreenshot(null);

            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper className="max-w-4xl mx-auto space-y-8 py-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold">Upgrade to Pro</h1>
                <p className="text-muted-foreground mt-2">Unlock advanced features and unlimited access</p>
            </div>

            {/* Pricing Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-8"
            >
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Pro Plan</h2>
                        <p className="text-muted-foreground mb-6">Get full access to all features</p>
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-5xl font-bold">৳100</span>
                            <span className="text-muted-foreground mb-1">/month</span>
                        </div>
                        <ul className="space-y-3">
                            {[
                                'Unlimited accounts',
                                'Advanced analytics',
                                'Budget management',
                                'AI insights',
                                'Mobile app access',
                                'Priority support',
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <div className="inline-block bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-4">
                                Include Free 14-day Trial
                            </div>
                            <p className="text-muted-foreground mb-6">
                                Start your journey with Smart Finance Manager today
                            </p>
                            <p className="text-sm text-muted-foreground">
                                📱 Works on all devices
                                <br />
                                🔒 100% Secure
                                <br />
                                🚀 Instant activation
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-success/10 text-success p-4 rounded-xl border border-success/20 flex items-start gap-3"
                    >
                        <Check size={20} className="flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold">Payment Submitted!</h3>
                            <p className="text-sm mt-1">Your payment is under review. Pro access will be activated within 1-2 hours.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 flex items-start gap-3"
                    >
                        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold">Error</h3>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment Methods */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Choose Payment Method</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {Object.entries(payments).map(([key, payment]) => {
                        const Icon = payment.icon;
                        return (
                            <motion.button
                                key={key}
                                onClick={() => setSelectedMethod(key as any)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                                    selectedMethod === key
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border bg-card hover:border-primary/50'
                                }`}
                            >
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${payment.color} text-white mb-4`}>
                                    <Icon size={24} />
                                </div>
                                <h3 className="font-bold text-lg">{payment.title}</h3>
                                <p className="text-sm text-muted-foreground mt-2">{payment.instruction}</p>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Payment Details */}
            <AnimatePresence mode="wait">
                {selectedMethod && (
                    <motion.div
                        key={selectedMethod}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-card border border-border rounded-3xl p-8 space-y-6"
                    >
                        <h3 className="text-xl font-bold">Payment Details</h3>

                        {selectedMethod === 'bank' ? (
                            <div className="space-y-4">
                                {[
                                    { label: 'Account Name', value: payments.bank.details.accountName },
                                    { label: 'Account Number', value: payments.bank.details.accountNumber },
                                    { label: 'Branch', value: payments.bank.details.branch },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between bg-muted/50 p-4 rounded-xl">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{item.label}</p>
                                            <p className="font-mono font-bold text-lg">{item.value}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(item.value, item.label)}
                                            className="p-2 hover:bg-background rounded-lg transition-colors"
                                        >
                                            {copied === item.label ? (
                                                <Check size={20} className="text-success" />
                                            ) : (
                                                <Copy size={20} className="text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl">
                                <div>
                                    <p className="text-sm text-muted-foreground">{payments[selectedMethod as 'bkash' | 'nagad'].title} Number</p>
                                    <p className="font-mono font-bold text-lg">{payments[selectedMethod as 'bkash' | 'nagad'].number}</p>
                                </div>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            payments[selectedMethod as 'bkash' | 'nagad'].number,
                                            'number'
                                        )
                                    }
                                    className="p-2 hover:bg-background rounded-lg transition-colors"
                                >
                                    {copied === 'number' ? (
                                        <Check size={20} className="text-success" />
                                    ) : (
                                        <Copy size={20} className="text-muted-foreground" />
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-400 flex items-start gap-3">
                            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                            <p>
                                Send exactly <strong>৳100</strong> to complete your upgrade. Keep the transaction ID for verification.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6 border-t border-border pt-6">
                            {/* Transaction ID */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Transaction ID *</label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="e.g., TXN123456789"
                                    className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">Required for verification</p>
                            </div>

                            {/* Sender Number */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Sender Number (Optional)</label>
                                <input
                                    type="tel"
                                    value={senderNumber}
                                    onChange={(e) => setSenderNumber(e.target.value)}
                                    placeholder="Your bKash/Nagad/Bank number"
                                    className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Helps us match your payment faster</p>
                            </div>

                            {/* Screenshot Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Payment Proof (Optional)</label>
                                <label className="border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary transition-colors block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Upload size={20} />
                                        <div>
                                            <p className="text-sm font-medium">Click to upload screenshot</p>
                                            <p className="text-xs">PNG, JPG up to 5MB</p>
                                        </div>
                                    </div>
                                </label>
                                {screenshot && (
                                    <p className="text-sm text-success mt-2">✓ {screenshot.name}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Payment
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Help Section */}
            <div className="bg-muted/30 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-4">FAQs</h3>
                <div className="space-y-4">
                    {[
                        {
                            q: 'How long does it take to activate?',
                            a: 'Payments are verified within 1-2 hours. Pro access will be activated immediately after verification.',
                        },
                       
                        {
                            q: 'What is included in Pro?',
                            a: 'All features are included: analytics, budgets, AI insights, mobile app access, and more.',
                        },
                        {
                            q: 'Do I need to wait for trial to end?',
                            a: 'No, you can upgrade anytime. If you have days left in trial, they will be added to your Pro period.',
                        },
                    ].map((faq, i) => (
                        <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                            <p className="font-medium text-sm mb-1">{faq.q}</p>
                            <p className="text-sm text-muted-foreground">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
