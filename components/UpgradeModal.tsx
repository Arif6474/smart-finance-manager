'use client';

import { useState } from 'react';
import { X, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PAYMENT_CONFIG, PLANS } from '@/lib/paymentConfig';
import PaymentForm from './PaymentForm';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
    const [step, setStep] = useState<'methods' | 'instructions' | 'form'>('methods');
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const handleSelectMethod = (methodId: string) => {
        setSelectedMethod(methodId);
        setStep('instructions');
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmitPayment = () => {
        setStep('methods');
        setSelectedMethod('');
        toast.success('Payment submitted! We will verify and activate your Pro plan soon.');
        onSuccess?.();
        onClose();
    };

    const selectedPaymentMethod = selectedMethod
        ? PAYMENT_CONFIG.methods[selectedMethod as keyof typeof PAYMENT_CONFIG.methods]
        : null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Upgrade to Pro</h2>
                                <p className="text-muted-foreground text-sm">
                                    {step === 'methods'
                                        ? 'Choose your payment method'
                                        : step === 'instructions'
                                        ? 'Follow the instructions below'
                                        : 'Submit your payment details'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Step 1: Select Payment Method */}
                            {step === 'methods' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3 mb-6">
                                        <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-semibold">Pro Plan: {PAYMENT_CONFIG.pricing.currency}{PLANS.MONTHLY.price}/month</p>
                                            <p className="text-muted-foreground">After your 14-day free trial</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        {Object.values(PAYMENT_CONFIG.methods).map((method) => (
                                            <motion.button
                                                key={method.id}
                                                onClick={() => handleSelectMethod(method.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all text-left hover:bg-primary/5"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold">{method.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {method.id === 'bank'
                                                                ? method.instruction.substring(0, 40) + '...'
                                                                : `Transfer using ${method.name}`}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: method.color + '20' }}
                                                    >
                                                        <div
                                                            className="w-8 h-8 rounded-full"
                                                            style={{ backgroundColor: method.color }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Payment Instructions */}
                            {step === 'instructions' && selectedPaymentMethod && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                                        <h3 className="font-semibold text-lg">Payment Instructions</h3>

                                        {selectedPaymentMethod?.id === 'bank' ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">Account Name</p>
                                                    <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                                                        <code className="font-mono text-sm font-semibold">
                                                            {(selectedPaymentMethod as typeof PAYMENT_CONFIG.methods.bank).accountName}
                                                        </code>
                                                        <button
                                                            onClick={() =>
                                                                handleCopy((selectedPaymentMethod as typeof PAYMENT_CONFIG.methods.bank).accountName)
                                                            }
                                                            className="p-2 hover:bg-primary/10 rounded transition-colors"
                                                        >
                                                            {copied ? (
                                                                <CheckCircle2 size={18} className="text-success" />
                                                            ) : (
                                                                <Copy size={18} className="text-muted-foreground" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">Account Number</p>
                                                    <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                                                        <code className="font-mono text-sm font-semibold">
                                                            {(selectedPaymentMethod as typeof PAYMENT_CONFIG.methods.bank).accountNumber}
                                                        </code>
                                                        <button
                                                            onClick={() =>
                                                                handleCopy((selectedPaymentMethod as typeof PAYMENT_CONFIG.methods.bank).accountNumber)
                                                            }
                                                            className="p-2 hover:bg-primary/10 rounded transition-colors"
                                                        >
                                                            {copied ? (
                                                                <CheckCircle2 size={18} className="text-success" />
                                                            ) : (
                                                                <Copy size={18} className="text-muted-foreground" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">Branch</p>
                                                    <div className="bg-card border border-border rounded-lg p-3">
                                                        <p className="font-semibold">{(selectedPaymentMethod as typeof PAYMENT_CONFIG.methods.bank).branchName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Send Money To</p>
                                                <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                                                    <code className="font-mono text-lg font-bold">
                                                        {selectedPaymentMethod && 'number' in selectedPaymentMethod ? selectedPaymentMethod.number : 'N/A'}
                                                    </code>
                                                    <button
                                                        onClick={() => {
                                                            if (selectedPaymentMethod && 'number' in selectedPaymentMethod) {
                                                                handleCopy(selectedPaymentMethod.number);
                                                            }
                                                        }}
                                                        className="p-2 hover:bg-primary/10 rounded transition-colors"
                                                    >
                                                        {copied ? (
                                                            <CheckCircle2 size={20} className="text-success" />
                                                        ) : (
                                                            <Copy size={20} className="text-muted-foreground" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                                            <p className="text-sm">
                                                <strong>Amount to send:</strong> {PAYMENT_CONFIG.pricing.currency}
                                                {PLANS.MONTHLY.price}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {selectedPaymentMethod.instruction}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep('methods')}
                                            className="flex-1 btn-secondary py-3 rounded-xl"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep('form')}
                                            className="flex-1 btn-primary py-3 rounded-xl"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Payment Form */}
                            {step === 'form' && selectedMethod && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <PaymentForm
                                        paymentMethod={selectedMethod}
                                        onBack={() => setStep('instructions')}
                                        onSuccess={handleSubmitPayment}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
