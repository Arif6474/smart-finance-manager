'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { motion } from 'framer-motion';
import { HeartPulse, Flame, Target, DollarSign, Activity, AlertCircle, Award } from 'lucide-react';

const ALL_BADGES = [
    { id: '7_DAY_STREAK', name: 'Week Warrior', icon: Flame, desc: 'Logged in 7 days in a row' },
    { id: '30_DAY_STREAK', name: 'Monthly Master', icon: Flame, desc: 'Logged in 30 days in a row' },
    { id: 'EXCELLENT_FINANCES', name: 'Financial Guru', icon: HeartPulse, desc: 'Reached a health score of 80+' },
    { id: 'FIRST_SAVINGS', name: 'Saver', icon: DollarSign, desc: 'Created your first goal' },
    { id: 'BUDGET_MASTER', name: 'On Track', icon: Target, desc: 'Stayed within all budgets for a month' }
];

export default function HealthDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealthScore = async () => {
            try {
                // This POST recalculates and returns the latest stats
                const res = await fetch('/api/gamification/calculate', { method: 'POST' });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching health score:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHealthScore();
    }, []);

    if (loading) {
        return (
            <PageWrapper>
                <div className="h-40 bg-card rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                    <div className="h-32 bg-card rounded-2xl animate-pulse" />
                    <div className="h-32 bg-card rounded-2xl animate-pulse" />
                    <div className="h-32 bg-card rounded-2xl animate-pulse" />
                </div>
            </PageWrapper>
        );
    }

    if (!stats) return null;

    const { healthScore, breakdown, badges } = stats;

    let scoreColor = "text-yellow-500 bg-yellow-500/10";
    let scoreText = "Fair";
    if (healthScore >= 80) { scoreColor = "text-emerald-500 bg-emerald-500/10"; scoreText = "Excellent"; }
    else if (healthScore < 40) { scoreColor = "text-red-500 bg-red-500/10"; scoreText = "Needs Work"; }

    return (
        <PageWrapper>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Financial Health</h1>
                <p className="text-muted-foreground mt-1 text-sm">Your overall financial wellness score and insights.</p>
            </div>

            {/* Main Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 justify-between"
            >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="flex items-center flex-col md:flex-row gap-8 relative z-10 w-full md:w-auto">
                    <div className="relative flex items-center justify-center">
                        <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" stroke="var(--border)" strokeWidth="8" fill="none" />
                            <circle
                                cx="50%" cy="50%" r="45%"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * healthScore) / 100}
                                className={`transition-all duration-1000 ease-out ${scoreColor.split(' ')[0]}`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl md:text-5xl font-black">{healthScore}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Your Score is {scoreText}</h2>
                        <p className="text-muted-foreground mt-1 text-sm max-w-sm">
                            This score is calculated based on your emergency savings, debt-to-income ratio, and budget adherence over the last 30 days.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto bg-background/50 p-4 rounded-2xl border border-border">
                    <div className="flex items-center gap-3">
                        <Flame size={20} className="text-orange-500" />
                        <span className="text-sm font-medium">Keep your login streak going!</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Target size={20} className="text-primary" />
                        <span className="text-sm font-medium">Stay under your budget limits</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <DollarSign size={20} className="text-emerald-500" />
                        <span className="text-sm font-medium">Save 3x your monthly expenses</span>
                    </div>
                </div>
            </motion.div>

            {/* Breakdown Cards */}
            <h2 className="text-lg font-bold mt-8 mb-4">Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { label: 'Savings & Liquidity', score: breakdown.savingsScore, max: 40, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Debt Management', score: breakdown.debtScore, max: 30, icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Budget Adherence', score: breakdown.budgetScore, max: 30, icon: Target, color: 'text-rose-500', bg: 'bg-rose-500/10' }
                ].map((item, i) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                                <item.icon size={20} />
                            </div>
                            <span className="font-semibold">{item.label}</span>
                        </div>
                        <div>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-2xl font-bold">{item.score}</span>
                                <span className="text-muted-foreground text-sm">/ {item.max} pts</span>
                            </div>
                            <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${item.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${(item.score / item.max) * 100}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Badges Section */}
            <h2 className="text-lg font-bold mt-8 mb-4">Your Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {ALL_BADGES.map((badge, i) => {
                    const isEarned = badges?.includes(badge.id);
                    const Icon = badge.icon;
                    return (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all duration-300 ${isEarned ? 'bg-primary/5 border-primary/20 hover:scale-105' : 'bg-background border-border opacity-60 grayscale'}`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isEarned ? 'bg-primary/20 text-primary shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                                <Icon size={28} />
                            </div>
                            <h3 className="font-bold text-sm mt-1">{badge.name}</h3>
                            <p className="text-[10px] text-muted-foreground leading-tight">{badge.desc}</p>
                        </motion.div>
                    );
                })}
            </div>
        </PageWrapper>
    );
}
