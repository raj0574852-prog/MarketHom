import React from 'react';

export function PreviewOrderSummary() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden sticky top-6">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Order Summary</h3>
        
        <div className="flex justify-between items-start mb-1">
          <span className="text-sm font-medium text-slate-700">Content Placement</span>
          <span className="text-lg font-bold text-slate-900">$6.00</span>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          You provide the written article. Publisher publishes it on their site permanently.
        </p>
        
        {/* Mock for stage 1 - ensure we don't invent features, but user asked to architect it so it can be added if available */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4 flex gap-3 opacity-50">
          <div className="mt-0.5">
            <div className="w-4 h-4 rounded-full border border-slate-300"></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-sm font-medium text-slate-500">Creation & Placement</span>
              <span className="text-sm font-medium text-slate-500">N/A</span>
            </div>
            <p className="text-[11px] text-slate-400">Not available for this publisher.</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-slate-50/50">
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium text-slate-700">$6.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Platform Fee</span>
            <span className="font-medium text-slate-700">$0.60</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span className="font-bold text-slate-900">Total</span>
            <span className="text-xl font-extrabold text-blue-600">$6.60</span>
          </div>
        </div>
        
        <button className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all duration-200 mb-3 flex justify-center items-center gap-2">
          Proceed to Checkout
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
        
        <button className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-sm transition-all duration-200 text-sm">
          Explore Marketplace
        </button>
      </div>
    </div>
  );
}
