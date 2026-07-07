'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'SEO Services', href: '/services/seo', icon: '🔍' },
      { label: 'AI SEO', href: '/services/ai-seo', icon: '🤖' },
      { label: 'PPC Advertising', href: '/services/ppc', icon: '💰' },
      { label: 'Social Media Marketing', href: '/services/smm', icon: '📱' },
      { label: 'Link Building', href: '/services/link-building', icon: '🔗' },
      { label: 'Guest Posting', href: '/services/guest-posting', icon: '✍️' },
      { label: 'Web Development', href: '/services/web-development', icon: '💻' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-[hsl(222,47%,7%)]/95 backdrop-blur-xl shadow-[0_2px_40px_hsl(217,91%,54%,0.08)] border-b border-[hsl(215,25%,22%)]/50'
          : 'bg-transparent'
        }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(217,91%,54%)] to-[hsl(270,80%,60%)] flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
              M
            </div>
            <div>
              <span className="text-xl font-bold text-white">Market</span>
              <span className="text-xl font-bold gradient-text">Hom</span>
              <div className="text-[10px] text-[hsl(215,20%,70%)] tracking-widest uppercase -mt-1">Agency</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname.startsWith('/services')
                          ? 'text-[hsl(217,91%,75%)]'
                          : 'text-[hsl(215,20%,70%)] hover:text-white'
                        }`}
                      onMouseEnter={() => setActiveDropdown('services')}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.label}
                      <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Dropdown */}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                      onMouseEnter={() => setActiveDropdown('services')}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="glass rounded-2xl p-2 min-w-[280px] shadow-2xl shadow-black/50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[hsl(217,91%,54%)]/10 transition-all duration-200 group/item"
                          >
                            <span className="text-lg">{child.icon}</span>
                            <span className="text-sm font-medium text-[hsl(215,20%,80%)] group-hover/item:text-white transition-colors">
                              {child.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href
                        ? 'text-[hsl(217,91%,75%)] bg-[hsl(217,91%,54%)]/10'
                        : 'text-[hsl(215,20%,70%)] hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/contact" className="btn-primary text-sm px-6 py-3">
              <span>Get Free Audit</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-screen' : 'max-h-0'
          }`}
      >
        <div className="bg-[hsl(222,47%,9%)]/98 backdrop-blur-xl border-t border-[hsl(215,25%,22%)]/50 px-6 py-4">
          {navLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className={`block py-3 text-base font-medium border-b border-[hsl(215,25%,22%)]/30 transition-colors ${pathname === link.href
                    ? 'text-[hsl(217,91%,75%)]'
                    : 'text-[hsl(215,20%,70%)] hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="pl-4">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="flex items-center gap-2 py-2 text-sm text-[hsl(215,20%,60%)] hover:text-white transition-colors"
                    >
                      <span>{child.icon}</span>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/contact" className="btn-primary w-full justify-center mt-4 text-sm">
            <span>Get Free Audit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
