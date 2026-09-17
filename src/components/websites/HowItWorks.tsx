import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Submit Request',
      description: 'Click "Buy Now" to connect with our team and securely request your placement.'
    },
    {
      step: '02',
      title: 'Content Review',
      description: 'Provide your content or have our editorial team craft it to meet the publisher\'s standards.'
    },
    {
      step: '03',
      title: 'Publication',
      description: 'The publisher reviews and publishes the article, securing your permanent link.'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={i} className="relative flex flex-col p-5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-3xl font-black text-slate-200 mb-3">{s.step}</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed flex-1">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
