'use client';

import Link from 'next/link';
import { Check, Zap, PackageCheck, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: 'Free Trial',
        price: '৳0',
        period: '14 days',
        desc: 'Try everything free. No risk, no commitment.',
        icon: PackageCheck,
        gradient: 'from-slate-500 to-slate-600',
        badge: 'Start Here',
        features: [
            'Full access to all features',
            'Unlimited transactions',
            'Budget, goals & EMI tracking',
            'AI insights (limited)',
            'No credit card required',
        ],
        cta: 'Start Free Trial',
        ctaHref: '/signup',
        highlighted: false,
    },
    {
        name: 'Pro Monthly',
        price: '৳100',
        period: 'month',
        desc: 'Simple monthly plan for consistent financial growth.',
        icon: Zap,
        gradient: 'from-blue-500 to-indigo-500',
        badge: 'Most Flexible',
        features: [
            'All premium features unlocked',
            'Advanced analytics & reports',
            'Savings goals & EMI management',
            'Smart budgeting & alerts',
            'Priority support',
        ],
        cta: 'Upgrade to Pro',
        ctaHref: '/signup',
        highlighted: false,
    },
    {
        name: 'Pro 6 Months',
        price: '৳550',
        period: '6 months',
        desc: 'Best for focused users. Save more as you grow.',
        icon: Star,
        gradient: 'from-teal-500 to-emerald-500',
        badge: '🔥 Most Popular',
        features: [
            'Everything in Monthly',
            'AI financial insights (full)',
            'Net worth tracking & reports',
            'Subscription & bill reminders',
            'Better savings vs monthly',
        ],
        cta: 'Get 6 Months Plan',
        ctaHref: '/signup',
        highlighted: true,
    },
    {
        name: 'Pro Yearly',
        price: '৳1000',
        period: 'year',
        desc: 'Maximum value for long-term financial control.',
        icon: ShieldCheck,
        gradient: 'from-violet-500 to-purple-500',
        badge: '💎 Best Value',
        features: [
            'Everything in 6 Months',
            'Save ৳200 yearly',
            'Early access to new features',
            'VIP priority support',
            'Long-term savings optimization',
        ],
        cta: 'Upgrade Yearly',
        ctaHref: '/signup',
        highlighted: false,
    },
];
export default function PricingSection() {
    return (
        <section className="py-28 bg-card border-t border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,hsl(168,80%,36%,0.07),transparent_60%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                    >
                        Pricing
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
                    >
                        Honest pricing.{' '}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                            No surprises.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground"
                    >
                        Start free. Upgrade only when you&apos;re ready.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {plans.map((plan, i) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
                                className={`relative rounded-3xl p-8 flex flex-col hover:-translate-y-2 transition-all duration-500 ${plan.highlighted
                                        ? 'bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-2xl shadow-teal-500/30 border-2 border-teal-500/50'
                                        : 'bg-background border border-border hover:shadow-lift'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg">
                                        ⚡ Most Popular
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} ${plan.highlighted ? 'bg-white/20' : ''} flex items-center justify-center mb-5 shadow-lg`}>
                                    <Icon size={22} className="text-white" />
                                </div>

                                <h3 className={`text-2xl font-bold mb-1 ${plan.highlighted ? 'text-white' : ''}`}>{plan.name}</h3>
                                <p className={`text-sm mb-5 ${plan.highlighted ? 'text-white/70' : 'text-muted-foreground'}`}>{plan.desc}</p>

                                <div className="mb-6">
                                    <span className={`text-5xl font-black ${plan.highlighted ? 'text-white' : ''}`}>{plan.price}</span>
                                    <span className={`text-sm ml-2 ${plan.highlighted ? 'text-white/70' : 'text-muted-foreground'}`}>/{plan.period}</span>
                                </div>

                                <ul className={`space-y-3 mb-8 flex-1 text-sm ${plan.highlighted ? 'text-white/90' : 'text-muted-foreground'}`}>
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-3">
                                            <Check size={16} className={plan.highlighted ? 'text-white' : 'text-success'} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.ctaHref}
                                    className={`w-full py-3.5 rounded-2xl font-bold text-sm text-center transition-all duration-300 ${plan.highlighted
                                            ? 'bg-white text-teal-700 hover:bg-white/90 shadow-lg hover:shadow-xl'
                                            : 'btn-primary'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
