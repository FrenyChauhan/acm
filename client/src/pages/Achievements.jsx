import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/achievements.css';

gsap.registerPlugin(ScrollTrigger);

/* ─── static data ─────────────────────────────────────────────── */
const STATS = [
  {
    label: 'ICPC Appearances', num: 3, suffix: '',
    desc: "Regional-level ICPC qualifications, representing NIT Surat at India's most prestigious programming contest.",
  },
  {
    label: 'DotSlash Editions', num: 9, suffix: '',
    desc: "Consecutive editions of NIT Surat's flagship hackathon, each bigger and bolder than the last.",
  },
  {
    label: 'Years of Legacy', num: 14, suffix: '',
    desc: 'A decade-plus of the ACM chapter building culture, community, and champion coders at NIT Surat.',
  },
  {
    label: 'Students Impacted', num: 500, suffix: '+',
    desc: 'Events, workshops, contests and mentorships touching the lives of hundreds of students every year.',
  },
];

const ACH_CARDS = [
  {
    icon: '💻', num: '01', label: 'Competitive Programming',
    title: 'ICPC Regionals Qualification',
    desc: 'Team skill_issue — Vanshik, Dweep, and Smit — qualified for and competed in the ICPC Asia West Regionals 2025–26, one of the most competitive stages in collegiate programming.',
    detail: [
      "The International Collegiate Programming Contest (ICPC) is the world's most prestigious collegiate programming competition. Getting to the Regional stage is itself a monumental feat — teams must first clear online preliminaries competing against thousands of teams nationwide.",
      'Team skill_issue — comprising Vanshik Godeshwar, Dweep Modi, and Smit Marakna — represented NIT Surat at two regional sites: Amritapuri and Chennai, both in the Asia West zone. Their performance demanded mastery of algorithms, data structures, and high-pressure collaborative problem-solving.',
      'This qualification marks one of ACM NIT Surat\'s most celebrated moments in competitive programming and continues to inspire the next generation of coders at the institute. 🚀',
    ],
    tags: ['ICPC 2025–26', 'Asia West Regionals', 'Amritapuri', 'Chennai', 'Team of 3'],
  },
  {
    icon: '🚀', num: '02', label: 'Flagship Event',
    title: 'DotSlash 9.0 — Successfully Executed',
    desc: '9 editions. Hundreds of participants. Sleepless nights. The ACM Core team organized DotSlash 9.0 — where code met creativity and innovation became real on 21 & 22 March 2025.',
    detail: [
      'DotSlash is NIT Surat\'s flagship hackathon — a 36-hour marathon of innovation, collaboration, and relentless building. Now in its 9th edition, DotSlash 9.0 held on 21 & 22 March 2025 brought together bright minds from institutions across the country.',
      'Organized entirely by the ACM Core 2025–26 team, DotSlash 9.0 featured themed problem statements, mentorship from industry experts, and a high-energy environment where ideas rapidly evolved into functional prototypes.',
      'Months of behind-the-scenes planning — logistics, sponsorships, problem curation, judge coordination — culminated in an event that the chapter is immensely proud of. Every sleepless night was worth it. ✨',
    ],
    tags: ['Hackathon', '36 Hours', 'March 2025', 'Edition 9', 'NIT Surat'],
  },
  {
    icon: '🌐', num: '03', label: 'Web Development',
    title: 'ACM Website Revamp',
    desc: "The ACM NIT Surat website was completely revamped by the 2023–24 core team — a sleek, animated platform serving as the chapter's digital home and resource hub.",
    detail: [
      'The ACM NIT Surat website underwent a complete ground-up rebuild by the Core Team 2023–24. Moving away from a dated static site, the revamped platform was built with modern web technologies including GSAP animations, smooth page transitions, and a fully responsive layout.',
      "The new website serves as the chapter's primary digital presence — showcasing events, projects, achievements, blogs, and the core team. It incorporates scroll-triggered reveals, a custom cursor, particle effects, and a cohesive dark design language.",
      'Beyond aesthetics, the revamp streamlined information architecture, making it easier for students to discover resources, join events, and learn about the chapter\'s legacy.',
    ],
    tags: ['2023–24', 'GSAP', 'Responsive Design', 'Web Dev'],
  },
  {
    icon: '📦', num: '04', label: 'Open Source',
    title: 'ButterFlask-UI Framework',
    desc: 'A modern Python framework for building responsive web UIs with a Flutter-inspired widget model, conceived and built by ACM NIT Surat members and open-sourced to the community.',
    detail: [
      "ButterFlask-UI is an open-source Python framework developed by ACM NIT Surat members that bridges the gap between backend Python developers and modern frontend UI development. Inspired by Flutter's declarative widget model, it allows developers to compose web interfaces using Python constructs.",
      'The framework enables rapid prototyping of responsive UIs by providing a library of composable, styleable widgets backed by a Flask server — especially powerful for data scientists and backend engineers.',
      "Being open-sourced, ButterFlask-UI represents ACM NIT Surat's commitment to contributing back to the broader developer community. 🌍",
    ],
    tags: ['Open Source', 'Python', 'Flask', 'Flutter-inspired', 'UI Framework'],
  },
  {
    icon: '🧠', num: '05', label: 'Education',
    title: 'ML Workshop Series',
    desc: 'Over 200 students trained across multiple ML workshop series — from linear regression fundamentals to neural networks — with hands-on notebooks and real-world datasets.',
    detail: [
      'Launched by the ACM Core 2022–23 team, the Machine Learning Workshop Series was designed to make ML accessible and practical for students at every level. The series spanned multiple sessions over the academic year, each building on the last.',
      'Topics covered included linear regression, classification, clustering, decision trees, and introductory neural networks — all taught through interactive Jupyter notebooks applied to real-world datasets.',
      'With 200+ students trained, the series significantly raised the ML literacy floor at NIT Surat and served as a launching pad for many students\' AI/ML journeys.',
    ],
    tags: ['Machine Learning', '200+ Students', '2022–23', 'Jupyter', 'Hands-on'],
  },
  {
    icon: '⚡', num: '06', label: 'Community Building',
    title: '14 Years & Still Growing',
    desc: 'From 2011 to 2025 — 14 years of building a culture of computing at NIT Surat. Hundreds of alumni, dozens of events, and a legacy that continues to inspire every incoming batch.',
    detail: [
      'The ACM Student Chapter at NIT Surat was established in 2011 — making it one of the longest-running technical student bodies at the institute. What started as a small group of passionate coders has grown into a thriving community.',
      'Over 14 years, the chapter has organized hackathons, coding contests, workshops, seminars, and industry talks. It has been the birthplace of competitive programmers, open-source contributors, startup founders, and engineering leaders.',
      'The alumni network spans top tech companies and research institutions globally. 14 years in — and the best chapters are still being written. 🏛️',
    ],
    tags: ['Since 2011', '14+ Years', '500+ Students', 'Alumni Network', 'Legacy'],
  },
];


