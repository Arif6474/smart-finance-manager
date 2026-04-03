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
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-500">
      {/* Sticky Landing Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 dark:bg-card/60 backdrop-blur-2xl border-b border-border h-16 flex items-center px-4 sm:px-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/20">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
              SmartFinance
            </span>
          </Link>
          <div className="flex gap-2 sm:gap-3 items-center">
            <Link href="/login" className="px-4 py-2 font-medium text-muted-foreground hover:text-foreground transition-colors text-sm">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary px-4 py-2 text-sm">
              Sign Up
            </Link>
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
