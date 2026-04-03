'use client';

import { BarChart2, Wallet, HandCoins, PieChart, Smartphone, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: BarChart2,
        title: 'Real-Time Cash Flow',
        desc: 'Watch your money move in real time. Beautiful charts that update the moment you log a transaction.',
        gradient: 'from-teal-500 to-emerald-500',
        badge: 'Most Popular',
    },
    {
        icon: Wallet,
        title: 'All Accounts, One View',
        desc: 'Cash, bank, bKash, Nagad — every account in one unified dashboard. No more jumping between apps.',
        gradient: 'from-blue-500 to-cyan-500',
        badge: null,
    },
    {
        icon: HandCoins,
        title: 'Debt & Lending Tracker',
        desc: "Who owes you. Who you owe. Track borrowings, due dates, and repayments with zero confusion.",
        gradient: 'from-amber-500 to-orange-500',
        badge: 'Unique',
    },
    {
        icon: PieChart,
        title: 'Smart Spending Insights',
        desc: 'Monthly breakdowns by category show exactly where your money leaks — so you can stop it.',
        gradient: 'from-purple-500 to-pink-500',
        badge: null,
    },
    {
        icon: BellRing,
        title: 'Smart Alerts',
        desc: 'Get notified when you overspend a category, a debt is due, or your balance drops dangerously low.',
        gradient: 'from-red-500 to-rose-500',
        badge: 'Coming Soon',
    },
    {
        icon: Smartphone,
        title: 'Works Like a Native App',
        desc: 'Install it on your phone homescreen. Works offline. Feels native. No App Store required.',
        gradient: 'from-teal-500 to-blue-500',
        badge: 'PWA',
    },
];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function FeaturesSection() {
    return (
        <section className="py-28 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(168,80%,36%,0.05),transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-18 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                    >
                        Features
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 leading-tight"
                    >
                        Your finances, finally{' '}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                            under control
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-lg text-muted-foreground max-w-xl mx-auto"
                    >
                        Everything you need to go from financial chaos to financial clarity — in one app.
                    </motion.p>
                </div>

                {/* Feature Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((f) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={f.title}
                                variants={item}
                                className="relative group bg-card border border-border rounded-3xl p-7 hover:-translate-y-2 hover:shadow-lift hover:border-primary/30 transition-all duration-500"
                            >
                                {f.badge && (
                                    <span className={`absolute top-5 right-5 text-[10px] font-bold px-2.5 py-1 rounded-full 
                    ${f.badge === 'Coming Soon' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                        {f.badge}
                                    </span>
                                )}
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={22} className="text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
