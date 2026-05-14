const fs = require('fs');
const path = require('path');

const files = {
  'src/utils/gsapAnimations.js': `import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const heroReveal = (el) => {
  if (!el) return;
  // This expects SplitText, but since SplitText is a premium plugin, we'll simulate it with simple stagger if needed,
  // or use Framer Motion / basic GSAP text reveals.
  gsap.fromTo(el.children,
    { y: 70, opacity: 0, rotateX: -40 },
    { y: 0, opacity: 1, rotateX: 0, stagger: 0.03, duration: 1, ease: 'power3.out' }
  );
};

export const sectionFadeUp = (el, delay = 0) => {
  if (!el) return;
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' } }
  );
};

export const staggerCards = (selector) => {
  gsap.fromTo(selector,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: selector, start: 'top 85%' } }
  );
};

export const countUp = (el, target, duration = 2) => {
  if (!el) return;
  gsap.fromTo(el,
    { innerHTML: 0 },
    { innerHTML: target, duration, ease: 'power2.out', snap: { innerHTML: 1 }, scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
  );
};

export const timelineDraw = (lineEl) => {
  if (!lineEl) return;
  gsap.fromTo(lineEl,
    { strokeDashoffset: lineEl.getTotalLength() },
    { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: lineEl.parentElement, start: 'top 80%', end: 'bottom 20%', scrub: 1 } }
  );
};

export const magneticButton = (el) => {
  if (!el) return;
  const hover = (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
  };
  const leave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  };
  el.addEventListener('mousemove', hover);
  el.addEventListener('mouseleave', leave);
  return () => {
    el.removeEventListener('mousemove', hover);
    el.removeEventListener('mouseleave', leave);
  };
};

export const parallaxLayer = (el, speed = 0.3) => {
  if (!el) return;
  gsap.to(el, {
    y: () => -window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 }
  });
};
`,
  'src/utils/seoConfig.js': `export const seoSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ACM Student Chapter NIT Surat',
  url: 'https://nitsurat.acm.org',
  logo: 'https://nitsurat.acm.org/logo.png',
  sameAs: [
    'https://twitter.com/acmnitsurat',
    'https://www.linkedin.com/company/acmnitsurat',
    'https://github.com/acm-svnit'
  ]
};
`,
  'src/services/api.js': `import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
`,
  'src/services/eventService.js': `import api from './api';

export const getEvents = (params = {}) =>
  api.get('/events', { params }).then(r => r.data.data);

export const getFlagshipEvents = () =>
  api.get('/events', { params: { flagship: true } }).then(r => r.data.data);

export const getEventBySlug = (slug) =>
  api.get(\`/events/\${slug}\`).then(r => r.data.data);

export const getUpcomingEvents = () =>
  api.get('/events', { params: { upcoming: true } }).then(r => r.data.data);
`,
  'src/components/common/Navbar.jsx': `import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={\`fixed top-0 w-full z-[1000] transition-all duration-300 \${scrolled ? 'backdrop-blur-xl bg-[#050A14]/85 border-b border-[#00D4FF]/10 py-3' : 'bg-transparent py-5'}\`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-['Space_Grotesk'] font-bold text-white flex items-center gap-2">
          <span className="gradient-text">ACM</span>
          <span className="text-lg text-gray-300">NIT Surat</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Events', 'Projects', 'Blogs', 'Team', 'Achievements', 'Contact'].map((item) => (
            <NavLink
              key={item}
              to={item === 'Home' ? '/' : \`/\${item.toLowerCase()}\`}
              className={({ isActive }) =>
                \`relative text-sm font-medium transition-colors hover:text-[#00D4FF] \${isActive ? 'text-[#00D4FF]' : 'text-[#8899BB]'}\`
              }
            >
              {({ isActive }) => (
                <>
                  {item}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#00D4FF] scale-x-100 transition-transform origin-left" />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <button className="px-6 py-2 rounded-full border border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/10 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.15)] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            Join Us
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-screen bg-[#050A14] flex flex-col items-center pt-10 gap-6">
          {['Home', 'Events', 'Projects', 'Blogs', 'Team', 'Achievements', 'Contact'].map((item) => (
            <NavLink
              key={item}
              to={item === 'Home' ? '/' : \`/\${item.toLowerCase()}\`}
              className="text-2xl text-white font-['Space_Grotesk']"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
`,
  'src/components/common/ParticleCanvas.jsx': `import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      for(let i = 0; i < particles.length; i++) {
        for(let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = \`rgba(0, 212, 255, \${0.2 - dist/750})\`;
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 pointer-events-none" />;
}
`,
  'src/components/common/GlowButton.jsx': `import React from 'react';

export default function GlowButton({ children, onClick, className = '' }) {
  return (
    <button 
      onClick={onClick}
      className={\`relative px-8 py-3 rounded-full font-semibold text-white overflow-hidden group border border-[#0066FF]/50 shadow-[0_0_20px_rgba(0,102,255,0.2)] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 \${className}\`}
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0066FF] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
      {children}
    </button>
  );
}
`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullpath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullpath), { recursive: true });
  fs.writeFileSync(fullpath, content);
});

console.log('Utils and shared components scaffolded.');
