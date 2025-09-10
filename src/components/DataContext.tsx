import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InventoryItem {
  id: number;
  title: string;
  sourceType: string;
  sourceId: string;
  buyPrice: number;
  sellPrice: number;
  fees: number;
  shippingCost: number;
  profit: number;
  status: 'researching' | 'listed' | 'sold' | 'shipped';
  datePurchased?: string;
  dateSold?: string;
  category?: string;
}

export interface StorageUnit {
  id: string;
  name: string;
  location: string;
  monthlyFee: number;
  totalCost: number;
  dateAcquired: string;
  items: InventoryItem[];
  trips: StorageTrip[];
  isActive: boolean;
}

export interface StorageTrip {
  id: string;
  unitId: string;
  date: string;
  unitCost: number;
  travelCost: number;
  fees: number;
  totalCost: number;
  itemsFound: number;
  notes?: string;
}

export interface FleaMarketTrip {
  id: string;
  name: string;
  location: string;
  date: string;
  entryFee: number;
  travelCost: number;
  totalSpent: number;
  totalCost: number;
  itemsPurchased: number;
  notes?: string;
  items: InventoryItem[];
}

interface Analytics {
  totalRevenue: number;
  totalProfit: number;
  totalInvestment: number;
  totalItems: number;
  profitMargin: number;
  roi: number;
  averageItemProfit: number;
  monthlyData: { month: string; revenue: number; profit: number; }[];
  categoryData: { name: string; value: number; amount: number; }[];
  recentActivity: { item: string; price: string; profit: string; status: string; }[];
}

interface DataContextType {
  inventoryItems: InventoryItem[];
  storageUnits: StorageUnit[];
  fleaMarketTrips: FleaMarketTrip[];
  analytics: Analytics;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'profit'>) => void;
  updateInventoryItem: (id: number, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: number) => void;
  addStorageUnit: (unit: Omit<StorageUnit, 'items' | 'trips'>) => void;
  addStorageTrip: (trip: Omit<StorageTrip, 'id'>) => void;
  addFleaMarketTrip: (trip: Omit<FleaMarketTrip, 'items'>) => void;
  recalculateAnalytics: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Initial sample data
const initialInventoryData: InventoryItem[] = [
  {
    id: 1,
    title: 'Vintage Polaroid Camera',
    sourceType: 'Storage Unit',
    sourceId: 'SU-001',
    buyPrice: 25.00,
    sellPrice: 125.50,
    fees: 12.55,
    shippingCost: 8.50,
    profit: 79.45,
    status: 'sold',
    datePurchased: '2024-01-15',
    dateSold: '2024-01-20',
    category: 'Electronics'
  },
  {
    id: 2,
    title: 'Antique Table Lamp',
    sourceType: 'Flea Market',
    sourceId: 'FM-003',
    buyPrice: 15.00,
    sellPrice: 89.99,
    fees: 8.99,
    shippingCost: 12.00,
    profit: 54.00,
    status: 'sold',
    datePurchased: '2024-02-01',
    dateSold: '2024-02-05',
    category: 'Antiques'
  },
  {
    id: 3,
    title: 'Craftsman Power Drill Set',
    sourceType: 'Storage Unit',
    sourceId: 'SU-002',
    buyPrice: 35.00,
    sellPrice: 156.00,
    fees: 15.60,
    shippingCost: 0.00,
    profit: 105.40,
    status: 'listed',
    datePurchased: '2024-02-10',
    category: 'Tools'
  },
  {
    id: 4,
    title: 'Jewelry Music Box',
    sourceType: 'Flea Market',
    sourceId: 'FM-001',
    buyPrice: 8.00,
    sellPrice: 45.75,
    fees: 4.58,
    shippingCost: 6.50,
    profit: 26.67,
    status: 'sold',
    datePurchased: '2024-02-15',
    dateSold: '2024-02-18',
    category: 'Collectibles'
  },
  {
    id: 5,
    title: 'Vintage Record Collection (50pcs)',
    sourceType: 'Storage Unit',
    sourceId: 'SU-001',
    buyPrice: 50.00,
    sellPrice: 0.00,
    fees: 0.00,
    shippingCost: 0.00,
    profit: -50.00,
    status: 'researching',
    datePurchased: '2024-02-20',
    category: 'Collectibles'
  },
  {
    id: 6,
    title: 'Cast Iron Skillet Set',
    sourceType: 'Flea Market',
    sourceId: 'FM-002',
    buyPrice: 20.00,
    sellPrice: 85.00,
    fees: 8.50,
    shippingCost: 15.00,
    profit: 41.50,
    status: 'shipped',
    datePurchased: '2024-02-25',
    dateSold: '2024-03-01',
    category: 'Other'
  },
];

