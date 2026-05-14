import React from 'react';
import CountdownTimer from './CountdownTimer';

export default function UpcomingEvents() {
  const upcoming = [
    { title: "DotSlash 7.0", date: "2024-02-15T09:00:00Z" },
    { title: "Epiphany 13.0", date: "2024-01-20T14:00:00Z" },
    { title: "Inception 9.0", date: "2024-10-15T10:00:00Z" }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-['Space_Grotesk'] font-bold text-white">Coming Soon</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcoming.map((ev, i) => (
            <div key={i} className="glass-card relative overflow-hidden p-8 flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
              <div className="absolute top-4 right-[-30px] bg-[#00D4FF] text-black text-xs font-bold px-10 py-1 rotate-45">
                COMING SOON
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 mt-4">{ev.title}</h3>
              <CountdownTimer targetDate={ev.date} />
              <button className="mt-8 px-6 py-2 border border-white/20 rounded-full text-gray-300 hover:bg-white hover:text-black transition-colors text-sm font-bold w-full">
                Register Interest
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
