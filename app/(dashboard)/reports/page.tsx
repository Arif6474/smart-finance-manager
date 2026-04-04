'use client';

import { useState, useEffect } from 'react';
import { PieChart as PieChartIcon, ChevronLeft, ChevronRight, Calendar, BarChart2, TrendingUp, DollarSign, Activity } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area,
    Legend
} from 'recharts';

const COLORS = ['#0d9488', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');

    // General Tab State
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [referenceDate, setReferenceDate] = useState(new Date());

    // Advanced Tab State
    const [netWorthData, setNetWorthData] = useState<any[]>([]);
    const [trendsData, setTrendsData] = useState<any[]>([]);
    const [advancedLoading, setAdvancedLoading] = useState(true);
    const [nwDays, setNwDays] = useState<'30' | '90' | '365'>('30');
    const [trendMonths, setTrendMonths] = useState<'6' | '12'>('6');

    // Fetch General Data
    useEffect(() => {
        if (activeTab !== 'general') return;

        const fetchReportsData = async () => {
            setLoading(true);
            try {
                const dateStr = referenceDate.toISOString();
                const res = await fetch(`/api/reports?range=${range}&date=${dateStr}`);
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (error) {
                console.error('Error fetching reports data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReportsData();
    }, [range, referenceDate, activeTab]);

    // Fetch Advanced Data
    useEffect(() => {
        if (activeTab !== 'advanced') return;

        const fetchAdvancedData = async () => {
            setAdvancedLoading(true);
            try {
                const [nwRes, trendsRes] = await Promise.all([
                    fetch(`/api/analytics/net-worth?days=${nwDays}`),
                    fetch(`/api/analytics/trends?months=${trendMonths}`)
                ]);

                if (nwRes.ok) setNetWorthData(await nwRes.json());
                if (trendsRes.ok) setTrendsData(await trendsRes.json());
            } catch (error) {
                console.error('Error fetching advanced analytics:', error);
            } finally {
                setAdvancedLoading(false);
            }
        };

        fetchAdvancedData();
    }, [nwDays, trendMonths, activeTab]);

    // Navigation Handlers for General Tab
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

    // Derived Variables
    const historyData = data?.historyData || [];
    const categoryData = data?.categoryData || [];
    const totalExpense = categoryData.reduce((acc: number, curr: any) => acc + curr.value, 0);

    return (
        <PageWrapper className="space-y-6 pb-12">
            {/* Header & Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold">Analytics & Reports</h1>
                    <p className="text-muted-foreground text-sm mt-1">Detailed breakdown of your financial performance</p>
                </div>

                <div className="bg-muted/30 p-1.5 rounded-xl border border-border flex items-center gap-1">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-5 py-2.5 text-sm font-bold flex items-center gap-2 rounded-lg transition-all duration-300 ${activeTab === 'general'
                            ? 'bg-background text-primary shadow-sm border border-border/50'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <PieChartIcon size={16} />
                        General Output
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={`px-5 py-2.5 text-sm font-bold flex items-center gap-2 rounded-lg transition-all duration-300 ${activeTab === 'advanced'
                            ? 'bg-background text-primary shadow-sm border border-border/50'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <TrendingUp size={16} />
                        Advanced Analytics
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: General */}
            {activeTab === 'general' && (
                <div className="space-y-6">
                    {/* General Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center justify-center sm:justify-start gap-3 bg-card/50 border border-border/50 p-2 sm:p-3 rounded-2xl w-full sm:w-auto">
                            <button onClick={handlePrevious} className="p-2 hover:bg-muted rounded-xl transition-colors border border-border/50 ">
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-2 min-w-[160px] justify-center">
                                <Calendar size={18} className="text-primary " />
                                <span className="text-sm font-bold tracking-tight">{getPeriodLabel()}</span>
                            </div>
                            <button onClick={handleNext} className="p-2 hover:bg-muted rounded-xl transition-colors border border-border/50 ">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="bg-muted/30 p-1.5 rounded-xl border border-border flex items-center gap-1 w-full sm:w-auto">
                            {(['weekly', 'monthly', 'yearly'] as const).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRange(r)}
                                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${range === r
                                        ? 'bg-background text-primary shadow-sm border border-border/50'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading && !data ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <div className="lg:col-span-2 h-[450px] bg-card border border-border rounded-2xl animate-pulse" />
                            <div className="h-[450px] bg-card border border-border rounded-2xl animate-pulse" />
                        </div>
                    ) : (
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
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} dy={10} />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))', boxShadow: '0 8px 30px -5px rgb(0 0 0 / 0.3)' }}
                                                    cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                                                />
                                                <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={range === 'monthly' ? 12 : 24} animationDuration={1000} />
                                                <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} barSize={range === 'monthly' ? 12 : 24} animationDuration={1000} />
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
                            <div className="bg-card border border-border p-6 rounded-2xl min-h-[450px] flex flex-col items-center relative">
                                {loading && (
                                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                                <div className="w-full">
                                    <h3 className="text-lg font-bold mb-1">Expense Categories</h3>
                                    <p className="text-muted-foreground text-xs mb-4">Current {range} distribution</p>
                                </div>
                                <div className="w-full flex-1 flex items-center justify-center relative min-h-[220px]">
                                    {categoryData.length > 0 ? (
                                        <>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none" animationDuration={1200}>
                                                        {categoryData.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-muted-foreground text-xs">Total</span>
                                                <span className="text-2xl font-bold tracking-tighter">৳{(totalExpense / 1000).toFixed(1)}k</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center opacity-10">
                                            <PieChartIcon size={64} />
                                            <p className="text-xs mt-2 font-medium">No Data</p>
                                        </div>
                                    )}
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
                                        <div className="flex w-full items-center justify-center py-4 text-muted-foreground opacity-50 text-xs italic">
                                            <p>No category expenses found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: Advanced Analytics */}
            {activeTab === 'advanced' && (
                <div className="space-y-6">
                    {advancedLoading && netWorthData.length === 0 ? (
                        <div className="grid grid-cols-1 gap-5">
                            <div className="h-[400px] bg-card border border-border rounded-2xl animate-pulse" />
                            <div className="h-[400px] bg-card border border-border rounded-2xl animate-pulse" />
                        </div>
                    ) : (
                        <>
                            {/* Net Worth Tracker */}
                            <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none opacity-50" />
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold flex items-center gap-2">
                                            <Activity className="text-primary" size={24} />
                                            Net Worth Over Time
                                        </h3>
                                        <p className="text-muted-foreground text-sm mt-1">Track your liquid wealth progression</p>
                                    </div>
                                    <div className="bg-muted/30 p-1 rounded-xl border border-border flex items-center gap-1">
                                        {(['30', '90', '365'] as const).map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setNwDays(r)}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${nwDays === r
                                                    ? 'bg-background text-primary shadow-sm border border-border/50'
                                                    : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                {r} Days
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-[350px] relative z-10">
                                    {netWorthData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={netWorthData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} minTickGap={30} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`} />
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
                                                    formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Net Worth']}
                                                    labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                                                />
                                                <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorNetWorth)" animationDuration={1500} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                                            <Activity size={48} className="mb-2" />
                                            <p className="text-sm italic">No data to plot</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Monthly Trends */}
                            <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl relative group">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold flex items-center gap-2">
                                            <DollarSign className="text-primary" size={24} />
                                            Cash Flow Trends
                                        </h3>
                                        <p className="text-muted-foreground text-sm mt-1">Monthly Income vs. Expense analysis</p>
                                    </div>
                                    <div className="bg-muted/30 p-1 rounded-xl border border-border flex items-center gap-1">
                                        {(['6', '12'] as const).map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setTrendMonths(r)}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${trendMonths === r
                                                    ? 'bg-background text-primary shadow-sm border border-border/50'
                                                    : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                {r} Months
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-[350px]">
                                    {trendsData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={trendsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
                                                    cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                                                    formatter={(value: any) => [`৳${Number(value).toLocaleString()}`]}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                                <Bar dataKey="Income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} barSize={24} animationDuration={1000} />
                                                <Bar dataKey="Expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} barSize={24} animationDuration={1000} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                                            <BarChart2 size={48} className="mb-2" />
                                            <p className="text-sm italic">No data to plot</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </PageWrapper>
    );
}
