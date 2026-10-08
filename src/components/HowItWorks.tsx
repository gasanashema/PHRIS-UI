import { Database, BrainCircuit, BellRing, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
export function HowItWorks() {
  const steps = [
  {
    num: '01',
    icon: Database,
    title: 'Collect',
    desc: "The system automatically pulls health data from DHIS2, RBC Laboratory, 45,000 community health workers, NISR census data, and Rwanda's meteorological agency — every hour, without manual work."
  },
  {
    num: '02',
    icon: BrainCircuit,
    title: 'Analyze',
    desc: 'AI models process all incoming data, calculate disease spread rates (R0), identify vulnerable populations, and generate risk scores from 0 to 100 for every district across Rwanda.'
  },
  {
    num: '03',
    icon: BellRing,
    title: 'Warn & Act',
    desc: 'Color-coded alerts (green/yellow/orange/red) are automatically sent to the right health authorities with recommended actions — before the situation becomes a crisis.'
  }];

  return (
    <section id="how" className="py-20 bg-section">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[13px] font-medium text-primary uppercase tracking-wider mb-2 block">
            How It Works
          </span>
          <h2 className="text-[36px] font-bold text-text-primary">
            From Raw Data to Life-Saving Decisions in Real Time
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-[2px] bg-border z-0" />

          {steps.map((step, index) =>
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
              duration: 0.5,
              delay: index * 0.2
            }}
            className="relative z-10 flex flex-col items-center text-center">
            
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center mb-6 relative">
                <step.icon className="w-8 h-8 text-primary" />
                {index < 2 &&
              <div className="hidden md:flex absolute -right-[calc(50%+1rem)] top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border border-border items-center justify-center z-20">
                    <ArrowRight className="w-4 h-4 text-text-secondary" />
                  </div>
              }
              </div>

              <span className="text-[48px] font-extrabold text-primary/20 leading-none mb-2">
                {step.num}
              </span>

              <h3 className="text-[20px] font-bold text-text-primary mb-3">
                {step.title}
              </h3>

              <p className="text-[15px] text-text-secondary leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}