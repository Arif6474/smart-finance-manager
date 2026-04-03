import { PieChart, TrendingUp, Wallet, HandCoins, Smartphone, Moon } from 'lucide-react';

const features = [
    {
        title: 'Income & Expense',
        description: 'Easily track every penny coming in and out of your accounts with smart categorization.',
        icon: TrendingUp,
        color: 'text-indigo-500',
        bg: 'bg-indigo-100 dark:bg-indigo-500/10'
    },
    {
        title: 'Smart Reports',
        description: 'Beautiful visual charts and analytics to show you exactly where your money goes.',
        icon: PieChart,
        color: 'text-pink-500',
        bg: 'bg-pink-100 dark:bg-pink-500/10'
    },
    {
        title: 'Multiple Accounts',
        description: 'Manage Cash, Bank, and Mobile Banking balances all from one unified dashboard.',
        icon: Wallet,
        color: 'text-emerald-500',
        bg: 'bg-emerald-100 dark:bg-emerald-500/10'
    },
    {
        title: 'Payable & Receivable',
        description: 'Keep track of who owes you money and who you owe, complete with due dates.',
        icon: HandCoins,
        color: 'text-amber-500',
        bg: 'bg-amber-100 dark:bg-amber-500/10'
    },
    {
        title: 'Install as Mobile App',
        description: 'Add to your home screen! Fully works offline and feels like a native mobile app.',
        icon: Smartphone,
        color: 'text-blue-500',
        bg: 'bg-blue-100 dark:bg-blue-500/10'
    },
    {
        title: 'Dark Mode Ready',
        description: 'Easy on the eyes. Effortlessly switch between light and dark modes for comfortable late-night tracking.',
        icon: Moon,
        color: 'text-purple-500',
        bg: 'bg-purple-100 dark:bg-purple-500/10'
    }
];

export default function FeaturesSection() {
    return (
        <section className="py-24 bg-white dark:bg-slate-900 border-t border-b">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need to succeed</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Smart Finance Manager bundles all the tools you need to stop guessing and start predicting your financial future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div key={i} className="p-8 rounded-2xl glass hover:shadow-xl transition-all duration-300 group border border-slate-100 dark:border-slate-800">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform`}>
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
