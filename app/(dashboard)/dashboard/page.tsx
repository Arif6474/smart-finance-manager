'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const data = [
    { name: 'Mon', income: 4000, expense: 2400 },
    { name: 'Tue', income: 3000, expense: 1398 },
    { name: 'Wed', income: 2000, expense: 9800 },
    { name: 'Thu', income: 2780, expense: 3908 },
    { name: 'Fri', income: 1890, expense: 4800 },
    { name: 'Sat', income: 2390, expense: 3800 },
    { name: 'Sun', income: 3490, expense: 4300 },
];

const cards = [
    { title: 'Total Balance', amount: 125400, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Total Income', amount: 45000, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Total Expense', amount: 12400, icon: TrendingDown, color: 'text-destructive', bg: 'bg-destructive/10' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/dashboard');
                const result = await res.json();
                if (res.ok) {
                    setData(result);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <PageWrapper>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-card border border-border rounded-2xl animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                    <div className="h-[400px] bg-card border border-border rounded-2xl animate-pulse" />
                    <div className="h-[400px] bg-card border border-border rounded-2xl animate-pulse" />
                </div>
            </PageWrapper>
        );
    }

    const cards = [
        { title: 'Total Balance', amount: data?.totalBalance || 0, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
        { title: 'Total Income', amount: data?.income || 0, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
        { title: 'Total Expense', amount: data?.expense || 0, icon: TrendingDown, color: 'text-destructive', bg: 'bg-destructive/10' },
    ];

    return (
        <PageWrapper>
            {/* Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.title}
                            variants={itemVariants}
                            className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between card-hover"
                        >
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">{card.title}</p>
                                <h3 className="text-3xl font-bold mt-1 tracking-tight">৳{(card.amount || 0).toLocaleString()}</h3>
                            </div>
                            <div className={`${card.bg} ${card.color} p-4 rounded-xl`}>
                                <Icon size={24} />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Charts & Transactions */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6"
            >
                <motion.div variants={itemVariants} className="bg-card border border-border p-6 rounded-2xl h-[400px]">
                    <h3 className="text-base font-semibold mb-5">Cash Flow Summary (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={data?.chartData || []}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(168 80% 36%)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="hsl(168 80% 36%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214 20% 90%)" strokeOpacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 14% 50%)', fontSize: 12 }} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(222 47% 8%)',
                                    border: '1px solid hsl(220 26% 20%)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    boxShadow: '0 8px 30px -5px rgb(0 0 0 / 0.3)'
                                }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="hsl(168 80% 36%)"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-card border border-border p-6 rounded-2xl overflow-hidden">
                    <h3 className="text-base font-semibold mb-5">Recent Transactions</h3>
                    <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2">
                        {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                            data.recentTransactions.map((t: any) => (
                                <div key={t._id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-all duration-300 cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${t.type === 'Income'
                                            ? 'bg-success/10 text-success group-hover:bg-success/20'
                                            : t.type === 'Expense' ? 'bg-destructive/10 text-destructive group-hover:bg-destructive/20' : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                                            }`}>
                                            {t.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{t.description || t.category}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock size={11} /> {new Date(t.date).toLocaleDateString()} • {t.accountId?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`font-bold text-sm ${t.type === 'Income' ? 'text-success' : 'text-destructive'}`}>
                                        {t.type === 'Income' ? '+' : '-'}৳{(t.amount || 0).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <Clock size={40} className="mb-2 opacity-20" />
                                <p className="text-sm italic">No recent transactions</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </PageWrapper>
    );
}

