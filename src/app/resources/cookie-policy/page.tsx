import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | EducationHom',
  description: 'Learn how EducationHom uses cookies and how you can control your cookie preferences on our website.',
};

export default function CookiePolicyPage() {
  return (
    <section className="pt-32 pb-20 relative bg-[hsl(222,47%,7%)] min-h-screen">
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-[hsl(215,20%,60%)]">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><span>/</span></li>
            <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
            <li><span>/</span></li>
            <li className="text-white" aria-current="page">Cookie Policy</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black mb-4">Cookie Policy</h1>
        <p className="text-[hsl(215,20%,60%)] mb-12">Last Updated: October 1, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none text-[hsl(215,20%,70%)]">
          <p>
            This Cookie Policy explains how EducationHom uses cookies and similar tracking technologies on our website. By continuing to browse or use our website, you consent to the use of cookies as described in this policy.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">1. What Are Cookies?</h2>
          <p className="mb-8">
            Cookies are small text files that are stored on your browser or device when you visit a website. They are widely used to make websites work efficiently, remember your preferences, and provide a secure browsing experience.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">2. Types of Cookies We Use</h2>
          <p>Currently, our website primarily relies on cookies that are strictly necessary for the technical operation of the site.</p>
          
          <h3 className="text-xl font-bold text-white mt-8 mb-4">Essential Cookies</h3>
          <p className="mb-8">
            These cookies are strictly necessary for the website to function correctly. They enable core functionalities such as page navigation, network routing, and access to secure areas of the website. The website cannot function properly without these cookies, and they cannot be disabled in our systems.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">Analytics and Marketing Cookies</h3>
          <p className="mb-8">
            At this time, we do not deploy invasive third-party tracking cookies, advertising pixels (such as Meta Pixel), or advanced analytical cookies (such as Google Analytics) that track your behavior across other sites without your explicit consent. If we introduce such technologies in the future to improve our services or marketing efforts, we will update this policy and provide appropriate consent mechanisms.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">3. Managing Cookies</h2>
          <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting or amending your web browser controls to accept or refuse cookies.</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings preferences. You can typically find these settings in the "Options" or "Preferences" menu of your browser.</li>
            <li><strong>Effects of Refusal:</strong> If you choose to reject essential cookies, you may still use our website, though your access to some functionality and areas of our website may be restricted or degraded.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">4. Changes to This Policy</h2>
          <p className="mb-8">
            We may update this Cookie Policy from time to time to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">5. Contact Us</h2>
          <p>If you have any questions about our use of cookies or other technologies, please contact us at:</p>
          <ul className="list-none space-y-2 mb-8 mt-4 p-6 glass rounded-xl">
            <li><strong>Email:</strong> <a href="mailto:Sophia@educationhom.com" className="text-[hsl(217,91%,75%)] hover:underline">[Sophia@educationhom.com]</a></li>
            <li><strong>Phone:</strong> <a href="tel:+91 8824896910" className="text-[hsl(217,91%,75%)] hover:underline">+91 8824896910</a></li>
            <li><strong>Address:</strong> Sanganer, Jaipur, Rajasthan, India</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
