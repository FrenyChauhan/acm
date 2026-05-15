import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import GlowButton from '../components/common/GlowButton';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      if (response.data.success) {
        toast.success(response.data.message || 'Message received! An email has been sent to the admin.');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact | ACM NIT Surat</title></Helmet>
      <main className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
        <h1 className="text-5xl font-bold font-['Space_Grotesk'] text-white mb-8">Let's Build Something Together</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="glass-card p-8">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name" 
                className="w-full bg-[#050A14] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#3A9BD5]" 
              />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email" 
                className="w-full bg-[#050A14] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-[#3A9BD5]" 
              />
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message" 
                rows="5" 
                className="w-full bg-[#050A14] border border-gray-700 rounded p-3 text-white resize-none focus:outline-none focus:border-[#3A9BD5]"
              ></textarea>
              <GlowButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </GlowButton>
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
