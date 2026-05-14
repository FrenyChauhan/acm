import React from 'react';
import useCountUp from '../../hooks/useCountUp';

export default function EventStats() {
  const c1 = useCountUp("8+", 2);
  const c2 = useCountUp("500+", 2);
  const c3 = useCountUp("40", 2);
  const c4 = useCountUp("3000+", 2);
  const c5 = useCountUp("30", 2);

  const stats = [
    { ref: c1, label: "Events Per Year" },
    { ref: c2, label: "Students Reached" },
    { ref: c3, label: "Hackathon Teams" },
    { ref: c4, label: "Prize Money (₹)" },
    { ref: c5, label: "Days — Summer Challenge" }
  ];

  return (
    <section className="py-20 border-y border-[#00D4FF]/10 bg-[#0A1628]/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div ref={stat.ref} className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold text-white mb-2">0</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
