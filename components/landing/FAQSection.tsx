'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "What happens after the 14-day free trial?",
        answer: "After 14 days, your account will automatically transition to our Free plan with limited features. You will not be charged unless you choose to upgrade to the Pro plan manually. All your data will remain safe."
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your Pro subscription at any time from your profile settings. You will continue to have Pro access until the end of your current billing period."
    },
    {
        question: "Is my financial data secure?",
        answer: "Absolutely. We use bank-level encryption (AES-256) to secure your data. Your information is private and is never shared with third parties. We prioritize your privacy above everything else."
    },
    {
        question: "Do I need a credit card to start the trial?",
        answer: "No credit card is required to start your 14-day free trial. We want you to experience the full value of SmartFinance before you decide to commit."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-28 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(168,80%,36%,0.03),transparent_60%)] pointer-events-none" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                    >
                        FAQ
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl font-extrabold mb-4"
                    >
                        Frequently Asked{' '}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </motion.h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="border border-border rounded-2xl overflow-hidden bg-card"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-bold text-foreground">{faq.question}</span>
                                {openIndex === i ? (
                                    <Minus size={20} className="text-primary" />
                                ) : (
                                    <Plus size={20} className="text-muted-foreground" />
                                )}
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
