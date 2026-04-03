import { Star } from 'lucide-react';

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Sarah Jenkins',
            role: 'Freelance Designer',
            text: "This app replaced my messy Excel sheets forever. The UI is incredibly clean, and being able to log my app as a PWA on my phone means I record expenses instantly.",
            avatar: 'SJ',
            gradient: 'from-teal-500 to-emerald-600'
        },
        {
            name: 'David Rahman',
            role: 'Small Business Owner',
            text: "I needed something to track who owes me money for my wholesale business. The 'Payable & Receivable' feature literally saved me from losing track of thousands.",
            avatar: 'DR',
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            name: 'Emily Chen',
            role: 'Personal Finance Junkie',
            text: "Tried YNAB, tried Mint. This is exactly what I wanted. Fast, beautiful, dark mode out of the box, and respects my privacy. 10/10.",
            avatar: 'EC',
            gradient: 'from-purple-500 to-pink-600'
        }
    ];

    return (
        <section className="py-24 bg-background transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by people taking control</h2>
                    <p className="text-lg text-muted-foreground">Join thousands of users who trust us to manage their money.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-card p-8 rounded-2xl border border-border hover:shadow-lift hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between">
                            <div>
                                <div className="flex gap-1 mb-5">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="text-amber-400 fill-current" size={16} />
                                    ))}
                                </div>
                                <p className="mb-7 text-foreground/80 italic text-sm leading-relaxed">&quot;{t.text}&quot;</p>
                            </div>
                            <div className="flex items-center gap-3 border-t border-border pt-5">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white shadow-md`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">{t.name}</h4>
                                    <p className="text-xs text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
