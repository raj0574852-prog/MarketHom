'use client';

import { useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    title: 'CEO, StyleVault Fashion',
    avatar: 'SM',
    rating: 5,
    text: 'MarketHom Agency transformed our online presence completely. In 8 months, our organic traffic went from 12,000 to over 53,000 monthly visitors. The team is incredibly strategic and results-focused. Worth every penny.',
    result: '+342% Organic Traffic',
    color: 'hsl(270,80%,60%)',
  },
  {
    name: 'James Rodriguez',
    title: 'Founder, DataFlow Pro',
    avatar: 'JR',
    rating: 5,
    text: 'Their PPC expertise is unmatched. They reduced our cost per lead by 69% while simultaneously tripling the quality of leads coming in. Our sales team couldn\'t be happier. This is what a real marketing partner looks like.',
    result: '-69% Cost Per Lead',
    color: 'hsl(217,91%,54%)',
  },
  {
    name: 'Dr. Amanda Chen',
    title: 'Owner, PrimeCare Dental',
    avatar: 'AC',
    rating: 5,
    text: 'We were invisible on Google. MarketHom got us to #1 on Google Maps within 4 months. Our phone is ringing off the hook. Patient bookings went up 422%. This team delivers real, measurable results.',
    result: '#1 Google Maps',
    color: 'hsl(152,69%,46%)',
  },
  {
    name: 'Marcus Thompson',
    title: 'Marketing Director, TechBridge',
    avatar: 'MT',
    rating: 5,
    text: 'The AI SEO strategy they implemented gave us a massive edge over competitors. We\'re now ranking for 1,200+ keywords we never thought possible. Their content strategy is truly next-level.',
    result: '+1,200 Keywords Ranked',
    color: 'hsl(39,100%,58%)',
  },
  {
    name: 'Lisa Park',
    title: 'Co-Founder, GreenLeaf Organics',
    avatar: 'LP',
    rating: 5,
    text: 'From website redesign to full SEO and social media management — MarketHom does it all seamlessly. Revenue from organic channels grew by 215% in the first year. The team is proactive, transparent, and genuinely invested.',
    result: '+215% Organic Revenue',
    color: 'hsl(340,80%,58%)',
  },
  {
    name: 'David Kim',
    title: 'VP Marketing, CloudSync',
    avatar: 'DK',
    rating: 5,
    text: 'Their link building and guest posting program built our domain authority from 18 to 54 in 9 months. We now compete with industry giants for the most competitive keywords. Best agency decision we ever made.',
    result: 'DA 18 → 54 in 9mo',
    color: 'hsl(190,80%,50%)',
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-padding bg-[hsl(222,47%,5%)]" id="testimonials">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="badge mb-4">Client Stories</span>
          <h2 className="text-4xl md:text-5xl font-black mb-5">
            What Our Clients{' '}
            <span className="gradient-text">Say About Us</span>
          </h2>
          <p className="text-[hsl(215,20%,60%)] text-lg max-w-2xl mx-auto">
            500+ businesses trust MarketHom Agency. Here's what they're saying.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden">
            {/* Glow */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${testimonials[active].color}, transparent 70%)` }}
            />

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-[hsl(39,100%,58%)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg md:text-xl text-[hsl(215,20%,80%)] leading-relaxed mb-8 italic relative z-10">
              "{testimonials[active].text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${testimonials[active].color}, hsl(270,80%,60%))` }}
              >
                {testimonials[active].avatar}
              </div>
              <div className="text-left">
                <div className="font-bold text-white">{testimonials[active].name}</div>
                <div className="text-sm text-[hsl(215,20%,55%)]">{testimonials[active].title}</div>
              </div>
              <span
                className="ml-4 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{
                  background: `${testimonials[active].color}20`,
                  color: testimonials[active].color,
                  border: `1px solid ${testimonials[active].color}40`,
                }}
              >
                {testimonials[active].result}
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                active === i
                  ? 'border-[hsl(217,91%,54%)]/60 bg-[hsl(217,91%,54%)]/10'
                  : 'border-[hsl(215,25%,22%)]/40 bg-[hsl(215,25%,12%)]/50 hover:border-[hsl(215,25%,30%)]'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mb-2"
                style={{ background: `${t.color}` }}
              >
                {t.avatar}
              </div>
              <div className="text-xs font-semibold text-white truncate">{t.name}</div>
              <div className="text-[10px] text-[hsl(215,20%,50%)] truncate">{t.title.split(',')[0]}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
