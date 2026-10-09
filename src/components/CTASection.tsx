import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section id="cta" className="py-20 bg-primary text-white border-t border-primary-dark">
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-[32px] sm:text-[40px] font-extrabold text-white leading-tight mb-4 tracking-tight">
            Protecting Population Health With Actionable AI
          </h2>

          <p className="text-[17px] text-white/90 mb-8 leading-relaxed">
            Designed for the Ministry of Health, RBC, and District Health Offices to monitor and respond to health emergencies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="h-12 px-7 text-[15px] font-semibold text-primary bg-white rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center shadow-xs"
            >
              Request System Access
            </Link>
            <a
              href="#indicators"
              className="h-12 px-7 text-[15px] font-semibold text-white border border-white/40 hover:border-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Explore AI Indicators
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}