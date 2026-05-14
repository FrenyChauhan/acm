import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { format } from 'date-fns';

const categoryColors = {
  hackathon:   { bg: 'rgba(220,38,38,0.15)',  border: '#DC2626', text: '#FCA5A5' },
  competition: { bg: 'rgba(37,99,235,0.15)',  border: '#2563EB', text: '#93C5FD' },
  workshop:    { bg: 'rgba(124,58,237,0.15)', border: '#7C3AED', text: '#C4B5FD' },
  outreach:    { bg: 'rgba(5,150,105,0.15)',  border: '#059669', text: '#6EE7B7' },
  online:      { bg: 'rgba(217,119,6,0.15)',  border: '#D97706', text: '#FCD34D' },
  talk:        { bg: 'rgba(14,165,233,0.15)', border: '#0EA5E9', text: '#7DD3FC' },
};

export default function EventCard({ event, onOpen }) {
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (cardRef.current) {
      VanillaTilt.init(cardRef.current, {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
      });
    }
  }, []);

  const catColors = categoryColors[event.category] || categoryColors.talk;
  const dateStr = event.startDate ? format(new Date(event.startDate), 'd MMM yyyy') : '';

  return (
    <div ref={cardRef} className="glass-card h-full flex flex-col relative overflow-hidden group cursor-pointer" onClick={() => onOpen(event)}>
      {event.achievement && (
        <div className="absolute inset-0 border-2 border-yellow-500/50 rounded-[20px] pointer-events-none animate-pulse"></div>
      )}
      
      <div 
        className="w-full h-20 relative flex p-4 justify-between items-start"
        style={{ background: event.bannerGradient || 'linear-gradient(135deg, #333, #111)' }}
      >
        {event.edition && (
          <div className="absolute bottom-[-15px] left-4 bg-[#050A14] text-white border border-gray-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 shadow-lg">
            {event.edition}
          </div>
        )}
        <div className="ml-auto flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ backgroundColor: catColors.bg, color: catColors.text, border: `1px solid ${catColors.border}` }}>
          {event.category}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col mt-2">
        {event.achievement && (
          <div className="text-yellow-500 text-xs font-bold mb-2 flex items-center gap-1">
            <span>🏆</span> {event.achievement}
          </div>
        )}
        
        <h3 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-2 group-hover:text-[#00D4FF] transition-colors line-clamp-1">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-lg">📅</span> {dateStr}
          </div>
          <div className="flex items-center gap-1 truncate">
            <span className="text-lg">📍</span> <span className="truncate">{event.venue || 'TBA'}</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
          {event.description}
        </p>

        <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
          <div className="flex gap-2">
            {event.tags && event.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                #{tag}
              </span>
            ))}
            {event.tags && event.tags.length > 2 && (
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                +{event.tags.length - 2}
              </span>
            )}
          </div>
          <button className="text-sm font-semibold text-[#00D4FF] group-hover:underline">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
