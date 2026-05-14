import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function EventFilter({ active, onFilter, events = [] }) {
  const barRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(barRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.5 }
    );
  }, []);

  const categories = ['all', 'hackathon', 'competition', 'workshop', 'outreach', 'online', 'talk'];

  const getCount = (cat) => {
    if (cat === 'all') return events.length;
    return events.filter(e => e.category === cat).length;
  };

  return (
    <div ref={barRef} className="sticky top-[72px] z-[100] w-full border-b border-[#00D4FF]/10 backdrop-blur-md bg-[#050A14]/80 py-4">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                active === cat 
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white shadow-[0_0_15px_rgba(0,212,255,0.4)] border border-transparent' 
                  : 'bg-transparent text-gray-400 border border-gray-700 hover:border-[#00D4FF]/50 hover:text-white'
              }`}
            >
              <span className="capitalize">{cat}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${active === cat ? 'bg-white/20' : 'bg-gray-800'}`}>
                {getCount(cat)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
