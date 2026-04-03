'use client';

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
    BarChart,
    Bar,
    Cell
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
    { title: 'Total Balance', amount: 125400, icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Total Income', amount: 45000, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Total Expense', amount: 12400, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
];

export default function DashboardPage() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.title} className="glass p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                                <h3 className="text-3xl font-bold mt-1">৳{card.amount.toLocaleString()}</h3>
                            </div>
                            <div className={`${card.bg} ${card.color} p-4 rounded-xl`}>
                                <Icon size={24} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="glass p-6 rounded-2xl h-[400px]">
                    <h3 className="text-lg font-bold mb-6">Cash Flow Summary</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="income" stroke="#6366f1" fillOpacity={1} fill="url(#colorIncome)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-lg font-bold mb-6">Recent Transactions</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-lg ${i % 2 === 0 ? 'bg-green-100 dark:bg-green-900/20 text-green-500' : 'bg-red-100 dark:bg-red-900/20 text-red-500'}`}>
                                        {i % 2 === 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold">{i % 2 === 0 ? 'Salary Deposit' : 'Groceries Purchase'}</p>
                                        <p className="text-xs text-slate-500 flex items-center">
                                            <Clock size={12} className="mr-1" /> Today, 2:30 PM • Main Bank
                                        </p>
                                    </div>
                                </div>
                                <p className={`font-bold ${i % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {i % 2 === 0 ? '+' : '-'}৳{(500 * (i + 1)).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
