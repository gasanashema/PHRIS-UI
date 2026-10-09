import { XCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
export function ProblemSection() {
  const rows = [
    {
      today: 'Outbreaks detected after they start',
      aiVital: 'Risks detected weeks before'
    },
    {
      today: 'Data scattered across systems',
      aiVital: 'All data unified in one platform'
    },
    {
      today: 'Manual reports taking days',
      aiVital: 'Automatic reports in minutes'
    },
    {
      today: 'Reactive response only',
      aiVital: 'Proactive prevention'
    }
  ];

  return (
    <section id="problem" className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="mb-12">
          <span className="text-[13px] font-medium text-primary uppercase tracking-wider mb-2 block">
            The Challenge
          </span>
          <h2 className="text-[36px] font-bold text-text-primary max-w-2xl leading-tight">
            Rwanda's Health Data Exists. The Intelligence Doesn't — Yet.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
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
              duration: 0.5
            }}>

            <p className="text-[16px] text-text-secondary leading-relaxed mb-10">
              Rwanda collects health data daily from hospitals, clinics, and
              45,000 community health workers — but that data sits in separate
              systems that do not talk to each other. By the time a disease
              outbreak is noticed, people are already sick.
            </p>

            <div className="border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 bg-page border-b border-border">
                <div className="p-4 font-bold text-text-primary border-r border-border">
                  Today
                </div>
                <div className="p-4 font-bold text-primary bg-primary/5">
                  With AI Vital
                </div>
              </div>
              {rows.map((row, i) =>
                <div
                  key={i}
                  className={`grid grid-cols-2 divide-x divide-border ${i < rows.length - 1 ? 'border-b border-border' : ''}`}>

                  <div className="p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-alert-red shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">
                      {row.today}
                    </span>
                  </div>
                  <div className="p-4 flex items-start gap-3 bg-primary/5">
                    <CheckCircle2 className="w-5 h-5 text-alert-green shrink-0 mt-0.5" />
                    <span className="text-sm text-text-primary font-medium">
                      {row.aiVital}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="relative">

            <div className="absolute -inset-4 border-2 border-primary/20 rounded-2xl transform translate-x-4 translate-y-4" />
            <img
              src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Community health worker visiting a rural household in Rwanda"
              className="w-full h-auto rounded-xl relative z-10 shadow-lg object-cover aspect-[4/3]" />

          </motion.div>
        </div>
      </div>
    </section>);

}