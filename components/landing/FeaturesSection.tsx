'use client';

import { 
    BarChart2, 
    Wallet, 
    HandCoins, 
    PieChart, 
    Smartphone, 
    BellRing, 
    Sparkles, 
    Target, 
    CalendarClock, 
    Trophy 
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Target,
        title: 'Smart Budgeting',
        desc: 'Set category limits and get AI-powered alerts before you overspend. Stay on track effortlessly.',
        gradient: 'from-teal-500 to-emerald-500',
        badge: 'Popular',
    },
    {
        icon: Sparkles,
        title: 'AI Financial Assistant',
        desc: 'Ask questions and get intelligent suggestions on saving money and improving your financial habits.',
        gradient: 'from-purple-500 to-pink-500',
        badge: 'AI Powered',
    },
    {
        icon: BarChart2,
        title: 'Net Worth Tracking',
        desc: 'Visualize your wealth growth with real-time graphs. See the big picture of your financial journey.',
        gradient: 'from-blue-500 to-cyan-500',
        badge: null,
    },
    {
        icon: Wallet,
        title: 'Multi-Account Sync',
        desc: 'Unified view for Bank, bKash, Nagad, and Cash. No more switching between multiple apps.',
        gradient: 'from-emerald-500 to-teal-600',
        badge: null,
    },
    {
        icon: HandCoins,
        title: 'Payable & Receivable',
        desc: 'Never forget who you owe or who owes you. Track debts and collections with automated reminders.',
        gradient: 'from-amber-500 to-orange-500',
        badge: null,
    },
    {
        icon: CalendarClock,
        title: 'Loan & EMI Manager',
        desc: 'Track installments, interest, and upcoming payment dates. Never miss a loan repayment again.',
        gradient: 'from-red-500 to-rose-500',
        badge: 'New',
    },
    {
        icon: BellRing,
        title: 'Subscription Tracker',
        desc: 'Manage monthly bills and recurring payments. Get notified before your subscriptions renew.',
        gradient: 'from-indigo-500 to-blue-600',
        badge: null,
    },
    {
        icon: Trophy,
        title: 'Gamified Finance',
        desc: 'Earn streaks and badges for healthy financial habits. Watch your Health Score improve daily.',
        gradient: 'from-yellow-500 to-amber-600',
        badge: 'Fun',
    },
    {
        icon: Smartphone,
        title: 'PWA Access',
        desc: 'Works like a native app on your phone.',
        gradient: 'from-teal-500 to-blue-500',
        badge: 'PWA',
    },
    {
        icon: PieChart,
        title: 'Advanced Analytics',
        desc: 'Deep dive into your spending patterns with interactive reports. Export your data to CSV or PDF.',
        gradient: 'from-cyan-500 to-blue-500',
        badge: null,
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
