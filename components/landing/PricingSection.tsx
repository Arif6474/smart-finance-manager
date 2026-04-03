import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingSection() {
    return (
        <section className="py-24 bg-white dark:bg-slate-900 border-t">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Start for free, upgrade when you need superpowers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Free Plan */}
                    <div className="glass p-10 rounded-3xl border border-slate-200 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300 flex flex-col text-center md:text-left">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Basic</h3>
                            <p className="text-slate-500 mb-6">Perfect for personal use</p>
                            <div className="text-5xl font-black mb-6">৳0 <span className="text-lg text-slate-500 font-medium tracking-normal">/forever</span></div>
                            <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto md:mx-0">
                                <li className="flex items-center gap-3"><Check className="text-green-500" size={20} /> Unlimited Accounts</li>
                                <li className="flex items-center gap-3"><Check className="text-green-500" size={20} /> Add up to 500 transactions/mo</li>
                                <li className="flex items-center gap-3"><Check className="text-green-500" size={20} /> Basic Reports</li>
                                <li className="flex items-center gap-3"><Check className="text-green-500" size={20} /> Installable Mobile App (PWA)</li>
                            </ul>
                        </div>
                        <Link href="/signup" className="mt-auto w-full py-4 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="glass p-10 rounded-3xl border-2 border-primary relative hover:-translate-y-2 transition-transform duration-300 flex flex-col text-center md:text-left shadow-2xl shadow-primary/20">
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-3xl">POPULAR</div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <p className="text-slate-500 mb-6">For small businesses & power users</p>
                            <div className="text-5xl font-black mb-6">৳499 <span className="text-lg text-slate-500 font-medium tracking-normal">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto md:mx-0">
                                <li className="flex items-center gap-3"><Check className="text-primary" size={20} /> Everything in Basic</li>
                                <li className="flex items-center gap-3"><Check className="text-primary" size={20} /> Priority support</li>
                                <li className="flex items-center gap-3"><Check className="text-primary" size={20} /> Advanced AI Analytics</li>
                                <li className="flex items-center gap-3"><Check className="text-primary" size={20} /> CSV Data Export</li>
                                <li className="flex items-center gap-3"><Check className="text-primary" size={20} /> Payable & Receivable Tracking</li>
                            </ul>
                        </div>
                        <button className="mt-auto w-full py-4 text-center rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-colors shadow-lg">
                            Upgrade to Pro
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
