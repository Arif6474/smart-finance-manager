'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Award, HeartPulse, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function GamificationWidget() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Background update streak
                await fetch('/api/gamification', { method: 'POST' });

                // Fetch the latest health score calculation in the background
                const calcRes = await fetch('/api/gamification/calculate', { method: 'POST' });

                // Fetch user document stats for streaks
                const res = await fetch('/api/gamification');
                if (res.ok && calcRes.ok) {
                    const data = await res.json();
                    const calcData = await calcRes.json();
                    setStats({
                        ...data,
                        healthScore: calcData.healthScore,
                        badges: calcData.badges
                    });
                }
            } catch (error) {
                console.error('Error fetching gamification stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="h-24 bg-card border border-border rounded-2xl animate-pulse mt-6" />;
    }

    if (!stats) return null;

    // Determine color based on score health
    let scoreColor = "text-yellow-500 bg-yellow-500/10";
    if (stats.healthScore >= 80) scoreColor = "text-emerald-500 bg-emerald-500/10";
    else if (stats.healthScore < 40) scoreColor = "text-red-500 bg-red-500/10";

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 card-hover overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-full pointer-events-none" />

            <div className="flex items-center gap-6 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                {/* Streak */}
                <div className="flex flex-col items-center min-w-max">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 mb-2">
                        <Flame size={24} className={stats.streakCount > 0 ? "fill-orange-500/30" : ""} />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Daily Streak</p>
                    <p className="text-lg font-bold">{stats.streakCount || 0} {(stats.streakCount || 0) === 1 ? 'Day' : 'Days'}</p>
                </div>

                <div className="w-px h-12 bg-border hidden sm:block" />

                {/* Health Score */}
                <div className="flex flex-col items-center min-w-max">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${scoreColor} mb-2`}>
                        <HeartPulse size={24} />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Health Score</p>
                    <p className="text-lg font-bold">{stats.healthScore}/100</p>
                </div>

                <div className="w-px h-12 bg-border hidden sm:block" />

                {/* Badges */}
                <div className="flex flex-col items-center min-w-max">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 mb-2">
                        <Award size={24} className={stats.badges?.length > 0 ? "fill-indigo-500/30" : ""} />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Badges Earned</p>
                    <p className="text-lg font-bold">{stats.badges?.length || 0}</p>
                </div>
            </div>

            <Link href="/health" className="flex items-center gap-2 text-sm font-medium text-teal-500 hover:text-teal-400 transition-colors w-full sm:w-auto justify-end whitespace-nowrap mt-2 sm:mt-0">
                View Health Dashboard
                <ChevronRight size={16} />
            </Link>
        </motion.div>
    );
}
