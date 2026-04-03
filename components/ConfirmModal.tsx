'use client';

import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}: ConfirmModalProps) {
    const colors = {
        danger: 'bg-red-500 shadow-red-500/20 text-white hover:bg-red-600',
        warning: 'bg-yellow-500 shadow-yellow-500/20 text-white hover:bg-yellow-600',
        info: 'bg-primary shadow-primary/20 text-white hover:bg-primary/90'
    };

    const iconColors = {
        danger: 'bg-red-500/10 text-red-500',
        warning: 'bg-yellow-500/10 text-yellow-500',
        info: 'bg-primary/10 text-primary'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border border-border"
                    >
                        <div className="p-8 text-center">
                            <div className={`w-16 h-16 rounded-2xl ${iconColors[variant]} flex items-center justify-center mx-auto mb-6`}>
                                <AlertTriangle size={32} />
                            </div>

                            <h3 className="text-2xl font-bold mb-2">{title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                                {description}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] ${colors[variant]}`}
                                >
                                    {confirmText}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl font-bold text-sm text-muted-foreground hover:bg-muted transition-all active:scale-[0.98]"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
