import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { format } from 'date-fns';

gsap.registerPlugin(ScrollTrigger);

export default function EventTimeline({ events }) {
  const lineRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!events.length) return;
    
    // Line draw animation
    if (lineRef.current) {
      const length = lineRef.current.getTotalLength();
      gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
      
      gsap.to(lineRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1
        }
      });
    }

    // Node animations
    const nodes = document.querySelectorAll('.timeline-node');
    nodes.forEach(node => {
      gsap.fromTo(node,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: node, start: 'top 75%' }
        }
      );
    });
  }, [events]);

  if (!events.length) return null;
  const sortedEvents = [...events].sort((a,b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <section className="py-24 bg-[#050A14] relative" ref={containerRef}>
      <div className="text-center mb-16">
        <h2 className="text-4xl font-['Space_Grotesk'] font-bold text-white">A Year in Events</h2>
      </div>

      <div className="container mx-auto px-4 relative max-w-5xl">
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
           <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 4 1000">
             <line x1="2" y1="0" x2="2" y2="1000" stroke="rgba(0,212,255,0.2)" strokeWidth="4" strokeDasharray="10 10" />
             <line ref={lineRef} x1="2" y1="0" x2="2" y2="1000" stroke="#00D4FF" strokeWidth="4" />
           </svg>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {sortedEvents.map((event, i) => {
            const isLeft = i % 2 === 0;
            const dateStr = event.startDate ? format(new Date(event.startDate), 'MMM yyyy') : '';
            return (
              <div key={i} className={`flex flex-col md:flex-row items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                
                <div className="w-full md:w-1/2"></div>
                
                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#050A14] border-4 border-[#00D4FF] timeline-node z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-ping absolute"></div>
                </div>
                
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'}`}>
                  <div className="timeline-node opacity-0">
                    <div className="text-sm font-['Space_Grotesk'] text-[#00D4FF] mb-1">{dateStr}</div>
                    <h4 className="text-2xl font-bold text-white hover:text-[#00D4FF] transition-colors inline-block cursor-pointer">
                      {event.title}
                    </h4>
                    <div className={`mt-2 flex items-center gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                      <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 uppercase">{event.category}</span>
                      {event.achievement && <span className="text-yellow-500 text-sm">🌟</span>}
                    </div>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
