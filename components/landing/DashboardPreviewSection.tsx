import { ArrowUpRight, Activity } from 'lucide-react';

export default function DashboardPreviewSection() {
    return (
        <section className="relative py-24 bg-slate-900 overflow-hidden hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 pointer-events-none z-10"></div>
            {/* Ambient teal glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-20 text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">See everything at a glance</h2>
                <p className="text-slate-400 text-lg">A powerful dashboard that turns complex financial data into clear, beautiful insights.</p>
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-20">
                <div className="rounded-2xl border border-slate-700/80 bg-slate-800/70 backdrop-blur-xl shadow-2xl overflow-hidden shadow-teal-500/10">
                    {/* Fake Browser Header */}
                    <div className="flex items-center px-4 py-3 border-b border-slate-700/80 bg-slate-900/50">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="bg-slate-700/50 rounded-md px-8 py-1 text-slate-400 text-xs">smartfinance.app/dashboard</div>
                        </div>
                    </div>

                    {/* Mockup Body */}
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/60">
                                    <p className="text-slate-400 text-xs mb-2 font-medium">Total Balance</p>
                                    <p className="text-2xl font-bold text-white">৳125,400</p>
                                </div>
                                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/60">
                                    <p className="text-slate-400 text-xs mb-2 font-medium">Monthly Spending</p>
                                    <p className="text-2xl font-bold text-white flex items-center gap-2">
                                        ৳42,300 <span className="text-red-400 text-xs font-medium flex items-center"><ArrowUpRight size={12} /> 12%</span>
                                    </p>
                                </div>
                            </div>

                            <div className="h-52 bg-slate-900/60 p-5 rounded-xl border border-slate-700/60 flex flex-col justify-between relative overflow-hidden">
                                <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm mb-3">
                                    <Activity size={16} />
                                    Cash Flow
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-teal-500/15 to-transparent"></div>
                                <div className="flex items-end justify-between h-24 z-10 gap-2">
                                    {[40, 70, 35, 90, 60, 110, 80].map((h, i) => (
                                        <div key={i} className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-sm opacity-90" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/60 space-y-3">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Recent Activity</p>
                            {[
                                { name: 'Salary', val: '+৳80,000', positive: true },
                                { name: 'Uber Rent', val: '-৳1,200', positive: false },
                                { name: 'Groceries', val: '-৳4,500', positive: false },
                                { name: 'Refund', val: '+৳8,500', positive: true },
                            ].map((tx, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-700/40 last:border-0">
                                    <p className="text-white font-medium text-xs">{tx.name}</p>
                                    <p className={`font-bold text-xs ${tx.positive ? 'text-teal-400' : 'text-slate-400'}`}>{tx.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
