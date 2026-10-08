export function StatsBar() {
  const stats = [
  {
    value: '14M+',
    label: 'Rwandans Protected'
  },
  {
    value: '30',
    label: 'Districts Covered'
  },
  {
    value: '45,000+',
    label: 'Community Health Workers'
  },
  {
    value: '87%',
    label: 'AI Prediction Accuracy'
  }];

  return (
    <section className="bg-primary-dark w-full py-6 md:py-0 md:h-20">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between divide-y md:divide-y-0 md:divide-x divide-white/20">
        {stats.map((s, i) =>
        <div
          key={i}
          className="flex flex-col items-center justify-center flex-1 py-4 md:py-0 w-full">
          
            <span className="text-[32px] font-bold text-white leading-tight">
              {s.value}
            </span>
            <span className="text-[14px] text-white/80">{s.label}</span>
          </div>
        )}
      </div>
    </section>);

}