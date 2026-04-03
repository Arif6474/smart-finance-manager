import { PiggyBank, Target, ShieldCheck, Zap } from 'lucide-react';

export default function BenefitsSection() {
    const benefits = [
        {
            title: 'Save More Money',
            desc: 'Identify useless subscriptions and cut down on impulse spending easily.',
            icon: PiggyBank,
            color: 'bg-emerald-500'
        },
        {
            title: 'Understand Habits',
            desc: 'See exactly where your money goes. Month-over-month graphs reveal your real habits.',
            icon: Target,
            color: 'bg-blue-500'
        },
        {
            title: 'Track Debts Easily',
            desc: 'Never forget a loaned out amount again. Accurate payable and receivable lists keep you safe.',
            icon: ShieldCheck,
            color: 'bg-amber-500'
        },
        {
            title: 'Smarter Decisions',
            desc: 'Data gives you confidence. Make big purchases knowing you can actually afford them.',
            icon: Zap,
            color: 'bg-primary'
        }
    ];

    return (
        <section className="py-24 bg-card border-t border-border transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                            Why use <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">Smart Finance?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Stop stressing over spreadsheets and banking apps that don&apos;t communicate with each other. We give you a bird&apos;s-eye view of your financial health.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                            {benefits.map((b, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className={`mt-0.5 p-2 rounded-xl text-white ${b.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        <b.icon size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1 text-sm">{b.title}</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full relative">
                        <div className="absolute inset-0 bg-primary/10 dark:bg-primary/10 rounded-3xl rotate-2 scale-105 blur-sm"></div>
                        <div className="relative bg-background p-8 md:p-10 rounded-3xl border border-border shadow-lift">
                            <h3 className="text-xl font-bold mb-6">Your Net Worth Growth</h3>
                            <div className="h-56 flex items-end gap-2 md:gap-3 relative">
                                {[20, 35, 50, 45, 60, 80, 100].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-lg hover:opacity-90 transition-all duration-300 hover:-translate-y-1"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                    <span key={d}>{d}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
