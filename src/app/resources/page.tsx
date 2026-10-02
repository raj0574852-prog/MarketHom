import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Resources & Legal Policies | EducationHom',
  description: 'Find important information about how we protect your information, operate our services, process refunds, and use cookies.',
};

const resources = [
  {
    title: 'Privacy Policy',
    description: 'Learn what information we collect, how we use it, and how we protect your privacy.',
    href: '/resources/privacy-policy',
    button: 'Read Privacy Policy',
  },
  {
    title: 'Terms of Service',
    description: 'Review the rules and conditions governing the use of EducationHom services and website.',
    href: '/resources/terms-of-service',
    button: 'Read Terms of Service',
  },
  {
    title: 'Refund Policy',
    description: 'Understand our policies regarding refunds, cancellations, and service guarantees.',
    href: '/resources/refund-policy',
    button: 'Read Refund Policy',
  },
  {
    title: 'Cookie Policy',
    description: 'Find out how we use cookies and similar technologies to improve your experience.',
    href: '/resources/cookie-policy',
    button: 'Read Cookie Policy',
  },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="pt-32 pb-20 relative overflow-hidden bg-[hsl(222,47%,7%)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,54%)]/8 via-transparent to-[hsl(270,80%,60%)]/5" />
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="gradient-text">Resources</span> & Policies
          </h1>
          <p className="text-[hsl(215,20%,60%)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Find important information about how we protect your information, operate our services, process refunds, and use cookies.
          </p>
        </div>
      </section>

      <section className="py-20 relative bg-[hsl(222,47%,5%)]">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {resources.map((resource) => (
              <div key={resource.href} className="glass p-8 rounded-2xl flex flex-col h-full hover:shadow-[0_0_30px_hsl(217,91%,54%,0.1)] transition-all duration-300">
                <h2 className="text-2xl font-bold text-white mb-4">{resource.title}</h2>
                <p className="text-[hsl(215,20%,60%)] flex-1 mb-8">
                  {resource.description}
                </p>
                <Link href={resource.href} className="btn-primary w-full text-center">
                  <span>{resource.button}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
