import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { StatsBar } from '../components/StatsBar';
import { AIIndicatorsSection } from '../components/AIIndicatorsSection';
import { HowItWorks } from '../components/HowItWorks';
import { AlertLevels } from '../components/AlertLevels';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-text-secondary selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <AIIndicatorsSection />
        <HowItWorks />
        <AlertLevels />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}