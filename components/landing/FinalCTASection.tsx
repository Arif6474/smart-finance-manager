'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function FinalCTASection() {
    const { user } = useAuth();
    return (
        <section className="py-28 relative overflow-hidden">
            {/* Full-bleed gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(0,0%,100%,0.05)_25%,transparent_25%),linear-gradient(225deg,hsl(0,0%,100%,0.05)_25%,transparent_25%),linear-gradient(315deg,hsl(0,0%,100%,0.05)_25%,transparent_25%)] bg-[size:60px_60px]" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-900/30 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
            >
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold mb-8">
                    <Sparkles size={14} className="fill-current" />
                    <span>Join 2,000+ smart savers today</span>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                    Start Your Free <br className="hidden sm:block" />
                    Trial <span className="text-amber-300">Today.</span>
                </h2>

                <p className="text-xl text-white/80 mb-12 max-w-xl mx-auto leading-relaxed">
                    Stop waiting. Stop guessing. Take 30 seconds to sign up and experience full financial clarity for the next 14 days — for free.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-teal-700 hover:bg-amber-50 font-extrabold px-12 py-5 rounded-2xl text-xl shadow-2xl hover:shadow-white/25 hover:scale-105 transition-all duration-300"
                        >
                            Go to Dashboard
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/signup"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-teal-700 hover:bg-amber-50 font-extrabold px-10 py-5 rounded-2xl text-lg shadow-2xl hover:shadow-white/25 hover:scale-105 transition-all duration-300"
                            >
                                Start 14-Day Free Trial
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/login"
                                className="w-full sm:w-auto inline-flex items-center justify-center text-white/80 hover:text-white font-semibold px-8 py-5 rounded-2xl border border-white/20 hover:bg-white/10 transition-all duration-300 text-lg"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>

                <p className="mt-8 text-white/50 text-sm">
                    No credit card required · 14 days full access · Cancel anytime
                </p>
            </motion.div>
        </section>
    );
}
