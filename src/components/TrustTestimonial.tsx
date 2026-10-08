import { Map } from 'lucide-react';
import { motion } from 'framer-motion';
export function TrustTestimonial() {
  return (
    <section id="trust" className="bg-primary-dark w-full overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[600px]">
        <div className="relative h-[400px] lg:h-auto">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Public health professionals reviewing data dashboards"
            className="absolute inset-0 w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-primary-dark/20 mix-blend-multiply" />
        </div>

        <div className="flex flex-col justify-center p-10 lg:p-20">
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
              duration: 0.6
            }}>
            
            <span className="text-[13px] font-medium text-primary uppercase tracking-wider mb-6 block">
              Built for Rwanda
            </span>

            <h2 className="text-[32px] lg:text-[40px] font-bold text-white leading-tight mb-10">
              "Population health intelligence that connects every hospital,
              every health center, and every community health worker into one
              unified platform."
            </h2>

            <div className="mb-10 opacity-20">
              <Map className="w-24 h-24 text-white" />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="px-4 py-2 border border-white/30 rounded text-white font-bold text-sm tracking-wide">
                RBC
              </div>
              <div className="px-4 py-2 border border-white/30 rounded text-white font-bold text-sm tracking-wide">
                Ministry of Health
              </div>
              <div className="px-4 py-2 border border-white/30 rounded text-white font-bold text-sm tracking-wide">
                WHO Rwanda
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}