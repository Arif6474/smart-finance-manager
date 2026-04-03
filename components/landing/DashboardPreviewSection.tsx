'use client';

import { motion } from 'framer-motion';
import { Activity, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function DashboardPreviewSection() {
    return (
        <section className="py-28 bg-card border-t border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(168,80%,36%,0.06),transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                    >
                        Live Preview
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5"
                    >
                        Beautiful by design.{' '}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                            Powerful by default.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-xl mx-auto"
                    >
                        This is exactly what you see when you log in. No clutter. No confusion. Just clarity.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="rounded-3xl border border-border bg-background shadow-2xl overflow-hidden">
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-muted/20">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="bg-card rounded-lg px-16 py-1.5 text-muted-foreground text-xs border border-border/60">
                                    smartfinance.app/dashboard
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-8">
                            {/* Top stat cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
                                {[
                                    { label: 'Total Balance', val: '৳1,25,400', sub: '+৳12,400 this month', color: 'text-foreground', icon: '💰' },
                                    { label: 'Total Income', val: '৳45,000', sub: 'This month', color: 'text-success', icon: '📈' },
                                    { label: 'Total Expense', val: '৳12,400', sub: 'This month', color: 'text-destructive', icon: '📉' },
                                ].map((c, i) => (
                                    <div key={c.label} className="bg-card border border-border rounded-2xl p-3 sm:p-5">
                                        <div className="text-lg sm:text-xl mb-1 sm:mb-2">{c.icon}</div>
                                        <p className="text-[10px] text-muted-foreground mb-0.5 sm:mb-1">{c.label}</p>
                                        <p className={`text-sm sm:text-2xl font-bold sm:font-black ${c.color}`}>{c.val}</p>
                                        <p className="hidden sm:block text-xs text-muted-foreground mt-1">{c.sub}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                {/* Chart */}
                                <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-5 h-48 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            <Activity size={15} className="text-primary" />
                                            Cash Flow
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground border border-border rounded-full px-3 py-1">Last 7 days</span>
                                    </div>
                                    <div className="flex items-end gap-1 sm:gap-1.5 flex-1 pb-1">
                                        {[45, 70, 40, 85, 60, 95, 75].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div
                                                    className="w-full rounded-sm sm:rounded-md bg-gradient-to-t from-teal-600 to-emerald-400 opacity-90"
                                                    style={{ height: `${h}%` }}
                                                />
                                                <span className="text-[8px] text-muted-foreground">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent */}
                                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-4">Recent Transactions</p>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Salary', account: 'Dutch Bangla', val: '+৳45,000', pos: true },
                                            { name: 'Grocery', account: 'Wallet', val: '-৳2,400', pos: false },
                                            { name: 'Electricity', account: 'bKash', val: '-৳900', pos: false },
                                            { name: 'Freelance', account: 'Bank', val: '+৳15,000', pos: true },
                                        ].map((t, i) => (
                                            <div key={t.name} className={`flex items-center justify-between ${i > 2 ? 'hidden sm:flex' : 'flex'}`}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${t.pos ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                                        {t.pos ? <TrendingUp size={12} /> : <ArrowUpRight size={12} className="rotate-180" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold">{t.name}</p>
                                                        <p className="text-[9px] text-muted-foreground">{t.account}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-bold ${t.pos ? 'text-success' : 'text-destructive'}`}>{t.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
