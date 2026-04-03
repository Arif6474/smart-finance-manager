import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block">
                            SmartFinance
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs">
                            The smartest way to track your income, expenses, and overall financial health all in one place.
                        </p>
                        <div className="flex gap-4 text-slate-400 text-sm font-medium">
                            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
                            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
                            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Download App</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Financial Guides</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} Smart Finance Manager. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
