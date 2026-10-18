import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | EducationHom',
  description: 'Get in touch with EducationHom for a free digital marketing consultation and audit. Call +91 8824896910.',
  alternates: {
    canonical: 'https://www.educationhom.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
