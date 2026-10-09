import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Clear, concise project explanation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1  text-xs font-semibold text-primary uppercase tracking-wider mb-6">
            &nbsp;
          </div>

          <h1 className="text-[44px] sm:text-[54px] font-extrabold text-text-primary leading-[1.1] tracking-tight mb-6">
            Detect Health Crises <br className="hidden sm:inline" />
            Before They Happen
          </h1>

          <p className="text-[18px] sm:text-[20px] text-text-secondary leading-relaxed mb-8">
            Rwanda's national AI platform connecting hospital records, 45,000 community health workers, and environmental signals to predict disease outbreaks before symptoms spread.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              to="/register"
              className="h-12 px-6 text-[15px] font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center shadow-xs"
            >
              Request Access
            </Link>
            <a
              href="#indicators"
              className="h-12 px-6 text-[15px] font-semibold text-text-primary border border-border hover:bg-section rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              View AI Indicators
              <ArrowRight className="w-4 h-4 text-primary" />
            </a>
          </div>

          <div className="pt-6 border-t border-border flex flex-wrap items-center gap-6 text-xs text-text-secondary">
            <span className="font-semibold text-text-primary">Operationalized for:</span>
            <span>Rwanda Biomedical Centre (RBC)</span>
            <span>·</span>
            <span>Ministry of Health</span>
            <span>·</span>
            <span>WHO Rwanda</span>
          </div>
        </motion.div>

        {/* Right Column: High quality photograph with minimal indicator overlays */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Public health professional analyzing digital surveillance data"
              className="w-full h-[420px] object-cover"
            />

            {/* Top Indicator Overlay Chip */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xs flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-alert-orange animate-pulse" />
              <div>
                <span className="text-[11px] font-bold text-text-primary block leading-tight">
                  Alerts in real time
                </span>
                <span className="text-[10px] text-text-secondary font-mono">
                  AI Probability: 87.4%
                </span>
              </div>
            </div>

            {/* Bottom Indicator Overlay Chip */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-text-primary mb-1">
                <span>Nationwide Telemetry</span>
                <span className="text-primary font-mono text-[11px]">30 Districts Active</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-snug">
                Ingesting signals from 45,000+ community health workers and national hospital laboratories.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}