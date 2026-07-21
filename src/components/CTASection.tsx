import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
export function CTASection() {
  return (
    <section
      id="cta"
      className="py-24 bg-gradient-to-b from-section to-[#D1FAE5]">
      
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.6
          }}
          className="max-w-3xl mx-auto">
          
          <h2 className="text-[40px] font-extrabold text-text-primary leading-tight mb-6">
            Rwanda's Health Authorities Deserve Better Tools
          </h2>

          <p className="text-[20px] text-text-secondary mb-10">
            Join the institutions already benefiting from real-time population
            health intelligence. Request access today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="h-14 px-8 text-[16px] font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center transform hover:-translate-y-0.5">
              
              Request System Access
            </Link>
            <a
              href="#features"
              className="h-14 px-8 text-[16px] font-medium text-primary border-2 border-primary/20 hover:border-primary rounded-lg hover:bg-white/50 transition-all flex items-center justify-center">
              
              Explore Features
            </a>
          </div>

          <div className="pt-10 border-t border-primary/20">
            <p className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-6">
              Trusted by Rwanda's Leading Health Institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <span className="text-xl font-bold text-text-primary/70">
                RBC
              </span>
              <span className="text-xl font-bold text-text-primary/70">
                NISR
              </span>
              <span className="text-xl font-bold text-text-primary/70">
                Ministry of Health
              </span>
              <span className="text-xl font-bold text-text-primary/70">
                WHO
              </span>
              <span className="text-xl font-bold text-text-primary/70">
                UNICEF Rwanda
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}