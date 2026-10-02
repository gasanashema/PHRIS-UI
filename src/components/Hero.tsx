import {
  Play,
  MapPin,
  AlertTriangle,
  Activity,
  CheckCircle2 } from
'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const chartData = [
{
  name: 'Mon',
  cases: 12
},
{
  name: 'Tue',
  cases: 19
},
{
  name: 'Wed',
  cases: 15
},
{
  name: 'Thu',
  cases: 25
},
{
  name: 'Fri',
  cases: 22
},
{
  name: 'Sat',
  cases: 30
},
{
  name: 'Sun',
  cases: 28
}];

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-b from-page to-section overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6
          }}
          className="max-w-2xl">
          
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[13px] font-medium text-primary uppercase tracking-wider">
              AI-Powered Public Health Intelligence
            </span>
          </div>

          <h1 className="text-[56px] font-extrabold text-text-primary leading-[1.1] mb-6">
            Detect Health Crises Before They Happen
          </h1>

          <p className="text-[20px] text-text-secondary leading-relaxed mb-10">
            Rwanda's first AI-driven population health risk platform —
            connecting hospital data, community health workers, and
            environmental signals to protect 14 million Rwandans.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              to="/register"
              className="h-14 px-8 text-[16px] font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center transform hover:-translate-y-0.5">
              
              Request System Access
            </Link>
            <a
              href="#how"
              className="h-14 px-8 text-[16px] font-medium text-primary border-2 border-primary/20 hover:border-primary rounded-lg hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
              
              <Play className="w-4 h-4" />
              Watch How It Works
            </a>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-[14px] font-medium text-text-secondary mb-4">
              Designed for RBC · Ministry of Health · District Health Offices ·
              WHO Rwanda
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-border text-[13px] font-medium text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                30 Districts Monitored
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-border text-[13px] font-medium text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                45,000+ CHW Data Points
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-border text-[13px] font-medium text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Real-time AI Predictions
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.6,
            delay: 0.2
          }}
          className="relative">
          
          <div className="absolute inset-0 bg-primary/10 rounded-[40px] blur-3xl transform rotate-3 scale-105" />

          <div className="relative bg-white rounded-xl shadow-floating hover:shadow-2xl transition-shadow duration-500 border border-border p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-text-primary">National Overview</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-alert-orange/10 text-alert-orange rounded-full text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-alert-orange animate-pulse" />
                MODERATE RISK
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-page rounded-lg p-4 flex flex-col items-center justify-center border border-border min-h-[160px] relative overflow-hidden hover:border-primary/30 transition-colors group cursor-default">
                <MapPin className="w-12 h-12 text-border group-hover:text-primary/20 transition-colors mb-2" />
                <span className="text-sm text-text-secondary">
                  Rwanda Risk Map
                </span>
                <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-alert-red shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse" />
                <div
                  className="absolute top-1/2 right-1/3 w-3 h-3 rounded-full bg-alert-orange shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"
                  style={{
                    animationDelay: '0.5s'
                  }} />
                
                <div
                  className="absolute bottom-1/3 left-1/2 w-3 h-3 rounded-full bg-alert-yellow shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse"
                  style={{
                    animationDelay: '1s'
                  }} />
                
                <div
                  className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-alert-green shadow-[0_0_10px_rgba(22,163,74,0.5)] animate-pulse"
                  style={{
                    animationDelay: '1.5s'
                  }} />
                
              </div>

              <div className="bg-page rounded-lg p-4 border border-border flex flex-col hover:border-primary/30 transition-colors cursor-default">
                <span className="text-xs font-medium text-text-secondary mb-2">
                  Weekly Disease Trends
                </span>
                <div className="flex-1 min-h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Tooltip
                        cursor={{
                          fill: 'transparent'
                        }}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} />
                      
                      <Bar
                        dataKey="cases"
                        fill="#0D9488"
                        radius={[4, 4, 0, 0]} />
                      
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-alert-red/20 bg-alert-red/5">
                <AlertTriangle className="w-5 h-5 text-alert-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-text-primary">
                    Cholera Alert — Rusizi
                  </h4>
                  <p className="text-xs text-text-secondary mt-1">
                    Cases exceeded threshold by 45% in last 48h.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-alert-orange/20 bg-alert-orange/5">
                <Activity className="w-5 h-5 text-alert-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-text-primary">
                    Malaria Warning — Kayonza
                  </h4>
                  <p className="text-xs text-text-secondary mt-1">
                    AI predicts 80% probability of outbreak next week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}