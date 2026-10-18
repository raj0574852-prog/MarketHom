import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import { CANONICAL_SITE_URL } from '@/lib/constants';

const StatsSection = dynamic(() => import('@/components/home/StatsSection'), { ssr: true });
const ServicesSection = dynamic(() => import('@/components/home/ServicesSection'), { ssr: true });
const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'), { ssr: true });
const ResultsSection = dynamic(() => import('@/components/home/ResultsSection'), { ssr: true });
const PricingPreview = dynamic(() => import('@/components/home/PricingPreview'), { ssr: true });
const BlogPreview = dynamic(() => import('@/components/home/BlogPreview'), { ssr: true });
const CTASection = dynamic(() => import('@/components/home/CTASection'), { ssr: true });

export const metadata: Metadata = {
  title: 'EducationHom | Digital Marketing Agency for Growth',
  description:
    'EducationHom delivers measurable results through SEO, AI SEO, PPC, Social Media Marketing, Link Building & Web Development. Get your free audit today and start outranking your competition.',
  publisher: 'EducationHom',
  alternates: {
    canonical: CANONICAL_SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <ResultsSection />
      <PricingPreview />
      <BlogPreview />
      <CTASection />
    </>
  );
}
