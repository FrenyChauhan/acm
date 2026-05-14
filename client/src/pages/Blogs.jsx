import React from 'react';
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
