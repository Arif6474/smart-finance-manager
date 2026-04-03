export default function HowItWorksSection() {
    const steps = [
        {
            num: '01',
            title: 'Create an Account',
            desc: 'Sign up securely in 30 seconds. No credit card required to start tracking.',
        },
        {
            num: '02',
            title: 'Add Your Transactions',
            desc: 'Log your income, expenses, and debts quickly using our clean, simple interface.',
        },
        {
            num: '03',
            title: 'Analyze Your Money',
            desc: 'Watch the beautiful charts aggregate your spending habits and net worth automatically.',
        }
    ];

    return (
        <section className="py-24 bg-background transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
                    <p className="text-lg text-muted-foreground mt-4">Simple as 1-2-3.</p>
                </div>

                <div className="flex flex-col lg:flex-row items-start justify-center gap-12 relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

                    {steps.map((step, i) => (
                        <div key={i} className="flex-1 text-center relative z-10 w-full group">
                            <div className="w-20 h-20 mx-auto bg-card border-4 border-background rounded-full flex items-center justify-center shadow-lift mb-6 group-hover:scale-110 transition-all duration-300">
                                <span className="text-2xl font-black bg-gradient-to-br from-teal-500 to-emerald-600 bg-clip-text text-transparent">{step.num}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
