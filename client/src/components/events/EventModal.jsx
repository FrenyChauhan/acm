import React, { useEffect, useRef } from 'react';
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
                  <div className="font-semibold">{dateStr} {endDateStr && `- ${endDateStr}`}</div>
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
