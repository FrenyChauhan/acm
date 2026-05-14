const fs = require('fs');
const path = require('path');

const files = {
  'src/hooks/useCountUp.js': `import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useCountUp(end, duration = 2) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    // Convert end string to number if needed, ignoring symbols
    const target = parseFloat(end.toString().replace(/[^0-9.-]+/g, ''));
    if (isNaN(target)) {
      el.textContent = end;
      return;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.fromTo(el,
        { textContent: 0 },
        { 
          textContent: target, 
          duration, 
          ease: 'power2.out', 
          snap: { textContent: 1 },
          onUpdate() { 
            // if original had +, keep it
            const prefix = end.toString().replace(/[0-9.,]+.*/, '');
            const suffix = end.toString().replace(/.*[0-9.,]+/, '');
            el.textContent = prefix + Math.round(+el.textContent) + suffix; 
          }
        }
      )
    });
    
    return () => st.kill();
  }, [end, duration]);
  return ref;
}
`,
  'src/pages/Events.jsx': `import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getEvents, getFlagshipEvents } from '../services/eventService';

import EventsHero from '../components/events/EventsHero';
import EventFilter from '../components/events/EventFilter';
import FlagshipEvent from '../components/events/FlagshipEvent';
import EventGrid from '../components/events/EventGrid';
import EventTimeline from '../components/events/EventTimeline';
import EventStats from '../components/events/EventStats';
import UpcomingEvents from '../components/events/UpcomingEvents';
import EventGallery from '../components/events/EventGallery';
import ProposeCTA from '../components/events/ProposeCTA';
import EventModal from '../components/events/EventModal';

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [flagship, setFlagship] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    Promise.all([getEvents(), getFlagshipEvents()]).then(([all, flags]) => {
      setEvents(all || []);
      setFiltered(all || []);
      setFlagship(flags || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleFilter = (category) => {
    setActiveFilter(category);
    const next = category === 'all' ? events : events.filter(e => e.category === category);
    gsap.to('.event-card', { opacity: 0, y: 20, duration: 0.25, stagger: 0.03,
      onComplete: () => {
        setFiltered(next);
        gsap.to('.event-card', { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, delay: 0.05 });
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Events | ACM Student Chapter NIT Surat — Hackathons, Workshops & Competitions</title>
        <meta name="description" content="Explore all events by ACM NIT Surat: DotSlash hackathon, Epiphany coding contest, Inception, Open Source workshop, Hour of Code, SIH Ideathon, Summer Challenge, and CodeWars." />
        <meta name="keywords" content="ACM NIT Surat events, DotSlash hackathon SVNIT, Epiphany coding contest, Inception competitive programming, open source workshop Surat, SIH 2023 SVNIT" />
        <meta property="og:title" content="Events — ACM NIT Surat Student Chapter" />
        <meta property="og:description" content="Hackathons, coding contests, workshops, and outreach programs by ACM NIT Surat SVNIT." />
        <meta property="og:url" content="https://nitsurat.acm.org/events" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nitsurat.acm.org/events" />
      </Helmet>

      <main>
        <EventsHero />
        <EventFilter active={activeFilter} onFilter={handleFilter} events={events} />
        {flagship.length > 0 && <FlagshipEvent events={flagship} onOpen={setSelectedEvent} />}
        <EventGrid events={filtered} loading={loading} onOpen={setSelectedEvent} />
        <EventTimeline events={events} />
        <EventStats />
        <UpcomingEvents />
        <EventGallery />
        <ProposeCTA />
      </main>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
`,
  'src/components/events/EventsHero.jsx': `import React, { useEffect, useRef } from 'react';
import ParticleCanvas from '../common/ParticleCanvas';
import GlowButton from '../common/GlowButton';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function EventsHero() {
  const h1Ref = useRef(null);
  const subRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    // Basic text reveal without SplitText plugin
    const titleChars = h1Ref.current.querySelectorAll('span');
    gsap.fromTo(titleChars, 
      { y: 70, opacity: 0, rotateX: -40 },
      { y: 0, opacity: 1, rotateX: 0, stagger: 0.03, duration: 1, ease: 'power3.out' }
    );
    
    gsap.fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: 'power2.out' }
    );

    gsap.to(bgRef.current, {
      y: () => -window.innerHeight * 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: bgRef.current.parentElement,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }, []);

  const titleStr = "Where Ideas Collide";

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 w-full h-[130%] -top-[15%]">
        <ParticleCanvas />
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
        <div className="inline-block px-4 py-1 mb-6 rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 text-[#00D4FF] text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(0,212,255,0.2)]">
          ⚡ Events · ACM NIT Surat
        </div>
        
        <h1 ref={h1Ref} className="text-5xl md:text-7xl lg:text-8xl font-['Space_Grotesk'] font-bold mb-6 perspective-1000">
          {titleStr.split('').map((char, i) => (
            <span key={i} className={\`inline-block \${char === ' ' ? 'w-4' : ''}\`}>
              {char}
            </span>
          ))}
        </h1>
        
        <p ref={subRef} className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10">
          Hackathons. Workshops. Competitions. Real impact.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <GlowButton onClick={() => document.getElementById('event-grid').scrollIntoView({ behavior: 'smooth' })}>
            Explore Events
          </GlowButton>
          <button 
            onClick={() => document.getElementById('propose-cta').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 rounded-full font-semibold text-white border border-gray-600 hover:border-white transition-colors"
          >
            Propose an Event
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </section>
  );
}
`,
  'src/components/events/EventFilter.jsx': `import React, { useEffect, useRef } from 'react';
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
              className={\`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 \${
                active === cat 
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white shadow-[0_0_15px_rgba(0,212,255,0.4)] border border-transparent' 
                  : 'bg-transparent text-gray-400 border border-gray-700 hover:border-[#00D4FF]/50 hover:text-white'
              }\`}
            >
              <span className="capitalize">{cat}</span>
              <span className={\`text-xs px-2 py-0.5 rounded-full \${active === cat ? 'bg-white/20' : 'bg-gray-800'}\`}>
                {getCount(cat)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
  'src/components/events/FlagshipEvent.jsx': `import React, { useEffect, useRef } from 'react';
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
            <div key={event._id || i} className={\`flagship-row flex flex-col \${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center\`}>
              
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
`,
  'src/components/events/EventGrid.jsx': `import React, { useEffect } from 'react';
import EventCard from './EventCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EventGrid({ events, loading, onOpen }) {
  useEffect(() => {
    if (!loading && events.length > 0) {
      ScrollTrigger.batch('.event-card', {
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }),
        start: 'top 85%'
      });
    }
  }, [events, loading]);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading events...</div>;
  }

  return (
    <section id="event-grid" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <div key={event._id || i} className="event-card opacity-0 translate-y-10">
              <EventCard event={event} onOpen={onOpen} />
            </div>
          ))}
        </div>
        {events.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-lg">No events found for this category.</div>
        )}
      </div>
    </section>
  );
}
`,
  'src/components/events/EventCard.jsx': `import React, { useEffect, useRef } from 'react';
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
        <div className="ml-auto flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ backgroundColor: catColors.bg, color: catColors.text, border: \`1px solid \${catColors.border}\` }}>
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
`,
  'src/components/events/EventModal.jsx': `import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { format } from 'date-fns';

export default function EventModal({ event, onClose }) {
  const backdropRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const tl = gsap.timeline();
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo(cardRef.current, { y: '100%', opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.1);

    const handleEsc = (e) => { if(e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(cardRef.current, { y: '100%', opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to(backdropRef.current, { opacity: 0, duration: 0.3 }, 0.1);
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) handleClose();
  };

  const dateStr = event.startDate ? format(new Date(event.startDate), 'dd MMM yyyy') : '';
  const endDateStr = event.endDate ? format(new Date(event.endDate), 'dd MMM yyyy') : null;

  return (
    <div 
      ref={backdropRef} 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(5,10,20,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={handleBackdropClick}
    >
      <div 
        ref={cardRef} 
        className="w-full max-w-4xl bg-[#0A1628] rounded-[24px] border border-[#00D4FF]/20 shadow-2xl relative flex flex-col overflow-hidden"
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-[#00D4FF] hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div 
          className="w-full h-[200px] flex items-center justify-center relative"
          style={{ background: event.bannerGradient || 'linear-gradient(135deg, #1E3A8A, #2563EB)' }}
        >
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase border border-white/20">
            {event.category}
          </div>
          <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold text-white text-center px-4">
            {event.title}
          </h2>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto max-h-[70vh] no-scrollbar">
          {event.achievement && (
            <div className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 border border-yellow-500/30 text-yellow-500 font-bold mb-6 flex justify-center items-center gap-2">
              🏆 {event.achievement}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">📅</span>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Date</div>
                  <div className="font-semibold">{dateStr} {endDateStr && \`- \${endDateStr}\`}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">📍</span>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Venue</div>
                  <div className="font-semibold">{event.venue || 'Online'}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Event Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                {event.stats && event.stats.map((s,i) => (
                  <div key={i}>
                    <div className="text-xl font-bold text-white">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-['Space_Grotesk'] font-bold text-white mb-4">About the Event</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {event.tags && event.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] text-sm border border-[#00D4FF]/20">
                #{tag}
              </span>
            ))}
          </div>

          {event.gallery && event.gallery.length > 0 ? (
             <div className="mb-8">
               <h3 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-4">Gallery</h3>
               <div className="grid grid-cols-3 gap-4">
                 {event.gallery.map((img, i) => (
                   <div key={i} className="aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                     <img src={img.url} alt={img.caption || 'Event image'} className="w-full h-full object-cover" />
                   </div>
                 ))}
               </div>
             </div>
          ) : (
            <div className="mb-8">
               <h3 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-4">Gallery</h3>
               <div className="grid grid-cols-3 gap-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="aspect-video bg-white/5 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500">
                     <span className="text-2xl mb-2">📷</span>
                     <span className="text-xs">{event.title}</span>
                   </div>
                 ))}
               </div>
             </div>
          )}

          <div className="flex items-center gap-4 border-t border-white/10 pt-6">
             <div className="text-sm text-gray-400">Share this event:</div>
             <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] transition-colors flex items-center justify-center">
               TW
             </button>
             <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#0A66C2]/20 hover:text-[#0A66C2] transition-colors flex items-center justify-center">
               IN
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
`,
  'src/components/events/EventTimeline.jsx': `import React, { useEffect, useRef } from 'react';
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
              <div key={i} className={\`flex flex-col md:flex-row items-center w-full \${isLeft ? 'md:flex-row-reverse' : ''}\`}>
                
                <div className="w-full md:w-1/2"></div>
                
                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#050A14] border-4 border-[#00D4FF] timeline-node z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-ping absolute"></div>
                </div>
                
                <div className={\`w-full md:w-1/2 pl-12 md:pl-0 \${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'}\`}>
                  <div className="timeline-node opacity-0">
                    <div className="text-sm font-['Space_Grotesk'] text-[#00D4FF] mb-1">{dateStr}</div>
                    <h4 className="text-2xl font-bold text-white hover:text-[#00D4FF] transition-colors inline-block cursor-pointer">
                      {event.title}
                    </h4>
                    <div className={\`mt-2 flex items-center gap-2 \${isLeft ? 'md:justify-end' : ''}\`}>
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
`,
  'src/components/events/EventStats.jsx': `import React from 'react';
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
`,
  'src/components/events/CountdownTimer.jsx': `import React, { useState, useEffect } from 'react';

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
`,
  'src/components/events/UpcomingEvents.jsx': `import React from 'react';
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
`,
  'src/components/events/EventGallery.jsx': `import React from 'react';

export default function EventGallery() {
  return (
    <section className="py-20 bg-[#050A14]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-['Space_Grotesk'] font-bold text-white text-center mb-12">Moments from Our Events</h2>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="break-inside-avoid relative group rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer" style={{ height: \`\${200 + (i%3)*100}px\` }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <span className="text-3xl mb-2">📷</span>
                <span className="text-xs uppercase tracking-wider">Event Moment {i}</span>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold border border-white px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  View Gallery
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'src/components/events/ProposeCTA.jsx': `import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast, Toaster } from 'react-hot-toast';
import api from '../../services/api';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  idea: z.string().min(20, 'Please describe your idea (min 20 chars)')
});

