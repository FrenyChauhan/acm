import React, { useEffect, useState } from 'react';
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
