import { gsap } from 'gsap';
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
