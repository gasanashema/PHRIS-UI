import { Database, BrainCircuit, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: Database,
      title: 'Automated Ingestion',
      desc: 'Connects directly with hospital DHIS2 records, laboratory feeds, 45,000 community health workers, and weather stations.'
    },
    {
      num: '02',
      icon: BrainCircuit,
      title: 'AI Risk Modeling',
      desc: 'Machine learning algorithms calculate outbreak probabilities, spread rates, and vulnerability scores for all 30 districts.'
    },
    {
      num: '03',
      icon: BellRing,
      title: 'Decisive Early Warning',
      desc: 'Dispatches color-coded alerts and tailored response actions to national and district health officers before crises expand.'
    }
  ];

  return (
    <section id="how" className="py-20 bg-white border-b border-border">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
            System Workflow
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-extrabold text-text-primary tracking-tight leading-tight">
            How AI Vital Works
          </h2>
          <p className="text-[16px] text-text-secondary mt-2">
            A three-step loop turning raw national health signals into immediate preventive action.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.1 }}
              className="bg-section/30 p-7 rounded-xl border border-border flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-lg bg-white border border-border flex items-center justify-center text-primary mb-5">
                <step.icon className="w-6 h-6" />
              </div>

              <span className="font-mono text-xs font-bold text-primary mb-1">
                STEP {step.num}
              </span>

              <h3 className="text-[18px] font-bold text-text-primary mb-2">
                {step.title}
              </h3>

              <p className="text-[14px] text-text-secondary leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}