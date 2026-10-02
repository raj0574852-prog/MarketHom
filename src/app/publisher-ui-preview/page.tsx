import React from 'react';
import { PreviewBreadcrumb } from '@/components/publisher-preview/PreviewBreadcrumb';
import { PreviewHero } from '@/components/publisher-preview/PreviewHero';
import { PreviewOrderSummary } from '@/components/publisher-preview/PreviewOrderSummary';
import { PreviewMetrics } from '@/components/publisher-preview/PreviewMetrics';
import { PreviewAuthoritySnapshot } from '@/components/publisher-preview/PreviewAuthoritySnapshot';
import { PreviewGuidelines } from '@/components/publisher-preview/PreviewGuidelines';
import { PreviewOrderingSteps } from '@/components/publisher-preview/PreviewOrderingSteps';
import { PreviewFAQ } from '@/components/publisher-preview/PreviewFAQ';
import { PreviewSimilarSites } from '@/components/publisher-preview/PreviewSimilarSites';

export const metadata = {
  title: 'Preview Publisher Layout | EducationHom',
  description: 'Stage 1 UI Preview - Not for Production',
  robots: {
    index: false,
    follow: false,
  }
};

export default function PublisherUIPreviewPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FC] pb-24 font-sans text-slate-800">
      {/* Header/Nav space mock */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 md:px-8 mb-6 sticky top-0 z-50">
        <div className="font-black text-xl tracking-tight text-slate-900">Education<span className="text-blue-600">Hom</span></div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-4">
          <PreviewBreadcrumb />
        </div>

        {/* Hero Area */}
        <PreviewHero />

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* Left Column - Main Content (~68%) */}
          <div className="w-full lg:w-[68%] flex flex-col min-w-0">
            <PreviewMetrics />
            <PreviewGuidelines />
            <PreviewAuthoritySnapshot />
            <PreviewOrderingSteps />
            <PreviewFAQ />
            <PreviewSimilarSites />
          </div>

          {/* Right Column - Order Summary (~32%) */}
          <div className="w-full lg:w-[32%] shrink-0 order-first lg:order-last mb-8 lg:mb-0">
            <PreviewOrderSummary />
          </div>

        </div>
      </div>
    </main>
  );
}
