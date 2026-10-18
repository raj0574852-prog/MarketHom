'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    
    // Optionally trigger GTM/GA initialization here if needed for strict GDPR compliance
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cookie_consent_accepted'));
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-[hsl(222,47%,9%)]/95 backdrop-blur-md border-t border-[hsl(215,25%,22%)] shadow-2xl transform transition-transform duration-300">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-[hsl(215,20%,70%)]">
            We use cookies to improve your experience, analyze site traffic, and optimize our digital marketing services. 
            By continuing to use this site, you consent to our use of cookies. 
            Read our <Link href="/resources/cookie-policy" className="text-[hsl(217,91%,70%)] hover:underline font-medium">Cookie Policy</Link> for more information.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={declineCookies}
            className="flex-1 md:flex-none btn-outline py-2 px-4 text-xs font-semibold"
          >
            Decline
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none btn-primary py-2 px-6 text-xs font-semibold"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
