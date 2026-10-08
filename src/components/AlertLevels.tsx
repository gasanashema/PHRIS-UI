import { motion } from 'framer-motion';
export function AlertLevels() {
  const alerts = [
  {
    bgClass: 'bg-[#F0FDF4]',
    borderClass: 'border-l-[#16A34A]',
    title: '🟢 GREEN — Normal',
    desc: 'Cases within expected range. Routine monitoring continues. No intervention required.'
  },
  {
    bgClass: 'bg-[#FEFCE8]',
    borderClass: 'border-l-[#EAB308]',
    title: '🟡 YELLOW — Watch',
    desc: 'Cases slightly rising. Monitor closely. Prepare resources for possible response.'
  },
  {
    bgClass: 'bg-[#FFFBEB]',
    borderClass: 'border-l-[#F59E0B]',
    title: '🟠 ORANGE — Alert',
    desc: 'Cases crossing safe threshold. Take action soon. Deploy response team.'
  },
  {
    bgClass: 'bg-[#FEF2F2]',
    borderClass: 'border-l-[#DC2626]',
    title: '🔴 RED — Emergency',
    desc: 'Outbreak confirmed or imminent. Immediate response required. Escalate to national level.'
  }];

  return (
    <section id="alerts" className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[13px] font-medium text-primary uppercase tracking-wider mb-2 block">
            Early Warning System
          </span>
          <h2 className="text-[36px] font-bold text-text-primary">
            Four Alert Levels. One Clear Response.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {alerts.map((alert, index) =>
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
              delay: index * 0.1
            }}
            className={`p-6 rounded-r-xl border border-border border-l-4 ${alert.borderClass} ${alert.bgClass}`}>
            
              <h3 className="text-[18px] font-bold text-text-primary mb-2">
                {alert.title}
              </h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                {alert.desc}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}