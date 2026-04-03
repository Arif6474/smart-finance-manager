import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingSection() {
    return (
        <section className="py-24 bg-card border-t border-border transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
                    <p className="text-lg text-muted-foreground">Start for free, upgrade when you need superpowers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Free Plan */}
                    <div className="bg-background p-10 rounded-3xl border border-border hover:-translate-y-2 transition-all duration-500 flex flex-col text-center md:text-left">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Basic</h3>
                            <p className="text-muted-foreground mb-6">Perfect for personal use</p>
                            <div className="text-5xl font-black mb-6">৳0 <span className="text-lg text-muted-foreground font-medium tracking-normal">/forever</span></div>
                            <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto md:mx-0 text-sm">
                                <li className="flex items-center gap-3"><Check className="text-success flex-shrink-0" size={18} /> Unlimited Accounts</li>
                                <li className="flex items-center gap-3"><Check className="text-success flex-shrink-0" size={18} /> Up to 500 transactions/mo</li>
                                <li className="flex items-center gap-3"><Check className="text-success flex-shrink-0" size={18} /> Basic Reports</li>
                                <li className="flex items-center gap-3"><Check className="text-success flex-shrink-0" size={18} /> Installable Mobile App (PWA)</li>
                            </ul>
                        </div>
                        <Link href="/signup" className="mt-auto w-full py-3.5 text-center rounded-xl bg-muted hover:bg-muted/80 font-semibold transition-colors text-sm">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-background p-10 rounded-3xl border-2 border-primary relative hover:-translate-y-2 transition-all duration-500 flex flex-col text-center md:text-left shadow-glow">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-3xl">POPULAR</div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <p className="text-muted-foreground mb-6">For small businesses & power users</p>
                            <div className="text-5xl font-black mb-6">৳499 <span className="text-lg text-muted-foreground font-medium tracking-normal">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto md:mx-0 text-sm">
                                <li className="flex items-center gap-3"><Check className="text-primary flex-shrink-0" size={18} /> Everything in Basic</li>
                                <li className="flex items-center gap-3"><Check className="text-primary flex-shrink-0" size={18} /> Priority support</li>
                                <li className="flex items-center gap-3"><Check className="text-primary flex-shrink-0" size={18} /> Advanced AI Analytics</li>
                                <li className="flex items-center gap-3"><Check className="text-primary flex-shrink-0" size={18} /> CSV Data Export</li>
                                <li className="flex items-center gap-3"><Check className="text-primary flex-shrink-0" size={18} /> Payable & Receivable Tracking</li>
                            </ul>
                        </div>
                        <button className="mt-auto w-full btn-primary py-3.5 text-sm">
                            Upgrade to Pro
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
