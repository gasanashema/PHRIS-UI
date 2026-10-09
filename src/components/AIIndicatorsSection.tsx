import { BrainCircuit, TrendingUp, Users, CloudRain, Building2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export function AIIndicatorsSection() {
  const indicators = [
    {
      code: 'IND-01',
      name: 'Outbreak Probability Index',
      stat: '87.4%',
      status: 'Critical Alert',
      dot: 'bg-alert-red',
      badge: 'bg-red-50 text-alert-red border-red-200',
      icon: TrendingUp,
      desc: 'Predicts the likelihood of a disease outbreak up to 14 days in advance for each of Rwanda’s 30 districts.'
    },
    {
      code: 'IND-02',
      name: 'Transmission Velocity (R_t)',
      stat: '1.28',
      status: 'High Alert',
      dot: 'bg-alert-orange',
      badge: 'bg-amber-50 text-alert-orange border-amber-200',
      icon: BrainCircuit,
      desc: 'Calculates the real-time spread rate per infected case to detect active community transmission chains early.'
    },
    {
      code: 'IND-03',
      name: 'Community Health Worker Signals',
      stat: '+42.3%',
      status: 'Early Signal',
      dot: 'bg-alert-orange',
      badge: 'bg-amber-50 text-alert-orange border-amber-200',
      icon: Users,
      desc: 'Clusters symptom reports from 45,000 community health workers to catch outbreaks days before hospital visits.'
    },
    {
      code: 'IND-04',
      name: 'Vector & Climate Risk',
      stat: '1.46x',
      status: 'Elevated Watch',
      dot: 'bg-alert-yellow',
      badge: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      icon: CloudRain,
      desc: 'Correlates satellite rainfall and temperature data with mosquito breeding cycles to forecast malaria surges.'
    },
    {
      code: 'IND-05',
      name: 'Healthcare Facility Stress',
      stat: '88.5%',
      status: 'Capacity Alert',
      dot: 'bg-alert-orange',
      badge: 'bg-amber-50 text-alert-orange border-amber-200',
      icon: Building2,
      desc: 'Forecasts hospital bed occupancy and essential medicine stockouts before health facilities become overwhelmed.'
    },
    {
      code: 'IND-06',
      name: 'Population Vulnerability Index',
      stat: '72.1 / 100',
      status: 'Targeted Focus',
      dot: 'bg-primary',
      badge: 'bg-section text-primary border-primary/20',
      icon: ShieldAlert,
      desc: 'Combines census, nutrition, and clean water data to identify communities at the highest risk during an epidemic.'
    }
  ];

  return (
    <section id="indicators" className="py-20 bg-section/40 border-b border-border">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
            Algorithmic Intelligence
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-extrabold text-text-primary tracking-tight leading-tight">
            AI-Designed Health Indicators
          </h2>
          <p className="text-[16px] text-text-secondary mt-2 leading-relaxed">
            Continuously computed in real time to give health leaders clear, actionable foresight.
          </p>
        </div>

        {/* Concise Indicators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indicators.map((ind, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white p-6 rounded-xl border border-border shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-section flex items-center justify-center text-primary">
                    <ind.icon className="w-5 h-5" />
                  </div>
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${ind.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ind.dot}`} />
                    {ind.status}
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-mono text-text-secondary uppercase">
                    {ind.code}
                  </span>
                  <h3 className="text-[17px] font-bold text-text-primary mt-0.5">
                    {ind.name}
                  </h3>
                </div>

                <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
                  {ind.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-text-secondary">Current National Level:</span>
                <span className="font-mono text-sm font-bold text-text-primary">{ind.stat}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
