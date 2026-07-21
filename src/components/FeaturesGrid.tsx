import React from 'react';
import {
  Brain,
  Bell,
  Map,
  Activity,
  Users,
  Target,
  CloudRain,
  FileText,
  Building2 } from
'lucide-react';
import { motion } from 'framer-motion';
export function FeaturesGrid() {
  const features = [
  {
    icon: Brain,
    title: 'AI Risk Prediction',
    desc: 'Outbreak probability scores for all 30 districts, updated every 2 hours with confidence intervals.'
  },
  {
    icon: Bell,
    title: 'Early Warning Alerts',
    desc: 'Four-level color-coded alerts sent via email and SMS to the right authority automatically.'
  },
  {
    icon: Map,
    title: 'Live Health Maps',
    desc: 'Interactive Rwanda map showing disease hotspots, facility locations, and risk zones in real time.'
  },
  {
    icon: Activity,
    title: 'Disease Surveillance',
    desc: 'Real-time tracking of 15+ notifiable diseases with epidemic curve generation.'
  },
  {
    icon: Users,
    title: 'Vulnerable Population Finder',
    desc: 'AI identifies high-risk groups — children, elderly, refugees — before they get sick.'
  },
  {
    icon: Target,
    title: 'Program Performance',
    desc: 'Track vaccination, malaria, maternal health, and HIV program coverage against national targets.'
  },
  {
    icon: CloudRain,
    title: 'Environmental Intelligence',
    desc: 'Correlate rainfall, water quality, and poverty with disease outbreaks automatically.'
  },
  {
    icon: FileText,
    title: 'Automated Reports',
    desc: 'Weekly epidemiological bulletins generated in 15 minutes instead of 3 days.'
  },
  {
    icon: Building2,
    title: 'Healthcare Capacity Monitor',
    desc: 'Track medicines, beds, and staff availability across all Rwanda health facilities.'
  }];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[13px] font-medium text-primary uppercase tracking-wider mb-2 block">
            Platform Features
          </span>
          <h2 className="text-[36px] font-bold text-text-primary">
            Everything Rwanda's Health System Needs
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) =>
          <motion.div
            key={index}
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
              duration: 0.4,
              delay: index % 3 * 0.1
            }}
            className="group bg-white p-6 rounded-xl border border-border hover:shadow-floating transition-all duration-300 relative overflow-hidden">
            
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <feature.icon className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-[17px] font-bold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}