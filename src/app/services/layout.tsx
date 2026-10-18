import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services | EducationHom',
  description: 'Explore our premium digital marketing services including SEO, AI SEO, PPC, Link Building, and Web Development.',
  alternates: {
    canonical: 'https://www.educationhom.com/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
