'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            login(data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-500">
            {/* Subtle background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-lift space-y-7 relative"
            >
                {/* Logo Section */}
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
                    <p className="text-muted-foreground text-sm mt-1">Log in to manage your finances</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-destructive/10 text-destructive p-3 rounded-xl text-sm border border-destructive/20"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-muted-foreground/70" size={18} />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field pl-12 focus-ring"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-muted-foreground/70" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pl-12 focus-ring"
                        />
                        <div className="flex justify-end mt-1">
                            <Link href="/forgot-password" size="sm" className="text-xs text-muted-foreground hover:text-primary transition-colors pr-2">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.97 }}
                        className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
                        <span>{loading ? 'Logging in...' : 'Sign In'}</span>
                    </motion.button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-primary font-semibold hover:underline underline-offset-4">
                        Create one
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
