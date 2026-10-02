import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | EducationHom',
  description: 'Read the EducationHom Privacy Policy. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-32 pb-20 relative bg-[hsl(222,47%,7%)] min-h-screen">
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-[hsl(215,20%,60%)]">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><span>/</span></li>
            <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
            <li><span>/</span></li>
            <li className="text-white" aria-current="page">Privacy Policy</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
        <p className="text-[hsl(215,20%,60%)] mb-12">Last Updated: October 1, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none text-[hsl(215,20%,70%)]">
          <p>
            EducationHom ("we," "us," or "our"), operates the website educationhom.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">1. Information We Collect</h2>
          <p>We may collect the following types of information when you interact with our website or services:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, company name, and website URL when you contact us, request an audit, or submit a form.</li>
            <li><strong>Usage Data:</strong> We may collect data regarding how you access and use our website. This can include your IP address, browser type, pages visited, and time spent on our site.</li>
            <li><strong>Cookies:</strong> Small data files stored on your device that help us provide essential functionality. See our <Link href="/resources/cookie-policy" className="text-[hsl(217,91%,75%)] hover:underline">Cookie Policy</Link> for details.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">2. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Respond to your inquiries, audit requests, and provide digital marketing services.</li>
            <li>Send you relevant updates, reports, and administrative communications.</li>
            <li>Improve our website, service offerings, and user experience.</li>
            <li>Fulfil our contractual obligations to you.</li>
            <li>Comply with legal and regulatory requirements.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">3. Sharing Your Information</h2>
          <p>
            We respect your privacy and do not sell your personal data. We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Service Providers:</strong> Trusted third-party vendors who assist in our operations (such as secure hosting providers or communication tools).</li>
            <li><strong>Legal Authorities:</strong> When required by law, subpoena, or similar legal process.</li>
            <li><strong>Business Partners:</strong> Only with your explicit consent for specific strategic collaborations.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">4. Data Security</h2>
          <p className="mb-8">
            We implement industry-standard security measures including SSL encryption, secure servers, and strict access controls to protect your personal information. However, no method of transmission over the Internet is 100% secure, and while we strive to protect your data, we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">5. Data Retention</h2>
          <p className="mb-8">
            We retain your personal data only as long as necessary to fulfil the purposes outlined in this policy, to provide our services, or as required by applicable laws and regulations.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate or incomplete data.</li>
            <li>Request deletion of your data (right to be forgotten).</li>
            <li>Opt out of marketing communications at any time.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">7. Third-Party Links</h2>
          <p className="mb-8">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices, content, or security of those external sites and encourage you to review their respective privacy policies.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">8. Changes to This Policy</h2>
          <p className="mb-8">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the new policy on this page with an updated "Last Updated" date.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">9. Contact Us</h2>
          <p>If you have any questions or requests regarding this Privacy Policy, please contact us:</p>
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
