'use client';

import React, { useState, useEffect } from 'react';
import { WebsiteListing } from './types';
import { CANONICAL_SITE_URL } from '@/lib/constants';

interface MarketplaceInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: WebsiteListing;
}

export default function MarketplaceInquiryModal({
  isOpen,
  onClose,
  website
}: MarketplaceInquiryModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const publisherTitle = website.name || website.domain;
  const listingUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `${CANONICAL_SITE_URL}/website/${website.slug}`;
  const actualPrice = website.content_placement_selling_price || website.price || website.content_placement_price;
  const currencySymbol = website.currency === 'USD' || !website.currency ? '$' : website.currency;
  const priceDisplay = actualPrice ? `${currencySymbol}${actualPrice}` : 'Custom Quote';

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Validate Full Name
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // 2. Validate Contact Fields Rule: At least one must be provided
    const hasEmail = email.trim().length > 0;
    const hasWhatsapp = whatsapp.trim().length > 0;

    if (!hasEmail && !hasWhatsapp) {
      setErrorMsg('Please enter at least one contact method: email address or WhatsApp number.');
      return;
    }

    // 3. Email format check if provided
    if (hasEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
    }

    // 4. WhatsApp format check if provided
    if (hasWhatsapp) {
      const digits = whatsapp.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) {
        setErrorMsg('Please enter a valid WhatsApp number with country code (e.g. +1 555 123 4567).');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/marketplace/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim() || null,
          whatsapp: whatsapp.trim() || null,
          message: message.trim() || null,
          publisherSlug: website.slug,
          publisherDomain: website.domain,
          listingUrl,
          price: priceDisplay
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please check your internet connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-slate-900">
              {isSuccess ? 'Inquiry Submitted' : 'Order Publisher Placement'}
            </h3>
            <p className="text-xs text-slate-500">
              {isSuccess ? 'Thank you for reaching out' : `Direct placement inquiry for ${publisherTitle}`}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900">Inquiry Received!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Our marketplace team has registered your placement request for <span className="font-semibold text-slate-900">{publisherTitle}</span>. We will review your guidelines and reach out via your provided contact details.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm"
                >
                  Return to Listing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Selected Publisher / Page URL (Read-only) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider">Target Listing</span>
                  <span className="font-bold text-blue-600">{priceDisplay}</span>
                </div>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {publisherTitle}
                </div>
                <div className="text-xs text-slate-400 truncate font-mono">
                  {listingUrl}
                </div>
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Full Name (Required) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Contact Information (At least one required) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contact Method <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Provide Email, WhatsApp, or both</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">WhatsApp Number (with Country Code)</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Message (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Requirements or Special Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your article topic, anchor text requirements, target date, or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending Inquiry...
                    </>
                  ) : (
                    <>
                      Submit Placement Inquiry
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Your contact details are stored securely and never shared with third parties.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
