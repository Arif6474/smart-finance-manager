'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Zap, Loader2 } from 'lucide-react';
import { Insight } from '@/lib/ai';
import { toast } from 'react-hot-toast';

export default function AiInsightsWidget() {
    const [insights, setInsights] = useState<Insight[]>([]);
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
                setInsights(data.insight.insights);
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
                    if (data.insight) setInsights(data.insight.insights);
                    return;
                }
                throw new Error(data.error || 'Generation failed');
            }

            setInsights(data.insight.insights);
            toast.success("Daily report generated successfully!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <TrendingUp size={18} className="text-success" />;
            case 'warning': return <AlertTriangle size={18} className="text-destructive" />;
            case 'tip': return <Lightbulb size={18} className="text-primary" />;
            default: return <Sparkles size={18} className="text-primary" />;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'success': return 'border-success/30 bg-success/5';
            case 'warning': return 'border-destructive/30 bg-destructive/5';
            case 'tip': return 'border-primary/30 bg-primary/5';
            default: return 'border-border bg-card';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-gradient-to-br from-indigo-950/20 via-card to-background border border-primary/20 p-6 rounded-3xl relative overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/20 rounded-2xl relative group">
                        <Sparkles size={22} className="text-primary transition-transform group-hover:rotate-12" />
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-primary/30 rounded-2xl blur-md"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-indigo-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                            AI Financial Assistant
                        </h3>
                        <p className="text-xs text-slate-500 font-medium tracking-wide flex items-center gap-1.5 mt-0.5 uppercase">
                            <Zap size={10} className="fill-primary text-primary" /> Personalized Daily Insights
                        </p>
                    </div>
                </div>

                {insights.length === 0 && !loading && (
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-primary text-white py-2.5 px-6 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                    >
                        {generating ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Processing Data...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Generate Today's Report
                            </>
                        )}
                    </button>
                )}

                {insights.length > 0 && (
                    <div className="px-4 py-1.5 bg-success/10 border border-success/20 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-[10px] uppercase font-bold text-success tracking-widest">Live Report: Today</span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="p-5 bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl text-sm flex items-start gap-3 backdrop-blur-sm">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold mb-1">Service Temporarily Unavailable</p>
                        <p className="opacity-80">We're having trouble reaching the AI. Please check your connection or try again later.</p>
                    </div>
                </div>
            ) : insights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center bg-white/5 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Sparkles size={32} className="text-primary/50" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Ready to analyze?</h4>
                    <p className="text-sm text-slate-500 max-w-sm mb-6">
                        Get a personalized breakdown of your spending habits and financial health for today.
                    </p>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="text-primary text-sm font-bold hover:underline py-2 px-4 flex items-center gap-2 disabled:opacity-50"
                    >
                        {generating ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                        {generating ? 'Gathering insights...' : 'Generate your first report of the day'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                    <AnimatePresence mode="popLayout">
                        {insights.map((insight, idx) => (
                            <motion.div
                                key={`${insight.title}-${idx}`}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
                                className={`p-5 rounded-2xl border ${getColors(insight.type)} transition-all hover:shadow-xl hover:-translate-y-1 backdrop-blur-md group relative`}
                            >
                                <div className="absolute inset-0 bg-white/5 dark:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="mt-0.5 bg-background/80 p-2 rounded-xl border border-border/50 shadow-sm">
                                        {getIcon(insight.type)}
                                    </div>
                                    <h4 className="font-bold text-foreground leading-snug pt-1">
                                        {insight.title}
                                    </h4>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-12 transition-all">
                                    {insight.description}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}
