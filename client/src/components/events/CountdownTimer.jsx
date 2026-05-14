import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff < 0) {
        clearInterval(interval);
        setExpired(true);
        return;
      }
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      
      setTimeLeft({ d, h, m, s });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);

  if (expired) return <div className="text-[#00D4FF] font-bold text-xl">Event Started!</div>;

  return (
    <div className="flex items-center gap-2 md:gap-4 text-center font-['Space_Grotesk']">
      {Object.entries(timeLeft).map(([unit, val]) => (
        <div key={unit} className="flex flex-col">
          <div className="bg-black/50 text-white text-2xl md:text-4xl font-bold px-3 py-2 rounded-lg border border-white/10 w-[50px] md:w-[70px]">
            {val}
          </div>
          <div className="text-[10px] uppercase text-gray-500 mt-1">{unit}</div>
        </div>
      ))}
    </div>
  );
}
