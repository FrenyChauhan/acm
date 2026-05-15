import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../styles/home.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      if (response.data.success) {
        toast.success(response.data.message || 'Message received! An email has been sent to the admin.');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Canvas animation
    const hcanvas = canvasRef.current;
    if (!hcanvas) return;
    const hctx = hcanvas.getContext('2d');
    let animationFrameId;
    
    const hResize = () => {
      hcanvas.width = hcanvas.offsetWidth;
      hcanvas.height = hcanvas.offsetHeight;
    };
    hResize();
    window.addEventListener('resize', hResize);
    
    let mouseHX = 0, mouseHY = 0;
    const handleMouseMove = (e) => {
      mouseHX = e.clientX;
      mouseHY = e.clientY;
    };
    document.addEventListener('mousemove', handleMouseMove);
    
    const dots = [];
    for(let i = 0; i < 120; i++) {
      dots.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - .5) * .15,
        vy: (Math.random() - .5) * .15,
        r: Math.random() * 1.2 + .4
      });
    }
    
    const drawHero = () => {
      hctx.clearRect(0, 0, hcanvas.width, hcanvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if(d.x < 0 || d.x > hcanvas.width) d.vx *= -1;
        if(d.y < 0 || d.y > hcanvas.height) d.vy *= -1;
        const dist = Math.hypot(d.x - mouseHX, d.y - mouseHY);
        const alpha = Math.max(0, .6 - dist / 400);
        hctx.beginPath(); hctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        hctx.fillStyle = `rgba(58,155,213,${alpha})`; hctx.fill();
      });
      for(let i = 0; i < dots.length; i++) {
        for(let j = i + 1; j < dots.length; j++) {
          const d = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
          if(d < 110) {
            hctx.beginPath(); hctx.moveTo(dots[i].x, dots[i].y); hctx.lineTo(dots[j].x, dots[j].y);
            hctx.strokeStyle = `rgba(58,155,213,${(.22*(1-d/110)).toFixed(3)})`;
            hctx.lineWidth = .5; hctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(drawHero);
    };
    drawHero();

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Counter animation
      document.querySelectorAll('.hero-stat-num').forEach(el => {
        const target = +el.dataset.target;
        gsap.to({ v: 0 }, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].v) + (target >= 100 ? '+' : '');
          },
          scrollTrigger: {
            trigger: '.hero-stats',
            start: 'top 90%',
            once: true
          }
        });
      });

      // ScrollTrigger reveals
      const revealWords = (selector) => {
        document.querySelectorAll(selector + ' .reveal-word').forEach(el => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            onEnter: () => gsap.to(el, { y: 0, duration: .9, ease: 'expo.out' })
          });
        });
      };
      ['#about', '#whatwedo', '#events', '#testimonials', '#contact'].forEach(s => revealWords(s));

      gsap.from('#aboutVisual .about-card', {
        y: 60, opacity: 0, duration: .9, stagger: .2, ease: 'expo.out',
        scrollTrigger: { trigger: '#aboutVisual', start: 'top 75%' }
      });

      gsap.from('.wwd-card', {
        y: 50, opacity: 0, duration: .8, stagger: .15, ease: 'expo.out',
        scrollTrigger: { trigger: '.wwd-grid', start: 'top 75%' }
      });

      gsap.from('.event-card', {
        y: 60, opacity: 0, duration: .9, stagger: .18, ease: 'expo.out',
        scrollTrigger: { trigger: '.events-grid', start: 'top 75%' }
      });

      gsap.from('.contact-info-block, .contact-form', {
        y: 40, opacity: 0, duration: .8, stagger: .15, ease: 'expo.out',
        scrollTrigger: { trigger: '#contact .contact-grid', start: 'top 75%' }
      });

      gsap.from('.join-inner > *', {
        y: 40, opacity: 0, duration: .9, stagger: .2, ease: 'expo.out',
        scrollTrigger: { trigger: '#join', start: 'top 75%' }
      });

      // Hero deco slow rotation
      gsap.to('.hero-deco-diamond', {
        rotation: '+=4', yoyo: true, repeat: -1, duration: 6, ease: 'sine.inOut'
      });

      // Section number lines
      gsap.utils.toArray('.section-tag').forEach(el => {
        gsap.from(el, {
          x: -30, opacity: 0, duration: .7, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });
      
      // Hero Entrance
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.to('#heroEyebrow', { opacity: 1, duration: .6 })
            .to('.hero-title .word', { y: 0, duration: .9, stagger: .12, ease: 'expo.out' }, '-=0.4')
            .to('#heroDesc', { opacity: 1, duration: .7 }, '-=0.5')
            .to('#heroBtns', { opacity: 1, duration: .6 }, '-=0.5')
            .to('#heroDeco', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8')
            .to('#heroStats', { opacity: 1, duration: .6 }, '-=0.5')
            .to('#heroScroll', { opacity: 1, duration: .6 }, '-=0.5');
    });

    const handleScrollEffects = () => {
      const y = window.scrollY;
      const heroGlow = document.querySelector('.hero-glow');
      const heroGlow2 = document.querySelector('.hero-glow2');
      if (heroGlow) heroGlow.style.transform = `translateY(${y*.15}px)`;
      if (heroGlow2) heroGlow2.style.transform = `translateY(${-y*.1}px)`;
    };
    window.addEventListener('scroll', handleScrollEffects);

    return () => {
      window.removeEventListener('resize', hResize);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScrollEffects);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>ACM NIT Surat — Student Chapter</title>
      </Helmet>

      {/* ══════════ HERO ══════════════════════════════════════ */}
      <section id="hero">
        <canvas id="hero-canvas" ref={canvasRef}></canvas>
        <div className="hero-grid-bg"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>

        <div className="hero-content">
          <div className="hero-eyebrow" id="heroEyebrow">
            <span className="hero-tag">Est. 2005 · SVNIT</span>
            Student Chapter · Surat, Gujarat
          </div>
          <h1 className="hero-title" id="heroTitle">
            <span className="line"><span className="word">Computing</span></span>
            <span className="line"><span className="word grad">NIT</span>&nbsp;<span className="word">Surat</span></span>
            <span className="line"><span className="word">Chapter</span></span>
          </h1>
          <p className="hero-desc" id="heroDesc">
            Inspiring dialogue, resource-sharing, and tackling real challenges in computing — through hackathons, coding contests, workshops, and meaningful community.
          </p>
          <div className="hero-btns" id="heroBtns">
            <a href="#events" className="btn-primary">Explore Events →</a>
            <a href="#about" className="btn-outline">Our Story</a>
          </div>
        </div>

        {/* decorative ACM diamond */}
        <div className="hero-deco" id="heroDeco">
          <div className="hero-deco-ring r2"></div>
          <div className="hero-deco-ring r1"></div>
          <div className="hero-deco-diamond">
            <div className="hero-deco-circle">
              <div className="hero-deco-c"><span>acm</span></div>
            </div>
          </div>
        </div>

        <div className="hero-stats" id="heroStats">
          <div className="hero-stat">
            <span className="hero-stat-num" data-target="19">0</span>
            <span className="hero-stat-label">Years Active</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num" data-target="500">0</span>
            <span className="hero-stat-label">Members</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num" data-target="50">0</span>
            <span className="hero-stat-label">Events Hosted</span>
          </div>
        </div>

        <div className="hero-scroll" id="heroScroll">
          <div className="hero-scroll-line"></div>
          Scroll to explore
        </div>
      </section>

      {/* ══════════ MARQUEE ══════════════════════════════════ */}
      <div className="marquee-section">
        <div className="marquee-track">
          {/* duplicate for seamless loop */}
          <div className="marquee-item"><span className="marquee-dot"></span>Dotslash Hackathon</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Epiphany Coding Contest</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Tech Talks</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Inception DSA</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Open Source Projects</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Workshops &amp; Bootcamps</div>
          <div className="marquee-item"><span className="marquee-dot"></span>ACM NIT Surat Est. 2005</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Dotslash Hackathon</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Epiphany Coding Contest</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Tech Talks</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Inception DSA</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Open Source Projects</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Workshops &amp; Bootcamps</div>
          <div className="marquee-item"><span className="marquee-dot"></span>ACM NIT Surat Est. 2005</div>
        </div>
      </div>

      {/* ══════════ ABOUT ══════════════════════════════════ */}
      <section id="about">
        <div className="about-grid">
          <div className="about-visual" id="aboutVisual">
            <div className="about-card main">
              <div className="about-card-label">Founded</div>
              <div className="about-card-num">2005<small>Student Chapter · SVNIT Surat</small></div>
              <ul className="about-card-list">
                <li>International ACM Network</li>
                <li>Coding · Design · Development</li>
                <li>Annual flagship events</li>
              </ul>
              <span className="about-card-since">XIX</span>
            </div>
            <div className="about-card accent">
              <div className="about-card-label">Impact</div>
              <div className="about-card-num">500+<small>Active Members Engaged</small></div>
            </div>
            <div className="about-dot-grid">
              <span></span><span></span><span></span><span></span><span></span><span></span>
              <span></span><span></span><span></span><span></span><span></span><span></span>
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>

          <div className="about-text">
            <div className="section-tag">About Us</div>
            <h2 className="section-heading">
              <span className="reveal-line"><span className="reveal-word">We are</span></span>
              <span className="reveal-line"><span className="reveal-word grad">ACM NIT</span></span>
              <span className="reveal-line"><span className="reveal-word">Surat</span></span>
            </h2>
            <p className="about-body">
              ACM NIT Surat student chapter, established in 2005, is an integral part of the International Learned Society for Computing, ACM. Comprising a dedicated team of computing educators, researchers, and professionals, the chapter aims to inspire dialogue, resource-sharing, and tackling challenges in the field of computing.
            </p>
            <div className="about-highlights">
              <div className="highlight-item">
                <h4>Hackathons</h4>
                <p>Dotslash — our flagship 24-hour hackathon with nationwide participation.</p>
              </div>
              <div className="highlight-item">
                <h4>Contests</h4>
                <p>Epiphany — inter-college competitive programming at its finest.</p>
              </div>
              <div className="highlight-item">
                <h4>Workshops</h4>
                <p>Hands-on tech talks and bootcamps across web, ML, and systems.</p>
              </div>
              <div className="highlight-item">
                <h4>Community</h4>
                <p>A vibrant network of coders, designers, and innovators at SVNIT.</p>
              </div>
            </div>
            <div className="about-social">
              <a href="mailto:acm@svnit.ac.in" className="social-link">✉ Mail</a>
              <a href="https://github.com/acm-svnit" className="social-link" target="_blank" rel="noreferrer">⌥ GitHub</a>
              <a href="https://linkedin.com/company/acmnitsurat" className="social-link" target="_blank" rel="noreferrer">in LinkedIn</a>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* ══════════ WHAT WE DO ════════════════════════════ */}
      <section id="whatwedo">
        <div className="section-tag">Our Activities</div>
        <h2 className="section-heading">
          <span className="reveal-line"><span className="reveal-word">What We</span></span>
          <span className="reveal-line"><span className="reveal-word grad">Do</span></span>
        </h2>
        <div className="wwd-grid">
          <div className="wwd-card">
            <span className="wwd-num">01 / 04</span>
            <div className="wwd-icon">
              <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div className="wwd-title">Hackathons &amp; Competitions</div>
            <p className="wwd-desc">From Dotslash to Epiphany, we host high-energy events that challenge and inspire students to build, break, and innovate under pressure.</p>
          </div>
          <div className="wwd-card">
            <span className="wwd-num">02 / 04</span>
            <div className="wwd-icon">
              <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div className="wwd-title">Tech Talks &amp; Workshops</div>
            <p className="wwd-desc">Curated sessions by industry experts, alumni, and faculty — covering web development, machine learning, open source, and emerging technologies.</p>
          </div>
          <div className="wwd-card">
            <span className="wwd-num">03 / 04</span>
            <div className="wwd-icon">
              <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div className="wwd-title">Real-World Projects</div>
            <p className="wwd-desc">Members collaborate across web, mobile, and hardware projects — building portfolio-worthy work while sharpening engineering and teamwork skills.</p>
          </div>
          <div className="wwd-card">
            <span className="wwd-num">04 / 04</span>
            <div className="wwd-icon">
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div className="wwd-title">Community Building</div>
            <p className="wwd-desc">Fostering a culture of learning, mentorship, and collaboration — creating bonds that outlast the campus years and extend into the industry.</p>
          </div>
        </div>
      </section>

      {/* ══════════ EVENTS ════════════════════════════════ */}
      <section id="events">
        <div className="events-header">
          <div>
            <div className="section-tag">Upcoming &amp; Past</div>
            <h2 className="section-heading">
              <span className="reveal-line"><span className="reveal-word">Flagship</span></span>
              <span className="reveal-line"><span className="reveal-word grad">Events</span></span>
            </h2>
          </div>
          <Link to="/events" className="btn-outline" style={{ height: 'fit-content' }}>All Events →</Link>
        </div>
        <div className="events-grid">
          <div className="event-card featured">
            <div>
              <div className="event-date">Hackathon</div>
              <h3 className="event-title">Dotslash</h3>
              <p className="event-desc">Get ready for innovation at its best. Brilliant minds collide, code sparks fly, and groundbreaking ideas come to life in our flagship 24-hour hackathon with nationwide participants.</p>
              <span className="event-tag">● Hackathon · Open Registration</span>
            </div>
          </div>
          <div className="event-card">
            <div className="event-date">Coding Contest</div>
            <h3 className="event-title">Epiphany</h3>
            <p className="event-desc">An inter-college coding contest to test your programming skills and push your limits. Get those thinking caps on for this legendary competitive programming contest.</p>
            <span className="event-tag">● Contest · Inter-College</span>
          </div>
          <div className="event-card">
            <div className="event-date">DSA Event</div>
            <h3 className="event-title">Inception</h3>
            <p className="event-desc">One of our most awaited coding events returns. Join us in solving the most fun and challenging DSA problems, crafted to stretch every participant's algorithmic thinking.</p>
            <span className="event-tag">● DSA · Problem Solving</span>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* ══════════ TESTIMONIALS ══════════════════════════ */}
      <section id="testimonials" style={{ paddingBottom: 0 }}>
        <div className="section-tag" style={{ padding: '0 clamp(1.5rem,6vw,7rem)' }}>Community Voices</div>
        <h2 className="section-heading" style={{ padding: '0 clamp(1.5rem,6vw,7rem)', marginBottom: '2rem' }}>
          <span className="reveal-line"><span className="reveal-word">What They</span></span>
          <span className="reveal-line"><span className="reveal-word grad">Say</span></span>
        </h2>
        <div className="testi-wrap">
          <div className="testi-track">
            <div className="testi-card">
              <p className="testi-quote">ACM NIT Surat chapter has been an incredible platform for me to enhance my technical skills — the engaging workshops and coding competitions have been both educational and genuinely fun.</p>
              <div className="testi-author">Anand</div>
              <div className="testi-role">CSE, SVNIT · 2023</div>
            </div>
            <div className="testi-card">
              <p className="testi-quote">I'm impressed with ACM NIT Surat's welcoming community. I've made valuable connections and had the chance to participate in exciting coding competitions and hackathons that shaped my career.</p>
              <div className="testi-author">Arjun</div>
              <div className="testi-role">IT, SVNIT · 2023</div>
            </div>
            <div className="testi-card">
              <p className="testi-quote">Dotslash was the turning point in my engineering journey. The intensity, the collaboration, and the late-night debugging sessions were unlike anything I'd experienced before.</p>
              <div className="testi-author">Priya</div>
              <div className="testi-role">ECE, SVNIT · 2022</div>
            </div>
            <div className="testi-card">
              <p className="testi-quote">The workshops on full-stack development gave me the confidence to build my first real project and ultimately land my first internship. Cannot recommend ACM enough.</p>
              <div className="testi-author">Rahul</div>
              <div className="testi-role">CSE, SVNIT · 2024</div>
            </div>
            {/* duplicate for loop */}
            <div className="testi-card">
              <p className="testi-quote">ACM NIT Surat chapter has been an incredible platform for me to enhance my technical skills — the engaging workshops and coding competitions have been both educational and genuinely fun.</p>
              <div className="testi-author">Anand</div>
              <div className="testi-role">CSE, SVNIT · 2023</div>
            </div>
            <div className="testi-card">
              <p className="testi-quote">I'm impressed with ACM NIT Surat's welcoming community. I've made valuable connections and had the chance to participate in exciting coding competitions and hackathons that shaped my career.</p>
              <div className="testi-author">Arjun</div>
              <div className="testi-role">IT, SVNIT · 2023</div>
            </div>
            <div className="testi-card">
              <p className="testi-quote">Dotslash was the turning point in my engineering journey. The intensity, the collaboration, and the late-night debugging sessions were unlike anything I'd experienced before.</p>
              <div className="testi-author">Priya</div>
              <div className="testi-role">ECE, SVNIT · 2022</div>
            </div>
            <div className="testi-card">
              <p className="testi-quote">The workshops on full-stack development gave me the confidence to build my first real project and ultimately land my first internship. Cannot recommend ACM enough.</p>
              <div className="testi-author">Rahul</div>
              <div className="testi-role">CSE, SVNIT · 2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ JOIN CTA ══════════════════════════════ */}
      <section id="join">
        <div className="join-inner">
          <div>
            <h2 className="join-heading">
              Ready to<br/>
              <span style={{ background: 'linear-gradient(90deg,var(--acl),var(--w))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Join Us?</span>
            </h2>
            <p className="join-sub">Become part of the ACM NIT Surat student chapter today.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem', minWidth: '220px' }}>
            <a href="mailto:acm@svnit.ac.in" className="btn-primary" style={{ justifyContent: 'center' }}>Reach Out →</a>
            <a href="#" className="btn-outline" style={{ justifyContent: 'center' }}>Visit Website</a>
          </div>
        </div>
      </section>

      {/* ══════════ CONTACT ════════════════════════════════ */}
      <section id="contact">
        <div className="section-tag">Get In Touch</div>
        <h2 className="section-heading">
          <span className="reveal-line"><span className="reveal-word">Contact</span></span>
          <span className="reveal-line"><span className="reveal-word grad">Us</span></span>
        </h2>
        <div className="contact-grid">
          <div>
            <div className="contact-info-block">
              <div className="contact-label">Phone</div>
              <a href="tel:+917977579577" className="contact-value">+91 79775 79577</a>
            </div>
            <div className="contact-info-block">
              <div className="contact-label">Email</div>
              <a href="mailto:acm@svnit.ac.in" className="contact-value">acm@svnit.ac.in</a>
              <a href="mailto:acmnitsurat@gmail.com" className="contact-value">acmnitsurat@gmail.com</a>
            </div>
            <div className="contact-info-block">
              <div className="contact-label">Location</div>
              <span className="contact-value">SVNIT, Ichchhanath,<br/>Surat — 395 007, Gujarat</span>
            </div>
            <div className="about-social" style={{ marginTop: '1.5rem' }}>
              <a href="https://github.com/acm-svnit" className="social-link" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/company/acmnitsurat" className="social-link" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://twitter.com/acmnitsurat" className="social-link" target="_blank" rel="noreferrer">Twitter</a>
              <a href="https://www.facebook.com/acmnitsurat" className="social-link" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.youtube.com/c/acmnitsurat" className="social-link" target="_blank" rel="noreferrer">YouTube</a>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Your Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Arjun Sharma"/>
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@svnit.ac.in"/>
            </div>
            <div className="form-field">
              <label>Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="I'd like to know more about joining ACM NIT Surat..."></textarea>
            </div>
            <button className="form-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
