import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/projects.css';

gsap.registerPlugin(ScrollTrigger);

const TitleLine = ({ text, grad }) => (
  <span className="line">
    <span className={`word ${grad ? 'grad' : ''}`} style={{display:'inline-block'}}>
      {text}
    </span>
  </span>
);

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const hcRef = useRef(null);
  const featCanvasRef = useRef(null);

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        if (res.data.success) {
          setProjects(res.data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Animations & Canvas
  useEffect(() => {
    if (loading) return;

    let ctx = gsap.context(() => {
      // Hero Animations
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.to('#heroEyebrow', { opacity: 1, duration: 0.6 })
            .fromTo('.ph-title .word', { y: '110%' }, { y: '0%', duration: 0.9, stagger: 0.12, ease: 'expo.out' }, "-=0.4")
            .to('#heroDesc', { opacity: 1, duration: 0.7 }, "-=0.6")
            .to('#heroCount', { opacity: 1, duration: 0.8 }, "-=0.4")
            .to('#heroScroll', { opacity: 1, duration: 0.6 }, "-=0.6")
            .to('.ph-ring', { opacity: 1, duration: 1.5, stagger: 0.2 }, 0.2);

      // Rotating rings
      gsap.to('#ring1', { rotation: 360, duration: 40, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to('#ring2', { rotation: -360, duration: 60, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to('#ring3', { rotation: 360, duration: 25, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });

      // Scroll reveals
      gsap.to('#featuredProj', {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '#featuredProj', start: 'top 80%' }
      });

      gsap.to('.proj-card', {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '#projGrid', start: 'top 80%' }
      });

      // Stats counters
      gsap.utils.toArray('.stat-block').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: i * 0.1,
          scrollTrigger: {
            trigger: '#stats-section', start: 'top 80%',
            onEnter: () => {
              const num = el.querySelector('.stat-num');
              const target = +num.dataset.target;
              gsap.to({ v: 0 }, {
                v: target, duration: 2, ease: 'power2.out',
                onUpdate: function() { num.textContent = Math.round(this.targets()[0].v) + (target > 10 ? '+' : ''); }
              });
            }
          }
        });
      });

      // Section tags
      gsap.utils.toArray('.section-tag').forEach(el => {
        gsap.fromTo(el, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

      // Contribute section words
      gsap.utils.toArray('#contribute .reveal-word').forEach(el => {
        ScrollTrigger.create({
          trigger: el, start: 'top 85%',
          onEnter: () => gsap.fromTo(el, { y: '110%' }, { y: '0%', duration: 0.9, ease: 'expo.out' })
        });
      });

      // Contribute visual cards
      gsap.to('#cvMain', {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: '#ctaVisual', start: 'top 78%' }
      });
      gsap.to('#cvAlt', {
        opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: 'expo.out',
        scrollTrigger: { trigger: '#ctaVisual', start: 'top 78%' }
      });
      gsap.to('#ctaCta', {
        opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: '#ctaCta', start: 'top 88%' }
      });

    }, containerRef);

    // Hero Canvas
    const hc = hcRef.current;
    let hReq;
    if (hc) {
      const hctx = hc.getContext('2d');
      const hResize = () => { hc.width = hc.offsetWidth; hc.height = hc.offsetHeight; };
      hResize();
      window.addEventListener('resize', hResize);

      let mouseHX = window.innerWidth / 2, mouseHY = window.innerHeight / 2;
      const onMM = (e) => { mouseHX = e.clientX; mouseHY = e.clientY; };
      document.addEventListener('mousemove', onMM);

      const dots = [];
      for(let i = 0; i < 100; i++) {
        dots.push({
          x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.2 + 0.4
        });
      }

      const drawHero = () => {
        if (!hc.width) return;
        hctx.clearRect(0, 0, hc.width, hc.height);
        dots.forEach(d => {
          d.x += d.vx; d.y += d.vy;
          if (d.x < 0 || d.x > hc.width) d.vx *= -1;
          if (d.y < 0 || d.y > hc.height) d.vy *= -1;
          const dist = Math.hypot(d.x - mouseHX, d.y - mouseHY);
          const alpha = Math.max(0, 0.6 - dist / 400);
          hctx.beginPath(); hctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          hctx.fillStyle = `rgba(58,155,213,${alpha})`; hctx.fill();
        });
        for(let i=0; i<dots.length; i++){
          for(let j=i+1; j<dots.length; j++){
            const d = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
            if(d < 100){
              hctx.beginPath(); hctx.moveTo(dots[i].x, dots[i].y); hctx.lineTo(dots[j].x, dots[j].y);
              hctx.strokeStyle = `rgba(58,155,213,${(0.2 * (1 - d/100)).toFixed(3)})`;
              hctx.lineWidth = 0.5; hctx.stroke();
            }
          }
        }
        hReq = requestAnimationFrame(drawHero);
      };
      drawHero();

      ctx.add(() => {
        window.removeEventListener('resize', hResize);
        document.removeEventListener('mousemove', onMM);
        cancelAnimationFrame(hReq);
      });
    }

    // Featured Canvas
    const fc = featCanvasRef.current;
    let fReq;
    if (fc) {
      const fctx = fc.getContext('2d');
      const fResize = () => { fc.width = fc.offsetWidth; fc.height = fc.offsetHeight; };
      fResize();
      window.addEventListener('resize', fResize);

      const fDots = [];
      for(let i=0; i<50; i++){
        fDots.push({
          x: Math.random() * 500, y: Math.random() * 400,
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5, p: Math.random() * Math.PI * 2
        });
      }

      const drawFeat = () => {
        if(!fc.width || !fc.height){ fReq = requestAnimationFrame(drawFeat); return; }
        fctx.clearRect(0, 0, fc.width, fc.height);
        fDots.forEach(d => {
          d.p += 0.02; d.x += d.vx; d.y += d.vy;
          if(d.x < 0 || d.x > fc.width) d.vx *= -1;
          if(d.y < 0 || d.y > fc.height) d.vy *= -1;
          const alpha = 0.3 + 0.2 * Math.sin(d.p);
          fctx.beginPath(); fctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          fctx.fillStyle = `rgba(110,198,240,${alpha})`; fctx.fill();
        });
        for(let i=0; i<fDots.length; i++){
          for(let j=i+1; j<fDots.length; j++){
            const dist = Math.hypot(fDots[i].x - fDots[j].x, fDots[i].y - fDots[j].y);
            if(dist < 90){
              fctx.beginPath(); fctx.moveTo(fDots[i].x, fDots[i].y); fctx.lineTo(fDots[j].x, fDots[j].y);
              fctx.strokeStyle = `rgba(58,155,213,${(0.25 * (1 - dist/90)).toFixed(3)})`;
              fctx.lineWidth = 0.5; fctx.stroke();
            }
          }
        }
        fReq = requestAnimationFrame(drawFeat);
      };
      drawFeat();

      ctx.add(() => {
        window.removeEventListener('resize', fResize);
        cancelAnimationFrame(fReq);
      });
    }

    // Hero Parallax
    const handleScroll = () => {
      const y = window.scrollY;
      const hg1 = document.querySelector('.hero-glow');
      const hg2 = document.querySelector('.hero-glow2');
      const r1 = document.querySelector('#ring1');
      if (hg1) hg1.style.transform = `translateY(${y * 0.15}px)`;
      if (hg2) hg2.style.transform = `translateY(${-y * 0.1}px)`;
      if (r1) r1.style.transform = `translateY(${y * 0.05}px) rotate(${y * 0.2}deg)`;
    };
    window.addEventListener('scroll', handleScroll);

    // Magnetic Hover
    const cards = document.querySelectorAll('.proj-card');
    const handleMM = (e, card) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width * 8;
      const dy = (e.clientY - cy) / rect.height * 8;
      gsap.to(card, {
        rotateX: -dy, rotateY: dx, duration: 0.4, ease: 'power2.out',
        transformPerspective: 600, transformOrigin: '50% 50%'
      });
    };
    const handleML = (card) => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'expo.out' });
    };
    
    cards.forEach(card => {
      const onMove = (e) => handleMM(e, card);
      const onLeave = () => handleML(card);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      ctx.add(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, projects]);

  const featuredProject = projects.find(p => p.featured) || projects[0];
  const gridProjects = projects.filter(p => p !== featuredProject);

  return (
    <div ref={containerRef}>
      <Helmet>
        <title>Projects | ACM NIT Surat</title>
        <meta name="description" content="Explore what we've been shipping." />
      </Helmet>

      {/* HERO */}
      <section id="proj-hero">
        <canvas id="hero-canvas" ref={hcRef}></canvas>
        <div className="hero-grid-bg"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>

        <div className="ph-ring r1" id="ring1"></div>
        <div className="ph-ring r2" id="ring2"></div>
        <div className="ph-ring r3" id="ring3"></div>

        <div className="ph-content">
          <div className="ph-eyebrow" id="heroEyebrow">
            <div className="ph-tag">ACM NIT Surat</div>
            Innovation in Code
          </div>
          <h1 className="ph-title">
            <TitleLine text="OUR" />
            <TitleLine text="PROJECTS" grad />
          </h1>
          <p className="ph-desc" id="heroDesc">
            From frameworks that simplify web development to platforms that connect our chapter,
            every project here is built by students, for the world. Explore what we've been shipping.
          </p>
        </div>

        <div className="ph-count" id="heroCount">
          <div className="ph-count-num" id="projCountNum">{(projects.length || 0).toString().padStart(2, '0')}</div>
        </div>

        <div className="ph-scroll" id="heroScroll">
          <div className="ph-scroll-line"></div>
          Scroll to explore
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="marquee-item"><div className="marquee-dot"></div>Open Source</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Python</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Web Dev</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Competitive Programming</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Machine Learning</div>
              <div className="marquee-item"><div className="marquee-dot"></div>React</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Flask</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Innovation</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* PROJECTS GRID */}
      <section id="projects-section">
        {featuredProject && (
          <div className="proj-featured" id="featuredProj">
            <div className="proj-featured-visual">
              <canvas id="featCanvas" ref={featCanvasRef}></canvas>
              <div className="pf-icon">
                <div className="pf-icon-inner">ACM</div>
              </div>
            </div>
            <div className="proj-featured-body">
              <div className="proj-num">{featuredProject.number}</div>
              <div>
                <div className="section-tag" style={{marginBottom:'.6rem', opacity:1, transform:'none'}}>
                  Official Website
                </div>
                <h2 className="proj-card-title" style={{fontSize:'2.2rem', marginBottom:'.8rem'}}>
                  {featuredProject.name}
                </h2>
                <p className="proj-card-desc">
                  {featuredProject.description}
                </p>
                <div className="proj-tags">
                  {(featuredProject.techStack || []).map((tech, i) => (
                    <span key={i} className="proj-tag">{tech}</span>
                  ))}
                </div>
              </div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem'}}>
                <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
                  {featuredProject.liveUrl && (
                    <a href={featuredProject.liveUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{fontSize:'.62rem', padding:'.6rem 1.4rem'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Live Site
                    </a>
                  )}
                  {featuredProject.githubUrl && featuredProject.githubUrl !== '#' && (
                    <a href={featuredProject.githubUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{fontSize:'.62rem', padding:'.6rem 1.4rem'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                      GitHub
                    </a>
                  )}
                </div>
                <span className={`proj-card-status ${featuredProject.status === 'Active' ? 'active' : ''}`}>{featuredProject.status}</span>
              </div>
            </div>
          </div>
        )}

        <div className="proj-grid" id="projGrid">
          {gridProjects.map((p, i) => (
            <div key={i} className={`proj-card ${p.longDesc ? 'wide' : ''}`}>
              <div className="proj-card-header">
                <div className="proj-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </div>
                <span className="proj-card-num">{p.number}</span>
                <h3 className="proj-card-title">{p.name}</h3>
                <div className="proj-tags">
                  {(p.techStack || []).map((tech, idx) => (
                    <span key={idx} className="proj-tag">{tech}</span>
                  ))}
                </div>
              </div>
              <div className="proj-card-body">
                <p className="proj-card-desc">{p.description}</p>
                {p.longDesc && (
                  <ul style={{listStyle:'none', marginBottom:'1.5rem', display:'flex', flexDirection:'column', gap:'.5rem'}}>
                    {p.longDesc.split('. ').map((point, idx) => point && (
                      <li key={idx} style={{fontFamily:'var(--font-ui)', fontWeight:300, fontSize:'.85rem', color:'var(--w60)', display:'flex', alignItems:'flex-start', gap:'.5rem'}}>
                        <span style={{color:'var(--acl)', flexShrink:0}}>▸</span>{point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="proj-card-footer">
                {p.githubUrl && p.githubUrl !== '#' ? (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="proj-link">
                    View on GitHub
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </a>
                ) : (
                  <a href="#" className="proj-link" onClick={e => e.preventDefault()}>
                    Explore
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </a>
                )}
                <span className={`proj-card-status ${p.status === 'Active' ? 'active' : ''}`}>{p.status}</span>
              </div>
              <div className="proj-card-reveal">
                <div className="reveal-title">{p.name}</div>
                <p className="reveal-text">{p.description}</p>
                <div className="reveal-btns">
                  {p.githubUrl && p.githubUrl !== '#' && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn-sm-primary">GitHub ↗</a>}
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-sm-outline">Live Demo</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS STRIP */}
      <section id="stats-section">
        <div className="stats-grid">
          <div className="stat-block">
            <span className="stat-label">Projects Shipped</span>
            <span className="stat-num" data-target="2" id="s1">0</span>
            <p className="stat-desc">Across web, ML, tooling, and framework categories — all open source.</p>
          </div>
          <div className="stat-block">
            <span className="stat-label">Contributors</span>
            <span className="stat-num" data-target="40" id="s2">0</span>
            <p className="stat-desc">Student developers, designers, and researchers who built these products.</p>
          </div>
          <div className="stat-block">
            <span className="stat-label">GitHub Stars</span>
            <span className="stat-num" data-target="120" id="s3">0</span>
            <p className="stat-desc">Combined recognition from the open-source community globally.</p>
          </div>
          <div className="stat-block">
            <span className="stat-label">Active Projects</span>
            <span className="stat-num" data-target="2" id="s4">0</span>
            <p className="stat-desc">Currently maintained and accepting contributions from new members.</p>
          </div>
        </div>
      </section>

      {/* CONTRIBUTE */}
      <section id="contribute">
        <div className="contribute-inner">
          <div className="contribute-copy">
            <div className="section-tag" id="ctag">// Get Involved</div>
            <h2 className="section-heading" style={{marginBottom:'1.2rem'}}>
              <span className="reveal-line"><span className="reveal-word">BUILD</span></span><br/>
              <span className="reveal-line"><span className="reveal-word grad" style={{background:'linear-gradient(90deg,var(--acl),var(--ac))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>WITH US</span></span>
            </h2>
            <p style={{fontFamily:'var(--font-ui)', fontWeight:300, fontSize:'1.05rem', lineHeight:1.8, color:'var(--w60)', maxWidth:'480px'}}>
              Every project here started as a student's weekend idea. If you have a problem worth solving,
              or want to contribute to something that already ships — the ACM chapter is your launchpad.
            </p>
            <div className="contribute-cta" id="ctaCta">
              <a href="https://github.com/acmnitsurat" target="_blank" rel="noreferrer" className="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                View on GitHub
              </a>
            </div>
          </div>
          <div className="contribute-visual" id="ctaVisual">
            <div className="cv-card main" id="cvMain">
              <div className="cv-label">Active Repos</div>
              <div className="cv-num">02<small>open source projects</small></div>
              <ul className="cv-list">
                <li>ACM NIT Surat Website</li>
                <li>ButterFlask-UI</li>
              </ul>
            </div>
            <div className="cv-card alt" id="cvAlt">
              <div className="cv-label">Open Contributions</div>
              <div className="cv-num">12<small>open issues · good first</small></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
