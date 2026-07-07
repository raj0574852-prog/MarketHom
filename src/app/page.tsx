import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import ServicesSection from '@/components/home/ServicesSection';
import ProcessSection from '@/components/home/ProcessSection';
import ResultsSection from '@/components/home/ResultsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PricingPreview from '@/components/home/PricingPreview';
import BlogPreview from '@/components/home/BlogPreview';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'MarketHom Agency | #1 Digital Marketing Agency for Growth',
  description:
    'MarketHom Agency delivers measurable results through SEO, AI SEO, PPC, Social Media Marketing, Link Building & Web Development. Get your free audit today and start outranking your competition.',
  keywords: [
    'digital marketing agency',
    'SEO agency',
    'AI SEO services',
    'PPC management agency',
    'social media marketing agency',
    'link building services',
    'web development agency',
    'online marketing agency',
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'MarketHom Agency',
            url: 'https://markethom.agency',
            logo: 'https://markethom.agency/logo.png',
            description:
              'Premium digital marketing agency specializing in SEO, AI SEO, PPC, SMM, Link Building and Web Development.',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+1-800-MARKETHOM',
              contactType: 'customer service',
              availableLanguage: 'English',
            },
            sameAs: [
              'https://twitter.com/markethom',
              'https://linkedin.com/company/markethom',
              'https://facebook.com/markethom',
            ],
          }),
        }}
      />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <ResultsSection />
      <TestimonialsSection />
      <PricingPreview />
      <BlogPreview />
      <CTASection />
    </>
  );
}
