'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, Save, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            updateUser(data.user);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <PageWrapper className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <UserIcon className="text-primary" size={32} />
                    Profile Settings
                </h1>
                <p className="text-muted-foreground mt-2">Manage your personal information and account preferences.</p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm flex items-start gap-3"
                            >
                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-success/10 text-success p-4 rounded-xl text-sm flex items-start gap-3"
                            >
                                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p>Profile updated successfully!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Email - Read Only */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full bg-muted/50 border border-border/50 rounded-xl py-3 pl-11 pr-4 text-sm text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Your email address cannot be changed at this time.</p>
                    </div>

                    {/* Name - Editable */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                                <UserIcon size={18} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-card border border-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <button
                            type="submit"
                            disabled={loading || name === user.name || !name.trim()}
                            className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
}
