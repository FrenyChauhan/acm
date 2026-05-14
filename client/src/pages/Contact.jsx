import React from 'react';
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
