'use client';

import { useState, useEffect } from 'react';
import { Calculator, IndianRupee, Calendar, Percent, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function EmiCalculator() {
    const [principal, setPrincipal] = useState<number>(500000);
    const [interestRate, setInterestRate] = useState<number>(9);
    const [tenor, setTenor] = useState<number>(24); // Months

    const [emi, setEmi] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);

    const calculateEmi = () => {
        const p = principal;
        const r = interestRate / 12 / 100;
        const n = tenor;

        if (r === 0) {
            setEmi(Math.round(p / n));
            setTotalInterest(0);
            setTotalPayment(p);
            return;
        }

        const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPay = emiValue * n;
        const totalInt = totalPay - p;

        setEmi(Math.round(emiValue));
        setTotalInterest(Math.round(totalInt));
        setTotalPayment(Math.round(totalPay));
    };

    useEffect(() => {
        calculateEmi();
    }, [principal, interestRate, tenor]);

    const chartData = [
        { name: 'Principal', value: principal, color: 'hsl(168 80% 36%)' },
        { name: 'Interest', value: totalInterest, color: 'hsl(222 47% 31%)' }
    ];

    return (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Calculator size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold">EMI Calculator</h3>
                    <p className="text-sm text-muted-foreground">Plan your loans smarter</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <IndianRupee size={12} /> Loan Amount
                        </label>
                        <input
                            type="range"
                            min="10000"
                            max="5000000"
                            step="10000"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">৳10K</span>
                            <span className="text-lg font-bold">৳{principal.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">৳50L</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Percent size={12} /> Interest Rate (Annual)
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">1%</span>
                            <span className="text-lg font-bold">{interestRate}%</span>
                            <span className="text-xs text-muted-foreground">30%</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Calendar size={12} /> Loan Tenor (Months)
                        </label>
                        <input
                            type="range"
                            min="6"
                            max="360"
                            step="6"
                            value={tenor}
                            onChange={(e) => setTenor(Number(e.target.value))}
                            className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">6mo</span>
                            <span className="text-lg font-bold">{tenor} Months</span>
                            <span className="text-xs text-muted-foreground">30yr</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-muted/20 rounded-[2.5rem] p-8 border border-border/50 relative overflow-hidden">
                    <div className="text-center relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Monthly EMI</p>
                        <h2 className="text-4xl font-black tracking-tighter text-primary">৳{emi.toLocaleString()}</h2>
                    </div>

                    <div className="w-full h-48 mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)' }}
                                    formatter={(value: any) => `৳${value.toLocaleString()}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full mt-4 text-center">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest leading-none mb-1">Total Principal</p>
                            <p className="font-bold text-sm">৳{principal.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest leading-none mb-1">Total Interest</p>
                            <p className="font-bold text-sm">৳{totalInterest.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
