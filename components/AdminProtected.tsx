'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PageWrapper from './PageWrapper';
import { Lock } from 'lucide-react';
import { isAdmin } from '@/lib/adminUtils';
import toast from 'react-hot-toast';

interface AdminProtectedProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function AdminProtected({ children, fallback }: AdminProtectedProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && !isAdmin(user.level)) {
            toast.error('Access Denied: Admin only');
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
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
            fallback || (
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
            )
        );
    }

    return <>{children}</>;
}
