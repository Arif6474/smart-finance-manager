'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Tanvir Ahmed',
        role: 'Freelance Developer, Dhaka',
        text: "I had 3 different bank accounts and no idea how much money I actually had. SmartFinance gave me clarity in ONE day. I literally cried when I saw all my money in one place.",
        avatar: 'TA',
        gradient: 'from-teal-500 to-emerald-600',
        stars: 5,
    },
    {
        name: 'Nusrat Jahan',
        role: 'Small Business Owner, Chittagong',
        text: "The payable and receivable tracker is a game-changer. I was losing thousands because I couldn't remember who owed me. Now I collect everything on time. Worth every second.",
        avatar: 'NJ',
        gradient: 'from-purple-500 to-pink-600',
        stars: 5,
    },
    {
        name: 'Rakib Hasan',
        role: 'Engineer, Sylhet',
        text: "I tried 5 finance apps. All of them were either too complex or too plain. SmartFinance is the first app that actually looks beautiful AND works perfectly. 10/10 recommend.",
        avatar: 'RH',
        gradient: 'from-blue-500 to-indigo-600',
        stars: 5,
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-28 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(168,80%,36%,0.05),transparent_60%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
                    >
                        Testimonials
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
                    >
                        Real people.{' '}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                            Real results.
                        </span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-2 mt-4"
                    >
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                        ))}
                        <span className="text-muted-foreground text-sm ml-2">4.9 average from 2,000+ users</span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
                            className="relative bg-card border border-border rounded-3xl p-7 hover:shadow-lift hover:-translate-y-1 transition-all duration-500 flex flex-col"
                        >
                            <Quote size={32} className="text-primary/20 mb-4" />
                            <div className="flex gap-0.5 mb-4">
                                {[...Array(t.stars)].map((_, j) => (
                                    <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-foreground/80 text-sm leading-relaxed flex-1 mb-6 italic">
                                &ldquo;{t.text}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 border-t border-border pt-5">
                                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-muted/50 border border-border text-muted-foreground text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Built for freelancers, job holders, and small businesses
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
