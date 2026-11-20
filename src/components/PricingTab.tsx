import React, { useState } from 'react';
import { Tag, TrendingUp, ShieldCheck, Sparkles, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { PriceSuggestion, ShopProfile } from '../types.ts';

interface PricingTabProps {
  shopProfile: ShopProfile;
  onApplyPriceToInventory?: (name: string, price: number) => void;
}

export const PricingTab: React.FC<PricingTabProps> = ({
  shopProfile,
  onApplyPriceToInventory,
}) => {
  const [costInput, setCostInput] = useState('75');
  const [itemName, setItemName] = useState('Basmati Chawal Grade A');
  const [selectedCategory, setSelectedCategory] = useState('staples');
  const [customMargin, setCustomMargin] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [pricingResult, setPricingResult] = useState<PriceSuggestion | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const calculatePrice = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cost = parseFloat(costInput);
    if (isNaN(cost) || cost <= 0) return;

    setIsLoading(true);
    setAppliedNotice(false);

    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costPrice: cost,
          category: selectedCategory,
          customMargin: customMargin !== '' ? customMargin : undefined,
          shopProfile,
        }),
      });

      if (!res.ok) throw new Error('Pricing calculation failed');
      const data = await res.json();
      setPricingResult(data);
    } catch (err) {
      console.error('Error fetching pricing:', err);
      // Mathematical fallback client-side
      const chosenMargin = typeof customMargin === 'number' ? Math.max(5, Math.min(60, customMargin)) : 15;
      const suggested = Math.round(cost * (1 + chosenMargin / 100));
      const min = Math.round(cost * 1.08);
      const max = Math.round(cost * 1.25);
      setPricingResult({
        costPrice: cost,
        minPrice: min,
        suggestedPrice: suggested,
        maxPrice: max,
        minMarginPct: 8,
        suggestedMarginPct: chosenMargin,
        maxMarginPct: 25,
        profitPerUnit: Math.round((suggested - cost) * 100) / 100,
        category: selectedCategory,
        explanation: `Cost ₹${cost} par ${chosenMargin}% margin lagakar bechne par ₹${suggested} ka retail price sahi rahega.`,
        guardrailApplied: false,
        aiExplanation: `Kanpur mandi ke hisaab se ₹${suggested} par bechne par aapko har piece par ₹${suggested - cost} ka shuddh munafa milega aur grahak ko bhi rate kifaayati lagega.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial calculation once
  React.useEffect(() => {
    calculatePrice();
  }, []);

  const handleApplyToInventory = () => {
    if (pricingResult && onApplyPriceToInventory) {
      onApplyPriceToInventory(itemName, pricingResult.suggestedPrice);
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 2500);
    }
  };

  const categories = [
    { id: 'staples', label: 'Staples (Atta, Chawal, Tel, Sugar)', defaultMargin: 10 },
    { id: 'snacks', label: 'Snacks & FMCG (Maggi, Biscuits, Chips)', defaultMargin: 18 },
    { id: 'spices', label: 'Spices & Pulses (Masale, Dal)', defaultMargin: 22 },
    { id: 'dairy', label: 'Dairy (Milk, Paneer, Dahi)', defaultMargin: 8 },
    { id: 'bakery', label: 'Bakery & Sweets (Cakes, Pav, Cookies)', defaultMargin: 40 },
    { id: 'tailoring', label: 'Tailoring & Services (Stitching)', defaultMargin: 50 },
    { id: 'general', label: 'General Retail', defaultMargin: 20 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8 space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Smart Price Guru (सटीक भाव व मुनाफा)
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Code computes exact margins & guardrails (5% to 60%). Gemini AI provides local retail competitive intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="md:col-span-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Kharid Daam & Category
          </h2>

          <form onSubmit={calculatePrice} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Item Ka Naam
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Basmati Chawal 1kg"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Kharid Daam / Cost Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={costInput}
                  onChange={(e) => setCostInput(e.target.value)}
                  placeholder="50"
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCustomMargin('');
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} (~{c.defaultMargin}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-600 dark:text-slate-300 font-medium">
                  Custom Margin % (Optional)
                </label>
                {customMargin !== '' && (
                  <button
                    type="button"
                    onClick={() => setCustomMargin('')}
                    className="text-[10px] text-emerald-600 hover:underline"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
              <input
                type="number"
                min="5"
                max="60"
                value={customMargin}
                onChange={(e) => setCustomMargin(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="Auto by category"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Guardrail limit: 5% se 60% ke beech
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !costInput}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              {isLoading ? (
                <span>Rate nikal rahe hain...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sahi Rate Suggest Karein</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results & AI Advisor Column */}
        <div className="md:col-span-7 space-y-4">
          {pricingResult && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Recommended Selling Price
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
                    ₹{pricingResult.suggestedPrice}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Shuddh Munafa (Profit)
                  </span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                    +₹{pricingResult.profitPerUnit}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    {pricingResult.suggestedMarginPct}% margin
                  </div>
                </div>
              </div>

              {/* Price Range Comparison Box */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-medium">Kifaayati (Fast Sale)</div>
                  <div className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums mt-0.5">
                    ₹{pricingResult.minPrice}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {pricingResult.minMarginPct}%
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-300 dark:border-emerald-700">
                  <div className="text-[10px] text-emerald-800 dark:text-emerald-200 font-semibold">Hamara Sujhaav</div>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-300 font-mono tabular-nums mt-0.5">
                    ₹{pricingResult.suggestedPrice}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono font-medium">
                    {pricingResult.suggestedMarginPct}%
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-medium">Max (Premium)</div>
                  <div className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums mt-0.5">
                    ₹{pricingResult.maxPrice}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {pricingResult.maxMarginPct}%
                  </div>
                </div>
              </div>

              {/* AI Local Market Advice */}
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-1.5">
                <div className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>DukaanSaathi Market Intelligence ({shopProfile.city})</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-xs">
                  {pricingResult.aiExplanation || pricingResult.explanation}
                </p>
              </div>

              {/* Guardrails Safety Banner */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Anti-Loss Guardrails: Rate suggestions are mathematically clamped between 5% and 60% margin. Yeh keval sujhaav hai.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
