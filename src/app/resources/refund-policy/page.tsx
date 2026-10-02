import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy | EducationHom',
  description: 'Understand the EducationHom refund terms for our digital marketing and SEO services.',
};

export default function RefundPolicyPage() {
  return (
    <section className="pt-32 pb-20 relative bg-[hsl(222,47%,7%)] min-h-screen">
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-[hsl(215,20%,60%)]">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><span>/</span></li>
            <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
            <li><span>/</span></li>
            <li className="text-white" aria-current="page">Refund Policy</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black mb-4">Refund Policy</h1>
        <p className="text-[hsl(215,20%,60%)] mb-12">Last Updated: October 1, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none text-[hsl(215,20%,70%)]">
          <p>
            At EducationHom, we are committed to delivering high-quality digital marketing and SEO services. This Refund Policy outlines the terms under which refunds may or may not be granted.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">1. General Policy</h2>
          <p className="mb-8">
            Due to the nature of SEO and digital marketing services—which involve significant upfront work including research, strategy formulation, outreach, and content creation—all sales are generally considered final. We do not offer refunds for work that has already been completed, hours logged, or deliverables that have already been provided to the client.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">2. Non-Refundable Services</h2>
          <p>The following services and deliverables are strictly non-refundable once work has commenced or the item has been delivered:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Completed SEO audits and strategy documents.</li>
            <li>Content creation and copywriting services.</li>
            <li>Published guest posts and placed backlinks.</li>
            <li>Set-up, onboarding, and campaign initiation fees.</li>
            <li>Management fees for PPC or social media campaigns where the time has been expended.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">3. Monthly Retainers and Subscriptions</h2>
          <p className="mb-8">
            For clients on monthly retainer agreements, refunds will not be issued for the current billing cycle once the month has commenced and resources have been allocated. Clients may cancel future billing cycles according to the termination clause in their specific service agreement (typically requiring written notice prior to the next billing date).
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">4. Eligible Refund Scenarios</h2>
          <p>Refunds or credits may be considered in the following limited circumstances at the sole discretion of EducationHom:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>We completely fail to initiate or deliver an agreed-upon service within the contracted timeframe due to circumstances solely within our control.</li>
            <li>Duplicate charges occur due to a technical or billing error on our end.</li>
            <li>A specific guarantee was explicitly made in writing in your individual contract, and those specific conditions for a refund were met.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">5. Refund Processing Time</h2>
          <p className="mb-8">
            If a refund is approved, it will be processed and credited back to the original method of payment within 20 days. Please note that it may take additional time for your bank or credit card company to post the refund to your account.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">6. How to Request a Refund</h2>
          <p>To request a refund for an eligible scenario, please contact our billing department with your order details and a detailed explanation of the issue.</p>
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
