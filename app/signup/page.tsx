'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

export default function SignupPage() {
    const [name, setName] = useState('');
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
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="max-w-md w-full glass p-8 rounded-2xl shadow-2xl space-y-8 animate-in">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        Join Us
                    </h1>
                    <p className="text-slate-500 mt-2">Start managing your wealth smarter</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center space-x-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                        <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
                    </button>
                </form>

                <div className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
