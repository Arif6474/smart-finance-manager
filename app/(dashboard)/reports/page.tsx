'use client';

import { useState } from 'react';
import { Download, PieChart as PieChartIcon } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const data = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
];

const categoryData = [
    { name: 'Food', value: 400 },
    { name: 'Transport', value: 300 },
    { name: 'Rent', value: 300 },
    { name: 'Utilities', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ReportsPage() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Analytics & Reports</h1>
                <button
                    className="bg-black dark:bg-white text-white dark:text-black hover:opacity-80 px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-opacity w-full sm:w-auto"
                >
                    <Download size={20} />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl lg:col-span-2 h-[450px]">
                    <h3 className="text-lg font-bold mb-6">Income vs Expense (6 Months)</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }}
                                cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                            <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass p-6 rounded-2xl h-[450px] flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-2 self-start">Expenses by Category</h3>
                    <div className="flex-1 w-full flex items-center justify-center relative translate-y-[-10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <PieChartIcon size={32} className="text-slate-400 mb-1" />
                            <span className="text-2xl font-bold">1.2K</span>
                        </div>
                    </div>

                    <div className="w-full space-y-3 mt-4">
                        {categoryData.map((cat, i) => (
                            <div key={cat.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                                    <span className="text-slate-500 font-medium">{cat.name}</span>
                                </div>
                                <span className="font-bold">৳{cat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
