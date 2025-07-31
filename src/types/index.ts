export interface Item {
  id: string;
  name: string;
  description: string;
  rfid: string;
  category: string;
  isEssential: boolean;
  status: 'detected' | 'missing';
  lastSeen: string;
  location?: string;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    accessibility: {
      highContrast: boolean;
      largeText: boolean;
      reduceMotion: boolean;
    };
  };
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  type: 'check' | 'maintenance' | 'replacement';
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  nextDue: string;
  isActive: boolean;
  itemId?: string;
}

export interface AnalyticsData {
  totalItems: number;
  detectedItems: number;
  missingItems: number;
  essentialItems: number;
  recentActivity: {
    id: string;
    action: string;
    itemName: string;
    timestamp: string;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
    percentage: number;
  }[];
}

export interface FilterState {
  search: string;
  category: string;
  status: string;
  essential: boolean;
  dateRange: {
    start: string;
    end: string;
  };
}

export type RootStackParamList = {
  Main: undefined;
  ItemDetail: { item: Item };
  AddItem: undefined;
  EditItem: { item: Item };
  Settings: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Items: undefined;
  Analytics: undefined;
  Reminders: undefined;
  Profile: undefined;
}; 