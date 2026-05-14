import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastY = 0;
    const handleScroll = () => {
      const y = window.scrollY;
      const nav = document.getElementById('navbar');
      if (nav) {
        if (y > lastY && y > 120) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
        nav.style.transition = 'transform .4s ease';
      }
      lastY = y;
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = ['Home', 'Events', 'Projects', 'Blogs', 'Team', 'Achievements', 'Contact'];

  return (
    <>
      <nav id="navbar" style={{ opacity: 1, transform: 'translateY(0)' }}>
        <NavLink to="/" className="nav-logo">
          <div className="nav-diamond">
            <div className="nav-diamond-inner"><span>acm</span></div>
          </div>
          <div className="nav-name">ACM NIT Surat<small>Student Chapter</small></div>
        </NavLink>
        
        <ul className="nav-links">
          {navLinks.map((item) => (
            <li key={item}>
              <NavLink 
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                style={({ isActive }) => ({ color: isActive ? 'var(--w)' : '' })}
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <button className="nav-join"><span>Join Chapter →</span></button>
        
        <div className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} color="var(--w60)" /> : (
            <>
              <span></span><span></span><span></span>
            </>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed top-[70px] left-0 w-full h-screen bg-[#04090f] flex flex-col items-center pt-10 gap-6 z-[999]">
          {navLinks.map((item) => (
            <NavLink
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="text-2xl text-white font-['Rajdhani'] uppercase tracking-widest font-bold"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}
