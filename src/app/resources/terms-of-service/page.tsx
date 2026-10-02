import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | EducationHom',
  description: 'Read the EducationHom Terms of Service. Understand your rights and obligations when using our digital marketing services.',
};

export default function TermsOfServicePage() {
  return (
    <section className="pt-32 pb-20 relative bg-[hsl(222,47%,7%)] min-h-screen">
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-[hsl(215,20%,60%)]">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><span>/</span></li>
            <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
            <li><span>/</span></li>
            <li className="text-white" aria-current="page">Terms of Service</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
        <p className="text-[hsl(215,20%,60%)] mb-12">Last Updated: October 1, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none text-[hsl(215,20%,70%)]">
          <p>
            These Terms of Service ("Terms") govern your use of the website and services provided by EducationHom ("Company," "we," "us," or "our"). By accessing our website or engaging our services, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">1. Services Provided</h2>
          <p className="mb-8">
            EducationHom provides digital marketing services including but not limited to: Google SEO, AI Search Engine Optimization (AEO), Generative Engine Optimization (GEO), PPC advertising, link building, guest posting, and web development. The specific scope of work, deliverables, and timelines will be defined in individual service agreements, contracts, or proposals provided to you.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">2. Client Responsibilities</h2>
          <p>To ensure we can deliver the best results, clients agree to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Provide accurate and necessary access to websites, analytics accounts, and related platforms as required for the services.</li>
            <li>Provide timely feedback and approvals on deliverables and content.</li>
            <li>Make timely payments as per the agreed billing schedule.</li>
            <li>Notify us promptly of any significant changes to your website, business goals, or hosting environments.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">3. Payment Terms</h2>
          <p className="mb-8">
            Payments for services are due as outlined in your specific service agreement. Services are generally billed in advance. Late payments may result in the suspension or termination of active campaigns. All payments are non-refundable except as explicitly outlined in our <Link href="/resources/refund-policy" className="text-[hsl(217,91%,75%)] hover:underline">Refund Policy</Link>.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">4. Results and Guarantees</h2>
          <p className="mb-8">
            While EducationHom utilizes industry best practices to deliver measurable digital marketing improvements, search engine algorithms (like Google) are constantly changing and outside our direct control. Therefore, we do not guarantee specific ranking positions, traffic volumes, or immediate ROI, but we guarantee transparent reporting and execution of the agreed strategies.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">5. Intellectual Property</h2>
          <p className="mb-8">
            All strategies, proprietary code, content, and materials created by EducationHom remain our intellectual property until full payment for those specific deliverables is received. Upon complete payment, ownership of final deliverables (such as website code or written content) transfers to the client, while we retain the right to use non-confidential elements in our portfolio or case studies.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">6. Confidentiality</h2>
          <p className="mb-8">
            Both parties agree to keep all proprietary and sensitive information shared during the engagement confidential. This includes marketing strategies, pricing structures, and internal client business data.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">7. Limitation of Liability</h2>
          <p className="mb-8">
            In no event shall EducationHom be liable for any indirect, incidental, consequential, or punitive damages, including loss of profits or data, arising out of or related to your use of our services. Our total liability shall not exceed the total amount paid by you for the specific service giving rise to the claim in the three months preceding the claim.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">8. Termination</h2>
          <p className="mb-8">
            Either party may terminate the service agreement with written notice as specified in the individual contract (typically 30 days). Upon termination, all outstanding balances for work performed become immediately due, and any completed deliverables will be handed over.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">9. Governing Law</h2>
          <p className="mb-8">
            These Terms shall be governed by and construed in accordance with the laws applicable in Rajasthan, India, without regard to its conflict of law provisions. Any disputes shall be resolved in the appropriate courts of Jaipur, Rajasthan.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">10. Contact Information</h2>
          <p>If you have any questions or concerns regarding these Terms of Service, please contact us:</p>
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
