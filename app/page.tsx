'use client';

import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import DashboardPreviewSection from '@/components/landing/DashboardPreviewSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-500">

      {/* ── Sticky Navigation ── */}
      <Header />

      {/* ── Page Sections ── */}
      <main>
        <HeroSection />
        <div id="features" className="scroll-mt-20 px-6 sm:px-0">
          <FeaturesSection />
        </div>
        <div id="how-it-works" className="scroll-mt-20 px-6 sm:px-0">
          <HowItWorksSection />
        </div>
        <DashboardPreviewSection />
        <BenefitsSection />
        <TestimonialsSection />
        <div id="pricing" className="scroll-mt-20 px-6 sm:px-0">
          <PricingSection />
        </div>
        <div id="faq" className="scroll-mt-20 px-6 sm:px-0">
          <FAQSection />
        </div>
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
