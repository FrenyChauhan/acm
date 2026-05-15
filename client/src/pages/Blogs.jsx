import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/blogs.css';

gsap.registerPlugin(ScrollTrigger);

const TitleLine = ({ text, grad }) => (
  <span className="line">
    <span className={`word ${grad ? 'grad' : ''}`} style={{display:'inline-block'}}>
      {text}
    </span>
  </span>
);

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const containerRef = useRef(null);
  const hcRef = useRef(null);
  const featCanvasRef = useRef(null);

  // Fetch blogs
  useEffect(() => {
    api.get('/blogs')
      .then(res => {
        if (res.data.success) {
          setBlogs(res.data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Format date
  const fmtDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // GSAP Animations
  useEffect(() => {
    if (loading) return;

    let ctx = gsap.context(() => {
      // Hero
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.to('#heroEyebrow', { opacity: 1, duration: 0.6 })
            .fromTo('.bh-title .word', { y: '110%' }, { y: '0%', duration: 0.9, stagger: 0.12, ease: 'expo.out' }, "-=0.4")
            .to('#heroMeta', { opacity: 1, duration: 0.7 }, "-=0.4");

      // Scroll reveals
      if (document.querySelector('#featLabel')) {
        gsap.to('#featLabel', { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: '#featLabel', start: 'top 88%' } });
        gsap.to('#featCard', { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#featCard', start: 'top 80%' } });
      }
      
      const blogCards = gsap.utils.toArray('.blog-card');
      if (blogCards.length > 0) {
        gsap.to(blogCards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: '#blogGrid', start: 'top 80%' } });
      }

      document.querySelectorAll('.bc-title-word').forEach(el => {
        ScrollTrigger.create({
          trigger: el, start: 'top 88%',
          onEnter: () => gsap.to(el, { y: 0, duration: 0.8, ease: 'expo.out' })
        });
      });

      gsap.utils.toArray('.sub-section-tag').forEach(el => {
        gsap.to(el, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });

      gsap.to('#gridTag', { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: '#gridTag', start: 'top 88%' } });

      gsap.utils.toArray('#subscribe .reveal-word').forEach(el => {
        ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => gsap.to(el, { y: 0, duration: 0.9, ease: 'expo.out' }) });
      });

      gsap.to('#subForm', {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: {
          trigger: '#subForm', start: 'top 80%',
          onEnter: () => {
            document.querySelectorAll('.sub-stat-num').forEach(el => {
              const t = +el.dataset.target;
              gsap.to({ v: 0 }, { v: t, duration: 2, ease: 'power2.out', onUpdate: function() { el.textContent = Math.floor(this.targets()[0].v) + (t > 10 ? '+' : ''); } });
            });
          }
        }
      });
    }, containerRef);

    // Hero Canvas
    const hc = hcRef.current;
    let hReq;
    if (hc) {
      const hctx = hc.getContext('2d');
      const hR = () => { hc.width = hc.offsetWidth; hc.height = hc.offsetHeight; };
      hR(); window.addEventListener('resize', hR);
      let mhx = window.innerWidth / 2, mhy = window.innerHeight / 2;
      const onMM = (e) => { mhx = e.clientX; mhy = e.clientY; };
      document.addEventListener('mousemove', onMM);
      const dots = [];
      for (let i = 0; i < 90; i++) dots.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18, r: Math.random() * 1.2 + 0.4 });
      
      const dH = () => {
        if (!hc.width) return;
        hctx.clearRect(0, 0, hc.width, hc.height);
        dots.forEach(d => {
          d.x += d.vx; d.y += d.vy;
          if (d.x < 0 || d.x > hc.width) d.vx *= -1;
          if (d.y < 0 || d.y > hc.height) d.vy *= -1;
          const dist = Math.hypot(d.x - mhx, d.y - mhy);
          const a = Math.max(0, 0.6 - dist / 400);
          hctx.beginPath(); hctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); hctx.fillStyle = `rgba(58,155,213,${a})`; hctx.fill();
        });
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const d = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
            if (d < 100) {
              hctx.beginPath(); hctx.moveTo(dots[i].x, dots[i].y); hctx.lineTo(dots[j].x, dots[j].y);
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

    // Featured Canvas
    const fc = featCanvasRef.current;
    let fReq;
    if (fc) {
      const fctx = fc.getContext('2d');
      const fR = () => { fc.width = fc.offsetWidth; fc.height = fc.offsetHeight; };
      fR(); window.addEventListener('resize', fR);
      const fd = [];
      for (let i = 0; i < 40; i++) fd.push({ x: Math.random() * 600, y: Math.random() * 460, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.5 + 0.5, p: Math.random() * Math.PI * 2 });
      
      const dF = () => {
        if (!fc.width || !fc.height) { fReq = requestAnimationFrame(dF); return; }
        fctx.clearRect(0, 0, fc.width, fc.height);
        fd.forEach(d => {
          d.p += 0.018; d.x += d.vx; d.y += d.vy;
          if (d.x < 0 || d.x > fc.width) d.vx *= -1;
          if (d.y < 0 || d.y > fc.height) d.vy *= -1;
          const a = 0.2 + 0.15 * Math.sin(d.p);
          fctx.beginPath(); fctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); fctx.fillStyle = `rgba(110,198,240,${a})`; fctx.fill();
        });
        for (let i = 0; i < fd.length; i++) {
          for (let j = i + 1; j < fd.length; j++) {
            const dist = Math.hypot(fd[i].x - fd[j].x, fd[i].y - fd[j].y);
            if (dist < 100) {
              fctx.beginPath(); fctx.moveTo(fd[i].x, fd[i].y); fctx.lineTo(fd[j].x, fd[j].y);
              fctx.strokeStyle = `rgba(58,155,213,${(0.18 * (1 - dist / 100)).toFixed(3)})`;
              fctx.lineWidth = 0.5; fctx.stroke();
            }
          }
        }
        fReq = requestAnimationFrame(dF);
      };
      dF();
      ctx.add(() => {
        window.removeEventListener('resize', fR);
        cancelAnimationFrame(fReq);
      });
    }

    return () => ctx.revert();
  }, [loading, blogs, activeCat]);

  const featuredBlog = blogs.find(b => b.featured) || blogs[0];
  const filteredBlogs = activeCat === 'all' ? blogs : blogs.filter(b => b.category === activeCat);

  const handleSubscribe = () => {
    alert("Subscribed!");
  };

  return (
    <div ref={containerRef}>
      <Helmet>
        <title>Blog | ACM NIT Surat</title>
      </Helmet>

      {/* HERO */}
      <section id="blog-hero">
        <canvas id="hero-canvas" ref={hcRef}></canvas>
        <div className="hero-grid-bg"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>
        <div className="bh-inner">
          <div className="bh-eyebrow" id="heroEyebrow">
            <div className="bh-tag">ACM NIT Surat</div>
            Ideas · Research · Insights
          </div>
          <h1 className="bh-title">
            <TitleLine text="THE" />
            <TitleLine text="BLOG" grad />
          </h1>
          <div className="bh-meta-row" id="heroMeta">
            <p className="bh-desc">Student-authored deep-dives into algorithms, research, career paths, and the craft of computing — written by the people building tomorrow.</p>
            <div className="bh-scroll"><div className="bh-scroll-line"></div>Scroll to read</div>
          </div>
        </div>
      </section>

      {/* FEATURED BLOG */}
      {featuredBlog && (
        <section id="featured">
          <div className="featured-label" id="featLabel">// Featured Post</div>
          <div className="feat-card" id="featCard" onClick={() => setSelectedBlog(featuredBlog)}>
            <div className="feat-visual">
              <canvas className="feat-visual-canvas" id="featCanvas" ref={featCanvasRef}></canvas>
              <div className="feat-visual-icon">
                <pre className="fvi-formula">
{`E[X] = Σ E[Xᵢ]  i=1..n
      = Σ (1/i)
      ≤ ln(n) + 1
      = O(log n)`}
                </pre>
              </div>
            </div>
            <div className="feat-body">
              <div className="feat-num">{featuredBlog.number || '01'}</div>
              <div>
                <div className="feat-topic">{featuredBlog.category}</div>
                <h2 className="feat-title">{featuredBlog.title}</h2>
                <p className="feat-excerpt">{featuredBlog.excerpt}</p>
              </div>
              <div className="feat-author-row">
                <div className="feat-author">
                  <div className="author-avatar">{featuredBlog.author?.avatar || 'ACM'}</div>
                  <div>
                    <div className="author-name">{featuredBlog.author?.name || 'ACM Member'}</div>
                    <span className="author-date">{fmtDate(featuredBlog.publishedAt)} · {featuredBlog.readTime} min read</span>
                  </div>
                </div>
                <button className="read-btn" onClick={(e) => { e.stopPropagation(); setSelectedBlog(featuredBlog); }}>
                  Read Article
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="marquee-item"><div className="marquee-dot"></div>Algorithms</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Research</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Career</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Probability</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Open Source</div>
              <div className="marquee-item"><div className="marquee-dot"></div>CS Theory</div>
              <div className="marquee-item"><div className="marquee-dot"></div>Student Life</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* BLOG GRID */}
      <section id="blog-grid-section">
        <div className="bg-header">
          <div>
            <div className="sub-section-tag" id="gridTag" style={{marginBottom:'.8rem'}}>// All Posts</div>
            <h2 className="bg-heading"><span className="grad">Latest</span> Writing</h2>
          </div>
          <div className="bg-count"><strong id="visCount">{filteredBlogs.length}</strong> articles published</div>
        </div>

        <div className="cat-pills">
          <button className={`cat-pill ${activeCat === 'all' ? 'active' : ''}`} onClick={() => setActiveCat('all')}><span>All</span></button>
          <button className={`cat-pill ${activeCat === 'algorithms' ? 'active' : ''}`} onClick={() => setActiveCat('algorithms')}><span>Algorithms</span></button>
          <button className={`cat-pill ${activeCat === 'career' ? 'active' : ''}`} onClick={() => setActiveCat('career')}><span>Career</span></button>
          <button className={`cat-pill ${activeCat === 'research' ? 'active' : ''}`} onClick={() => setActiveCat('research')}><span>Research</span></button>
        </div>

        <div className="blog-grid" id="blogGrid">
          {filteredBlogs.map((b, i) => (
            <div key={b._id || i} className="blog-card" onClick={() => setSelectedBlog(b)}>
              <div className="blog-card-top">
                <span className="bc-num">{b.number || `0${i+1}`}</span>
                <div className="bc-cat"><div className="bc-dot"></div>{b.category}</div>
                <h3 className="bc-title">
                  {b.title.split(' ').map((word, wIdx) => (
                    <span key={wIdx} className="bc-title-line" style={{ display: 'inline-block', marginRight: '8px' }}>
                      <span className="bc-title-word">{word}</span>
                    </span>
                  ))}
                </h3>
                <p className="bc-desc">{b.excerpt}</p>
              </div>
              <div className="blog-card-bottom">
                <div className="bc-author">
                  <div className="bc-avatar">{b.author?.avatar || 'A'}</div>
                  <div>
                    <div className="bc-author-name">{b.author?.name || 'Author'}</div>
                    <div className="bc-date">{fmtDate(b.publishedAt)} · {b.readTime} min</div>
                  </div>
                </div>
                <button className="bc-link" onClick={(e) => { e.stopPropagation(); setSelectedBlog(b); }}>
                  Read
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section id="subscribe">
        <div className="sub-inner">
          <div className="sub-copy">
            <div className="sub-section-tag" id="subTag">// Stay in the Loop</div>
            <h2 className="sub-heading">
              <span className="reveal-line"><span className="reveal-word">Never</span></span><br/>
              <span className="reveal-line"><span className="reveal-word grad">Miss</span></span><br/>
              <span className="reveal-line"><span className="reveal-word">A Post</span></span>
            </h2>
            <p className="sub-desc">Get new articles from the ACM chapter delivered to your inbox. Student perspectives on CS, research, and everything in between.</p>
          </div>
          <div className="sub-form" id="subForm">
            <div className="sub-stats">
              <div className="sub-stat">
                <span className="sub-stat-num" data-target="200" id="ss1">0</span>
                <div className="sub-stat-label">Readers</div>
              </div>
              <div className="sub-stat">
                <span className="sub-stat-num" data-target="2" id="ss2">0</span>
                <div className="sub-stat-label">Articles</div>
              </div>
              <div className="sub-stat">
                <span className="sub-stat-num" data-target="8" id="ss3">0</span>
                <div className="sub-stat-label">Topics</div>
              </div>
            </div>
            <div className="sub-field">
              <input type="email" className="sub-input" placeholder="your@email.com" id="subEmail" />
              <button className="sub-btn" onClick={handleSubscribe}>Subscribe</button>
            </div>
            <div className="sub-note">No spam · Unsubscribe anytime</div>
          </div>
        </div>
      </section>

      {/* ARTICLE OVERLAY */}
      <div id="article-overlay" className={selectedBlog ? 'open' : ''}>
        <div className="ao-backdrop" onClick={() => setSelectedBlog(null)}></div>
        <div className="ao-panel" id="aoPanel">
          <div className="ao-close">
            <span className="ao-close-label">ACM NIT Surat · Blog</span>
            <button className="ao-close-btn" onClick={() => setSelectedBlog(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Close
            </button>
          </div>
          {selectedBlog && (
            <div id="aoContent">
              <div className="ao-header">
                <div className="ao-cat">{selectedBlog.category}</div>
                <h1 className="ao-title">{selectedBlog.title}</h1>
              </div>
              <div className="ao-author-bar">
                <div className="ao-avatar">{selectedBlog.author?.avatar || 'A'}</div>
                <div>
                  <div className="ao-author-name">{selectedBlog.author?.name || 'Author'}</div>
                  <div className="ao-author-meta">{fmtDate(selectedBlog.publishedAt)} · {selectedBlog.readTime} min read · {selectedBlog.category}</div>
                </div>
              </div>
              <div className="ao-body" dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
