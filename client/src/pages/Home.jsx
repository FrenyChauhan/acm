import React from 'react';
import { Helmet } from 'react-helmet-async';
import ParticleCanvas from '../components/common/ParticleCanvas';
import GlowButton from '../components/common/GlowButton';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>ACM Student Chapter NIT Surat | SVNIT — Compete. Build. Learn.</title>
        <meta name="description" content="ACM NIT Surat is SVNIT's premier technical student chapter — hosting hackathons, workshops, competitive programming contests and open-source projects." />
      </Helmet>
      <main className="w-full">
        {/* Hero */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <ParticleCanvas />
          <div className="z-10 text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-['Space_Grotesk'] font-bold mb-6 text-white">
              Where Code Meets Innovation
            </h1>
            <p className="text-xl text-gray-400 mb-8">ACM Student Chapter · NIT Surat · Est. 2008</p>
            <div className="flex justify-center gap-4">
              <GlowButton>Join Us</GlowButton>
              <button className="px-8 py-3 rounded-full font-semibold text-white border border-gray-600 hover:border-white transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-[#0A1628]/50 border-y border-[#00D4FF]/10">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white font-['Space_Grotesk'] font-bold text-4xl">
            <div>500+ <span className="block text-sm text-gray-400 mt-2">Members</span></div>
            <div>50+ <span className="block text-sm text-gray-400 mt-2">Events</span></div>
            <div>10+ <span className="block text-sm text-gray-400 mt-2">Years</span></div>
            <div>20+ <span className="block text-sm text-gray-400 mt-2">Projects</span></div>
          </div>
        </section>
        
        {/* About, WhatWeDo, Featured, CTA can be implemented here... */}
        <section className="py-32 container mx-auto px-4 text-center">
          <h2 className="text-4xl font-['Space_Grotesk'] font-bold text-white mb-6">Ready to build the future?</h2>
          <GlowButton>Apply Now</GlowButton>
        </section>
      </main>
    </>
  );
}
