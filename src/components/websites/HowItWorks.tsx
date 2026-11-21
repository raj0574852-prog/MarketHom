import React from 'react';
import { Send, FileText, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: <Send className="w-5 h-5 text-cyan-400" />,
      title: 'Submit Brief & Target URLs',
      description: 'Provide your anchor text and target landing page, or supply your own pre-written draft.'
    },
    {
      step: '02',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      title: 'Editorial Review & QA',
      description: 'Our senior editorial team verifies natural context, anti-spam hygiene, and publisher guidelines.'
    },
    {
      step: '03',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      title: 'Guaranteed Live Publication',
      description: 'Article goes live with permanent DoFollow link and is monitored for fast Google indexation.'
    }
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <h2 className="text-xl font-bold text-white tracking-tight">Placement Workflow</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={i} className="relative flex flex-col p-6 bg-slate-950/60 rounded-2xl border border-white/5 hover:border-white/15 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                {s.icon}
              </div>
              <div className="text-2xl font-black text-slate-700 group-hover:text-cyan-400 transition-colors">
                {s.step}
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed flex-1 font-light">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
