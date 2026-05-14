import React, { useEffect } from 'react';
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
