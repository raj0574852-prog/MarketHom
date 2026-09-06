import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';

const StatsSection = dynamic(() => import('@/components/home/StatsSection'), { ssr: true });
const ServicesSection = dynamic(() => import('@/components/home/ServicesSection'), { ssr: true });
const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'), { ssr: true });
const ResultsSection = dynamic(() => import('@/components/home/ResultsSection'), { ssr: true });
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), { ssr: true });
const PricingPreview = dynamic(() => import('@/components/home/PricingPreview'), { ssr: true });
const BlogPreview = dynamic(() => import('@/components/home/BlogPreview'), { ssr: true });
const CTASection = dynamic(() => import('@/components/home/CTASection'), { ssr: true });

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
            url: 'https://www.educationhom.com',
            logo: 'https://www.educationhom.com/logo.png',
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
