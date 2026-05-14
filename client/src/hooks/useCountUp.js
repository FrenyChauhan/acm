import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useCountUp(end, duration = 2) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    // Convert end string to number if needed, ignoring symbols
    const target = parseFloat(end.toString().replace(/[^0-9.-]+/g, ''));
    if (isNaN(target)) {
      el.textContent = end;
      return;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.fromTo(el,
        { textContent: 0 },
        { 
          textContent: target, 
          duration, 
          ease: 'power2.out', 
          snap: { textContent: 1 },
          onUpdate() { 
            // if original had +, keep it
            const prefix = end.toString().replace(/[0-9.,]+.*/, '');
            const suffix = end.toString().replace(/.*[0-9.,]+/, '');
            el.textContent = prefix + Math.round(+el.textContent) + suffix; 
          }
        }
      )
    });
    
    return () => st.kill();
  }, [end, duration]);
  return ref;
}
