import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Code, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FlagshipEvent({ events, onOpen }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const panels = sectionRef.current.querySelectorAll('.flagship-row');
    panels.forEach((panel) => {
      const left = panel.querySelector('.flagship-left');
      const right = panel.querySelector('.flagship-right');
      
      gsap.fromTo(left, 
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: panel, start: 'top 80%' } }
      );
      gsap.fromTo(right, 
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: panel, start: 'top 80%' } }
      );
    });
  }, [events]);

  const getIcon = (cat) => {
    if(cat === 'hackathon') return <Zap size={80} className="text-white/20" />;
    if(cat === 'competition') return <Code size={80} className="text-white/20" />;
    return <BookOpen size={80} className="text-white/20" />;
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#050A14]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-['Space_Grotesk'] font-bold gradient-text inline-block relative">
            Our Flagship Events
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#00D4FF]"></span>
          </h2>
        </div>

        <div className="flex flex-col gap-12">
          {events.map((event, i) => (
            <div key={event._id || i} className={`flagship-row flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}>
              
              <div className="flagship-left w-full lg:w-1/2 h-[400px] rounded-[32px] p-1 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/20 to-[#0066FF]/20 animate-pulse"></div>
                <div 
                  className="w-full h-full rounded-[30px] flex items-center justify-center relative overflow-hidden"
                  style={{ background: event.bannerGradient || 'linear-gradient(135deg, #1E3A8A, #2563EB)' }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 font-bold whitespace-nowrap" style={{ fontSize: 'clamp(3rem, 6vw, 7rem)', fontFamily: 'Space Grotesk' }}>
                    {event.title.toUpperCase()}
                  </div>
                  {getIcon(event.category)}
                  {/* Abstract circles */}
                  <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-2xl"></div>
                  <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-black/20 blur-3xl"></div>
                </div>
              </div>

              <div className="flagship-right w-full lg:w-1/2 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#00D4FF]">
                    {event.category}
                  </span>
                  {event.edition && (
                    <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-white">
                      {event.edition}
                    </span>
                  )}
                </div>
                
                <h3 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold text-white">
                  {event.title}
                </h3>
                
                <p className="text-gray-400 text-lg leading-relaxed">
                  {event.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  {event.stats && event.stats.slice(0,3).map((stat, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button onClick={() => onOpen(event)} className="px-8 py-3 rounded-full border border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-[#050A14] transition-colors font-bold">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
