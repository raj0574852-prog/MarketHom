import React from 'react';

export function PreviewOrderingSteps() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">How Ordering Works</h2>
        <p className="text-sm text-slate-500 mt-1">Simple 4-step process to get your content published.</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                01
              </div>
              <div className="h-px bg-slate-200 flex-1 hidden sm:block"></div>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Choose & Pay</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select your placement options, provide your written article, and complete the secure payment.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                02
              </div>
              <div className="h-px bg-slate-200 flex-1 hidden sm:block"></div>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Publisher Publishes</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              The publisher reviews your content and publishes it on their website within the turnaround time.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                03
              </div>
              <div className="h-px bg-slate-200 flex-1 hidden sm:block"></div>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">We Check It</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our system verifies the live link to ensure it meets the publisher's stated guidelines.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                04
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">You Approve</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review the live placement. Once you approve, the order is marked complete.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
