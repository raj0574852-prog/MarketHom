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
  metadataBase: new URL('https://markethom.agency'),
  title: {
    default: 'MarketHom Agency | Premium Digital Marketing Agency',
    template: '%s | MarketHom Agency',
  },
  description:
    'MarketHom Agency is a results-driven digital marketing agency offering SEO, AI SEO, PPC, Social Media Marketing, Link Building, and Web Development services. Grow your business online today.',
  keywords: [
    'digital marketing agency',
    'SEO services',
    'AI SEO',
    'PPC management',
    'social media marketing',
    'link building',
    'web development',
    'MarketHom Agency',
  ],
  authors: [{ name: 'MarketHom Agency' }],
  creator: 'MarketHom Agency',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://markethom.agency',
    siteName: 'MarketHom Agency',
    title: 'MarketHom Agency | Premium Digital Marketing Agency',
    description:
      'Drive growth with MarketHom Agency – experts in SEO, AI SEO, PPC, SMM, Link Building & Web Development.',
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
    title: 'MarketHom Agency | Premium Digital Marketing Agency',
    description:
      'Drive growth with MarketHom Agency – experts in SEO, AI SEO, PPC, SMM, Link Building & Web Development.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-[hsl(222,47%,7%)] text-white min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
