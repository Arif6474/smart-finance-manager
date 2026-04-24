'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, ShieldCheck, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const floatVariants = {
    animate: { y: [-8, 8, -8], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const } }
};
const floatVariants2 = {
    animate: { y: [6, -6, 6], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 } }
};

export default function HeroSection() {
    const { user } = useAuth();
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background pt-16">
            {/* ── Gradient Mesh Background ── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_20%_20%,hsl(168,80%,36%,0.12),transparent_60%)]" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_80%_10%,hsl(152,69%,40%,0.08),transparent_50%)]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_50%_100%,hsl(168,80%,36%,0.06),transparent_60%)]" />
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(hsl(168,80%,36%,0.04)_1px,transparent_1px),linear-gradient(90deg,hsl(168,80%,36%,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
                {/* ── Badge ── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-2 text-xs font-semibold mb-8"
                >
                    <Zap size={14} className="fill-current" />
                    <span>The #1 Personal Finance App of 2026</span>
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full ml-1">New</span>
                </motion.div>

                {/* ── Headline ── */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6"
                >
                    Take Control of Your Money <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                        Grow Smarter.
                    </span>
                </motion.h1>

                {/* ── Subheadline ── */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    TakaHisab gives you a crystal-clear picture of your money in seconds.
                    Advanced budgeting, AI insights, and total financial control — all in one beautiful app.
                </motion.p>

                {/* ── CTAs ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
                >
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-primary px-10 py-4 text-lg font-bold rounded-2xl shadow-xl shadow-teal-500/20"
                        >
                            Go to Dashboard
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/signup"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-primary px-8 py-4 text-base font-bold rounded-2xl"
                            >
                                Start Free 14-Day Trial
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card border border-border hover:bg-muted text-foreground font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-base"
                            >
                                See How It Works
                            </Link>
                        </>
                    )}
                </motion.div>

                {/* ── Social Proof ── */}
                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground mb-20"
                >
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                        ))}
                        <span className="ml-2 font-medium">4.9/5 from 2,000+ users</span>
                    </div>
                    <span className="hidden sm:block w-px h-4 bg-border" />
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-success" />
                        <span>Bank-level security</span>
                    </div>
                    <span className="hidden sm:block w-px h-4 bg-border" />
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary" />
                        <span>৳500Cr+ tracked monthly</span>
                    </div>
                </motion.div> */}

                {/* ── Floating Dashboard Preview ── */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
                    className="relative mx-auto max-w-4xl"
                >
                    {/* Floating Stat Cards - Desktop Only */}
                    <motion.div
                        variants={floatVariants}
                        animate="animate"
                        className="hidden sm:block absolute -left-16 top-8 z-20 bg-card border border-border rounded-2xl p-4 shadow-lift text-left w-52"
                    >
                        <p className="text-xs text-muted-foreground mb-1">Financial Health</p>
                        <p className="text-2xl font-black text-foreground">84/100</p>
                        <p className="text-xs text-success font-semibold mt-1 flex items-center gap-1">
                            <Zap size={11} className="fill-current" /> Excellent Progress
                        </p>
                    </motion.div>

                    <motion.div
                        variants={floatVariants2}
                        animate="animate"
                        className="hidden sm:block absolute -right-16 top-16 z-20 bg-card border border-border rounded-2xl p-4 shadow-lift text-left w-52"
                    >
                        <p className="text-xs text-muted-foreground mb-1">Net Worth</p>
                        <p className="text-2xl font-black text-primary">৳1,25,400</p>
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                    </motion.div>


                    {/* Main Dashboard Mockup */}
                    <div className="relative w-full rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-muted/30">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="bg-background rounded-lg px-16 py-1.5 text-muted-foreground text-xs border border-border">
                                    takahishab.com
                                </div>
                            </div>
                        </div>

                        {/* Dashboard body */}
                        <div className="p-4 sm:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6">
                                {/* Stat cards */}
                                {[
                                    { label: 'Total Balance', value: '৳1,25,400', color: 'text-foreground', iconBg: 'bg-primary/10 text-primary' },
                                    { label: 'Income', value: '৳45,000', color: 'text-success', iconBg: 'bg-success/10 text-success' },
                                    { label: 'Expense', value: '৳12,400', color: 'text-destructive', iconBg: 'bg-destructive/10 text-destructive' },
                                ].map((c, i) => (
                                    <div key={c.label} className={`bg-background rounded-2xl p-4 border border-border ${i > 0 ? 'hidden sm:block' : ''}`}>
                                        <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                                        <p className={`text-lg sm:text-xl font-bold ${c.color}`}>{c.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {/* Chart area */}
                                <div className="sm:col-span-2 bg-background rounded-2xl p-4 border border-border h-32 flex flex-col justify-between">
                                    <p className="text-xs font-semibold text-muted-foreground">Cash Flow</p>
                                    <div className="flex items-end gap-1 h-20">
                                        {[35, 60, 45, 80, 55, 95, 70, 85, 60, 100].map((h, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-t-md bg-gradient-to-t from-teal-600 to-emerald-400 opacity-90 ${i > 5 ? 'hidden sm:block' : ''}`}
                                                style={{ height: `${h}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Recent tx */}
                                <div className="bg-background rounded-2xl p-3 border border-border h-32 flex flex-col justify-between">
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">Recent</p>
                                    <div className="space-y-1.5 overflow-hidden">
                                        {[
                                            { name: 'Salary', val: '+৳45K', pos: true },
                                            { name: 'Grocery', val: '-৳2.4K', pos: false },
                                            { name: 'Electric', val: '-৳900', pos: false },
                                        ].map((t) => (
                                            <div key={t.name} className="flex justify-between items-center gap-2">
                                                <span className="text-[10px] text-foreground/80 truncate">{t.name}</span>
                                                <span className={`text-[10px] font-bold shrink-0 ${t.pos ? 'text-success' : 'text-destructive'}`}>{t.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom gradient fade */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
                </motion.div>
            </div>
        </section>
    );
}