/* ─── Marquee items ────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  'ICPC Regionals', 'DotSlash 9.0', 'Asia West Regionals',
  'Competitive Programming', 'Hackathon Champions', 'Innovation', 'NIT Surat',
];

/* ─── AchCard ─────────────────────────────────────────────────── */
function AchCard({ card }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - r.left - r.width  / 2) / r.width)  * 8;
      const dy = ((e.clientY - r.top  - r.height / 2) / r.height) * 8;
      gsap.to(el, {
        rotateX: -dy, rotateY: dx, duration: 0.4, ease: 'power2.out',
        transformPerspective: 600, transformOrigin: '50% 50%', zIndex: 2,
      });
    };
    const onLeave = () =>
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1,.7)', zIndex: 1 });

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    if (!expanded) {
      gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
    }
    setExpanded((v) => !v);
  };

  return (
    <div className={`ach-card${expanded ? ' expanded' : ''}`} ref={cardRef}>
      <span className="ach-card-icon">{card.icon}</span>
      <div className="ach-card-num">{card.num}</div>
      <div className="ach-card-label">{card.label}</div>
      <div className="ach-card-title">{card.title}</div>
      <p className="ach-card-desc">{card.desc}</p>
      <button className="ach-card-toggle" onClick={toggle} aria-expanded={expanded}>
        <span>{expanded ? 'Hide Details' : 'View Details'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="ach-card-detail">
        <div className="ach-detail-inner">
          {card.detail.map((p, i) => <p key={i}>{p}</p>)}
          <div className="ach-detail-meta">
            {card.tags.map((t, i) => <span key={i} className="ach-detail-tag">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Progress bar ────────────────────────────────────────────── */
function ProgressBar() {
  useEffect(() => {
    const ppf = document.getElementById('ppf');
    if (!ppf) return;
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total    = document.body.scrollHeight - window.innerHeight;
      ppf.style.width = `${(scrolled / total) * 100}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div id="pp">
      <div id="ppf" />
    </div>
  );
}

/* ─── Achievements page ───────────────────────────────────────── */
export default function Achievements() {
  const containerRef = useRef(null);
  const [icpcExpanded, setIcpcExpanded] = useState(false);
  const [dsExpanded,   setDsExpanded]   = useState(false);

  /* ---------- GSAP animations ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Hero */
      const tl = gsap.timeline();
      tl.to('#hEye',          { opacity: 1, y: 0,     duration: 0.8, ease: 'power3.out', delay: 0.2 })
        .to('.h-title .word', { y: '0%', opacity: 1,   duration: 1,   stagger: 0.15, ease: 'expo.out' }, '-=0.6')
        .to('#hMeta',         { opacity: 1,             duration: 1,   ease: 'power2.out' }, '-=0.4');

      /* Stat counters */
      ScrollTrigger.create({
        trigger: '#stats-strip',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to('.stat-block', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out' });
          document.querySelectorAll('.stat-num').forEach((el) => {
            const target = +el.getAttribute('data-t');
            const suffix = target >= 100 ? '+' : '';
            gsap.to({ v: 0 }, {
              v: target,
              duration: 2.2,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = Math.round(this.targets()[0].v) + suffix;
              },
            });
          });
        },
      });

      /* Section labels */
      gsap.utils.toArray('.sec-label').forEach((label) => {
        gsap.to(label, {
          scrollTrigger: { trigger: label, start: 'top 90%' },
          opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        });
      });

      /* ICPC & DotSlash cards */
      ['#icpcCard', '#dsCard'].forEach((id) => {
        gsap.to(id, {
          scrollTrigger: { trigger: id, start: 'top 78%' },
          opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
        });
      });

      /* Image parallax */
      ScrollTrigger.create({
        trigger: '#icpcCard', start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const img = document.getElementById('icpcImg');
          if (img) gsap.to(img, { y: self.progress * 30 - 15, duration: 0.3, ease: 'none' });
        },
      });
      ScrollTrigger.create({
        trigger: '#dsCard', start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const img = document.getElementById('dsImg');
          if (img) gsap.to(img, { y: self.progress * 30 - 15, duration: 0.3, ease: 'none' });
        },
      });

      /* ICPC card tilt */
      const icpcCard = document.getElementById('icpcCard');
      if (icpcCard) {
        icpcCard.addEventListener('mousemove', (e) => {
          const r  = icpcCard.getBoundingClientRect();
          const dx = ((e.clientX - r.left - r.width  / 2) / r.width)  * 3;
          const dy = ((e.clientY - r.top  - r.height / 2) / r.height) * 3;
          gsap.to(icpcCard, { rotateX: -dy, rotateY: dx, duration: 0.5, ease: 'power2.out', transformPerspective: 900, transformOrigin: '50% 50%' });
        });
        icpcCard.addEventListener('mouseleave', () =>
          gsap.to(icpcCard, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1,.7)' }));
      }

      /* DotSlash card tilt */
      const dsCard = document.getElementById('dsCard');
      if (dsCard) {
        dsCard.addEventListener('mousemove', (e) => {
          const r  = dsCard.getBoundingClientRect();
          const dx = ((e.clientX - r.left - r.width  / 2) / r.width)  * 3;
          const dy = ((e.clientY - r.top  - r.height / 2) / r.height) * 3;
          gsap.to(dsCard, { rotateX: -dy, rotateY: dx, duration: 0.5, ease: 'power2.out', transformPerspective: 900, transformOrigin: '50% 50%' });
        });
        dsCard.addEventListener('mouseleave', () =>
          gsap.to(dsCard, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1,.7)' }));
      }

      /* Achievement cards grid */
      gsap.to('.ach-card', {
        scrollTrigger: { trigger: '.ach-grid', start: 'top 82%' },
        opacity: 1, y: 0, duration: 0.8, stagger: { amount: 0.8 }, ease: 'expo.out',
      });



      /* CTA */
      gsap.to('#ctaLabel', { opacity: 1, duration: 0.6, scrollTrigger: { trigger: '#cta-section', start: 'top 85%' } });
      gsap.utils.toArray('.cta-heading .word').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 85%',
          onEnter: () => gsap.to(el, { y: '0%', opacity: 1, duration: 0.9, delay: i * 0.1, ease: 'expo.out' }),
        });
      });
      gsap.to('#ctaDesc', { opacity: 1, duration: 0.7, scrollTrigger: { trigger: '#ctaDesc', start: 'top 88%' } });
      gsap.to('#ctaBtns', { opacity: 1, duration: 0.7, scrollTrigger: { trigger: '#ctaBtns', start: 'top 90%' } });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ---------- Render ---------- */
  return (
    <div ref={containerRef} className="achievements-page">
      <Helmet>
        <title>Achievements | ACM NIT Surat</title>
        <meta name="description" content="Explore the legacy and achievements of ACM NIT Surat, from ICPC regionals to hackathon organization." />
      </Helmet>

      <ProgressBar />

      {/* ══ HERO ══ */}
      <section id="ach-hero">
        <canvas id="hero-canvas" />
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow2" />

        <div className="hero-content">
          <div className="h-eyebrow" id="hEye" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            <div className="h-tag">ACM NIT Surat</div>
            Excellence · Legacy · Pride
          </div>
          <h1 className="h-title">
            <span className="line">
              <span className="word" style={{ transform: 'translateY(110%)', opacity: 0 }}>OUR</span>
            </span>
            <span className="line">
              <span className="word grad" style={{ transform: 'translateY(110%)', opacity: 0 }}>ACHIEVEMENTS</span>
            </span>
          </h1>
          <div className="h-meta" id="hMeta" style={{ opacity: 0 }}>
            <p className="h-desc">
              From ICPC regionals to national hackathons — every milestone is a testament to the
              relentless drive of ACM NIT Surat's members. These aren't just trophies. They're proof.
            </p>
            <div className="h-scroll">
              <div className="h-scroll-line" />
              Scroll to explore
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              {MARQUEE_ITEMS.map((item, j) => (
                <div className="mqi" key={j}>
                  <div className="mqdot" />
                  {item}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ══ STATS STRIP ══ */}
      <section id="stats-strip">
        <div className="stats-grid">
          {STATS.map((stat, i) => (
            <div
              className="stat-block"
              key={i}
              style={{ opacity: 0, transform: 'translateY(30px)' }}
            >
              <span className="stat-label">{stat.label}</span>
              <span className="stat-num" data-t={stat.num}>0</span>
              <p className="stat-desc">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ICPC SECTION ══ */}
      <section id="icpc-section">
        <div className="sec-label" style={{ opacity: 0, transform: 'translateX(-30px)' }}>
          // ICPC 2025–26 · Asia West Regionals
        </div>
        <div
          className={`icpc-card${icpcExpanded ? ' expanded' : ''}`}
          id="icpcCard"
          style={{ opacity: 0, transform: 'translateY(60px)' }}
        >
          <div className="icpc-photo">
            <img id="icpcImg" src="/skill_issue.jpg" alt="Team skill_issue at ICPC Amritapuri & Chennai 2025-26" loading="lazy" />
            <div className="icpc-photo-overlay" />
            <div className="icpc-badge">
              <div className="icpc-badge-text">🏆 ICPC Qualifier</div>
            </div>
            <div className="icpc-year-float">2025</div>
          </div>

          <div className="icpc-info">
            <div>
              <div className="icpc-competition">International Collegiate Programming Contest</div>
              <h2 className="icpc-title">ICPC Amritapuri &amp; Chennai Region</h2>
              <div className="icpc-subtitle">Asia West Regionals 2025–26</div>
              <p className="icpc-desc">
                We are thrilled to share that our talented team —{' '}
                <strong style={{ color: 'var(--ac)' }}>skill_issue</strong> — represented NIT Surat
                at the Regional Contest of the International Collegiate Programming Contest (ICPC)
                in the Amritapuri and Chennai region.
                <br /><br />
                ICPC is one of the most prestigious global programming competitions, challenging
                participants to showcase their skills in algorithmic problem-solving and team-based
                coding. Kudos to the team for their dedication and hard work — you've made us proud
                and inspired future coders to aim higher and dream bigger! 🚀
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontFamily: 'var(--fm)', fontSize: '.56rem', letterSpacing: '.28em',
                  color: 'var(--ac)', textTransform: 'uppercase', marginBottom: '.8rem',
                }}>
                  Team skill_issue
                </div>
                <div className="team-members">
                  <div className="member-pill">
                    Vanshik Godeshwar
                    <span className="mp-inst">@vanshik_30</span>
                  </div>
                  <div className="member-pill">
                    Dweep Modi
                    <span className="mp-inst">@dweepmodi2311</span>
                  </div>
                  <div className="member-pill">
                    Smit Marakna
                    <span className="mp-inst">@smit.marakna</span>
                  </div>
                </div>
              </div>

              <div className="featured-detail">
                <p className="icpc-desc" style={{ marginTop: '1rem', borderTop: '1px solid var(--ac20)', paddingTop: '1.5rem' }}>
                  The journey to the regional stage demands clearing a grueling online preliminary
                  contest involving thousands of teams nationwide. Participating at both Amritapuri
                  and Chennai sites, the team demonstrated exceptional collaborative problem-solving
                  under tournament pressure. This milestone underscores ACM NIT Surat's commitment
                  to fostering competitive programming excellence — and continues to inspire every new batch.
                </p>
              </div>
            </div>

            <div>
              <div className="icpc-highlights">
                <div className="hl-chip">Amritapuri Region</div>
                <div className="hl-chip">Chennai Region</div>
                <div className="hl-chip">Asia West</div>
                <div className="hl-chip">Algorithmic PS</div>
                <div className="hl-chip">Team Contest</div>
                <div className="hl-chip">2025–26</div>
              </div>
              <button
                className="featured-toggle"
                onClick={() => setIcpcExpanded((v) => !v)}
                aria-expanded={icpcExpanded}
              >
                <span className="ft-text">{icpcExpanded ? 'Show Less' : 'Read More'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: icpcExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .4s ease' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DOTSLASH SECTION ══ */}
      <section id="dotslash-section">
        <div className="ds-heading-row">
          <div>
            <div className="sec-label" style={{ marginBottom: '.8rem', opacity: 0, transform: 'translateX(-30px)' }}>
              // Flagship Hackathon · 2025
            </div>
            <h2 className="ds-heading">
              <span className="grad">DotSlash</span> 9.0
            </h2>
          </div>
          <div className="ds-edition">Edition 9 · 21 &amp; 22 March</div>
        </div>

        <div
          className={`ds-card${dsExpanded ? ' expanded' : ''}`}
          id="dsCard"
          style={{ opacity: 0, transform: 'translateY(50px)' }}
        >
          <div className="ds-photo">
            <img id="dsImg" src="/dotslash.jpg" alt="DotSlash 9.0 — ACM NIT Surat" loading="lazy" />
            <div className="ds-photo-overlay" />
            <div className="ds-badge">
              <div className="ds-badge-pill">DotSlash 9.0</div>
              <div className="ds-date-badge">21 &amp; 22 March 2025</div>
            </div>
          </div>

          <div className="ds-info">
            <div>
              <div className="ds-event-type">Flagship Hackathon · NIT Surat</div>
              <div className="ds-title">DotSlash 9.0</div>
              <div className="ds-edition-tag">Edition 9 · ACM Core 2025–26</div>

              <div className="ds-quote">
                <p>"Months of planning, countless meetings, sleepless nights, last-minute chaos — and somehow, everything came together."</p>
              </div>

              <p className="ds-desc">
                DotSlash 9.0 became a platform where code met creativity and ideas turned into
                impactful innovations. The 9th edition of NIT Surat's most celebrated hackathon
                brought together brilliant minds from across the country for 36 hours of building,
                problem-solving, and breakthrough moments.
                <br /><br />
                With that, ACM Core 2025–26 signs off DotSlash 9.0. 🚀 Every all-nighter, every
                last-minute fix, every moment of chaos that turned into something beautiful — it
                was worth every second.
              </p>

              <div className="featured-detail">
                <p className="ds-desc" style={{ marginTop: '1rem', borderTop: '1px solid var(--ac20)', paddingTop: '1.5rem' }}>
                  Organized entirely by students, DotSlash 9.0 featured diverse problem statements
                  ranging from Web3 and AI to sustainability. Industry experts mentored teams through
                  night-long sprints. It was not just a competition, but a celebration of developer
                  culture at NIT Surat — proof that student-led events can rival professional
                  conferences in scale and impact.
                </p>
              </div>
            </div>

            <div>
              <div className="ds-tags">
                <div className="ds-tag">Hackathon</div>
                <div className="ds-tag">36 Hours</div>
                <div className="ds-tag">Innovation</div>
                <div className="ds-tag">Code + Creativity</div>
                <div className="ds-tag">NIT Surat</div>
                <div className="ds-tag">Edition 9</div>
              </div>
              <button
                className="featured-toggle"
                onClick={() => setDsExpanded((v) => !v)}
                aria-expanded={dsExpanded}
              >
                <span className="ft-text">{dsExpanded ? 'Show Less' : 'Read More'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: dsExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .4s ease' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MORE ACHIEVEMENTS ══ */}
      <section id="more-achievements">
        <div className="ma-header">
          <div className="sec-label" style={{ opacity: 0, transform: 'translateX(-30px)' }}>
            // Hall of Fame
          </div>
          <h2 className="ma-heading">
            More <span className="grad">Milestones</span>
          </h2>
        </div>

        <div className="ach-grid">
          {ACH_CARDS.map((card, i) => (
            <AchCard key={i} card={card} />
          ))}
        </div>
      </section>



      {/* ══ CTA ══ */}
      <section id="cta-section">
        <div className="cta-inner">
          <div className="cta-label" id="ctaLabel" style={{ opacity: 0 }}>
            // Be Part of the Legacy
          </div>
          <h2 className="cta-heading">
            <span className="line">
              <span className="word" style={{ transform: 'translateY(110%)', opacity: 0 }}>Write</span>
            </span>
            <span className="line">
              <span className="word grad" style={{ transform: 'translateY(110%)', opacity: 0 }}>Your Story</span>
            </span>
          </h2>
          <p className="cta-desc" id="ctaDesc" style={{ opacity: 0 }}>
            Every achievement here started with a student who decided to show up. The next chapter
            of ACM NIT Surat's legacy is yours to write.
          </p>
          <div className="cta-btns" id="ctaBtns" style={{ opacity: 0 }}>
            <Link to="/team" className="btn-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Meet the Team
            </Link>
            <Link to="/projects" className="btn-outline-gold">View Projects</Link>
          </div>
        </div>
      </section>
    </div>
  );
}