'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, Bot, Target, Share2, Link2, PenTool, Code, 
  ChevronDown, Shield, FileText, ArrowRight, Menu, X, Globe, Sparkles 
} from 'lucide-react';
import { BorderBeam } from '@/components/ui/BorderBeam';

const SERVICES_MENU = [
  { label: 'SEO Services', href: '/services/seo', desc: 'Data-driven technical & on-page ranking', icon: Search },
  { label: 'AI SEO (AEO/GEO)', href: '/services/ai-seo', desc: 'Optimize for ChatGPT, Perplexity & Gemini', icon: Bot },
  { label: 'PPC Advertising', href: '/services/ppc', desc: 'High-intent paid search & paid social', icon: Target },
  { label: 'Link Building', href: '/services/link-building', desc: 'Editorial high-authority backlink outreach', icon: Link2 },
  { label: 'Guest Posting', href: '/services/guest-posting', desc: 'Guaranteed publisher article placements', icon: PenTool },
  { label: 'Social Media', href: '/services/smm', desc: 'Community growth & brand authority', icon: Share2 },
  { label: 'Web Development', href: '/services/web-development', desc: 'Modern Next.js & React speed optimization', icon: Code },
];

const RESOURCES_MENU = [
  { label: 'Privacy Policy', href: '/resources/privacy-policy', icon: Shield },
  { label: 'Terms of Service', href: '/resources/terms-of-service', icon: FileText },
  { label: 'Refund Policy', href: '/resources/refund-policy', icon: FileText },
  { label: 'Cookie Policy', href: '/resources/cookie-policy', icon: Shield },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setResourcesOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" title="EducationHom Home" className="flex items-center gap-3 group">
            <div className="relative h-9 md:h-10 w-auto">
              <Image 
                src="/images/educationhom-logo.webp"
                alt="EducationHom"
                width={190}
                height={46}
                className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            <li>
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  pathname === '/' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                Home
              </Link>
            </li>

            {/* Services Dropdown */}
            <li
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  pathname.startsWith('/services') ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 pt-3 w-80 animate-fade-in-up">
                  <div className="rounded-2xl p-2.5 bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/80 grid gap-1">
                    {SERVICES_MENU.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                              {item.label}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link
                href="/websites"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  pathname.startsWith('/websites') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Marketplace</span>
              </Link>
            </li>

            <li>
              <Link
                href="/pricing"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  pathname === '/pricing' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                Pricing
              </Link>
            </li>

            <li>
              <Link
                href="/case-studies"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  pathname.startsWith('/case-studies') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                Results
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  pathname === '/about' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                About
              </Link>
            </li>

            {/* Resources Dropdown */}
            <li
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  pathname.startsWith('/resources') ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesOpen && (
                <div className="absolute top-full left-0 pt-3 w-56 animate-fade-in-up">
                  <div className="rounded-2xl p-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/80 grid gap-1">
                    {RESOURCES_MENU.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Icon className="w-3.5 h-3.5 text-blue-400" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link
                href="/blog"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  pathname.startsWith('/blog') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                Blog
              </Link>
            </li>
          </ul>

          {/* Right Action: Free Audit Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40"
            >
              <BorderBeam size={80} duration={6} colorFrom="#93c5fd" colorTo="#c084fc" />
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Free Audit</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 rounded-2xl bg-slate-900/98 backdrop-blur-2xl border border-white/10 p-5 shadow-2xl animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <Link href="/" className="px-3 py-2 text-sm font-semibold text-white">Home</Link>
              <Link href="/services" className="px-3 py-2 text-sm font-semibold text-white">Services</Link>
              <div className="grid grid-cols-2 gap-2 pl-3 py-1">
                {SERVICES_MENU.map((s) => (
                  <Link key={s.href} href={s.href} className="text-xs text-slate-400 hover:text-white py-1">
                    {s.label}
                  </Link>
                ))}
              </div>
              <Link href="/websites" className="px-3 py-2 text-sm font-semibold text-white">Marketplace</Link>
              <Link href="/pricing" className="px-3 py-2 text-sm font-semibold text-white">Pricing</Link>
              <Link href="/case-studies" className="px-3 py-2 text-sm font-semibold text-white">Case Studies</Link>
              <Link href="/about" className="px-3 py-2 text-sm font-semibold text-white">About</Link>
              <Link href="/blog" className="px-3 py-2 text-sm font-semibold text-white">Blog</Link>
              <Link href="/contact" className="mt-2 w-full py-3 rounded-xl bg-blue-600 text-center font-bold text-sm text-white">
                Get Free SEO Audit →
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
