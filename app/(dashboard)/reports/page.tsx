'use client';

import { useState, useEffect } from 'react';
import { Download, PieChart as PieChartIcon, ChevronLeft, ChevronRight, Calendar, BarChart2 } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0d9488', '#10b981', '#f59e0b', '#ef4444'];

export default function ReportsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [referenceDate, setReferenceDate] = useState(new Date());

    useEffect(() => {
        const fetchReportsData = async () => {
            setLoading(true);
            try {
                const dateStr = referenceDate.toISOString();
                const res = await fetch(`/api/reports?range=${range}&date=${dateStr}`);
                const result = await res.json();
                if (res.ok) {
                    setData(result);
                }
            } catch (error) {
                console.error('Error fetching reports data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReportsData();
    }, [range, referenceDate]);

    const handlePrevious = () => {
        const newDate = new Date(referenceDate);
        if (range === 'weekly') newDate.setDate(newDate.getDate() - 7);
        else if (range === 'monthly') newDate.setMonth(newDate.getMonth() - 1);
        else newDate.setFullYear(newDate.getFullYear() - 1);
        setReferenceDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(referenceDate);
        if (range === 'weekly') newDate.setDate(newDate.getDate() + 7);
        else if (range === 'monthly') newDate.setMonth(newDate.getMonth() + 1);
        else newDate.setFullYear(newDate.getFullYear() + 1);
        setReferenceDate(newDate);
    };

    const getPeriodLabel = () => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (range === 'weekly') {
            const start = new Date(data?.startDate || referenceDate);
            const end = new Date(data?.endDate || referenceDate);
            return `${start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
        } else if (range === 'monthly') {
            return `${monthNames[referenceDate.getMonth()]} ${referenceDate.getFullYear()}`;
        } else {
            return referenceDate.getFullYear().toString();
        }
    };

    if (loading && !data) {
        return (
            <PageWrapper className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-10 w-48 bg-card border border-border rounded-xl animate-pulse" />
                    <div className="h-10 w-32 bg-card border border-border rounded-xl animate-pulse" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 h-[450px] bg-card border border-border rounded-2xl animate-pulse" />
                    <div className="h-[450px] bg-card border border-border rounded-2xl animate-pulse" />
                </div>
            </PageWrapper>
        );
    }

    const historyData = data?.historyData || [];
    const categoryData = data?.categoryData || [];
    const totalExpense = categoryData.reduce((acc: number, curr: any) => acc + curr.value, 0);

    return (
        <PageWrapper className="space-y-6 pb-12">
            {/* Header & Main Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold">Analytics & Reports</h1>
                    <p className="text-muted-foreground text-sm mt-1">Detailed breakdown of your financial performance</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Range Selector */}
                     <div className="flex items-center justify-center sm:justify-start gap-4 bg-card/50 border border-border/50 p-4 rounded-2xl">
                <button
                    onClick={handlePrevious}
                    className="p-2 hover:bg-muted rounded-xl transition-colors border border-border/50"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-3 min-w-[180px] justify-center">
                    <Calendar size={18} className="text-primary" />
                    <span className="text-base font-bold tracking-tight">{getPeriodLabel()}</span>
                </div>

                <button
                    onClick={handleNext}
                    className="p-2 hover:bg-muted rounded-xl transition-colors border border-border/50"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
                    <div className="bg-muted/30 p-1.5 rounded-xl border border-border flex items-center gap-1">
                        {(['weekly', 'monthly', 'yearly'] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${range === r
                                    ? 'bg-background text-primary shadow-sm border border-border/50'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>

                    <button className="btn-secondary px-4 py-2.5 flex items-center gap-2 text-sm">
                        <Download size={18} />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Period Navigation */}
           

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Chart */}
                <div className="bg-card border border-border p-6 rounded-2xl lg:col-span-2 min-h-[450px] relative">
                    {loading && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Income vs Expense</h3>
                            <p className="text-muted-foreground text-xs">{range === 'yearly' ? 'Monthly' : 'Daily'} performance breakdown</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                                <span>Income</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
                                <span>Expense</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[320px]">
                        {historyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214 20% 90%)" strokeOpacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(215 14% 50%)', fontSize: 11 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(222 47% 8%)',
                                            border: '1px solid hsl(220 26% 20%)',
                                            borderRadius: '12px',
                                            color: '#fff',
                                            boxShadow: '0 8px 30px -5px rgb(0 0 0 / 0.3)'
                                        }}
                                        cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
                                    />
                                    <Bar
                                        dataKey="income"
                                        fill="#0d9488"
                                        radius={[4, 4, 0, 0]}
                                        barSize={range === 'monthly' ? 12 : 24}
                                        animationDuration={1000}
                                    />
                                    <Bar
                                        dataKey="expense"
                                        fill="#ef4444"
                                        radius={[4, 4, 0, 0]}
                                        barSize={range === 'monthly' ? 12 : 24}
                                        animationDuration={1000}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                                <BarChart2 size={48} className="mb-2" />
                                <p className="text-sm italic">No data for this period</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Donut Chart Breakdown */}
                <div className="bg-card border border-border p-6 rounded-2xl min-h-[450px] flex flex-col relative">
                    {loading && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    <h3 className="text-lg font-bold mb-1">Expense Categories</h3>
                    <p className="text-muted-foreground text-xs mb-4">Current {range} distribution</p>

                    <div className="flex-1 w-full flex items-center justify-center relative min-h-[220px]">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        fill="#8884d8"
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                        animationDuration={1200}
                                    >
                                        {categoryData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(222 47% 8%)',
                                            border: '1px solid hsl(220 26% 20%)',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center opacity-10">
                                <PieChartIcon size={64} />
                                <p className="text-xs mt-2 font-medium">No Data</p>
                            </div>
                        )}

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-muted-foreground text-xs">Total</span>
                            <span className="text-2xl font-bold tracking-tighter">৳{(totalExpense / 1000).toFixed(1)}k</span>
                        </div>
                    </div>

                    <div className="w-full space-y-2 mt-6 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                        {categoryData.length > 0 ? (
                            categoryData.map((cat: any, i: number) => (
                                <div key={cat.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                                        <span className="text-foreground text-sm font-medium">{cat.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">৳{cat.value.toLocaleString()}</p>
                                        <p className="text-[10px] text-muted-foreground">{Math.round((cat.value / totalExpense) * 100)}%</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4 text-muted-foreground opacity-50 text-xs italic">
                                <p>No category-wise expenses found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

