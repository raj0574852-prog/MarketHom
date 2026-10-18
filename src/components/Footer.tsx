import Link from 'next/link';
import Image from 'next/image';

const services = [
  { label: 'SEO Services', href: '/services/seo' },
  { label: 'AI SEO', href: '/services/ai-seo' },
  { label: 'PPC Advertising', href: '/services/ppc' },
  { label: 'Social Media Marketing', href: '/services/smm' },
  { label: 'Link Building', href: '/services/link-building' },
  { label: 'Guest Posting', href: '/services/guest-posting' },
  { label: 'Web Development', href: '/services/web-development' },
];

const company = [
  { label: 'About Us', href: '/about' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact Us', href: '/contact' },
];

const resources = [
  { label: 'Privacy Policy', href: '/resources/privacy-policy' },
  { label: 'Terms of Service', href: '/resources/terms-of-service' },
  { label: 'Refund Policy', href: '/resources/refund-policy' },
  { label: 'Cookie Policy', href: '/resources/cookie-policy' },
];

const socials: { label: string; href: string; icon: React.ReactNode }[] = [];

export default function Footer() {
  return (
    <footer className="relative bg-[hsl(222,47%,5%)] border-t border-[hsl(215,25%,22%)]/50">
      {/* Top gradient line */}
      <div className="gradient-divider" />

      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-[hsl(217,91%,54%)]/10 via-[hsl(270,80%,60%)]/10 to-[hsl(217,91%,54%)]/10 border-b border-[hsl(215,25%,22%)]/30">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">Get a Free SEO Audit</h3>
              <p className="text-[hsl(215,20%,65%)]">Discover exactly why your competitors are outranking you.</p>
            </div>
            <Link href="/contact" title="Claim Free SEO Audit" className="btn-primary whitespace-nowrap">
              <span>Claim Free Audit →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" title="EducationHom Home" className="flex items-center gap-3 mb-5 group">
              <div className="relative h-10 w-auto">
                <Image 
                  src="/images/educationhom-logo.webp"
                  alt="EducationHom"
                  width={200}
                  height={50}
                  className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <p className="text-[hsl(215,20%,60%)] text-sm leading-relaxed mb-6">
              We&apos;re a results-obsessed digital marketing agency helping businesses dominate search, drive qualified traffic, and convert visitors into loyal customers.
            </p>
            {/* Socials removed - unverified/old brand */}
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Services</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    title={s.label}
                    className="text-sm text-[hsl(215,20%,60%)] hover:text-[hsl(217,91%,75%)] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[hsl(217,91%,54%)] group-hover:w-2 transition-all duration-200" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    title={c.label}
                    className="text-sm text-[hsl(215,20%,60%)] hover:text-[hsl(217,91%,75%)] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[hsl(217,91%,54%)] group-hover:w-2 transition-all duration-200" />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Resources</h4>
            <ul className="space-y-3">
              {resources.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    title={r.label}
                    className="text-sm text-[hsl(215,20%,60%)] hover:text-[hsl(217,91%,75%)] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[hsl(217,91%,54%)] group-hover:w-2 transition-all duration-200" />
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[hsl(217,91%,54%)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[hsl(217,91%,75%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[hsl(215,20%,50%)] mb-0.5">Email</div>
                  <a href="mailto:hello@educationhom.com" title="Email Us" className="text-sm text-[hsl(215,20%,70%)] hover:text-white transition-colors">
                    hello@educationhom.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[hsl(217,91%,54%)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[hsl(217,91%,75%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[hsl(215,20%,50%)] mb-0.5">Phone</div>
                  <a href="tel:+918824896910" title="Call Us" className="text-sm text-[hsl(215,20%,70%)] hover:text-white transition-colors">
                    +91 8824896910
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[hsl(217,91%,54%)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[hsl(217,91%,75%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[hsl(215,20%,50%)] mb-0.5">Location</div>
                  <span className="text-sm text-[hsl(215,20%,70%)]">Sanganer, Jaipur, Rajasthan, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[hsl(215,25%,22%)]/50">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[hsl(215,20%,50%)]">
              © {new Date().getFullYear()} EducationHom. All rights reserved.
            </p>
            <div className="flex gap-6">
              {resources.map((item) => (
                <Link key={item.label} href={item.href} title={item.label} className="text-xs text-[hsl(215,20%,50%)] hover:text-[hsl(217,91%,75%)] transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
