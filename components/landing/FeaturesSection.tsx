import { PieChart, TrendingUp, Wallet, HandCoins, Smartphone, Moon } from 'lucide-react';

const features = [
    {
        title: 'Income & Expense',
        description: 'Easily track every penny coming in and out of your accounts with smart categorization.',
        icon: TrendingUp,
        color: 'text-teal-600 dark:text-teal-400',
        bg: 'bg-teal-100 dark:bg-teal-500/10'
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
        color: 'text-emerald-600 dark:text-emerald-400',
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
        <section className="py-24 bg-card border-t border-b border-border transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed</h2>
                    <p className="text-lg text-muted-foreground">
                        Smart Finance Manager bundles all the tools you need to stop guessing and start predicting your financial future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div key={i} className="p-7 rounded-2xl bg-background border border-border hover:shadow-lift hover:-translate-y-1 transition-all duration-500 group">
                                <div className={`w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={26} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
