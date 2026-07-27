'use client';

import { useState } from 'react';
import { addLead } from '@/lib/resourcesStore';

const contactInfo = [
  {
    icon: '📧',
    label: 'Email Us',
    value: 'hello@markethom.agency',
    href: 'mailto:hello@markethom.agency',
    sub: 'We reply within 2 hours',
  },
  {
    icon: '📞',
    label: 'Call Us',
    value: '+1 (800) MARKET-HOM',
    href: 'tel:+1800MARKETHOM',
    sub: 'Mon–Fri, 9am–6pm EST',
  },
  {
    icon: '💬',
    label: 'Live Chat',
    value: 'Start Live Chat',
    href: '#',
    sub: 'Available 24/7',
  },
];

const services = [
  'SEO Services', 'AI SEO', 'PPC Advertising', 'Social Media Marketing',
  'Link Building', 'Guest Posting', 'Web Development', 'Full-Service Package',
];

const budgets = [
  'Under $1,000/mo', '$1,000–$2,500/mo', '$2,500–$5,000/mo',
  '$5,000–$10,000/mo', '$10,000+/mo', 'Not Sure Yet',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', website: '',
    service: '', budget: '', message: '', consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // 1. Save to local storage & broadcast
      addLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        website: form.website,
        serviceRequested: form.service || 'General Inquiry',
        budget: form.budget,
        message: form.message
      });

      // 2. Also POST directly to server endpoint
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          website: form.website,
          serviceRequested: form.service || 'General Inquiry',
          budget: form.budget,
          message: form.message
        })
      });
    } catch (err) {
      console.error('Lead submission error:', err);
    }

    setStatus('sent');
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,54%)]/8 via-transparent to-[hsl(270,80%,60%)]/5" />
        <div className="container-custom relative z-10 text-center">
          <span className="badge mb-4">Contact Us</span>
          <h1 className="text-5xl md:text-6xl font-black mb-5">
            Let's <span className="gradient-text">Start Growing</span>
            <br />Your Business Today
          </h1>
          <p className="text-[hsl(215,20%,60%)] text-lg max-w-2xl mx-auto">
            Tell us about your goals. Our team will craft a custom strategy and send you a free audit within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding-sm bg-[hsl(222,47%,7%)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((item) => (
                <a key={item.label} href={item.href} className="glass-card p-6 flex items-start gap-4 block group">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <div className="text-xs text-[hsl(215,20%,50%)] uppercase tracking-wider mb-0.5">{item.label}</div>
                    <div className="font-semibold text-white group-hover:text-[hsl(217,91%,75%)] transition-colors">{item.value}</div>
                    <div className="text-xs text-[hsl(215,20%,50%)] mt-0.5">{item.sub}</div>
                  </div>
                </a>
              ))}

              {/* Why Choose Us */}
              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 text-white">Why Work With Us?</h3>
                <ul className="space-y-3">
                  {[
                    'Free comprehensive website audit',
                    'Custom strategy in 24 hours',
                    'No contracts, cancel anytime',
                    'Dedicated account manager',
                    'Weekly transparent reporting',
                    '30-day results guarantee',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[hsl(215,20%,65%)]">
                      <svg className="w-4 h-4 text-[hsl(152,69%,46%)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8">
                {status === 'sent' ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold mb-3 text-white">Message Received!</h2>
                    <p className="text-[hsl(215,20%,60%)]">
                      Thank you for reaching out, <span className="text-white font-bold">{form.name}</span>. Our team will review your inquiry for <strong className="text-emerald-400">{form.service || 'your request'}</strong> and get back to you within <strong className="text-white">2 business hours</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-2xl font-bold mb-2 text-white">Get Your Free Audit</h2>
                    <p className="text-[hsl(215,20%,60%)] text-sm mb-6">Fill out the form below and we'll have a custom strategy ready for you within 24 hours.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-[hsl(215,20%,70%)] mb-2">Full Name *</label>
                        <input
                          type="text" required placeholder="John Smith"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-[hsl(215,25%,14%)] border border-[hsl(215,25%,22%)]/60 rounded-xl px-4 py-3 text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)]/60 transition-colors text-sm"
                        />
                      </div>
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-[hsl(215,20%,70%)] mb-2">Email Address *</label>
                        <input
                          type="email" required placeholder="john@company.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-[hsl(215,25%,14%)] border border-[hsl(215,25%,22%)]/60 rounded-xl px-4 py-3 text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)]/60 transition-colors text-sm"
                        />
                      </div>
                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-[hsl(215,20%,70%)] mb-2">Phone Number</label>
                        <input
                          type="tel" placeholder="+1 (555) 000-0000"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-[hsl(215,25%,14%)] border border-[hsl(215,25%,22%)]/60 rounded-xl px-4 py-3 text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)]/60 transition-colors text-sm"
                        />
                      </div>
                      {/* Company */}
                      <div>
                        <label className="block text-sm font-medium text-[hsl(215,20%,70%)] mb-2">Company Name</label>
                        <input
                          type="text" placeholder="Your Company"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="w-full bg-[hsl(215,25%,14%)] border border-[hsl(215,25%,22%)]/60 rounded-xl px-4 py-3 text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)]/60 transition-colors text-sm"
                        />
                      </div>
                      {/* Website */}
                      <div>
                        <label className="block text-sm font-medium text-[hsl(215,20%,70%)] mb-2">Website URL</label>
                        <input
                          type="url" placeholder="https://yourwebsite.com"
                          value={form.website}
                          onChange={(e) => setForm({ ...form, website: e.target.value })}
                          className="w-full bg-[hsl(215,25%,14%)] border border-[hsl(215,25%,22%)]/60 rounded-xl px-4 py-3 text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)]/60 transition-colors text-sm"
                        />
                      </div>
                      {/* Budget */}
                      <div>
                        <label className="block text-sm font-medium text-[hsl(215,20%,70%)] mb-2">Monthly Budget</label>
                        <select
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          className="w-full bg-[hsl(215,25%,14%)] border border-[hsl(215,25%,22%)]/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[hsl(217,91%,54%)]/60 transition-colors text-sm"
                        >
                          <option value="">Select budget range</option>
                          {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-sm font-medium text-[hsl(215,20%,70%)] mb-2">Service Interested In *</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {services.map((s) => (
                          <label key={s} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-sm ${
                            form.service === s
                              ? 'border-[hsl(217,91%,54%)]/60 bg-[hsl(217,91%,54%)]/10 text-white'
                              : 'border-[hsl(215,25%,22%)]/50 text-[hsl(215,20%,60%)] hover:border-[hsl(215,25%,30%)]'
                          }`}>
                            <input type="radio" name="service" value={s} className="sr-only"
                              onChange={() => setForm({ ...form, service: s })} />
                            {s}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-[hsl(215,20%,70%)] mb-2">Tell Us About Your Goals *</label>
                      <textarea
                        required rows={4}
                        placeholder="What are your main marketing challenges? What results are you looking to achieve?"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-[hsl(215,25%,14%)] border border-[hsl(215,25%,22%)]/60 rounded-xl px-4 py-3 text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)]/60 transition-colors text-sm resize-none"
                      />
                    </div>

                    {/* Consent */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox" required
                        checked={form.consent}
                        onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-[hsl(215,25%,22%)] accent-[hsl(217,91%,54%)]"
                      />
                      <span className="text-xs text-[hsl(215,20%,55%)]">
                        I agree to MarketHom Agency's Privacy Policy and consent to being contacted about my inquiry. We never spam or sell your data.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-primary w-full justify-center text-base py-4 font-bold shadow-lg shadow-[hsl(217,91%,54%)]/25"
                    >
                      {status === 'sending' ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Sending your request...
                        </span>
                      ) : (
                        <span>Get My Free Audit →</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
