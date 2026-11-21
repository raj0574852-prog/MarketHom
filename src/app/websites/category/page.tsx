import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Category Retired | MarketHom',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function CategoryIndexPage() {
  notFound();
}
