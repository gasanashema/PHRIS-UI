export function StatsBar() {
  const stats = [
    {
      value: '14M+',
      label: 'Rwandans Protected'
    },
    {
      value: '30',
      label: 'Districts Monitored'
    },
    {
      value: '45,000+',
      label: 'Community Health Workers'
    },
    {
      value: '87%',
      label: 'AI Forecast Precision'
    }
  ];

  return (
    <section className="bg-primary-dark w-full py-6 md:py-0 md:h-20 border-y border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between divide-y md:divide-y-0 md:divide-x divide-white/15">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center flex-1 py-3 md:py-0 w-full"
          >
            <span className="text-[28px] md:text-[32px] font-bold text-white leading-tight font-mono">
              {s.value}
            </span>
            <span className="text-[13px] text-white/80 font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}