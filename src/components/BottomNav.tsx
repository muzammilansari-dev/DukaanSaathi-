import React from 'react';
import { MessageSquare, Package, Tag, Share2, Store } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'chat' | 'inventory' | 'pricing' | 'whatsapp' | 'profile';
  setActiveTab: (tab: 'chat' | 'inventory' | 'pricing' | 'whatsapp' | 'profile') => void;
  lowStockCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  lowStockCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden transition-colors">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('chat')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'chat'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Dukaan Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'inventory'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Package className="w-5 h-5" />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-amber-500 text-white rounded-full tabular-nums">
                {lowStockCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Stock</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'pricing'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Price Guru</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'whatsapp'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'profile'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Dukaan</span>
        </button>
      </div>
    </nav>
  );
};
