import {
  Shield,
  Stethoscope,
  Building,
  LineChart } from
'lucide-react';
import { motion } from 'framer-motion';
export function UserRoles() {
  const roles = [
  {
    icon: Shield,
    title: 'Administrator',
    orgs: 'RBC, Ministry of Health',
    desc: 'Manages users, monitors system, configures alerts'
  },
  {
    icon: Stethoscope,
    title: 'Epidemiologist',
    orgs: 'RBC, Ministry of Health',
    desc: 'Investigates outbreaks, analyzes disease patterns nationally'
  },
  {
    icon: Building,
    title: 'District Health Officer',
    orgs: '30 District Health Offices',
    desc: 'Monitors their district, responds to local alerts'
  },
  {
    icon: LineChart,
    title: 'Public Health Analyst',
    orgs: 'RBC, NISR',
    desc: 'Analyzes data, validates AI predictions, generates insights'
  }];

  return (
    <section id="roles" className="py-20 bg-section">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[13px] font-medium text-primary uppercase tracking-wider mb-2 block">
            Designed For
          </span>
          <h2 className="text-[36px] font-bold text-text-primary">
            Built for Every Level of Rwanda's Health System
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
          {roles.map((role, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.4,
              delay: index * 0.1
            }}
            className="flex-1 min-w-[260px] bg-white p-6 rounded-xl shadow-sm border border-border">
            
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <role.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-[18px] font-bold text-text-primary mb-1">
                {role.title}
              </h3>
              <p className="text-[13px] font-medium text-text-secondary mb-3">
                {role.orgs}
              </p>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                {role.desc}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}