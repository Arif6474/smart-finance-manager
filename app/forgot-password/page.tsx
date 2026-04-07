'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-500">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 -left-20 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-lift space-y-7 relative"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
                        <Image
                            src="/icons/icon-192x192.png"
                            alt="SmartFinance Logo"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-2xl object-contain shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-shadow"
                        />
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            SmartFinance
                        </span>
                    </Link>
                    <h2 className="text-xl font-bold mt-4">Forgot Password?</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-4"
                    >
                        <div className="flex justify-center">
                            <CheckCircle2 className="text-success h-16 w-16" />
                        </div>
                        <div className="bg-success/10 text-success p-4 rounded-2xl border border-success/20 text-sm">
                            If an account exists with <b>{email}</b>, you will receive a password reset link shortly.
                        </div>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-primary hover:underline font-medium pt-4"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-destructive/10 text-destructive p-3 rounded-xl text-sm border border-destructive/20"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-muted-foreground/70" size={18} />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-12 focus-ring"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileTap={{ scale: 0.97 }}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50 transition-all shadow-lg shadow-primary/25"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
                                <span>{loading ? 'Sending link...' : 'Send Reset Link'}</span>
                            </motion.button>
                        </form>

                        <div className="text-center pt-2">
                            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors">
                                <ArrowLeft size={14} />
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
