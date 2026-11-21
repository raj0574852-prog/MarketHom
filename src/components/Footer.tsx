'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Sparkles, Globe } from 'lucide-react';

const SERVICES = [
  { label: 'Technical SEO', href: '/services/seo' },
  { label: 'AI Search Optimization (AEO)', href: '/services/ai-seo' },
  { label: 'High-Intent PPC Campaigns', href: '/services/ppc' },
  { label: 'Authority Link Building', href: '/services/link-building' },
  { label: 'High DA Guest Posting', href: '/services/guest-posting' },
  { label: 'Social Media Velocity', href: '/services/smm' },
  { label: 'Next.js Web Development', href: '/services/web-development' },
];

const COMPANY = [
  { label: 'About Agency', href: '/about' },
  { label: 'Verified Case Studies', href: '/case-studies' },
  { label: 'Transparent Pricing', href: '/pricing' },
  { label: 'Editorial Blog', href: '/blog' },
  { label: 'Contact Strategists', href: '/contact' },
];

const RESOURCES = [
  { label: 'Privacy Policy', href: '/resources/privacy-policy' },
  { label: 'Terms of Service', href: '/resources/terms-of-service' },
  { label: 'Refund Policy', href: '/resources/refund-policy' },
  { label: 'Cookie Policy', href: '/resources/cookie-policy' },
];

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-white/10 text-slate-400">
      {/* Top Banner: Quick Audit Callout */}
      <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 py-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complimentary Performance Audit</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">
                Discover why competitors outrank you on Google & ChatGPT
              </h3>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
            >
              <span>Claim Free 360° Audit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" title="EducationHom Home" className="inline-block mb-5">
              <div className="relative h-10 w-auto">
                <Image 
                  src="/images/educationhom-logo.webp"
                  alt="EducationHom"
                  width={200}
                  height={50}
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              EducationHom is a next-generation growth agency engineered to scale enterprise organic revenue across traditional search and generative AI engines.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Google Premier & Meta Business Partner</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Practice Areas</h4>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {COMPANY.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Direct Email</div>
                  <a href="mailto:hello@educationhom.com" className="text-xs text-slate-300 hover:text-white transition-colors">
                    hello@educationhom.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Phone Support</div>
                  <a href="tel:+918824896910" className="text-xs text-slate-300 hover:text-white transition-colors">
                    +91 8824896910
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Headquarters</div>
                  <span className="text-xs text-slate-300">
                    Sanganer, Jaipur, Rajasthan, India
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-white/5 py-6">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} EducationHom. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {RESOURCES.map((r) => (
              <Link key={r.href} href={r.href} className="hover:text-slate-300 transition-colors">
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
