import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

import { CANONICAL_SITE_URL } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: 'EducationHom | Premium Digital Marketing & AI SEO Agency',
    template: '%s | EducationHom',
  },
  description:
    'EducationHom is an AI-powered digital marketing agency specializing in Google SEO, AI Search Engine Optimization (AEO), GEO (Generative Engine Optimization), PPC, Link Building, and Web Development.',
  authors: [{ name: 'EducationHom' }],
  creator: 'EducationHom',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'EducationHom',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EducationHom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${CANONICAL_SITE_URL}/#organization`,
  name: 'EducationHom',
  url: CANONICAL_SITE_URL,
  logo: `${CANONICAL_SITE_URL}/images/educationhom-logo.webp`,
  description: 'AI Content Intelligence, Google SEO, AEO, GEO, PPC, and Web Development Agency.',
  telephone: '+91 8824896910',
  knowsAbout: [
    'Search Engine Optimization (SEO)',
    'AI Search Engine Optimization (AEO)',
    'Generative Engine Optimization (GEO)',
    'Content Intelligence',
    'Pay-Per-Click Advertising (PPC)',
    'High DA Guest Posting',
    'Web Development'
  ]
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EducationHom',
  url: CANONICAL_SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${CANONICAL_SITE_URL}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="hsl(222,47%,7%)" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[hsl(222,47%,7%)] text-white min-h-screen flex flex-col`}>
        {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