export default function ProposeCTA() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/contact', {
        name: data.name,
        email: data.email,
        subject: 'general',
        message: data.idea
      });
      toast.success("Thanks! We'll be in touch 🚀", { style: { background: '#333', color: '#fff' }});
      reset();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="propose-cta" className="py-24 relative overflow-hidden">
      <Toaster position="bottom-right" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/10 to-[#00D4FF]/5 -z-10"></div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="glass-card p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
          
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6">
              Have a Great <span className="text-[#00D4FF]">Idea?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              We are always looking for fresh ideas for hackathons, workshops, and speaker sessions. If you have an idea, let us know and we might just make it happen!
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">💡</div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">🚀</div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">✨</div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <input 
                  {...register('name')} 
                  placeholder="Your Name"
                  className="w-full bg-[#050A14] border border-gray-700 focus:border-[#00D4FF] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                />
                {errors.name && <span className="text-red-400 text-xs mt-1">{errors.name.message}</span>}
              </div>
              
              <div>
                <input 
                  {...register('email')} 
                  placeholder="Your Email"
                  className="w-full bg-[#050A14] border border-gray-700 focus:border-[#00D4FF] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                />
                {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email.message}</span>}
              </div>

              <div>
                <textarea 
                  {...register('idea')} 
                  placeholder="Describe your event idea..."
                  rows="4"
                  className="w-full bg-[#050A14] border border-gray-700 focus:border-[#00D4FF] rounded-lg px-4 py-3 text-white outline-none transition-colors resize-none"
                />
                {errors.idea && <span className="text-red-400 text-xs mt-1">{errors.idea.message}</span>}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white font-bold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-shadow flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Submit Idea'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullpath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullpath), { recursive: true });
  fs.writeFileSync(fullpath, content);
});

console.log('Events module scaffolded.');
