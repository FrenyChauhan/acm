import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../../styles/loader.css';

export default function Loader({ onComplete }) {
  const canvasRef = useRef(null);
  const progressFillRef = useRef(null);
  const progressPctRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Canvas Particles
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    let animationFrameId;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const makeParticle = () => {
      const angle = Math.random() * Math.PI * 2;
      const r = 60 + Math.random() * 180;
      return {
        x: W / 2 + Math.cos(angle) * r,
        y: H / 2 + Math.sin(angle) * r,
        vx: (Math.random() - .5) * .4,
        vy: (Math.random() - .5) * .4,
        alpha: Math.random() * .6 + .2,
        size: Math.random() * 1.5 + .5,
        pulse: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < 80; i++) particles.push(makeParticle());

    const drawParticles = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.pulse += .02;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) Object.assign(p, makeParticle());
        const a = p.alpha * (.6 + .4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58,155,213,${a})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    drawParticles();

    // GSAP Master Timeline
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // 1. corners fade in
    tl.to('.loader-corner', { opacity: 1, duration: .5, stagger: .1 }, 0)
      // 2. particles canvas appears
      .to('.loader-particle-canvas', { opacity: 1, duration: .8 }, 0.1)
      // 3. glow rings bloom
      .to('.loader-glow-ring.g1', { opacity: 1, duration: 1.2 }, 0.2)
      .to('.loader-glow-ring.g2', { opacity: 1, duration: .8 }, 0.5)
      // 4. diamond drops + rotates in
      .to('.loader-diamond-wrap', {
        opacity: 1,
        rotate: 45,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.3)',
      }, 0.4)
      // 5. shimmer sweep across diamond
      .to('.loader-diamond-shimmer', {
        x: '200%',
        y: '200%',
        duration: .9,
      }, 1.2)
      // 6. circle pops in
      .to('.loader-circle', {
        opacity: 1,
        scale: 1,
        duration: .7,
        ease: 'back.out(1.8)',
      }, 1.1)
      // 7. "acm" text fade in
      .to('.loader-acm-text', { opacity: 1, duration: .5 }, 1.6)
      // 8. progress pct appears
      .to('.loader-progress-pct', { opacity: 1, duration: .3 }, 1.4)
      // 9. progress bar fills
      .to({}, {
        duration: 1.8,
        onUpdate: function () {
          const val = this.progress() * 100;
          if (progressFillRef.current) progressFillRef.current.style.width = `${val}%`;
          if (progressPctRef.current) progressPctRef.current.textContent = String(Math.round(val)).padStart(3, '0') + '%';
        },
        ease: 'power1.inOut',
      }, 1.2)
      // 10. labels slide up
      .to('.loader-label-nit', { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 1.6)
      .to('.loader-label-full', { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 1.8)
      // 11. brief hold at 100%
      .to({}, { duration: 0.6 }, 3.2)
      // 12. everything contracts / pulses
      .to('.loader-diamond-wrap', { scale: 1.12, duration: .22, ease: 'power2.in' }, 3.8)
      .to('.loader-diamond-wrap', { scale: 0, duration: .5, ease: 'power4.in' }, 4.0)
      .to('.loader-circle', { scale: 1.2, opacity: 0, duration: .4, ease: 'power2.in' }, 3.85)
      .to('.loader-glow-ring', { opacity: 0, scale: 1.4, duration: .5, ease: 'power2.in' }, 3.8)
      .to('.loader-corner', { opacity: 0, duration: .3 }, 3.8)
      .to('.loader-label-nit, .loader-label-full', { opacity: 0, y: -10, duration: .3 }, 3.8)
      .to('.loader-progress-pct, .loader-progress-wrap', { opacity: 0, duration: .3 }, 3.8)
      .to('.loader-particle-canvas', { opacity: 0, duration: .4 }, 3.8)
      // 13. panel wipe exit
      .to('.loader-panel.top', { scaleY: 1, transformOrigin: 'top', duration: .55, ease: 'power4.inOut' }, 4.1)
      .to('.loader-panel.bot', { scaleY: 1, transformOrigin: 'bottom', duration: .55, ease: 'power4.inOut' }, 4.1)
      .to('.loader-panel.top', { scaleY: 0, transformOrigin: 'top', duration: .55, ease: 'power4.inOut' }, 4.7)
      .to('.loader-panel.bot', { scaleY: 0, transformOrigin: 'bottom', duration: .55, ease: 'power4.inOut' }, 4.7)
      // 14. call onComplete callback
      .to({}, {
        duration: 0.1,
        onComplete: () => {
          if (onComplete) onComplete();
        }
      }, 5.1);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div id="acm-loader">
      <canvas ref={canvasRef} className="loader-particle-canvas"></canvas>
      <div className="loader-glow-ring g1"></div>
      <div className="loader-glow-ring g2"></div>

      {/* corner accents */}
      <div className="loader-corner tl"></div>
      <div className="loader-corner tr"></div>
      <div className="loader-corner bl"></div>
      <div className="loader-corner br"></div>

      {/* main logo */}
      <div className="loader-diamond-wrap">
        <div className="loader-diamond">
          <div className="loader-diamond-shimmer"></div>
          <div className="loader-diamond-border"></div>
          <div className="loader-circle-wrap">
            <div className="loader-circle">
              <div className="loader-circle-ring"></div>
              <span className="loader-acm-text">acm</span>
            </div>
          </div>
        </div>
      </div>

      {/* labels */}
      <div className="loader-label-block">
        <div className="loader-label-nit">NIT SURAT</div>
        <div className="loader-label-full">Association for Computing Machinery</div>
      </div>

      {/* progress */}
      <div className="loader-progress-wrap">
        <div className="loader-progress-track">
          <div ref={progressFillRef} className="loader-progress-fill"></div>
        </div>
        <div ref={progressPctRef} className="loader-progress-pct">000%</div>
      </div>

      {/* exit panels */}
      <div className="loader-panel top"></div>
      <div className="loader-panel bot"></div>
    </div>
  );
}
