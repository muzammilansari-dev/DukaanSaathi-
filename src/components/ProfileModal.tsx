import React, { useState } from 'react';
import { Store, User, MapPin, IndianRupee, Phone, Check, ShieldCheck } from 'lucide-react';
import { ShopProfile } from '../types.ts';

interface ProfileModalProps {
  shopProfile: ShopProfile;
  setShopProfile: (profile: ShopProfile) => void;
  onClose?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  shopProfile,
  setShopProfile,
  onClose,
}) => {
  const [name, setName] = useState(shopProfile.shopName);
  const [owner, setOwner] = useState(shopProfile.ownerName);
  const [type, setType] = useState(shopProfile.shopType);
  const [city, setCity] = useState(shopProfile.city);
  const [language, setLanguage] = useState(shopProfile.language);
  const [upi, setUpi] = useState(shopProfile.upiId);
  const [phone, setPhone] = useState(shopProfile.phone);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ShopProfile = {
      shopName: name.trim() || 'Sharma Kirana Store',
      ownerName: owner.trim() || 'Ramesh Sharma',
      shopType: type,
      city: city.trim() || 'Kanpur',
      language,
      upiId: upi.trim() || 'sharma@upi',
      phone: phone.trim() || '+91 98390 12345',
    };
    setShopProfile(updated);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Aapki Dukaan Ki Profile
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Yeh jankari har AI hisaab, rate sujhaav aur WhatsApp messages ko personalize karti hai.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Dukaan Ka Naam
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sharma Kirana & General Store"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Owner Ka Naam
              </label>
              <input
                type="text"
                required
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Ramesh Sharma"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Business Type
              </label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="kirana">Kirana / Grocery Store</option>
                <option value="bakery">Bakery / Confectionery</option>
                <option value="tailor">Tailor / Boutique</option>
                <option value="salon">Salon / Beauty Parlour</option>
                <option value="general">Freelancer / General Merchant</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Shahar / City (Mandi Dynamics ke liye)
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kanpur, Lucknow, Jaipur, etc."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                UPI ID (WhatsApp Reminders me bhejne ke liye)
              </label>
              <input
                type="text"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                placeholder="sharmakirana@upi"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Dukaan Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98390 12345"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Baat-cheet ki bhasha
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('hinglish')}
                className={`py-2 rounded-xl border text-center font-medium ${
                  language === 'hinglish'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Hinglish (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hindi')}
                className={`py-2 rounded-xl border text-center font-medium ${
                  language === 'hindi'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Hindi (हिन्दी)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('english')}
                className={`py-2 rounded-xl border text-center font-medium ${
                  language === 'english'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aapka data local browser me surakshit rehta hai.</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {savedNotice ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Profile Save Ho Gayi!</span>
                </>
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
