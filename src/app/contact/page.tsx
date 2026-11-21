'use client';

import { useState } from 'react';
import { addLead } from '@/lib/resourcesStore';
import { Mail, Phone, MessageSquare, CheckCircle2, ArrowRight, Sparkles, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5 text-cyan-400" />,
    label: 'Direct Strategy Desk',
    value: 'hello@educationhom.com',
    href: 'mailto:hello@educationhom.com',
    sub: 'Replies within 2 business hours',
  },
  {
    icon: <Phone className="w-5 h-5 text-blue-400" />,
    label: 'Telephone & WhatsApp',
    value: '+91 8824896910',
    href: 'tel:+918824896910',
    sub: 'Direct line to senior strategists',
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
    label: 'Private Client Slack',
    value: 'Priority Partner Access',
    href: '#',
    sub: 'Active for active agency retainers',
  },
];

const services = [
  'SEO & Organic Growth', 'AI Search (GEO / SGE)', 'Editorial Guest Posting', 
  'High-Authority Link Building', 'Precision PPC Campaigns', 'Next.js Web Development', 
  'Social Media Authority', 'Full-Scale Agency Retainer',
];

const budgets = [
  '$1,000 – $2,500/mo', '$2,500 – $5,000/mo',
  '$5,000 – $10,000/mo', '$10,000+/mo Enterprise', 'One-Time Project / Placement',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', website: '',
    service: '', budget: '', message: '', consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setStatus('sending');

    try {
      addLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        website: form.website,
        serviceRequested: form.service,
        budget: form.budget,
        message: form.message,
      });

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        setErrorMessage(data.error || 'Failed to submit inquiry. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('sent');
    } catch (err) {
      console.error('Lead submission error:', err);
      setErrorMessage('Network error submitting inquiry. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Hero Header */}
      <section className="pt-36 pb-16 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult Strategy Directors</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            Initiate Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Growth Blueprint.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
            Tell us about your brand targets. Our senior SEO architects will audit your competitive landscape and deliver a complimentary roadmap within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="pb-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Direct Desks & Assurances */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-start gap-4 block hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-400/30 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">{item.label}</div>
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm sm:text-base">{item.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.sub}</div>
                  </div>
                </a>
              ))}

              {/* Agency Guarantees Card */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>MarketHom Assurances</span>
                </div>
                <ul className="space-y-3.5">
                  {[
                    'Complimentary comprehensive domain audit',
                    'Zero long-term contracts; 30-day flexibility',
                    'Direct communication with senior SEO director',
                    'Permanent DoFollow links with 100% indexing SLA',
                    'Real-time automated performance dashboards',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 font-light">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Inquiry Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
                {status === 'sent' ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(52,211,153,0.3)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">Inquiry Received</h2>
                    <p className="text-slate-300 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-light">
                      Thank you, <strong className="text-white font-bold">{form.name}</strong>. Our senior strategy director has received your brief for <span className="text-cyan-300">{form.service || 'your marketing initiatives'}</span> and will reply within <strong className="text-white">2 business hours</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Request Executive Consultation</h2>
                      <p className="text-slate-400 text-sm font-light">Fill out your brand details below to receive your complimentary audit and strategic positioning blueprint.</p>
                    </div>

                    {status === 'error' && errorMessage && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-sm text-rose-300 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-white">Submission Notice</span>
                          <span>{errorMessage}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name *</label>
                        <input
                          type="text" required placeholder="Alexander Vance"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Work Email *</label>
                        <input
                          type="email" required placeholder="alexander@brand.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Company / Organization</label>
                        <input
                          type="text" placeholder="Acme Technologies"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="w-full bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Website URL</label>
                        <input
                          type="text" placeholder="https://company.com"
                          value={form.website}
                          onChange={(e) => setForm({ ...form, website: e.target.value })}
                          className="w-full bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Primary Objective</label>
                        <select
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="w-full bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                        >
                          <option value="" className="bg-slate-900 text-slate-400">Select Service Area</option>
                          {services.map((s) => (
                            <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Monthly Budget Scope</label>
                        <select
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          className="w-full bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                        >
                          <option value="" className="bg-slate-900 text-slate-400">Select Monthly Investment</option>
                          {budgets.map((b) => (
                            <option key={b} value={b} className="bg-slate-900 text-white">{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Project Brief & Core Challenges</label>
                      <textarea
                        rows={4}
                        placeholder="Detail your current organic visibility, primary competitors, or specific growth milestones..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm resize-none font-light"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-base disabled:opacity-50"
                    >
                      {status === 'sending' ? (
                        <span>Analyzing & Submitting...</span>
                      ) : (
                        <>
                          <span>Submit Inquiry for Free Audit</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
