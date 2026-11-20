import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  ArrowUpDown,
  ShoppingBag,
  Share2,
  Trash2,
  Check,
  Edit2,
  RefreshCw,
} from 'lucide-react';
import { InventoryItem, ShopProfile } from '../types.ts';

interface InventoryTabProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  shopProfile: ShopProfile;
  onNavigateToTab: (tab: 'chat' | 'pricing' | 'whatsapp') => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  inventory,
  setInventory,
  shopProfile,
  onNavigateToTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [copiedWholesale, setCopiedWholesale] = useState(false);

  // Form state for adding/editing item
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Grains & Staples');
  const [formStock, setFormStock] = useState('10');
  const [formUnit, setFormUnit] = useState('kg');
  const [formCost, setFormCost] = useState('50');
  const [formSelling, setFormSelling] = useState('60');
  const [formThreshold, setFormThreshold] = useState('5');

  // Categories extraction
  const categories = ['all', ...Array.from(new Set(inventory.map((item) => item.category)))];

  // Filter items
  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hindiName && item.hindiName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minThreshold);

  // Quick stock change handler
  const adjustStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.currentStock + delta);
          const timeString =
            'Aaj ' +
            new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
          return {
            ...item,
            currentStock: newStock,
            suggestedRestockQty: Math.max(0, item.minThreshold * 2 - newStock),
            lastUpdated: timeString,
          };
        }
        return item;
      })
    );
  };

  const deleteItem = (id: string) => {
    if (confirm('Kya aap is item ko inventory se hatana chahte hain?')) {
      setInventory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const cost = parseFloat(formCost) || 0;
    const selling = parseFloat(formSelling) || Math.round(cost * 1.15);
    const stock = parseFloat(formStock) || 0;
    const threshold = parseFloat(formThreshold) || 5;

    const timeString =
      'Aaj ' +
      new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (editingItem) {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === editingItem.id) {
            return {
              ...item,
              name: formName.trim(),
              category: formCategory,
              currentStock: stock,
              unit: formUnit,
              costPrice: cost,
              sellingPrice: selling,
              minThreshold: threshold,
              suggestedRestockQty: Math.max(0, threshold * 2 - stock),
              lastUpdated: timeString,
            };
          }
          return item;
        })
      );
      setEditingItem(null);
    } else {
      const newItem: InventoryItem = {
        id: 'item-' + Date.now(),
        name: formName.trim(),
        category: formCategory,
        currentStock: stock,
        unit: formUnit,
        costPrice: cost,
        sellingPrice: selling,
        minThreshold: threshold,
        suggestedRestockQty: Math.max(0, threshold * 2 - stock),
        lastUpdated: timeString,
      };
      setInventory((prev) => [newItem, ...prev]);
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormCategory('Grains & Staples');
    setFormStock('10');
    setFormUnit('kg');
    setFormCost('50');
    setFormSelling('60');
    setFormThreshold('5');
    setEditingItem(null);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormStock(item.currentStock.toString());
    setFormUnit(item.unit);
    setFormCost(item.costPrice.toString());
    setFormSelling(item.sellingPrice.toString());
    setFormThreshold(item.minThreshold.toString());
    setShowAddModal(true);
  };

  // Generate Wholesale order message for Distributor
  const generateWholesaleOrderText = () => {
    if (lowStockItems.length === 0) {
      return `Pranam Mandi/Distributor Bhaiya ji 🙏\nYeh ${shopProfile.shopName} (${shopProfile.city}) se wholesale order inquiry hai. Abhi stock theek hai.`;
    }

    const itemsList = lowStockItems
      .map(
        (it) =>
          `• ${it.name}: ${Math.max(it.suggestedRestockQty, it.minThreshold * 2)} ${it.unit} (Current bacha: ${it.currentStock} ${it.unit})`
      )
      .join('\n');

    return `Pranam Distributor Ji 🙏\n\n*Wholesale Purchase Order*\n*Dukaan:* ${shopProfile.shopName}, ${shopProfile.city}\n*Owner:* ${shopProfile.ownerName} (${shopProfile.phone})\n\nKripya neeche likha maal bhej dein:\n${itemsList}\n\nDelivery kab tak milegi aur kripya bill bhejein. Dhanyawad!`;
  };

  const handleCopyWholesaleOrder = () => {
    const text = generateWholesaleOrderText();
    navigator.clipboard.writeText(text);
    setCopiedWholesale(true);
    setTimeout(() => setCopiedWholesale(false), 2000);
  };

  const wholesaleWaLink = `https://wa.me/?text=${encodeURIComponent(generateWholesaleOrderText())}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8 space-y-6">
      {/* Top Banner & Restock Intelligence */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Godown & Stock Manager
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Code-calculated inventory math: Stock updates automatically from your chat, voice notes, and quick counters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Naya Item Jodein</span>
            </button>
          </div>
        </div>

        {/* Low Stock Alerts & Wholesale Order Bar */}
        {lowStockItems.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  {lowStockItems.length} Items Ka Stock Khatam Hone Wala Hai!
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                  {lowStockItems.map((i) => `${i.name} (${i.currentStock} ${i.unit})`).join(', ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyWholesaleOrder}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center gap-1"
              >
                {copiedWholesale ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedWholesale ? 'Order Copied!' : 'Copy Wholesale List'}</span>
              </button>

              <a
                href={wholesaleWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Distributor WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Item search karein (Chawal, Atta, Maggi)..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap capitalize ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table & Grid */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Current Stock</th>
                <th className="py-3 px-3 text-right">Kharid (Cost)</th>
                <th className="py-3 px-3 text-right">Bikri (Selling)</th>
                <th className="py-3 px-3 text-right">Margin</th>
                <th className="py-3 px-4 text-center">Quick Adjust</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-200">
              {filteredItems.map((item) => {
                const isLow = item.currentStock <= item.minThreshold;
                const marginPct =
                  item.costPrice > 0
                    ? Math.round(((item.sellingPrice - item.costPrice) / item.costPrice) * 100)
                    : 0;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors ${
                      isLow ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      {item.hindiName && (
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {item.hindiName}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Updated {item.lastUpdated}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-slate-500 dark:text-slate-400">{item.category}</span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div
                        className={`inline-flex items-center gap-1 font-bold font-mono text-sm tabular-nums px-2 py-0.5 rounded-md ${
                          isLow
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isLow && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        <span>
                          {item.currentStock} {item.unit}
                        </span>
                      </div>
                      {isLow && (
                        <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium mt-0.5">
                          Restock: +{item.suggestedRestockQty} {item.unit}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      ₹{item.costPrice}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      ₹{item.sellingPrice}
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span
                        className={`font-semibold ${
                          marginPct >= 20
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {marginPct}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                        <button
                          onClick={() => adjustStock(item.id, -1)}
                          className="w-6 h-6 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                          title="-1 unit"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, 1)}
                          className="w-6 h-6 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                          title="+1 unit"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, 5)}
                          className="w-7 h-6 rounded bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold text-[10px]"
                          title="+5 wholesale"
                        >
                          +5
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Koi item nahi mila. "Naya Item Jodein" button dabayein ya chat me bol kar add karein!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingItem ? 'Item Details Edit Karein' : 'Naya Item Stock Me Jodein'}
            </h2>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Item Ka Naam (e.g., Basmati Chawal 5kg)
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Grains & Staples">Grains & Staples</option>
                    <option value="Edible Oils">Edible Oils</option>
                    <option value="Pulses">Pulses (Dal)</option>
                    <option value="Snacks & Instant">Snacks & Instant</option>
                    <option value="Spices & Condiments">Spices & Condiments</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Beverages">Beverages (Chai/Coffee)</option>
                    <option value="General Items">General Items</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Unit (kg, packet, piece)
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Low Stock Alert (Threshold)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Kharid Daam (Cost Price ₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Bikri Daam (Selling Price ₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formSelling}
                    onChange={(e) => setFormSelling(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
                >
                  {editingItem ? 'Update Karein' : 'Item Save Karein'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
