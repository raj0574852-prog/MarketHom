export default function PreviewAcceptedContent({ niches }: { niches: string[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Accepted Content</h2>
      <div className="flex flex-wrap gap-2">
        {niches.map((niche, idx) => (
          <span 
            key={idx} 
            className="bg-white text-slate-700 font-medium px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:border-blue-300 hover:text-blue-700 transition-colors duration-200"
          >
            {niche}
          </span>
        ))}
      </div>
      
      <div className="mt-6 bg-blue-50 rounded-xl border border-blue-100 p-5 flex items-start gap-4">
        <div className="text-blue-600 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-1">Link Insertion</h3>
          <p className="text-sm text-slate-600 leading-relaxed">Existing articles may support link insertion depending on publisher guidelines.</p>
        </div>
      </div>
    </div>
  );
}
