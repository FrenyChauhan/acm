import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getEvents, getFlagshipEvents } from '../services/eventService';
import '../styles/events.css';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_DATA = [
  {label:"DotSlash 6.0", h:"gph-1"},{label:"Epiphany 12.1", h:"gph-2"},{label:"Inception 8.0", h:"gph-3"},
  {label:"Open Source WS", h:"gph-4"},{label:"Hour of Code", h:"gph-5"},{label:"CodeWars", h:"gph-6"},
  {label:"SIH Ideathon", h:"gph-7"},{label:"Summer Challenge", h:"gph-8"},{label:"DotSlash 6.0", h:"gph-9"},
  {label:"Epiphany 12.1", h:"gph-10"},{label:"Inception 8.0", h:"gph-11"},{label:"Hour of Code", h:"gph-12"}
];

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'});
}
function fmtDateRange(s, e) {
  if (!e) return fmtDate(s);
  return fmtDate(s) + ' – ' + fmtDate(e);
}
const catColors = {
  hackathon:  {bg:'rgba(220,38,38,.12)', border:'#DC2626', text:'#FCA5A5'},
  competition:{bg:'rgba(37,99,235,.12)', border:'#2563EB', text:'#93C5FD'},
  workshop:   {bg:'rgba(124,58,237,.12)',border:'#7C3AED', text:'#C4B5FD'},
  outreach:   {bg:'rgba(5,150,105,.12)', border:'#059669', text:'#6EE7B7'},
  online:     {bg:'rgba(217,119,6,.12)', border:'#D97706', text:'#FCD34D'},
};
function catStyle(cat) {
  const c = catColors[cat] || catColors.competition;
  return { background: c.bg, borderColor: c.border, color: c.text };
}
const bigIcons = {hackathon:'HACK', competition:'CODE', workshop:'LEARN', outreach:'TEACH'};

const sanitizeTitle = (t) => {
  if (!t) return '';
  return t.replace(/\s+[\d.]+(\s|$)/, '').trim();
};

