import React, { useEffect, useState } from 'react';
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
    <nav className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-[#050A14]/85 border-b border-[#00D4FF]/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-['Space_Grotesk'] font-bold text-white flex items-center gap-2">
          <span className="gradient-text">ACM</span>
          <span className="text-lg text-gray-300">NIT Surat</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Events', 'Projects', 'Blogs', 'Team', 'Achievements', 'Contact'].map((item) => (
            <NavLink
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors hover:text-[#00D4FF] ${isActive ? 'text-[#00D4FF]' : 'text-[#8899BB]'}`
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
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
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
