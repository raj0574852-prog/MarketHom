export default function PreviewPricingCard({ price }: { price: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-24 hover:-translate-y-0.5 transition-transform duration-200">
      <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Starting At</div>
      <div className="text-4xl font-extrabold text-slate-900 mb-2">{price}</div>
      <div className="text-xs text-slate-500 mb-6 pb-6 border-b border-slate-100">Platform fee may apply</div>
      
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 hover:shadow-md active:scale-[0.98] mb-3">
        Buy Now
      </button>
      <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-3 px-4 rounded-xl border border-slate-200 transition-colors duration-200">
        Explore Marketplace
      </button>
    </div>
  );
}