const initialStorageUnits: StorageUnit[] = [
  {
    id: 'SU-001',
    name: 'Downtown Storage',
    location: '123 Main St, Downtown',
    monthlyFee: 120,
    totalCost: 1200,
    dateAcquired: '2024-01-01',
    items: [],
    trips: [],
    isActive: true
  },
  {
    id: 'SU-002',
    name: 'Eastside Mini Storage',
    location: '456 Oak Ave, Eastside',
    monthlyFee: 85,
    totalCost: 850,
    dateAcquired: '2024-02-01',
    items: [],
    trips: [],
    isActive: true
  }
];

const initialFleaMarketTrips: FleaMarketTrip[] = [
  {
    id: 'FM-001',
    name: 'Riverside Flea Market',
    location: 'Riverside Community Center',
    date: '2024-02-15',
    entryFee: 5,
    travelCost: 15,
    totalSpent: 28,
    totalCost: 48,
    itemsPurchased: 1,
    items: []
  },
  {
    id: 'FM-002',
    name: 'Sunday Market Square',
    location: 'Market Square Plaza',
    date: '2024-02-25',
    entryFee: 3,
    travelCost: 12,
    totalSpent: 20,
    totalCost: 35,
    itemsPurchased: 1,
    items: []
  },
  {
    id: 'FM-003',
    name: 'Riverside Flea Market',
    location: 'Riverside Community Center',
    date: '2024-02-01',
    entryFee: 5,
    travelCost: 15,
    totalSpent: 15,
    totalCost: 35,
    itemsPurchased: 1,
    items: []
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Get current user to determine if they're demo user
  const getCurrentUser = () => {
    try {
      const savedUser = localStorage.getItem('cycle_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  };

  const isDemo = getCurrentUser()?.isDemo;

  // Initialize with demo data for demo users, empty for real users
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(isDemo ? initialInventoryData : []);
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>(isDemo ? initialStorageUnits : []);
  const [fleaMarketTrips, setFleaMarketTrips] = useState<FleaMarketTrip[]>(isDemo ? initialFleaMarketTrips : []);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: 0,
    totalProfit: 0,
    totalInvestment: 0,
    totalItems: 0,
    profitMargin: 0,
    roi: 0,
    averageItemProfit: 0,
    monthlyData: [],
    categoryData: [],
    recentActivity: []
  });

  const calculateProfit = (item: Omit<InventoryItem, 'profit'>) => {
    return (item.sellPrice || 0) - (item.buyPrice || 0) - (item.fees || 0) - (item.shippingCost || 0);
  };

  const recalculateAnalytics = () => {
    const soldItems = inventoryItems.filter(item => item.status === 'sold' || item.status === 'shipped');
    const totalRevenue = soldItems.reduce((sum, item) => sum + (item.sellPrice || 0), 0);
    const totalInvestment = inventoryItems.reduce((sum, item) => sum + item.buyPrice, 0);
    const totalProfit = soldItems.reduce((sum, item) => sum + Math.max(0, item.profit), 0);
    
    // Monthly data calculation
    const monthlyMap = new Map();
    soldItems.forEach(item => {
      if (item.dateSold) {
        const month = new Date(item.dateSold).toLocaleDateString('en-US', { month: 'short' });
        const existing = monthlyMap.get(month) || { month, revenue: 0, profit: 0 };
        existing.revenue += item.sellPrice || 0;
        existing.profit += Math.max(0, item.profit);
        monthlyMap.set(month, existing);
      }
    });

    // Category data calculation
    const categoryMap = new Map();
    soldItems.forEach(item => {
      const category = item.category || 'Other';
      const existing = categoryMap.get(category) || { name: category, value: 0, amount: 0 };
      existing.value += Math.max(0, item.profit);
      existing.amount += Math.max(0, item.profit);
      categoryMap.set(category, existing);
    });

    // Recent activity (last 4 sold items)
    const recentActivity = soldItems
      .sort((a, b) => new Date(b.dateSold || '').getTime() - new Date(a.dateSold || '').getTime())
      .slice(0, 4)
      .map(item => ({
        item: item.title,
        price: `$${item.sellPrice?.toFixed(2) || '0.00'}`,
        profit: `$${Math.max(0, item.profit).toFixed(2)}`,
        status: item.status
      }));

    setAnalytics({
      totalRevenue,
      totalProfit,
      totalInvestment,
      totalItems: inventoryItems.length,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      roi: totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0,
      averageItemProfit: soldItems.length > 0 ? totalProfit / soldItems.length : 0,
      monthlyData: Array.from(monthlyMap.values()),
      categoryData: Array.from(categoryMap.values()),
      recentActivity
    });
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'profit'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now(),
      profit: calculateProfit(item)
    };
    setInventoryItems(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: number, updates: Partial<InventoryItem>) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.profit = calculateProfit(updated);
        return updated;
      }
      return item;
    }));
  };

  const deleteInventoryItem = (id: number) => {
    setInventoryItems(prev => prev.filter(item => item.id !== id));
  };

  const addStorageUnit = (unit: Omit<StorageUnit, 'items' | 'trips'>) => {
    const newUnit: StorageUnit = {
      ...unit,
      items: [],
      trips: []
    };
    setStorageUnits(prev => [...prev, newUnit]);
  };

  const addStorageTrip = (trip: Omit<StorageTrip, 'id'>) => {
    const newTrip: StorageTrip = {
      ...trip,
      id: `ST-${Date.now()}`
    };
    setStorageUnits(prev => prev.map(unit => {
      if (unit.id === trip.unitId) {
        return { ...unit, trips: [...unit.trips, newTrip] };
      }
      return unit;
    }));
  };

  const addFleaMarketTrip = (trip: Omit<FleaMarketTrip, 'items'>) => {
    const newTrip: FleaMarketTrip = {
      ...trip,
      items: []
    };
    setFleaMarketTrips(prev => [...prev, newTrip]);
  };

  // Load user data on mount if not demo user
  useEffect(() => {
    const user = getCurrentUser();
    if (user && !user.isDemo) {
      // Load user-specific data from localStorage
      const userDataKey = `cycle_data_${user.id}`;
      try {
        const savedData = localStorage.getItem(userDataKey);
        if (savedData) {
          const data = JSON.parse(savedData);
          setInventoryItems(data.inventoryItems || []);
          setStorageUnits(data.storageUnits || []);
          setFleaMarketTrips(data.fleaMarketTrips || []);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Save user data when it changes (but not for demo users)
  useEffect(() => {
    const user = getCurrentUser();
    if (user && !user.isDemo) {
      const userDataKey = `cycle_data_${user.id}`;
      const dataToSave = {
        inventoryItems,
        storageUnits,
        fleaMarketTrips,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userDataKey, JSON.stringify(dataToSave));
    }
  }, [inventoryItems, storageUnits, fleaMarketTrips]);

  // Recalculate analytics when data changes
  useEffect(() => {
    recalculateAnalytics();
  }, [inventoryItems, storageUnits, fleaMarketTrips]);

  const value: DataContextType = {
    inventoryItems,
    storageUnits,
    fleaMarketTrips,
    analytics,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addStorageUnit,
    addStorageTrip,
    addFleaMarketTrip,
    recalculateAnalytics
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}