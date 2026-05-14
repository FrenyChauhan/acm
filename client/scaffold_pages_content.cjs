const fs = require('fs');
const path = require('path');

const homeJsx = `import React from 'react';
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
`;

const projectsJsx = `import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Projects() {
  return (
    <>
      <Helmet><title>Projects | ACM NIT Surat</title></Helmet>
      <main className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <h1 className="text-5xl font-bold font-['Space_Grotesk'] text-white mb-8">Projects</h1>
        <div className="glass-card p-10 text-center text-gray-400">
          Open source projects and tools built by the community. Coming soon.
        </div>
      </main>
    </>
  );
}
`;

const blogsJsx = `import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Blogs() {
  return (
    <>
      <Helmet><title>Blog | ACM NIT Surat</title></Helmet>
      <main className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <h1 className="text-5xl font-bold font-['Space_Grotesk'] text-white mb-8">Blogs</h1>
        <div className="glass-card p-10 text-center text-gray-400">
          Tech articles and tutorials. Coming soon.
        </div>
      </main>
    </>
  );
}
`;

const teamJsx = `import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Team() {
  return (
    <>
      <Helmet><title>Team | ACM NIT Surat</title></Helmet>
      <main className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <h1 className="text-5xl font-bold font-['Space_Grotesk'] text-white mb-8">The Minds Behind ACM NIT Surat</h1>
        <div className="glass-card p-10 text-center text-gray-400">
          Meet the core committee and faculty advisor. Coming soon.
        </div>
      </main>
    </>
  );
}
`;

const achievementsJsx = `import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Achievements() {
  return (
    <>
      <Helmet><title>Achievements | ACM NIT Surat</title></Helmet>
      <main className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <h1 className="text-5xl font-bold font-['Space_Grotesk'] text-white mb-8">Achievements</h1>
        <div className="glass-card p-10 text-center text-gray-400">
          Legacy of excellence. Coming soon.
        </div>
      </main>
    </>
  );
}
`;

const contactJsx = `import React from 'react';
import { Helmet } from 'react-helmet-async';
import GlowButton from '../components/common/GlowButton';

export default function Contact() {
  return (
    <>
      <Helmet><title>Contact | ACM NIT Surat</title></Helmet>
      <main className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <h1 className="text-5xl font-bold font-['Space_Grotesk'] text-white mb-8">Let's Build Something Together</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="glass-card p-8">
            <form className="flex flex-col gap-4">
              <input type="text" placeholder="Name" className="w-full bg-[#050A14] border border-gray-700 rounded p-3 text-white" />
              <input type="email" placeholder="Email" className="w-full bg-[#050A14] border border-gray-700 rounded p-3 text-white" />
              <textarea placeholder="Message" rows="5" className="w-full bg-[#050A14] border border-gray-700 rounded p-3 text-white resize-none"></textarea>
              <GlowButton>Send Message</GlowButton>
            </form>
          </div>
          <div className="text-gray-400 space-y-4">
            <h3 className="text-2xl text-white font-bold">Contact Info</h3>
            <p>Email: acm@svnit.ac.in</p>
            <p>Location: SVNIT Surat, Gujarat, India</p>
          </div>
        </div>
      </main>
    </>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src/pages/Home.jsx'), homeJsx);
fs.writeFileSync(path.join(__dirname, 'src/pages/Projects.jsx'), projectsJsx);
fs.writeFileSync(path.join(__dirname, 'src/pages/Blogs.jsx'), blogsJsx);
fs.writeFileSync(path.join(__dirname, 'src/pages/Team.jsx'), teamJsx);
fs.writeFileSync(path.join(__dirname, 'src/pages/Achievements.jsx'), achievementsJsx);
fs.writeFileSync(path.join(__dirname, 'src/pages/Contact.jsx'), contactJsx);

console.log('Pages content scaffolded.');
