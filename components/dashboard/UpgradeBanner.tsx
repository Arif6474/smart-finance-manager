import Link from 'next/link';
import { Zap, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UpgradeBanner() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-4 sm:p-6 flex items-start sm:items-center justify-between gap-4 relative overflow-hidden"
        >
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative flex items-start sm:items-center gap-4 flex-1">
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20">
                        <Zap size={20} className="text-primary" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base">Unlock Pro Features</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Upgrade to Pro for ৳100/month and get unlimited access to all features, advanced analytics, and more.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="relative flex items-center gap-2 flex-shrink-0">
                <Link
                    href="/upgrade"
                    className="btn-primary px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap"
                >
                    Upgrade Now
                </Link>
                <button
                    onClick={() => setVisible(false)}
                    className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close banner"
                >
                    <X size={18} className="text-muted-foreground" />
                </button>
            </div>
        </motion.div>
    );
}
