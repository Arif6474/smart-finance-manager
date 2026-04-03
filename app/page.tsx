import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import DashboardPreviewSection from '@/components/landing/DashboardPreviewSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            SmartFinance
          </h2>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="px-4 py-2 font-medium hover:text-primary transition-colors text-sm sm:text-base">Log In</Link>
            <Link href="/signup" className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors text-sm sm:text-base">Sign Up</Link>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        <DashboardPreviewSection />
        <FeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        <TestimonialsSection />
        <PricingSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
