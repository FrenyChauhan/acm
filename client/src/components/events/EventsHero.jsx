import React, { useEffect, useRef } from 'react';
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
            <span key={i} className={`inline-block ${char === ' ' ? 'w-4' : ''}`}>
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
