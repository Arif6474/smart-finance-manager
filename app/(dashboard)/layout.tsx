'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Skeleton from '@/components/Skeleton';

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

    // if (loading || !user) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-500">
    //             <div className="flex flex-col items-center gap-4">
    //                 <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    //                 <p className="text-sm text-muted-foreground animate-pulse">Loading your dashboard...</p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-background transition-colors duration-500">
            <Sidebar />
            <Navbar />
            <main className="md:ml-64 p-4 pb-24 md:p-8 md:pb-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
