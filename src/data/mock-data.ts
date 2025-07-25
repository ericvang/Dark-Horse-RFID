export interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  rfid: string;
  category: string;
  isEssential: boolean;
  status: "detected" | "missing";
  lastSeen: string;
}

export interface SystemData {
  user: User;
  system: {
    status: "active" | "idle" | "disconnected";
    lastScanTimestamp: string;
  };
  items: Item[];
}

export const mockData: SystemData = {
  user: {
    name: "System Administrator",
    email: "admin@rfid-corp.com",
    avatarUrl: ""
  },
  system: {
    status: "active",
    lastScanTimestamp: "2025-07-24T18:44:28Z"
  },
  items: [
    {
      id: "item-01",
      name: "iPhone 15 Pro",
      description: "Personal smartphone with work apps",
      rfid: "A1B2C3D4",
      category: "electronics",
      isEssential: true,
      status: "detected",
      lastSeen: "18:41"
    },
    {
      id: "item-02",
      name: "Passport",
      description: "Travel passport - keep secure",
      rfid: "E5F6G7H8",
      category: "documents",
      isEssential: true,
      status: "detected",
      lastSeen: "18:42"
    },
    {
      id: "item-03",
      name: "Car Keys",
      description: "BMW key fob with garage remote",
      rfid: "I9J0K1L2",
      category: "keys",
      isEssential: true,
      status: "missing",
      lastSeen: "18:39"
    },
    {
      id: "item-04",
      name: "AirPods Pro",
      description: "Wireless earbuds in charging case",
      rfid: "M3N4O5P6",
      category: "electronics",
      isEssential: false,
      status: "missing",
      lastSeen: "18:43"
    },
    {
      id: "item-05",
      name: "Prescription Glasses",
      description: "Reading glasses with blue light filter",
      rfid: "Q7R8S9T0",
      category: "medical",
      isEssential: true,
      status: "missing",
      lastSeen: "18:38"
    },
    {
      id: "item-06",
      name: "Laptop Charger",
      description: "MacBook Pro 65W USB-C charger",
      rfid: "Y5Z6A7B8",
      category: "electronics",
      isEssential: false,
      status: "detected",
      lastSeen: "18:40"
    },
    {
      id: "item-07",
      name: "House Keys",
      description: "Main house keys with fob",
      rfid: "C9D0E1F2",
      category: "keys",
      isEssential: true,
      status: "detected",
      lastSeen: "18:41"
    },
    {
      id: "item-08",
      name: "Wallet",
      description: "Leather wallet with cards and cash",
      rfid: "U1V2W3X4",
      category: "personal",
      isEssential: true,
      status: "detected",
      lastSeen: "18:44"
    }
  ]
};