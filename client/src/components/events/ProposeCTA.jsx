import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast, Toaster } from 'react-hot-toast';
import api from '../../services/api';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  idea: z.string().min(20, 'Please describe your idea (min 20 chars)')
});

export default function ProposeCTA() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/contact', {
        name: data.name,
        email: data.email,
        subject: 'general',
        message: data.idea
      });
      toast.success("Thanks! We'll be in touch 🚀", { style: { background: '#333', color: '#fff' }});
      reset();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="propose-cta" className="py-24 relative overflow-hidden">
      <Toaster position="bottom-right" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/10 to-[#00D4FF]/5 -z-10"></div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="glass-card p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
          
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6">
              Have a Great <span className="text-[#00D4FF]">Idea?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              We are always looking for fresh ideas for hackathons, workshops, and speaker sessions. If you have an idea, let us know and we might just make it happen!
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">💡</div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">🚀</div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">✨</div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <input 
                  {...register('name')} 
                  placeholder="Your Name"
                  className="w-full bg-[#050A14] border border-gray-700 focus:border-[#00D4FF] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                />
                {errors.name && <span className="text-red-400 text-xs mt-1">{errors.name.message}</span>}
              </div>
              
              <div>
                <input 
                  {...register('email')} 
                  placeholder="Your Email"
                  className="w-full bg-[#050A14] border border-gray-700 focus:border-[#00D4FF] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                />
                {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email.message}</span>}
              </div>

              <div>
                <textarea 
                  {...register('idea')} 
                  placeholder="Describe your event idea..."
                  rows="4"
                  className="w-full bg-[#050A14] border border-gray-700 focus:border-[#00D4FF] rounded-lg px-4 py-3 text-white outline-none transition-colors resize-none"
                />
                {errors.idea && <span className="text-red-400 text-xs mt-1">{errors.idea.message}</span>}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white font-bold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-shadow flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Submit Idea'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
