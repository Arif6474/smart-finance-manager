'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, 
    TrendingUp, 
    AlertTriangle, 
    Lightbulb, 
    Zap, 
    Loader2, 
    BarChart3, 
    Target, 
    ArrowRight,
    Search,
    ChevronRight,
    History
} from 'lucide-react';
import { Insight } from '@/lib/ai';
import { toast } from 'react-hot-toast';
import PageWrapper from '@/components/PageWrapper';

export default function AiAssistantPage() {
    const [report, setReport] = useState<{ insights: Insight[], summary: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTodayInsight();
    }, []);

    const fetchTodayInsight = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/insights');
            if (!res.ok) throw new Error('Failed to fetch insights');
            const data = await res.json();
            if (data.insight) {
                setReport({
                    insights: data.insight.insights,
                    summary: data.insight.summary
                });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setGenerating(true);
            const res = await fetch('/api/insights', {
                method: 'POST',
            });
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    toast.error(data.error);
                    if (data.insight) {
                        setReport({
                            insights: data.insight.insights,
                            summary: data.insight.summary
                        });
                    }
                    return;
                }
                throw new Error(data.error || 'Generation failed');
            }

            setReport({
                insights: data.insight.insights,
                summary: data.insight.summary
            });
            toast.success("AI Analysis Complete!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <TrendingUp size={20} className="text-emerald-500" />;
            case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
            case 'tip': return <Lightbulb size={20} className="text-blue-500" />;
            default: return <Sparkles size={20} className="text-primary" />;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'success': return 'border-emerald-500/20 bg-emerald-500/5';
            case 'warning': return 'border-amber-500/20 bg-amber-500/5';
            case 'tip': return 'border-blue-500/20 bg-blue-500/5';
            default: return 'border-border bg-card';
        }
    };

    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto space-y-8 pb-20 pt-4 md:pt-0">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                            <span className="bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                                AI Assistant
                            </span>
                        </h1>
                        <p className="text-muted-foreground font-semibold flex items-center gap-2 text-sm md:text-base">
                            <Sparkles size={16} className="text-emerald-400" />
                            Smart insights tailored to your habit & transactions
                        </p>
                    </div>

                    {!report && !loading && (
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="bg-primary text-white py-3.5 px-8 rounded-2xl flex items-center gap-3 text-base font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Analyzing Finances...
                                </>
                            ) : (
                                <>
                                    <Zap size={20} className="fill-white" />
                                    Generate Today's Report
                                </>
                            )}
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-8">
                        <div className="h-48 rounded-[40px] bg-card border border-border animate-pulse" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 rounded-[40px] bg-card border border-border animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : error ? (
                    <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-[40px] text-center space-y-6 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <AlertTriangle size={40} className="text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black">Analysis Failed</h2>
                            <p className="text-muted-foreground max-w-md mx-auto font-medium">{error}</p>
                        </div>
                        <button 
                            onClick={fetchTodayInsight}
                            className="bg-background border border-border py-2 px-6 rounded-xl font-black text-sm hover:bg-muted transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                ) : !report ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-gradient-to-b from-card/50 to-background border border-dashed border-border/50 rounded-[50px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [0, 5, 0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-28 h-28 bg-primary/10 rounded-[32px] flex items-center justify-center mb-10 relative shadow-2xl"
                        >
                            <Sparkles size={56} className="text-primary/30" />
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-xl border-4 border-background">
                                <Zap size={20} className="text-white fill-white" />
                            </div>
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter">Ready for your daily audit?</h2>
                        <p className="text-muted-foreground max-w-lg mb-12 text-lg font-medium leading-relaxed opacity-80">
                            Let our AI analyze your spending patterns, identify leaks, and celebrate your savings milestones. 
                            Your first report of the day is just one click away.
                        </p>
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="bg-primary text-white py-3 px-12 rounded-3xl flex items-center gap-4 text-xl font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {generating ? <Loader2 size={26} className="animate-spin" /> : <Sparkles size={26} />}
                            {generating ? 'Gathering context...' : 'Generate Daily Report'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Monthly Summary Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 blur-3xl opacity-60" />
                            <div className="relative bg-card/60 backdrop-blur-2xl border border-white/10 p-8 lg:p-10 xl:p-14 rounded-[50px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                                <div className="flex flex-col md:flex-row items-start gap-10">
                                    <div className="p-5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[32px] shadow-xl shadow-teal-500/20">
                                        <History size={40} className="text-white" />
                                    </div>
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <span className="px-4 py-1.5 bg-background border border-border text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                                                Executive Summary
                                            </span>
                                            <div className="h-px flex-1 max-w-[100px] bg-border/50" />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight text-foreground">Monthly Financial Status</h2>
                                        <p className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-200 leading-[1.4] italic pr-6 tracking-tight">
                                            {report.summary}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Insights Title */}
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground/60">Strategic Insights</h3>
                            <div className="h-px flex-1 bg-border/40" />
                        </div>

                        {/* Insights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {report.insights.map((insight, idx) => (
                                    <motion.div
                                        key={`${insight.title}-${idx}`}
                                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                        className={`p-8 rounded-[48px] border-2 ${getColors(insight.type)} shadow-[0_16px_32px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] hover:-translate-y-3 transition-all duration-700 group relative overflow-hidden`}
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-1000 group-hover:rotate-12 translate-x-4 -translate-y-4">
                                            {getIcon(insight.type)}
                                        </div>
                                        
                                        <div className="p-4 bg-background dark:bg-card w-fit rounded-[24px] border border-border/60 shadow-inner mb-8 group-hover:bg-primary/5 transition-colors">
                                            {getIcon(insight.type)}
                                        </div>

                                        <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight group-hover:text-primary transition-colors">
                                            {insight.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed text-lg tracking-tight">
                                            {insight.description}
                                        </p>

                                        {/* <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary/0 group-hover:text-primary/100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                                            View Details <ChevronRight size={14} className="stroke-[3]" />
                                        </div> */}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Footer Tips */}
                        <div className="p-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/50 rounded-[40px] border border-border/50 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-indigo-500" />
                            <p className="text-lg text-muted-foreground/80 font-bold max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3">
                                <span className="p-2 bg-background rounded-full border border-border shadow-sm">
                                    <Sparkles size={20} className="text-primary" />
                                </span>
                                AI insights are strategic tools. For critical tax or investment advice, please consult a certified professional.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}

