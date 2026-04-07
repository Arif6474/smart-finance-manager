'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2, Phone, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, confirmPassword, phone }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Signup failed');

            login(data.user);
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
                    <p className="text-muted-foreground text-sm mt-1">Start managing your wealth smarter</p>
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
                        <User className="absolute left-4 top-3.5 text-muted-foreground/70" size={18} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field pl-12 focus-ring"
                        />
                    </div>

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
                        <Phone className="absolute left-4 top-3.5 text-muted-foreground/70" size={18} />
                        <input
                            type="tel"
                            placeholder="Phone Number (Optional)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="input-field pl-12 focus-ring"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-muted-foreground/70" size={18} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pl-12 pr-12 focus-ring"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-muted-foreground/70" size={18} />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field pl-12 pr-12 focus-ring"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.97 }}
                        className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                        <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
                    </motion.button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
