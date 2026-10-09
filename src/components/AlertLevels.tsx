import { motion } from 'framer-motion';

export function AlertLevels() {
  const alerts = [
    {
      level: 'GREEN',
      label: 'Normal Baseline',
      colorDot: 'bg-alert-green',
      border: 'border-l-alert-green',
      desc: 'Disease incidence within expected thresholds. Automated hourly data ingestion continues across all 30 districts.'
    },
    {
      level: 'YELLOW',
      label: 'Watch Phase',
      colorDot: 'bg-alert-yellow',
      border: 'border-l-alert-yellow',
      desc: 'Early warning signals detected. Environmental factors or community worker reports show localized rise in symptoms.'
    },
    {
      level: 'ORANGE',
      label: 'High Alert',
      colorDot: 'bg-alert-orange',
      border: 'border-l-alert-orange',
      desc: 'Cases crossing safety thresholds. Response teams alerted to prepare supplies, diagnostic tests, and local personnel.'
    },
    {
      level: 'RED',
      label: 'Critical Emergency',
      colorDot: 'bg-alert-red',
      border: 'border-l-alert-red',
      desc: 'Outbreak confirmed or imminent. Immediate national escalation to RBC and Ministry of Health for containment.'
    }
  ];

  return (
    <section id="alerts" className="py-20 bg-section/40 border-b border-border">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
            Response Matrix
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-extrabold text-text-primary tracking-tight leading-tight">
            Four Alert Levels. One Clear Response.
          </h2>
          <p className="text-[16px] text-text-secondary mt-2">
            Automated thresholds guide rapid decision-making across Rwanda's health network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-6 bg-white rounded-r-xl border border-border border-l-4 ${alert.border} shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${alert.colorDot}`} />
                  <span className="text-sm font-bold text-text-primary">
                    {alert.label}
                  </span>
                </div>

                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {alert.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}