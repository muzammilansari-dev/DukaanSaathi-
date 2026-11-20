export interface ShopProfile {
  shopName: string;
  ownerName: string;
  shopType: 'kirana' | 'bakery' | 'tailor' | 'salon' | 'general';
  city: string;
  language: 'hinglish' | 'hindi' | 'english';
  upiId: string;
  phone: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  currentStock: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  minThreshold: number;
  suggestedRestockQty: number;
  lastUpdated: string;
}

export interface DemoPreset {
  id: string;
  label: string;
  profile: ShopProfile;
  inventory: InventoryItem[];
  welcomeMessage: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'kirana-kanpur',
    label: 'Sharma Kirana Store (Kanpur)',
    profile: {
      shopName: 'Sharma Kirana & General Store',
      ownerName: 'Ramesh Sharma',
      shopType: 'kirana',
      city: 'Kanpur',
      language: 'hinglish',
      upiId: 'sharmakirana@upi',
      phone: '+91 98390 12345',
    },
    inventory: [
      {
        id: 'item-1',
        name: 'Basmati Chawal (India Gate)',
        hindiName: 'बासमती चावल',
        category: 'Grains & Staples',
        currentStock: 2,
        unit: 'kg',
        costPrice: 85,
        sellingPrice: 105,
        minThreshold: 10,
        suggestedRestockQty: 25,
        lastUpdated: 'Aaj 9:30 AM',
      },
      {
        id: 'item-2',
        name: 'Aashirvaad Shudh Chakki Atta',
        hindiName: 'आशीर्वाद आटा 10kg',
        category: 'Grains & Staples',
        currentStock: 3,
        unit: 'bag (10kg)',
        costPrice: 380,
        sellingPrice: 420,
        minThreshold: 5,
        suggestedRestockQty: 10,
        lastUpdated: 'Kal sham',
      },
      {
        id: 'item-3',
        name: 'Fortune Mustard Oil (Sarson Tel)',
        hindiName: 'फार्च्यून सरसों तेल',
        category: 'Edible Oils',
        currentStock: 14,
        unit: 'liter',
        costPrice: 128,
        sellingPrice: 148,
        minThreshold: 8,
        suggestedRestockQty: 20,
        lastUpdated: 'Aaj 8:00 AM',
      },
      {
        id: 'item-4',
        name: 'Maggi 2-Minute Noodles (Pack of 4)',
        hindiName: 'मैगी 4-पैक',
        category: 'Snacks & Instant',
        currentStock: 4,
        unit: 'packet',
        costPrice: 50,
        sellingPrice: 58,
        minThreshold: 12,
        suggestedRestockQty: 24,
        lastUpdated: 'Aaj 11:15 AM',
      },
      {
        id: 'item-5',
        name: 'Tata Salt (Desh Ka Namak)',
        hindiName: 'टाटा नमक 1kg',
        category: 'Spices & Condiments',
        currentStock: 22,
        unit: 'packet',
        costPrice: 22,
        sellingPrice: 28,
        minThreshold: 10,
        suggestedRestockQty: 30,
        lastUpdated: '2 din pehle',
      },
      {
        id: 'item-6',
        name: 'Toor Dal Desi (Arhar)',
        hindiName: 'अरहर / तूर दाल',
        category: 'Pulses',
        currentStock: 6,
        unit: 'kg',
        costPrice: 135,
        sellingPrice: 160,
        minThreshold: 15,
        suggestedRestockQty: 30,
        lastUpdated: 'Aaj 10:00 AM',
      },
      {
        id: 'item-7',
        name: 'Amul Pasteurised Butter 100g',
        hindiName: 'अमुल बटर 100g',
        category: 'Dairy',
        currentStock: 8,
        unit: 'box',
        costPrice: 50,
        sellingPrice: 56,
        minThreshold: 6,
        suggestedRestockQty: 15,
        lastUpdated: 'Aaj subah',
      },
      {
        id: 'item-8',
        name: 'Red Label Tea 250g',
        hindiName: 'रेड लेबल चाय 250g',
        category: 'Beverages',
        currentStock: 12,
        unit: 'pack',
        costPrice: 110,
        sellingPrice: 130,
        minThreshold: 8,
        suggestedRestockQty: 16,
        lastUpdated: 'Kal dopahar',
      },
    ],
    welcomeMessage: 'Ram Ram Ramesh ji! 🙏 DukaanSaathi AI ready hai. Basmati Chawal (2 kg bacha hai) aur Maggi (4 packet bache hain) ka stock khatam hone wala hai. Aaj ka hisaab ya pricing advice ke liye bolkar ya type karke batayein!',
  },
  {
    id: 'bakery-jaipur',
    label: 'Gulab Sweets & Bakery (Jaipur)',
    profile: {
      shopName: 'Gulab Bakers & Sweets',
      ownerName: 'Sunita Meena',
      shopType: 'bakery',
      city: 'Jaipur',
      language: 'hinglish',
      upiId: 'gulabbakers@upi',
      phone: '+91 94140 56789',
    },
    inventory: [
      {
        id: 'b-1',
        name: 'Dutch Chocolate Truffle Cake (1/2 kg)',
        hindiName: 'डच चॉकलेट केक',
        category: 'Cakes',
        currentStock: 3,
        unit: 'piece',
        costPrice: 160,
        sellingPrice: 350,
        minThreshold: 5,
        suggestedRestockQty: 8,
        lastUpdated: 'Aaj 7:30 AM',
      },
      {
        id: 'b-2',
        name: 'Fresh Pav Buns (Ladi Pav 6pc)',
        hindiName: 'ताजा लाडी पाव',
        category: 'Breads',
        currentStock: 8,
        unit: 'packet',
        costPrice: 18,
        sellingPrice: 30,
        minThreshold: 15,
        suggestedRestockQty: 40,
        lastUpdated: 'Aaj 8:45 AM',
      },
      {
        id: 'b-3',
        name: 'Pista Cashew Nankhatai 250g',
        hindiName: 'नानखताई',
        category: 'Cookies',
        currentStock: 12,
        unit: 'box',
        costPrice: 65,
        sellingPrice: 120,
        minThreshold: 6,
        suggestedRestockQty: 15,
        lastUpdated: 'Kal',
      },
    ],
    welcomeMessage: 'Khamma Ghani Sunita ji! 🎂 Gulab Bakers ke liye DukaanSaathi AI taiyaar hai. Aaj fresh pav buns aur cake stock ka status update karna ho ya WhatsApp offer bhejna ho, bataiye!',
  },
];
