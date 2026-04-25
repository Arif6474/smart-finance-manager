import Link from 'next/link';
import PWAInstallButton from '@/components/PWAInstallButton';

export default function Footer() {
    return (
        <footer className="bg-card pt-20 pb-10 border-t border-border transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent inline-block">
                            TakaHisab
                        </h2>
                        <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                            The smartest way to track your income, expenses, and overall financial health all in one place.
                        </p>

                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Product</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#features" className="hover:text-primary transition-colors duration-300">Features</a></li>
                            <li><a href="#pricing" className="hover:text-primary transition-colors duration-300">Pricing</a></li>
                            <li><a href="#how-it-works" className="hover:text-primary transition-colors duration-300">How it works</a></li>
                            <li><a href="#faq" className="hover:text-primary transition-colors duration-300">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-primary transition-colors duration-300">Contact Us</Link></li>
                            <li><Link href="/docs" className="hover:text-primary transition-colors duration-300">Documentation</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors duration-300">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors duration-300">Careers</a></li>
                            <li><Link href="/#" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link></li>
                            <li><Link href="/#" className="hover:text-primary transition-colors duration-300">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} TakaHisab. All rights reserved.</p>
                    <div className="flex gap-6 items-center">
                        <Link href="/#" className="hover:text-primary transition-colors duration-300">Privacy</Link>
                        <Link href="/#" className="hover:text-primary transition-colors duration-300">Terms</Link>
                        <PWAInstallButton />
                    </div>
                </div>
            </div>
        </footer>
    );
}
