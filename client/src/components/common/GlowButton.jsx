import React from 'react';

export default function GlowButton({ children, onClick, className = '' }) {
  return (
    <button 
      onClick={onClick}
      className={`relative px-8 py-3 rounded-full font-semibold text-white overflow-hidden group border border-[#0066FF]/50 shadow-[0_0_20px_rgba(0,102,255,0.2)] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 ${className}`}
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0066FF] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
      {children}
    </button>
  );
}
