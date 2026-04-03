'use client';

import { motion } from 'framer-motion';
import { TrendingUp, PiggyBank, ShieldCheck, Clock } from 'lucide-react';

const stats = [
    { value: '৳500Cr+', label: 'Transactions tracked monthly', icon: TrendingUp },
    { value: '2,000+', label: 'Active users across Bangladesh', icon: PiggyBank },
    { value: '99.9%', label: 'Uptime reliability', icon: ShieldCheck },
    { value: '< 2min', label: 'Average setup time', icon: Clock },
];

const benefits = [
    {
        title: "See where every taka goes",
        desc: "Most people have no idea where their money disappears each month. Our auto-categorization and charts make it crystal clear — instantly.",
        color: "from-teal-500 to-emerald-500",
    },
    {
        title: "Never miss a payment again",
        desc: "Outstanding loans, due bills, supplier payments — we track everything so nothing falls through the cracks. Your reputation stays intact.",
        color: "from-amber-500 to-orange-500",
    },
    {
        title: "Build wealth, not just track it",
        desc: "Month-over-month net worth tracking shows your progress. Seeing the number go up every month is addicting in the best way possible.",
        color: "from-purple-500 to-pink-500",
    },
];

export default function BenefitsSection() {
    return (
        <section className="py-28 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,hsl(168,80%,36%,0.05),transparent_60%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Stats banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
                >
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 hover:shadow-soft transition-all duration-300"
                            >
                                <Icon size={20} className="text-primary mx-auto mb-2" />
                                <p className="text-2xl sm:text-3xl font-black text-foreground">{s.value}</p>
                                <p className="text-xs text-muted-foreground mt-1 leading-snug">{s.label}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Why SmartFinance */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                    >
                        Why SmartFinance
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
                    >
                        More than just tracking.{' '}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                            It&apos;s a mindset shift.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-xl mx-auto"
                    >
                        SmartFinance doesn&apos;t just show you numbers. It changes how you think about money.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
                            className="bg-card border border-border rounded-3xl p-8 hover:shadow-lift hover:-translate-y-1 transition-all duration-500"
                        >
                            <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${b.color} mb-6`} />
                            <h3 className="text-lg font-bold mb-3">{b.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
