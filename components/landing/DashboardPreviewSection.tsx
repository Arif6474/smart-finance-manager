import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function DashboardPreviewSection() {
    return (
        <section className="relative py-24 bg-slate-900 overflow-hidden hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 pointer-events-none z-10"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-20 text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">See everything at a glance</h2>
                <p className="text-slate-400 text-lg">A powerful dashboard that turns complex financial data into clear, beautiful insights.</p>
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-20">
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden shadow-primary/20">
                    {/* Fake Browser Header */}
                    <div className="flex items-center px-4 py-3 border-b border-slate-700 bg-slate-900/50">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                    </div>

                    {/* Mockup Body */}
                    <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                                    <p className="text-slate-400 text-sm mb-2">Total Balance</p>
                                    <p className="text-3xl font-bold text-white">৳125,400</p>
                                </div>
                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                                    <p className="text-slate-400 text-sm mb-2">Monthly Spending</p>
                                    <p className="text-3xl font-bold text-white flex items-center gap-2">
                                        ৳42,300 <span className="text-red-400 text-sm font-medium flex items-center"><ArrowUpRight size={14} /> 12%</span>
                                    </p>
                                </div>
                            </div>

                            <div className="h-64 bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col justify-between relative overflow-hidden">
                                <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4">
                                    <Activity size={20} />
                                    Cash Flow
                                </div>
                                {/* Fake Chart Lines */}
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-500/20 to-transparent"></div>
                                <div className="flex items-end justify-between h-32 z-10 gap-2">
                                    {[40, 70, 35, 90, 60, 110, 80].map((h, i) => (
                                        <div key={i} className="w-full bg-indigo-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 space-y-4">
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Recent Activity</p>

                            {[
                                { name: 'Salary', val: '+৳80,000', positive: true },
                                { name: 'Uber Rent', val: '-৳1,200', positive: false },
                                { name: 'Groceries', val: '-৳4,500', positive: false },
                                { name: 'Refund', val: '+৳8,500', positive: true },
                            ].map((tx, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                                    <p className="text-white font-medium text-sm">{tx.name}</p>
                                    <p className={`font-bold text-sm ${tx.positive ? 'text-green-400' : 'text-slate-400'}`}>{tx.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
