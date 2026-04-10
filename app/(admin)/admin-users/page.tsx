'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/lib/adminUtils';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Lock, Mail, Phone, Calendar, Zap, Users, AlertCircle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    plan: 'free' | 'pro';
    level: 'user' | 'admin' | 'superAdmin';
    trialStartDate?: string;
    subscriptionExpiryDate?: string;
    streakCount: number;
    healthScore: number;
    badges?: string[];
    createdAt: string;
}

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export default function AdminUsersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Check if user is admin
    useEffect(() => {
        if (!authLoading && user && !isAdmin(user.level)) {
            toast.error('Access Denied: Admin only');
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    // Fetch users
    useEffect(() => {
        if (user && isAdmin(user.level)) {
            fetchUsers(currentPage);
        }
    }, [user?.id, currentPage]);

    const fetchUsers = async (page: number) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/users?page=${page}&limit=20`);
            
            if (!res.ok) throw new Error('Failed to fetch users');

            const data = await res.json();
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPlanBadge = (plan: string) => {
        if (plan === 'pro') {
            return <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1"><Zap size={12} /> Pro</span>;
        }
        return <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">Free</span>;
    };

    const getLevelBadge = (level: string) => {
        const levels: Record<string, { color: string; label: string }> = {
            superAdmin: { color: 'bg-destructive/20 text-destructive', label: 'Super Admin' },
            admin: { color: 'bg-warning/20 text-warning', label: 'Admin' },
            user: { color: 'bg-muted text-muted-foreground', label: 'User' },
        };
        const levelData = levels[level] || levels.user;
        return <span className={`px-3 py-1 rounded-full ${levelData.color} text-xs font-semibold flex items-center gap-1`}><Shield size={12} /> {levelData.label}</span>;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (authLoading || loading) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center min-h-[500px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            </PageWrapper>
        );
    }

    if (!user || !isAdmin(user.level)) {
        return (
            <PageWrapper className="flex items-center justify-center min-h-[500px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full">
                        <Lock size={32} className="text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-muted-foreground">Only admins and super admins can access this page.</p>
                </motion.div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold flex items-center gap-3">
                    <Users size={36} className="text-primary" />
                    User Management
                </h1>
                <p className="text-muted-foreground mt-2">
                    View and manage all users in the system ({pagination?.total || 0} total)
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-3xl p-6 overflow-x-auto"
            >
                {filteredUsers.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center space-y-3">
                            <AlertCircle size={32} className="text-muted-foreground mx-auto" />
                            <p className="text-muted-foreground">No users found</p>
                        </div>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-4 px-4 font-semibold text-sm">Name</th>
                                <th className="text-left py-4 px-4 font-semibold text-sm">Email</th>
                                <th className="text-left py-4 px-4 font-semibold text-sm">Phone</th>
                                <th className="text-left py-4 px-4 font-semibold text-sm">Plan</th>
                                <th className="text-left py-4 px-4 font-semibold text-sm">Level</th>
                                <th className="text-left py-4 px-4 font-semibold text-sm">Health Score</th>
                                <th className="text-left py-4 px-4 font-semibold text-sm">Trial/Expiry</th>
                                <th className="text-left py-4 px-4 font-semibold text-sm">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <motion.tr
                                    key={u._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                                >
                                    <td className="py-4 px-4">
                                        <p className="font-semibold text-sm">{u.name}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail size={14} />
                                            {u.email}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {u.phone ? (
                                                <>
                                                    <Phone size={14} />
                                                    {u.phone}
                                                </>
                                            ) : (
                                                '-'
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">{getPlanBadge(u.plan)}</td>
                                    <td className="py-4 px-4">{getLevelBadge(u.level)}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${Math.min(100, u.healthScore)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-muted-foreground">{u.healthScore}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-muted-foreground">
                                        <div className="space-y-1">
                                            {u.trialStartDate && (
                                                <p className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(u.trialStartDate)}
                                                </p>
                                            )}
                                            {u.subscriptionExpiryDate && (
                                                <p className="text-primary font-semibold flex items-center gap-1">
                                                    {formatDate(u.subscriptionExpiryDate)}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-muted-foreground">
                                        {formatDate(u.createdAt)}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-10 h-10 rounded-lg transition-all ${
                                    currentPage === p
                                        ? 'bg-primary text-white font-semibold'
                                        : 'border border-border hover:bg-muted'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                        disabled={currentPage === pagination.pages}
                        className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <span className="text-sm text-muted-foreground ml-4">
                        Page {currentPage} of {pagination.pages}
                    </span>
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/10 border border-primary/20 rounded-2xl p-6"
                >
                    <p className="text-muted-foreground text-sm mb-2">Total Users</p>
                    <p className="text-3xl font-bold text-primary">{pagination?.total || 0}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-success/10 border border-success/20 rounded-2xl p-6"
                >
                    <p className="text-muted-foreground text-sm mb-2">Pro Users</p>
                    <p className="text-3xl font-bold text-success">
                        {users.filter((u) => u.plan === 'pro').length}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-warning/10 border border-warning/20 rounded-2xl p-6"
                >
                    <p className="text-muted-foreground text-sm mb-2">Admins</p>
                    <p className="text-3xl font-bold text-warning">
                        {users.filter((u) => u.level === 'admin' || u.level === 'superAdmin').length}
                    </p>
                </motion.div>
            </div>
        </PageWrapper>
    );
}
