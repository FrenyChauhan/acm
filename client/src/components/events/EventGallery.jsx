import React from 'react';

export default function EventGallery() {
  return (
    <section className="py-20 bg-[#050A14]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-['Space_Grotesk'] font-bold text-white text-center mb-12">Moments from Our Events</h2>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="break-inside-avoid relative group rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer" style={{ height: `${200 + (i%3)*100}px` }}>
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
