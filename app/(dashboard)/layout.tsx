'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <Navbar />
            <main className="md:ml-64 p-4 pb-24 md:p-6 md:pb-6 animate-in">
                <div className="max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
