import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/team.css';

gsap.registerPlugin(ScrollTrigger);

const ROLE_GRADS = {
  leadership: 'linear-gradient(160deg,#0c1e33 0%,#1a5c8a 60%,#04090f 100%)',
  developer: 'linear-gradient(160deg,#081320 0%,#0f3a5c 60%,#04090f 100%)',
  designer: 'linear-gradient(160deg,#10152a 0%,#1a3a6a 60%,#04090f 100%)',
  'problem-setter': 'linear-gradient(160deg,#0a1a22 0%,#0d4a5a 60%,#04090f 100%)',
  core: 'linear-gradient(160deg,#081320 0%,#1a5c8a 50%,#04090f 100%)',
};

const iconMail = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const iconLI = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const iconGH = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
const iconTW = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;

const initials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'A';

const MemberCard = ({ m, isLeader }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let w, h, pts = [];
    let req;

    const resize = () => {
      w = c.width = c.offsetWidth;
      h = c.height = c.offsetHeight;
      pts = [];
      for (let i = 0; i < 20; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.2 + 0.4,
          p: Math.random() * Math.PI * 2
        });
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(c);

    const draw = () => {
      if (!w || !h) { req = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);
      pts.forEach(d => {
        d.p += 0.025; d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        const a = (0.15 + 0.1 * Math.sin(d.p));
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110,198,240,${a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 70) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(58,155,213,${(0.12 * (1 - d / 70)).toFixed(3)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      req = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(req);
    };
  }, []);

  return (
    <div className={`member-card ${isLeader ? 'leader-card' : ''}`}>
      <div className="mc-photo" style={{ background: ROLE_GRADS[m.category] || ROLE_GRADS.core }}>
        {!m.photo?.url && <canvas className="mc-photo-canvas" ref={canvasRef}></canvas>}
        {m.photo?.url ? (
          <img src={m.photo.url} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) contrast(1.1)' }} />
        ) : (
          <div className="mc-initials">{initials(m.name)}</div>
        )}
        <div className="mc-role-badge">{m.role}</div>
      </div>
      <div className="mc-body">
        <div className="mc-name">{m.name}</div>
        <div className="mc-role">{m.role}</div>
      </div>
      <div className="mc-foot">
        {m.email && <a href={`mailto:${m.email}`} className="mc-soc" title="Email">{iconMail}</a>}
        {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" className="mc-soc" title="LinkedIn">{iconLI}</a>}
        {m.github && <a href={m.github} target="_blank" rel="noreferrer" className="mc-soc" title="GitHub">{iconGH}</a>}
        {m.twitter && <a href={m.twitter} target="_blank" rel="noreferrer" className="mc-soc" title="Twitter">{iconTW}</a>}
      </div>
    </div>
  );
};

const FacultyCard = ({ fac }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (fac.photo?.url) return; // No canvas needed if photo exists
    
    const fc = canvasRef.current;
    if (!fc) return;
    const fctx = fc.getContext('2d');
    let fReq;
    const fR = () => { fc.width = fc.offsetWidth; fc.height = fc.offsetHeight; };
    fR();
    const observer = new ResizeObserver(fR);
    observer.observe(fc);

    const fpts = [];
    for (let i = 0; i < 50; i++) fpts.push({ x: Math.random() * 600, y: Math.random() * 400, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.5, p: Math.random() * Math.PI * 2 });
    
    const dF = () => {
      if (!fc.width || !fc.height) { fReq = requestAnimationFrame(dF); return; }
      fctx.clearRect(0, 0, fc.width, fc.height);
      fpts.forEach(d => {
        d.p += 0.018; d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > fc.width) d.vx *= -1;
        if (d.y < 0 || d.y > fc.height) d.vy *= -1;
        const a = 0.18 + 0.12 * Math.sin(d.p);
        fctx.beginPath(); fctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); fctx.fillStyle = `rgba(110,198,240,${a})`; fctx.fill();
      });
      for (let i = 0; i < fpts.length; i++) {
        for (let j = i + 1; j < fpts.length; j++) {
          const d = Math.hypot(fpts[i].x - fpts[j].x, fpts[i].y - fpts[j].y);
          if (d < 100) {
            fctx.beginPath(); fctx.moveTo(fpts[i].x, fpts[i].y); fctx.lineTo(fpts[j].x, fpts[j].y);
            fctx.strokeStyle = `rgba(58,155,213,${(0.15 * (1 - d / 100)).toFixed(3)})`;
            fctx.lineWidth = 0.5; fctx.stroke();
          }
        }
      }
      fReq = requestAnimationFrame(dF);
    };
    dF();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(fReq);
    };
  }, [fac.photo?.url]);

  return (
    <div className="faculty-card">
      <div className="faculty-photo-side">
        {!fac.photo?.url && <canvas ref={canvasRef}></canvas>}
        {fac.photo?.url ? (
          <img src={fac.photo.url} alt={fac.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(15%)' }} />
        ) : (
          <div className="faculty-avatar-wrap">
            <div className="faculty-initials-ring">
              <div className="faculty-initials">{initials(fac.name)}</div>
            </div>
            <div className="faculty-role-badge">{fac.role}</div>
          </div>
        )}
      </div>
      <div className="faculty-info-side">
        <div>
          <div className="faculty-name">{fac.name}</div>
          <div className="faculty-dept">{fac.department || 'Department of Computer Science & Engineering · NIT Surat'}</div>
          <p className="faculty-bio">
            {fac.quote || 'Provides strategic guidance and institutional support to the ACM NIT Surat student chapter. A dedicated mentor to computer science students, they champion innovation, research, and professional development — helping the chapter connect academia with the real world of computing.'}
          </p>
          <div className="faculty-meta">
            <div className="fmeta-item">Faculty ACM Member</div>
            <div className="fmeta-item">Mentor</div>
            <div className="fmeta-item">NIT Surat</div>
          </div>
          <div className="faculty-socials">
            {fac.email && <a href={`mailto:${fac.email}`} className="soc-btn" title="Email">{iconMail}</a>}
            {fac.linkedin && <a href={fac.linkedin} target="_blank" rel="noreferrer" className="soc-btn" title="LinkedIn">{iconLI}</a>}
            {fac.github && <a href={fac.github} target="_blank" rel="noreferrer" className="soc-btn" title="GitHub">{iconGH}</a>}
            {fac.twitter && <a href={fac.twitter} target="_blank" rel="noreferrer" className="soc-btn" title="Twitter">{iconTW}</a>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Team() {
  const YEARS = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const [activeYear, setActiveYear] = useState('2025');
  const [activeRole, setActiveRole] = useState('all');
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const heroCanvasRef = useRef(null);
  const yearWrapRef = useRef(null);

  useEffect(() => {
    api.get('/team')
      .then(res => {
        if (res.data.success) {
          setTeamData(res.data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter Data
  const { faculty, leadership, others } = useMemo(() => {
    const yrMembers = teamData.filter(m => m.year === activeYear);
    const faculty = yrMembers.filter(m => m.isFaculty);
    const roleFiltered = activeRole === 'all' ? yrMembers.filter(m => !m.isFaculty) : yrMembers.filter(m => !m.isFaculty && m.category === activeRole);
    const leadership = roleFiltered.filter(m => m.category === 'leadership');
    const others = roleFiltered.filter(m => m.category !== 'leadership');
    return { faculty, leadership, others };
  }, [teamData, activeYear, activeRole]);

  useEffect(() => {
    if (loading) return;
    
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to('#hEye', { opacity: 1, duration: 0.6 })
        .fromTo('.h-title .word', { y: '110%' }, { y: '0%', duration: 0.9, stagger: 0.12, ease: 'expo.out' }, "-=0.4")
        .to('#hMeta', { opacity: 1, duration: 0.7 }, "-=0.4")
        .to('#hBigNum', { opacity: 1, duration: 1.2 }, "-=0.5")
        .to('.hero-ring', { opacity: 1, duration: 1.5, stagger: 0.2 }, "-=1")
        .to('#heroPhoto', { opacity: 1, x: 0, duration: 1.2, ease: 'expo.out' }, "-=1.2");

      gsap.to('#ring1', { rotation: 360, duration: 50, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to('#ring2', { rotation: -360, duration: 70, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to('#ring3', { rotation: 360, duration: 30, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });

      const facLabel = document.querySelector('#facLabel');
      if (facLabel) {
        gsap.fromTo('#facLabel', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: '#facLabel', start: 'top 88%' } });
        const facCards = gsap.utils.toArray('.faculty-card');
        if (facCards.length > 0) {
          gsap.fromTo(facCards, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'expo.out', scrollTrigger: { trigger: '#facCardsWrap', start: 'top 80%' } });
        }
      }
      
      gsap.to('#teamLabel', { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: '#teamLabel', start: 'top 88%' } });
      
      const memberCards = gsap.utils.toArray('.member-card');
      if (memberCards.length > 0) {
        gsap.to(memberCards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '#teamGrid', start: 'top 85%' } });
      }

      gsap.utils.toArray('.js-tag').forEach(el => gsap.to(el, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
      
      gsap.utils.toArray('.rv-w').forEach(el => {
        ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => gsap.to(el, { y: 0, duration: 0.9, ease: 'expo.out' }) });
      });

      gsap.to('#jsCta', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: '#jsCta', start: 'top 85%' } });
      gsap.to('#jsStats', {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: {
          trigger: '#jsStats', start: 'top 80%',
          onEnter: () => {
            document.querySelectorAll('.js-stat-num').forEach(el => {
              const t = +el.dataset.t;
              gsap.to({ v: 0 }, { v: t, duration: 2, ease: 'power2.out', onUpdate: function() { el.textContent = Math.floor(this.targets()[0].v) + (t > 50 ? '+' : ''); } });
            });
          }
        }
      });
    }, containerRef);

    // Hero Canvas
    const hc = heroCanvasRef.current;
    let hReq;
    if (hc) {
      const hctx = hc.getContext('2d');
      const hR = () => { hc.width = hc.offsetWidth; hc.height = hc.offsetHeight; };
      hR(); window.addEventListener('resize', hR);
      let mhx = window.innerWidth / 2, mhy = window.innerHeight / 2;
      const onMM = (e) => { mhx = e.clientX; mhy = e.clientY; };
      document.addEventListener('mousemove', onMM);
      const hdots = [];
      for (let i = 0; i < 100; i++) hdots.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18, r: Math.random() * 1.2 + 0.4 });
      
      const dH = () => {
        hctx.clearRect(0, 0, hc.width, hc.height);
        hdots.forEach(d => {
          d.x += d.vx; d.y += d.vy;
          if (d.x < 0 || d.x > hc.width) d.vx *= -1;
          if (d.y < 0 || d.y > hc.height) d.vy *= -1;
          const dist = Math.hypot(d.x - mhx, d.y - mhy);
          const a = Math.max(0, 0.6 - dist / 400);
          hctx.beginPath(); hctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); hctx.fillStyle = `rgba(58,155,213,${a})`; hctx.fill();
        });
        for (let i = 0; i < hdots.length; i++) {
          for (let j = i + 1; j < hdots.length; j++) {
            const d = Math.hypot(hdots[i].x - hdots[j].x, hdots[i].y - hdots[j].y);
            if (d < 100) {
              hctx.beginPath(); hctx.moveTo(hdots[i].x, hdots[i].y); hctx.lineTo(hdots[j].x, hdots[j].y);
              hctx.strokeStyle = `rgba(58,155,213,${(0.2 * (1 - d / 100)).toFixed(3)})`;
              hctx.lineWidth = 0.5; hctx.stroke();
            }
          }
        }
        hReq = requestAnimationFrame(dH);
      };
      dH();
      ctx.add(() => {
        window.removeEventListener('resize', hR);
        document.removeEventListener('mousemove', onMM);
        cancelAnimationFrame(hReq);
      });
    }

      // Scroll scroll wrap if any
      if (yearWrapRef.current) {
      setTimeout(() => {
        yearWrapRef.current.scrollLeft = yearWrapRef.current.scrollWidth;
      }, 200);
    }

    return () => ctx.revert();
  }, [loading, activeRole, activeYear, teamData]);

  const handleYearClick = (yr) => {
    setActiveYear(yr.toString());
    gsap.fromTo('#hBigNum', { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' });
  };

  return (
    <div ref={containerRef}>
      <Helmet>
        <title>Team | ACM NIT Surat</title>
      </Helmet>

      {/* HERO */}
      <section id="team-hero">
        <canvas id="hero-canvas" ref={heroCanvasRef}></canvas>
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>
        <div className="hero-ring r1" id="ring1"></div>
        <div className="hero-ring r2" id="ring2"></div>
        <div className="hero-ring r3" id="ring3"></div>

        <div className="hero-photo-wrap" id="heroPhoto">
          <img src="/acm-group-photo25.jpg" alt="ACM NIT Surat 2025 Core Team" />
        </div>

        <div className="hero-content">
          <div className="h-eyebrow" id="hEye"><div className="h-tag">ACM NIT Surat</div>The People Behind the Code</div>
          <h1 className="h-title">
            <span className="line"><span className="word" style={{display:'inline-block'}}>MEET</span></span>
            <span className="line"><span className="word grad" style={{display:'inline-block'}}>THE TEAM</span></span>
          </h1>
          <div className="h-meta" id="hMeta">
            <p className="h-desc">Every event, project, and blog is powered by these extraordinary students. The core team of ACM NIT Surat — engineers, designers, writers, and organizers — making the chapter what it is.</p>
            <div className="h-scroll"><div className="h-scroll-line"></div>Scroll to explore</div>
          </div>
        </div>
        <div className="h-big-num" id="hBigNum">{activeYear}</div>
      </section>

      {/* YEAR TIMELINE */}
      <div id="year-section">
        <div className="year-track-wrap" ref={yearWrapRef}>
          <div className="year-track">
            {YEARS.map(yr => (
              <div key={yr} className={`year-node ${activeYear === yr.toString() ? 'active' : ''}`} onClick={() => handleYearClick(yr)}>
                <div className="yn-count">{yr}</div>
                <div className="yn-dot"></div>
                <div className="yn-label">{yr.toString() === '2025' ? 'Current' : ''}</div>
                {activeYear === yr.toString() && <div className="yn-active-pill">→ Active</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="marquee-section" id="mq1">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="mqi"><div className="mqdot"></div>Chairperson</div>
              <div className="mqi"><div className="mqdot"></div>Developer</div>
              <div className="mqi"><div className="mqdot"></div>Designer</div>
              <div className="mqi"><div className="mqdot"></div>Secretary</div>
              <div className="mqi"><div className="mqdot"></div>Problem Setter</div>
              <div className="mqi"><div className="mqdot"></div>Treasurer</div>
              <div className="mqi"><div className="mqdot"></div>Community Head</div>
              <div className="mqi"><div className="mqdot"></div>Core Member</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* FACULTY ADVISOR */}
      {faculty.length > 0 && (
        <section id="faculty-section">
          <div className="sec-label" id="facLabel">// Faculty Leadership</div>
          <div id="facCardsWrap" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {faculty.map((fac, idx) => (
              <FacultyCard key={idx} fac={fac} />
            ))}
          </div>
        </section>
      )}

      {/* TEAM SECTION */}
      <section id="team-section">
        <div className="team-header" id="teamHdr">
          <div>
            <div className="sec-label" id="teamLabel">// Core Leadership · {activeYear}</div>
            <h2 className="team-heading"><span className="grad">Core</span> Leadership</h2>
          </div>
          <div className="team-total"><strong>{leadership.length + others.length}</strong> members · {activeYear}</div>
        </div>

        <div className="role-filters" id="roleFilters">
          <button className={`rf-btn ${activeRole === 'all' ? 'active' : ''}`} onClick={() => setActiveRole('all')}><span>All Roles</span></button>
          <button className={`rf-btn ${activeRole === 'leadership' ? 'active' : ''}`} onClick={() => setActiveRole('leadership')}><span>Leadership</span></button>
          <button className={`rf-btn ${activeRole === 'developer' ? 'active' : ''}`} onClick={() => setActiveRole('developer')}><span>Developer</span></button>
          <button className={`rf-btn ${activeRole === 'designer' ? 'active' : ''}`} onClick={() => setActiveRole('designer')}><span>Designer</span></button>
          <button className={`rf-btn ${activeRole === 'problem-setter' ? 'active' : ''}`} onClick={() => setActiveRole('problem-setter')}><span>Problem Setter</span></button>
          <button className={`rf-btn ${activeRole === 'core' ? 'active' : ''}`} onClick={() => setActiveRole('core')}><span>Core Member</span></button>
        </div>

        {(leadership.length > 0 || others.length > 0) && (
          <div className="team-grid" id="teamGrid">
            {leadership.map((m, i) => <MemberCard key={m._id || i} m={m} isLeader={false} />)}
            {others.map((m, i) => <MemberCard key={m._id || i} m={m} isLeader={false} />)}
          </div>
        )}
        
        {leadership.length === 0 && others.length === 0 && !loading && (
          <div className="p-10 text-center text-gray-500 border border-gray-800" style={{ background: 'var(--b1)' }}>
            No members found for {activeYear}.
          </div>
        )}
      </section>

      {/* JOIN STRIP */}
      <section id="join-strip">
        <div className="js-inner">
          <div className="js-copy">
            <div className="js-tag" id="jsTag">// Join the Chapter</div>
            <h2 className="js-heading">
              <span className="line"><span className="rv-w" style={{display:'inline-block'}}>Be Part</span></span><br/>
              <span className="line"><span className="rv-w grad" style={{display:'inline-block'}}>of the</span></span><br/>
              <span className="line"><span className="rv-w" style={{display:'inline-block'}}>Legacy</span></span>
            </h2>
            <p className="js-desc">The team grows every year. If you're passionate about computing, problem-solving, or just want to be part of something meaningful — ACM NIT Surat is your home.</p>
            <div className="js-cta" id="jsCta">
              <a href="#" className="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                Apply Now
              </a>
              <a href="#" className="btn-outline">Learn More</a>
            </div>
          </div>
          <div className="js-stats" id="jsStats">
            <div className="js-stat"><span className="js-stat-num" data-t="15" id="jss1">0</span><div className="js-stat-label">Years Active</div></div>
            <div className="js-stat"><span className="js-stat-num" data-t="200" id="jss2">0</span><div className="js-stat-label">Alumni+</div></div>
            <div className="js-stat"><span className="js-stat-num" data-t="18" id="jss3">0</span><div className="js-stat-label">2025 Team</div></div>
            <div className="js-stat"><span className="js-stat-num" data-t="8" id="jss4">0</span><div className="js-stat-label">Projects</div></div>
          </div>
        </div>
      </section>

    </div>
  );
}
