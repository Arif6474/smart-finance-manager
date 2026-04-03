import { Star } from 'lucide-react';

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Sarah Jenkins',
            role: 'Freelance Designer',
            text: "This app replaced my messy Excel sheets forever. The UI is incredibly clean, and being able to log my app as a PWA on my phone means I record expenses instantly.",
            avatar: 'SJ'
        },
        {
            name: 'David Rahman',
            role: 'Small Business Owner',
            text: "I needed something to track who owes me money for my wholesale business. The 'Payable & Receivable' feature literally saved me from losing track of thousands.",
            avatar: 'DR'
        },
        {
            name: 'Emily Chen',
            role: 'Personal Finance Junkie',
            text: "Tried YNAB, tried Mint. This is exactly what I wanted. Fast, beautiful, dark mode out of the box, and respects my privacy. 10/10.",
            avatar: 'EC'
        }
    ];

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by people taking control</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Join thousands of users who trust us to manage their money.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="glass p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow flex flex-col justify-between">
                            <div>
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="text-amber-400 fill-current" size={18} />
                                    ))}
                                </div>
                                <p className="mb-8 text-slate-700 dark:text-slate-300 italic">"{t.text}"</p>
                            </div>
                            <div className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                                <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-500">
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold">{t.name}</h4>
                                    <p className="text-sm text-slate-500">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
