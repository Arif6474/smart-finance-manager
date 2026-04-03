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
            color: 'bg-indigo-500'
        }
    ];

    return (
        <section className="py-24 bg-white dark:bg-slate-900 border-t">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                            Why use <span className="text-primary">Smart Finance?</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Stop stressing over spreadsheets and banking apps that do not communicate with each other. We give you a bird's-eye view of your financial health.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            {benefits.map((b, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className={`mt-1 p-2 rounded-lg text-white ${b.color}`}>
                                        <b.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">{b.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full relative">
                        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/10 rounded-3xl rotate-3 scale-105"></div>
                        <div className="relative glass p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                            <h3 className="text-2xl font-bold mb-6">Your Net Worth Growth</h3>
                            <div className="h-64 flex items-end gap-2 md:gap-4 relative">
                                {/* Fake Growth Chart inside card */}
                                {[20, 35, 50, 45, 60, 80, 100].map((h, i) => (
                                    <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-md hover:opacity-80 transition-opacity" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
