import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://educationhom.com'),
  title: {
    default: 'MarketHom Agency | Premium Digital Marketing & AI SEO Agency',
    template: '%s | MarketHom Agency',
  },
  description:
    'MarketHom Agency is an AI-powered digital marketing agency specializing in Google SEO, AI Search Engine Optimization (AEO), GEO (Generative Engine Optimization), PPC, Link Building, and Web Development.',
  keywords: [
    'digital marketing agency',
    'SEO services',
    'AI SEO',
    'AEO Answer Engine Optimization',
    'GEO Generative Engine Optimization',
    'PPC management',
    'link building',
    'guest posting',
    'web development',
    'MarketHom Agency',
  ],
  authors: [{ name: 'MarketHom Agency' }],
  creator: 'MarketHom Agency',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://educationhom.com',
    siteName: 'MarketHom Agency',
    title: 'MarketHom Agency | AI Content Intelligence & SEO Agency',
    description:
      'Scale your business with MarketHom Agency – experts in Google SEO, AEO, GEO, PPC, Guest Posting & Web Development.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MarketHom Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketHom Agency | AI Content Intelligence & SEO Agency',
    description:
      'Scale your business with MarketHom Agency – experts in Google SEO, AEO, GEO, PPC, Guest Posting & Web Development.',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MarketHom Agency',
  url: 'https://educationhom.com',
  logo: 'https://educationhom.com/og-image.png',
  description: 'AI Content Intelligence, Google SEO, AEO, GEO, PPC, and Web Development Agency.',
  sameAs: [
    'https://twitter.com/markethomagency',
    'https://linkedin.com/company/markethomagency'
  ],
  knowsAbout: [
    'Search Engine Optimization (SEO)',
    'AI Search Engine Optimization (AEO)',
    'Generative Engine Optimization (GEO)',
    'Content Intelligence',
    'Pay-Per-Click Advertising (PPC)',
    'High DA Guest Posting',
    'Web Development'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-800-555-0199',
    contactType: 'customer service',
    areaServed: 'Worldwide',
    availableLanguage: 'English'
  }
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MarketHom Agency',
  url: 'https://educationhom.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://educationhom.com/blog?q={search_term_string}',
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
