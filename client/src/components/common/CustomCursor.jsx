import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor({ children }) {
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;
    if (!cursor || !cursorRing) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animCursor = () => {
      gsap.set(cursor, { x: mx, y: my });
      rx += (mx - rx) * .12;
      ry += (my - ry) * .12;
      gsap.set(cursorRing, { x: rx, y: ry });
      animationFrameId = requestAnimationFrame(animCursor);
    };
    animCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor-ring" ref={cursorRingRef}></div>
      {children}
    </>
  );
}
