import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { StatsBar } from '../components/StatsBar';
import { ProblemSection } from '../components/ProblemSection';
import { HowItWorks } from '../components/HowItWorks';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { UserRoles } from '../components/UserRoles';
import { TrustTestimonial } from '../components/TrustTestimonial';
import { AlertLevels } from '../components/AlertLevels';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
export function LandingPage() {
  return (
    <div className="min-h-screen bg-page font-sans text-text-secondary">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <ProblemSection />
        <HowItWorks />
        <FeaturesGrid />
        <UserRoles />
        <TrustTestimonial />
        <AlertLevels />
        <CTASection />
      </main>
      <Footer />
    </div>);

}