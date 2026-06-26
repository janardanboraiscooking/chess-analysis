'use client';
import { useState } from 'react';
import Reveal from '@/components/ui/Reveal';

export default function Contact() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <Reveal>
        <span className="tag tag-gold mb-4 inline-block">Contact</span>
        <h1 className="text-4xl mb-4">Get in touch</h1>
        <p className="text-base mb-10" style={{ color: 'var(--text-secondary)' }}>
          Questions, feedback, or want to contribute? We&apos;d love to hear from you.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="surface p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="input-field" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} className="input-field" rows={6} placeholder="Tell us more..." style={{ resize: 'vertical' }} />
            </div>
            <button className="btn-primary">Send Message</button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface p-5">
            <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: 'Inter' }}>GitHub</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Open issues and discussions on our repository.</p>
          </div>
          <div className="surface p-5">
            <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: 'Inter' }}>Discord</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Join our community server for real-time help.</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
