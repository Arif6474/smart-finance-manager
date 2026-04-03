import Link from 'next/link';

export default function FinalCTASection() {
    return (
        <section className="py-24 relative overflow-hidden bg-primary text-white">
            {/* Background Graphic */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-900 opacity-20 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10 text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                    Start Managing Your Money Today
                </h2>
                <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                    Join thousands of smart individuals and business owners who have taken control of their financial future.
                </p>
                <Link
                    href="/signup"
                    className="inline-block px-10 py-5 bg-white text-primary rounded-xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform"
                >
                    Get Started Free
                </Link>
                <p className="mt-6 text-sm opacity-70">
                    Takes only 30 seconds. No credit card required.
                </p>
            </div>
        </section>
    );
}