const TitleLine = ({ text, grad }) => (
  <span className="line">
    <span className={`word ${grad ? 'grad' : ''}`} style={{display:'inline-block'}}>
      {text}
    </span>
  </span>
);

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [flagship, setFlagship] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const hcRef = useRef(null);
  const containerRef = useRef(null);
  const tlSvgRef = useRef(null);
  const tlPathRef = useRef(null);

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

  useEffect(() => {
    if (loading) return;
    
    let ctx = gsap.context(() => {
      // Flagship
      const flags = document.querySelectorAll('.flagship-item');
      flags.forEach((el, i) => {
        const graphic = el.querySelector('.flagship-graphic');
        const content = el.querySelector('.flagship-content');
        const fromDir = i % 2 === 0;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          onEnter: () => {
            gsap.timeline()
              .to(el, {opacity:1, duration:.1})
              .from(graphic, {x: fromDir ? -80 : 80, opacity:0, duration:.9, ease:'power3.out'}, 0)
              .from(content, {x: fromDir ? 80 : -80, opacity:0, duration:.9, ease:'power3.out'}, 0);
          }
        });
      });

      // Events
      gsap.from('.event-card', {
        y:50, opacity:0, duration:.8, stagger:.08, ease:'expo.out',
        scrollTrigger:{trigger:'#event-grid', start:'top 80%', once:true}
      });

      // Timeline
      const tlItems = document.querySelectorAll('.tl-item');
      tlItems.forEach((item) => {
        const left = item.querySelector('.tl-left');
        const right = item.querySelector('.tl-right');
        ScrollTrigger.create({
          trigger: item,
          start: 'top 80%',
          onEnter: () => {
            gsap.to([left, right], {opacity:1, x:0, duration:.8, stagger:.1, ease:'expo.out'});
          }
        });
      });
      const resizeTLSvg = () => {
        const itemsWrap = document.getElementById('timeline-items');
        if(itemsWrap && tlSvgRef.current && tlPathRef.current) {
          const h = itemsWrap.offsetHeight + 60;
          tlSvgRef.current.setAttribute('height', h);
          tlPathRef.current.setAttribute('y2', h);
          tlPathRef.current.setAttribute('stroke-dasharray', '8 6');
        }
      };
      setTimeout(resizeTLSvg, 500);
      window.addEventListener('resize', resizeTLSvg);

      // Stats
      document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        ScrollTrigger.create({
          trigger: el, start:'top 88%', once:true,
          onEnter: () => {
            gsap.fromTo({v:0}, {v:target}, {
              duration:2, ease:'power2.out',
              onUpdate: function() { el.textContent = prefix + Math.round(this.targets()[0].v) + suffix; }
            });
          }
        });
      });

      // Upcoming & Gallery
      gsap.from('.upcoming-card', {
        y:50, opacity:0, duration:.8, stagger:.12, ease:'expo.out',
        scrollTrigger:{trigger:'#upcoming', start:'top 78%', once:true}
      });
      gsap.from('.gallery-item', {
        y:30, opacity:0, duration:.7, stagger:.06, ease:'expo.out',
        scrollTrigger:{trigger:'#gallery', start:'top 78%', once:true}
      });

      // Flagship Header Underline
      ScrollTrigger.create({
        trigger:'#flagship', start:'top 75%',
        onEnter:() => {
          const u = document.getElementById('flagshipHeading');
          if (u) u.classList.add('animated');
        }
      });

      // Filter bar
      ScrollTrigger.create({
        trigger:'#events-hero', start:'bottom 80%',
        onEnter:()=>gsap.to('#filter-bar',{opacity:1, y:0, duration:.5, ease:'expo.out'})
      });

      // Hero animations
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.to('#heroEyebrow',{opacity:1,duration:.6})
            .fromTo('.hero-title .word',{y:'110%'},{y:'0%',duration:.9,stagger:.12,ease:'expo.out'}, '-=0.4')
            .to('#heroSub',{opacity:1,y:0,duration:.7}, '-=0.6')
            .to('#heroBtns',{opacity:1,duration:.6}, '-=0.4')
            .to('#heroCube',{opacity:1,duration:1,ease:'power2.out'}, '-=0.8')
            .to('#heroScroll',{opacity:1,duration:.6}, '-=0.6');

    }, containerRef);

    // Canvas
    const hc = hcRef.current;
    let animId;
    let hResize;
    let moveHandler;
    
    if (hc) {
      const hctx = hc.getContext('2d');
      let hcw, hch;
      hResize = () => { hcw = hc.width = hc.offsetWidth; hch = hc.height = hc.offsetHeight; };
      hResize();
      window.addEventListener('resize', hResize);
      let mhx=0, mhy=0;
      moveHandler = e => { mhx=e.clientX; mhy=e.clientY; };
      window.addEventListener('mousemove', moveHandler);
      
      const dots=[];
      for(let i=0;i<120;i++){
        dots.push({x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
          vx:(Math.random()-.5)*.15, vy:(Math.random()-.5)*.15, r:Math.random()*1.2+.4});
      }
      
      const drawHero = () => {
        hctx.clearRect(0,0,hcw,hch);
        dots.forEach(d=>{
          d.x+=d.vx; d.y+=d.vy;
          if(d.x<0||d.x>hcw) d.vx*=-1;
          if(d.y<0||d.y>hch) d.vy*=-1;
          const dist=Math.hypot(d.x-mhx,d.y-mhy);
          const al=Math.max(0,.6-dist/400);
          hctx.beginPath(); hctx.arc(d.x,d.y,d.r,0,Math.PI*2);
          hctx.fillStyle=`rgba(58,155,213,${al})`; hctx.fill();
        });
        for(let i=0;i<dots.length;i++) {
          for(let j=i+1;j<dots.length;j++){
            const d=Math.hypot(dots[i].x-dots[j].x,dots[i].y-dots[j].y);
            if(d<110){
              hctx.beginPath(); hctx.moveTo(dots[i].x,dots[i].y); hctx.lineTo(dots[j].x,dots[j].y);
              hctx.strokeStyle=`rgba(58,155,213,${(.22*(1-d/110)).toFixed(3)})`;
              hctx.lineWidth=.5; hctx.stroke();
            }
          }
        }
        animId = requestAnimationFrame(drawHero);
      };
      drawHero();
    }

    return () => {
      ctx.revert();
      if (hResize) window.removeEventListener('resize', hResize);
      if (moveHandler) window.removeEventListener('mousemove', moveHandler);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [loading]);

  const handleFilter = (category) => {
    if (activeFilter === category) return;
    setActiveFilter(category);
    const next = category === 'all' ? events : events.filter(e => e.category === category);
    
    gsap.to('.event-card', {opacity:0, y:20, duration:.2, stagger:.02, onComplete:()=>{
      setFiltered(next);
      setTimeout(() => {
        gsap.fromTo('.event-card', {opacity:0, y:20}, {opacity:1, y:0, duration:.35, stagger:.04});
      }, 50);
    }});
  };

  const handleShare = (platform) => {
    if (!selectedEvent) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${selectedEvent.title} by ACM NIT Surat!`);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`
    };
    window.open(urls[platform], '_blank', 'width=600,height=450');
  };

  const counts = { all: events.length };
  ['hackathon','competition','workshop','outreach'].forEach(c => {
    counts[c] = events.filter(e=>e.category===c).length;
  });

  const timelineEvents = [...events].sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
  const upcomingEvents = events.filter(e => new Date(e.startDate) > new Date());



  return (
    <div ref={containerRef}>
      <Helmet>
        <title>Events | ACM Student Chapter NIT Surat</title>
        <meta name="description" content="Hackathons, Workshops & Competitions." />
      </Helmet>

      {/* HERO */}
      <section id="events-hero">
        <canvas id="hero-canvas" ref={hcRef}></canvas>
        <div className="hero-grid-bg"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>
        <div className="hero-content">
          <div className="hero-eyebrow" id="heroEyebrow">
            <span className="hero-pill">⚡ Events · ACM NIT Surat</span>
            2022 – 2024 · SVNIT, Surat
          </div>
          <h1 className="hero-title" id="heroTitle">
            <TitleLine text="Where" />
            <TitleLine text="Ideas" grad />
            <TitleLine text="Collide" />
          </h1>
          <p className="hero-sub" id="heroSub" style={{opacity:0, transform:'translateY(20px)'}}>Hackathons. Workshops. Competitions. Real impact.</p>
          <div className="hero-btns" id="heroBtns" style={{opacity:0}}>
            <a href="#event-grid" className="btn-primary">Explore Events →</a>
          </div>
        </div>
        <div className="hero-cube-wrap" id="heroCube" style={{opacity:0}}>
          <div className="cube-glow"></div>
          <div className="hero-cube">
            <div className="cube-face front">HACK</div>
            <div className="cube-face back">CODE</div>
            <div className="cube-face left">BUILD</div>
            <div className="cube-face right">SHIP</div>
            <div className="cube-face top">WIN</div>
            <div className="cube-face bottom">ACM</div>
          </div>
        </div>
        <div className="hero-scroll" id="heroScroll" style={{opacity:0}}>
          <div className="hero-scroll-line"></div>
          Scroll to explore
          <div className="scroll-chevron"></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="marquee-item"><span className="marquee-dot"></span>DotSlash 6.0 · Hackathon</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Epiphany 12.1 · CP Contest</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Inception 8.0</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Hour of Code · 500+ Students</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Open Source · Hacktoberfest</div>
              <div className="marquee-item"><span className="marquee-dot"></span>SIH 2023 Ideathon</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Summer Challenge · 30 Days</div>
              <div className="marquee-item"><span className="marquee-dot"></span>CodeWars @ MINDBEND</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* FILTER BAR */}
      <div id="filter-bar">
        {['all','hackathon','competition','workshop','outreach'].map(f => (
          <button 
            key={f}
            className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
            onClick={() => handleFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} <span className="filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* FLAGSHIP */}
      <section id="flagship">
        <div className="flagship-heading-row">
          <div>
            <div className="section-tag">Flagship</div>
            <h2 className="section-heading section-heading-underline" id="flagshipHeading">Our Flagship Events</h2>
          </div>
        </div>
        <div id="flagship-container">
          {loading ? (
            <div className="cards-loading"><div className="loading-spinner"></div>Loading flagship events…</div>
          ) : flagship.length === 0 ? (
            <p style={{color:'var(--w40)', fontFamily:'var(--font-mono)', fontSize:'.7rem', letterSpacing:'.2em'}}>No flagship events found.</p>
          ) : (
            flagship.map((ev, i) => (
              <div key={ev._id} className={`flagship-item ${i % 2 !== 0 ? 'reverse' : ''}`} style={{opacity:0}}>
                <div className="flagship-graphic" style={{minHeight:'420px'}}>
                  <div className="flagship-bg" style={{background: ev.bannerGradient || 'var(--ac)'}}></div>
                  <div className="flagship-geo c1"></div>
                  <div className="flagship-geo c2"></div>
                  <div className="flagship-geo c3"></div>
                  <div className="flagship-border-glow"></div>
                  <div className="flagship-big-icon">{bigIcons[ev.category] || 'ACM'}</div>
                  {ev.edition && <div className="flagship-badge-large" style={{position:'relative', zIndex:1}}>Edition {ev.edition}</div>}
                  <div className="flagship-name-large">{ev.title}</div>
                </div>
                <div className="flagship-content">
                  {ev.achievement && <div className="achievement-badge">🏆 {ev.achievement}</div>}
                  <div className={`cat-pill ${ev.category}`} style={{position:'relative', zIndex:1}}>{(ev.category || '').toUpperCase()}</div>
                  {ev.edition && <div className="edition-badge">{ev.edition}</div>}
                  <h2>{ev.title}</h2>
                  <p className="flagship-desc">{ev.description}</p>
                  <div className="stats-row">
                    {(ev.stats||[]).map((s, idx) => (
                      <div key={idx} className="stat-box"><span className="stat-box-val">{s.value}</span><span className="stat-box-label">{s.label}</span></div>
                    ))}
                  </div>
                  <button className="view-btn" onClick={() => setSelectedEvent(ev)}><span>View Details →</span></button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="divider"></div>

      {/* EVENT GRID */}
      <section id="event-grid">
        <div className="grid-header">
          <div>
            <div className="section-tag">All Events</div>
            <h2 className="section-heading">Full Lineup</h2>
          </div>
          <p style={{fontFamily:'var(--font-ui)', color:'var(--w40)', fontSize:'.9rem', maxWidth:'320px', lineHeight:1.7}}>Every event curated and executed by ACM NIT Surat's core committee.</p>
        </div>
        <div className="events-masonry" id="events-masonry">
          {loading ? (
            <div className="cards-loading"><div className="loading-spinner"></div>Fetching events from database…</div>
          ) : filtered.length === 0 ? (
            <div className="no-events">No events match this filter.</div>
          ) : (
            filtered.map(ev => {
              const tags = (ev.tags||[]).slice(0,3);
              const extra = (ev.tags||[]).length - 3;
              return (
                <div key={ev._id} className={`event-card ${ev.achievement ? 'has-achievement' : ''}`} onClick={() => setSelectedEvent(ev)}>
                  <div className="card-banner" style={{background: ev.bannerGradient || 'var(--ac)'}}>
                    <div className="card-cat-pill" style={catStyle(ev.category)}>{ev.category}</div>
                    {ev.edition && <div className="card-edition">{ev.edition}</div>}
                  </div>
                  <div className="card-body">
                    {ev.achievement && <div className="achievement-badge" style={{marginBottom:'.8rem', fontSize:'.52rem'}}>🏆 {ev.achievement}</div>}
                    <h3>{ev.title}</h3>
                    <div className="card-meta">
                      <div className="card-meta-item">
                        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {fmtDateRange(ev.startDate, ev.endDate)}
                      </div>
                      {ev.venue && <div className="card-meta-item"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{ev.venue.length > 35 ? ev.venue.slice(0,35)+'…' : ev.venue}</div>}
                      {ev.isOnline && <div className="card-meta-item"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>Online</div>}
                    </div>
                    <p className="card-desc">{ev.description}</p>
                  </div>
                  <div className="card-footer">
                    <div className="tag-chips">
                      {tags.map((t, idx) => <span key={idx} className="tag-chip">{t}</span>)}
                      {extra > 0 && <span className="tag-more">+{extra}</span>}
                    </div>
                    <button className="card-view-btn" onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}>Details →</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <div className="divider"></div>

      {/* TIMELINE */}
      <section id="timeline">
        <div className="section-tag">Chronicle</div>
        <h2 className="section-heading">A Year in Events</h2>
        <div className="timeline-wrap">
          <div className="timeline-line">
            <svg id="tlSvg" ref={tlSvgRef} width="2" height="100%"><line id="tlPath" ref={tlPathRef} x1="1" y1="0" x2="1" y2="100%" stroke="rgba(58,155,213,0.25)" strokeWidth="2" strokeDasharray="8 6"/></svg>
          </div>
          <div className="timeline-items" id="timeline-items">
            {timelineEvents.map((item, i) => (
              <div key={item._id} className="tl-item">
                <div className={i % 2 === 0 ? 'tl-left' : 'tl-right'}>
                  <div className="tl-event-name">{sanitizeTitle(item.title)}{item.achievement && <span className="milestone-star">⭐</span>}</div>
                  <div className="tl-desc">{item.tagline || (item.description && item.description.slice(0,60)+'...')}</div>
                  <div style={{marginTop:'.6rem'}}><span className={`cat-pill ${item.category}`} style={{fontSize:'.5rem', padding:'.2rem .6rem'}}>{item.category}</span></div>
                </div>
                <div className="tl-center">
                  <div className="tl-dot"></div>
                  <div className="tl-date">{fmtDate(item.startDate)}</div>
                </div>
                <div className={i % 2 === 0 ? 'tl-right' : 'tl-left'}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* STATS */}
      <section id="event-stats">
        <div className="section-tag">By the Numbers</div>
        <h2 className="section-heading">Impact at a Glance</h2>
        <div className="stats-grid">
          <div className="stat-item"><span className="stat-icon">⚡</span><span className="stat-num" data-target="8" data-suffix="+">0</span><span className="stat-label">Events Per Year</span></div>
          <div className="stat-item"><span className="stat-icon">👥</span><span className="stat-num" data-target="500" data-suffix="+">0</span><span className="stat-label">Students Reached</span></div>
          <div className="stat-item"><span className="stat-icon">🏆</span><span className="stat-num" data-target="40" data-suffix="">0</span><span className="stat-label">Hackathon Teams</span></div>
          <div className="stat-item"><span className="stat-icon">💰</span><span className="stat-num" data-target="3000" data-suffix="+" data-prefix="₹">0</span><span className="stat-label">Prize Money</span></div>
          <div className="stat-item"><span className="stat-icon">📅</span><span className="stat-num" data-target="30" data-suffix="">0</span><span className="stat-label">Day Summer Challenge</span></div>
        </div>
      </section>

      <div className="divider"></div>

      {/* UPCOMING */}
      <section id="upcoming">
        <div className="section-tag">Coming Soon</div>
        <h2 className="section-heading">Upcoming Events</h2>
        <div className="upcoming-grid" id="upcoming-grid">
          {upcomingEvents.length === 0 ? (
            <p style={{color:'var(--w40)', fontFamily:'var(--font-mono)', fontSize:'.7rem', letterSpacing:'.2em'}}>No upcoming events currently scheduled.</p>
          ) : (
            upcomingEvents.map(ev => (
              <div key={ev._id} className="upcoming-card">
                <div className="coming-ribbon">Coming Soon</div>
                <div className="upcoming-cat">{ev.category}</div>
                <div className="upcoming-title">{ev.title}</div>
                <p className="upcoming-desc">{ev.description}</p>
                <button className="register-btn">Register Interest →</button>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="divider"></div>

      {/* GALLERY */}
      <section id="gallery">
        <div className="section-tag">Moments</div>
        <h2 className="section-heading">From Our Events</h2>
        <div className="gallery-masonry" id="gallery-masonry">
          {GALLERY_DATA.map((g, i) => (
            <div key={i} className="gallery-item">
              <div className="gallery-item-inner">
                <div className={`gallery-placeholder ${g.h}`}>
                  <svg viewBox="0 0 24 24" width="28" height="28" stroke="var(--w20)" fill="none"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span className="gallery-label">{g.label}</span>
                </div>
                <div className="gallery-overlay">View Gallery</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      <div id="modal-backdrop" className={selectedEvent ? 'open' : ''} onClick={() => setSelectedEvent(null)} style={{ display: selectedEvent ? 'flex' : 'none' }}>
        {selectedEvent && (
          <div id="modal-card" onClick={(e) => e.stopPropagation()} style={{ opacity: 1, transform: 'translateY(0)' }}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="modal-hero" id="modalHero">
              <div className="modal-hero-bg" id="modalHeroBg" style={{background: selectedEvent.bannerGradient || 'var(--ac)'}}></div>
              <p className="modal-hero-cat" id="modalCat">{(selectedEvent.category || '').toUpperCase()}</p>
              <h2 className="modal-hero-title" id="modalTitle">{selectedEvent.title}</h2>
            </div>
            <div className="modal-body" id="modalBody">
              {selectedEvent.achievement && <div className="modal-achievement">🏆 {selectedEvent.achievement}</div>}
              <p className="modal-desc">{selectedEvent.description}</p>
              <div className="modal-details-grid">
                <div className="modal-detail"><span className="modal-detail-label">📅 Date</span><span className="modal-detail-val">{fmtDateRange(selectedEvent.startDate, selectedEvent.endDate)}</span></div>
                {selectedEvent.venue && <div className="modal-detail"><span className="modal-detail-label">📍 Venue</span><span className="modal-detail-val">{selectedEvent.venue}</span></div>}
                <div className="modal-detail"><span className="modal-detail-label">🏷️ Category</span><span className="modal-detail-val" style={{textTransform:'capitalize'}}>{selectedEvent.category}</span></div>
                {selectedEvent.isOnline && <div className="modal-detail"><span className="modal-detail-label">🌐 Mode</span><span className="modal-detail-val">Online</span></div>}
                {selectedEvent.edition && <div className="modal-detail"><span className="modal-detail-label">✦ Edition</span><span className="modal-detail-val">{selectedEvent.edition}</span></div>}
              </div>
              <div className="modal-stats">
                {(selectedEvent.stats||[]).map((s, idx) => <div key={idx} className="modal-stat"><span className="modal-stat-val">{s.value}</span><span className="modal-stat-label">{s.label}</span></div>)}
              </div>
              <div className="modal-tags">
                {(selectedEvent.tags||[]).map((t, idx) => <span key={idx} className="modal-tag">{t}</span>)}
              </div>
              <div className="modal-gallery-section">
                <h4>Gallery</h4>
                <div className="modal-gallery-grid">
                  {[{h:'mph-1'},{h:'mph-2'},{h:'mph-3'},{h:'mph-4'},{h:'mph-5'},{h:'mph-6'}].map((g, idx) => (
                    <div key={idx} className={`modal-gallery-ph ${g.h}`}>
                      <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      <span>{selectedEvent.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-share">
                <span className="share-label">Share:</span>
                <button className="share-btn" onClick={() => handleShare('twitter')}>Tw</button>
                <button className="share-btn" onClick={() => handleShare('linkedin')}>Li</button>
                <button className="share-btn" onClick={() => handleShare('whatsapp')}>Wa</button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
