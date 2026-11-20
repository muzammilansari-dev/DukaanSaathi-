import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Sparkles,
  Phone,
  IndianRupee,
  Calendar,
  Send,
  MessageCircle,
  Package,
  HeartHandshake,
} from 'lucide-react';
import { ShopProfile } from '../types.ts';

interface WhatsAppTabProps {
  shopProfile: ShopProfile;
}

export const WhatsAppTab: React.FC<WhatsAppTabProps> = ({ shopProfile }) => {
  const [selectedType, setSelectedType] = useState<
    'payment_reminder' | 'restock_alert' | 'festival_offer' | 'custom'
  >('payment_reminder');

  const [customerName, setCustomerName] = useState('Ramesh Bhai');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [amount, setAmount] = useState('450');
  const [itemName, setItemName] = useState('Basmati Chawal Fresh Batch');
  const [offerDetails, setOfferDetails] = useState('5kg Atta ke sath 1 pack namak muft');
  const [customPrompt, setCustomPrompt] = useState('');

  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          customerName,
          phone: customerPhone,
          amount: parseFloat(amount) || 0,
          itemName,
          offerDetails: selectedType === 'custom' ? customPrompt : offerDetails,
          shopProfile,
        }),
      });

      if (!res.ok) throw new Error('Message generation failed');
      const data = await res.json();
      setGeneratedMessage(data.message);
      setWhatsappUrl(data.whatsappUrl);
    } catch (err) {
      console.error('Error generating WhatsApp message:', err);
      // Client-side fallback template
      let fallbackText = '';
      if (selectedType === 'payment_reminder') {
        fallbackText = `Pranam ${customerName || 'Bhaiya'} ji 🙏\n\nUmeed hai aap kushal hain. ${shopProfile.shopName} par aapka purana hisaab ₹${amount || 0} ka pending hai.\n\nAap suvidhanusar UPI se bhej sakte hain:\n📲 *UPI ID:* ${shopProfile.upiId}\n\nDhanyawad! ✨\n— ${shopProfile.ownerName}`;
      } else if (selectedType === 'restock_alert') {
        fallbackText = `Ram Ram ji! 🙏\n\n${shopProfile.shopName} par *${itemName}* ka taza maal aa gaya hai! Stock limited hai, toh aaj hi visit karein ya WhatsApp par mangwayein.\n\n📍 ${shopProfile.shopName}, ${shopProfile.city}`;
      } else {
        fallbackText = `Shubh Avsar Offer! 🎉✨\n\n${shopProfile.shopName} par vishesh offer uplabdh hai:\n*${offerDetails}*\n\nAaj hi padharein ya order bhejein!\n— ${shopProfile.ownerName} 🙏`;
      }
      setGeneratedMessage(fallbackText);
      const cleanPhone = customerPhone ? customerPhone.replace(/[^0-9]/g, '') : '';
      setWhatsappUrl(
        cleanPhone
          ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(fallbackText)}`
          : `https://wa.me/?text=${encodeURIComponent(fallbackText)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate initial message on load
  React.useEffect(() => {
    handleGenerate();
  }, [selectedType]);

  const handleCopy = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share && generatedMessage) {
      try {
        await navigator.share({
          text: generatedMessage,
        });
      } catch (e) {
        // user cancelled or not supported
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8 space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            WhatsApp Customer Message Studio
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Grahakon ke liye respectful payment reminders, festive offers aur restock messages 1 click me banayein aur bhejein.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Templates & Inputs */}
        <div className="md:col-span-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xs">
          {/* Template Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Message Ka Type Chunein:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedType('payment_reminder')}
                className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                  selectedType === 'payment_reminder'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Khata / Udhaar</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Respectful payment reminder
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('restock_alert')}
                className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                  selectedType === 'restock_alert'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold">
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Taaza Maal Aaya</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  New stock announcement
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('festival_offer')}
                className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                  selectedType === 'festival_offer'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tyohar / Offer</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Festive discount greeting
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('custom')}
                className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                  selectedType === 'custom'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Custom Soch</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Aapka manpasand message
                </div>
              </button>
            </div>
          </div>

          {/* Form Fields Based on Type */}
          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            {selectedType === 'payment_reminder' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                      Grahak Ka Naam
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ramesh Bhai"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                      Pending Raashi (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="450"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Customer Mobile Number (10 digit, optional)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Phone number browser me rehta hai aur direct wa.me link banata hai.
                  </span>
                </div>
              </>
            )}

            {selectedType === 'restock_alert' && (
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Koun Sa Maal Aaya Hai?
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Basmati Chawal & Desi Ghee"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            )}

            {selectedType === 'festival_offer' && (
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Offer Ya Chhoot Ki Details
                </label>
                <textarea
                  rows={2}
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  placeholder="e.g. Is hafte 10kg Aata ke sath 1 pack namak muft"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            )}

            {selectedType === 'custom' && (
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Kaisa message likhwana chahte hain?
                </label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Kal dukaan dopehar 2 baje band rahegi, grahak subah hi saaman le jayein"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Message ban raha hai...' : 'Naya Message Banayein'}</span>
            </button>
          </form>
        </div>

        {/* WhatsApp Mobile Mockup Preview */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-[#EFEAE2] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[380px]">
            {/* Mock WhatsApp Header */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                {customerName ? customerName.slice(0, 2).toUpperCase() : 'WA'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {customerName || 'Grahak'}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  Online
                </div>
              </div>
            </div>

            {/* Chat Bubble */}
            <div className="my-4 flex justify-end">
              <div className="bg-[#D9FDD3] dark:bg-emerald-950 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tr-xs p-3.5 max-w-[92%] shadow-xs text-xs whitespace-pre-wrap font-sans leading-relaxed border border-emerald-200 dark:border-emerald-800">
                {generatedMessage || 'Aapka message yahan dikhega...'}
                <div className="mt-1 text-[9px] text-right text-slate-400">
                  Aaj 10:45 AM · ✓✓
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                {typeof navigator !== 'undefined' && (navigator as any).share && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>Share Sheet</span>
                  </button>
                )}
              </div>

              <a
                href={whatsappUrl || `https://wa.me/?text=${encodeURIComponent(generatedMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp Par Bhejein (Direct wa.me)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
