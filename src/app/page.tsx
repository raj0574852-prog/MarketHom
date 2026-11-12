import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import { CANONICAL_SITE_URL } from '@/lib/constants';

const StatsSection = dynamic(() => import('@/components/home/StatsSection'), { ssr: true });
const ServicesSection = dynamic(() => import('@/components/home/ServicesSection'), { ssr: true });
const ProcessSection = dynamic(() => import('@/components/home/ProcessSection'), { ssr: true });
const ResultsSection = dynamic(() => import('@/components/home/ResultsSection'), { ssr: true });
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), { ssr: true });
const PricingPreview = dynamic(() => import('@/components/home/PricingPreview'), { ssr: true });
const BlogPreview = dynamic(() => import('@/components/home/BlogPreview'), { ssr: true });
const CTASection = dynamic(() => import('@/components/home/CTASection'), { ssr: true });

export const metadata: Metadata = {
  title: 'EducationHom | Next-Gen Digital Marketing & SEO Agency',
  description:
    'EducationHom delivers compounding organic revenue through technical SEO, AI Search Optimization (AEO/GEO), high-intent PPC, and authoritative link building.',
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
      <TestimonialsSection />
      <PricingPreview />
      <BlogPreview />
      <CTASection />
    </>
  );
}
