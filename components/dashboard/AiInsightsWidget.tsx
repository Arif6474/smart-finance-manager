'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Insight } from '@/lib/ai';

export default function AiInsightsWidget() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await fetch('/api/insights');
                if (!res.ok) throw new Error('Failed to fetch insights');
                const data = await res.json();
                setInsights(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

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
            className="mt-6 bg-gradient-to-br from-indigo-950/20 via-card to-background border border-primary/20 p-6 rounded-2xl relative overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary/20 rounded-xl relative">
                    <Sparkles size={20} className="text-primary" />
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-primary/30 rounded-xl blur-md"
                    />
                </div>
                <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                    AI Financial Assistant
                </h3>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 rounded-xl bg-card border border-border animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <span>Failed to load AI insights. Please ensure API keys are configured.</span>
                </div>
            ) : insights.length === 0 ? (
                <p className="text-muted-foreground text-sm">No insights available right now.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 relative z-10">
                    {insights.map((insight, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 + 0.3 }}
                            className={`p-5 rounded-xl border ${getColors(insight.type)} transition-colors hover:shadow-md backdrop-blur-sm`}
                        >
                            <div className="flex items-start gap-3 mb-2">
                                <div className="mt-1 bg-background/50 p-1.5 rounded-lg border border-border/50">
                                    {getIcon(insight.type)}
                                </div>
                                <h4 className="font-semibold text-foreground leading-tight">
                                    {insight.title}
                                </h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                                {insight.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
