import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50 dark:bg-slate-950">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                    Take Full Control of <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Your Money</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                    Track income, expenses, debts, and cash flow in one smart dashboard. Designed for individuals and small business owners to achieve financial freedom.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        href="/signup"
                        className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
                    >
                        Get Started Free
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/login"
                        className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-lg border transition-all"
                    >
                        Login
                    </Link>
                </div>

                {/* Trust Elements */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        No credit card required
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        Secure & private data
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        Install as Mobile App
                    </div>
                </div>
            </div>

            {/* Light gradient blur at the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
        </section>
    );
}
