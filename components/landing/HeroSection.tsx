import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-background">
            {/* Ambient background blobs */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse-soft pointer-events-none"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-soft pointer-events-none" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                    Take Full Control of <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">Your Money</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Track income, expenses, debts, and cash flow in one smart dashboard. Designed for individuals and small business owners to achieve financial freedom.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        href="/signup"
                        className="w-full sm:w-auto px-8 py-4 btn-primary text-lg flex items-center justify-center gap-2 group"
                    >
                        Get Started Free
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/login"
                        className="w-full sm:w-auto px-8 py-4 bg-card hover:bg-muted text-foreground rounded-xl font-bold text-lg border border-border transition-all duration-300"
                    >
                        Login
                    </Link>
                </div>

                {/* Trust Elements */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-success" />
                        No credit card required
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-success" />
                        Secure & private data
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-success" />
                        Install as Mobile App
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
        </section>
    );
}
