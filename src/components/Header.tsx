import React, { useState } from 'react';
import { Store, Moon, Sun, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { ShopProfile } from '../types.ts';
import { DEMO_PRESETS } from '../data/sampleData.ts';

interface HeaderProps {
  activeTab: 'chat' | 'inventory' | 'pricing' | 'whatsapp' | 'profile';
  setActiveTab: (tab: 'chat' | 'inventory' | 'pricing' | 'whatsapp' | 'profile') => void;
  shopProfile: ShopProfile;
  lowStockCount: number;
  isDark: boolean;
  toggleDark: () => void;
  loadPreset: (presetId: string) => void;
  resetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  shopProfile,
  lowStockCount,
  isDark,
  toggleDark,
  loadPreset,
  resetAll,
}) => {
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark & Shop identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                DukaanSaathi AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px] sm:max-w-xs">
              {shopProfile.shopName} · {shopProfile.city}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single line, unboxed tabs) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Dukaan Chat
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap relative ${
              activeTab === 'inventory'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Stock & Godown
            {lowStockCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-md tabular-nums">
                {lowStockCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Price Guru
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            WhatsApp Broadcaster
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Profile
          </button>
        </nav>

        {/* Zone 3: Demo Preset Selector & Dark Mode Action */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Presets</span>
            </button>

            {showPresetMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50 text-xs"
                onClick={() => setShowPresetMenu(false)}
              >
                <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Quick Load for Judges
                </div>
                {DEMO_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset.id)}
                    className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex flex-col"
                  >
                    <span className="font-medium">{preset.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {preset.profile.shopType === 'kirana' ? '8 Grocery items with low stock' : 'Bakery items with fresh pav'}
                    </span>
                  </button>
                ))}
                <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                <button
                  onClick={resetAll}
                  className="w-full text-left px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset to Fresh Setup
                </button>
              </div>
            )}
          </div>

          <button
            onClick={toggleDark}
            aria-label="Toggle Theme"
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
