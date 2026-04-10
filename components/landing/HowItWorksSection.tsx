'use client';

import { motion } from 'framer-motion';
import { UserPlus, LayoutDashboard, TrendingUp } from 'lucide-react';

const steps = [
    {
        num: '01',
        icon: UserPlus,
        title: 'Connect & Log',
        desc: 'Add your accounts and transactions in seconds. Whether it’s Cash, bKash, or Bank — setup is a breeze.',
        color: 'from-teal-500 to-emerald-500',
    },
    {
        num: '02',
        icon: LayoutDashboard,
        title: 'Monitor & Manage',
        desc: 'Keep track of every taka with automated categorization. Stay on top of your payables and budgets.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        num: '03',
        icon: TrendingUp,
        title: 'Optimize & Grow',
        desc: 'Use AI insights and health scores to improve habits. Watch your net worth grow with smart decisions.',
        color: 'from-purple-500 to-pink-500',
    },
];

export default function HowItWorksSection() {
    return (
        <section className="py-28 bg-card border-t border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,hsl(168,80%,36%,0.04),transparent_60%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                    >
                        How It Works
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
                    >
                        Up and running in{' '}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                            3 minutes flat
                        </span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 relative">
                    {/* Connector line */}
                    <div className="hidden md:block absolute top-16 left-[18%] right-[18%] h-px bg-gradient-to-r from-border via-primary/30 to-border z-0" />

                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
                                className="relative z-10 text-center group"
                            >
                                <div className="relative inline-flex mb-7">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={26} className="text-white" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-background border-2 border-border rounded-full flex items-center justify-center text-[10px] font-black text-primary">
                                        {i + 1}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
