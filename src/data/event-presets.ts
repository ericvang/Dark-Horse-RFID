export interface PresetItem {
  name: string;
  description: string;
  category: string;
  isEssential: boolean;
  rfid?: string;
}

export interface EventPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: PresetItem[];
  estimatedDuration?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const eventPresets: EventPreset[] = [
  {
    id: 'soccer',
    name: 'Soccer Game',
    icon: '⚽',
    description: 'Everything you need for a soccer match or practice',
    estimatedDuration: '2-3 hours',
    difficulty: 'medium',
    items: [
      {
        name: 'Soccer Ball',
        description: 'Official size 5 soccer ball',
        category: 'Equipment',
        isEssential: true,
      },
      {
        name: 'Soccer Cleats',
        description: 'Proper soccer shoes with cleats',
        category: 'Footwear',
        isEssential: true,
      },
      {
        name: 'Soccer Socks',
        description: 'Long soccer socks',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Soccer Shorts',
        description: 'Comfortable athletic shorts',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Soccer Jersey',
        description: 'Team jersey or athletic shirt',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Goalkeeper Gloves',
        description: 'Goalkeeper gloves (if playing goalie)',
        category: 'Equipment',
        isEssential: false,
      },
      {
        name: 'Water Bottle',
        description: 'Hydration bottle',
        category: 'Hydration',
        isEssential: true,
      },
      {
        name: 'First Aid Kit',
        description: 'Basic medical supplies',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Sports Tape',
        description: 'Athletic tape for injuries',
        category: 'Safety',
        isEssential: false,
      },
      {
        name: 'Anti-inflammatory Cream',
        description: 'Pain relief cream',
        category: 'Safety',
        isEssential: false,
      },
      {
        name: 'Phone',
        description: 'Communication device',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Car Keys',
        description: 'Vehicle keys',
        category: 'Transportation',
        isEssential: true,
      },
      {
        name: 'Money/ID',
        description: 'Cash and identification',
        category: 'Personal',
        isEssential: true,
      },
      {
        name: 'Hat/Sun Protection',
        description: 'Cap or visor for sun protection',
        category: 'Accessories',
        isEssential: false,
      },
      {
        name: 'Team Schedule',
        description: 'Game schedule and contact info',
        category: 'Documents',
        isEssential: true,
      },
    ],
  },
  {
    id: 'football',
    name: 'Football Game',
    icon: '🏈',
    description: 'Complete football game preparation',
    estimatedDuration: '3-4 hours',
    difficulty: 'medium',
    items: [
      {
        name: 'Football',
        description: 'Official football',
        category: 'Equipment',
        isEssential: true,
      },
      {
        name: 'Football Cleats',
        description: 'Football-specific cleats',
        category: 'Footwear',
        isEssential: true,
      },
      {
        name: 'Football Pads',
        description: 'Shoulder pads and protective gear',
        category: 'Equipment',
        isEssential: true,
      },
      {
        name: 'Football Helmet',
        description: 'Properly fitted helmet',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Mouthguard',
        description: 'Protective mouthguard',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Jersey',
        description: 'Team jersey',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Football Pants',
        description: 'Padded football pants',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Water Bottle',
        description: 'Large hydration bottle',
        category: 'Hydration',
        isEssential: true,
      },
      {
        name: 'Sports Tape',
        description: 'Athletic tape',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'First Aid Kit',
        description: 'Medical supplies',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Phone',
        description: 'Communication device',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Car Keys',
        description: 'Vehicle keys',
        category: 'Transportation',
        isEssential: true,
      },
      {
        name: 'Money/ID',
        description: 'Cash and identification',
        category: 'Personal',
        isEssential: true,
      },
      {
        name: 'Extra Socks',
        description: 'Clean socks for after game',
        category: 'Clothing',
        isEssential: false,
      },
      {
        name: 'Game Schedule',
        description: 'Team schedule and info',
        category: 'Documents',
        isEssential: true,
      },
    ],
  },
  {
    id: 'basketball',
    name: 'Basketball Practice',
    icon: '🏀',
    description: 'Basketball practice essentials',
    estimatedDuration: '1-2 hours',
    difficulty: 'easy',
    items: [
      {
        name: 'Basketball',
        description: 'Official basketball',
        category: 'Equipment',
        isEssential: true,
      },
      {
        name: 'Basketball Shoes',
        description: 'High-top basketball shoes',
        category: 'Footwear',
        isEssential: true,
      },
      {
        name: 'Basketball Shorts',
        description: 'Comfortable basketball shorts',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Basketball Jersey',
        description: 'Team jersey or athletic shirt',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Water Bottle',
        description: 'Hydration bottle',
        category: 'Hydration',
        isEssential: true,
      },
      {
        name: 'Sports Tape',
        description: 'Athletic tape',
        category: 'Safety',
        isEssential: false,
      },
      {
        name: 'Phone',
        description: 'Communication device',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Car Keys',
        description: 'Vehicle keys',
        category: 'Transportation',
        isEssential: true,
      },
      {
        name: 'Money/ID',
        description: 'Cash and identification',
        category: 'Personal',
        isEssential: true,
      },
      {
        name: 'Practice Schedule',
        description: 'Practice times and info',
        category: 'Documents',
        isEssential: true,
      },
    ],
  },
  {
    id: 'hockey',
    name: 'Hockey Game',
    icon: '🏒',
    description: 'Complete hockey game preparation',
    estimatedDuration: '2-3 hours',
    difficulty: 'medium',
    items: [
      {
        name: 'Hockey Stick',
        description: 'Properly sized hockey stick',
        category: 'Equipment',
        isEssential: true,
      },
      {
        name: 'Hockey Skates',
        description: 'Sharpened hockey skates',
        category: 'Footwear',
        isEssential: true,
      },
      {
        name: 'Hockey Helmet',
        description: 'CSA-approved hockey helmet',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Shoulder Pads',
        description: 'Hockey shoulder pads',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Elbow Pads',
        description: 'Hockey elbow pads',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Gloves',
        description: 'Hockey gloves',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Pants',
        description: 'Hockey pants with padding',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Jersey',
        description: 'Team hockey jersey',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Jock/Jill',
        description: 'Protective cup',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Shin Pads',
        description: 'Hockey shin pads',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Socks',
        description: 'Hockey socks',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Water Bottle',
        description: 'Hydration bottle',
        category: 'Hydration',
        isEssential: true,
      },
      {
        name: 'First Aid Kit',
        description: 'Basic medical supplies',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Phone',
        description: 'Communication device',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Car Keys',
        description: 'Vehicle keys',
        category: 'Transportation',
        isEssential: true,
      },
      {
        name: 'Money/ID',
        description: 'Cash and identification',
        category: 'Personal',
        isEssential: true,
      },
      {
        name: 'Game Schedule',
        description: 'Game time and location',
        category: 'Documents',
        isEssential: true,
      },
    ],
  },
  {
    id: 'tennis',
    name: 'Tennis Match',
    icon: '🎾',
    description: 'Tennis match preparation',
    estimatedDuration: '2-3 hours',
    difficulty: 'medium',
    items: [
      {
        name: 'Tennis Racket',
        description: 'Tennis racket with proper grip',
        category: 'Equipment',
        isEssential: true,
      },
      {
        name: 'Tennis Balls',
        description: 'Can of tennis balls',
        category: 'Equipment',
        isEssential: true,
      },
      {
        name: 'Tennis Shoes',
        description: 'Court shoes with good traction',
        category: 'Footwear',
        isEssential: true,
      },
      {
        name: 'Tennis Outfit',
        description: 'Comfortable tennis clothing',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Water Bottle',
        description: 'Hydration bottle',
        category: 'Hydration',
        isEssential: true,
      },
      {
        name: 'Sunscreen',
        description: 'SPF 30+ sunscreen',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Hat/Visor',
        description: 'Sun protection',
        category: 'Accessories',
        isEssential: false,
      },
      {
        name: 'Phone',
        description: 'Communication device',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Car Keys',
        description: 'Vehicle keys',
        category: 'Transportation',
        isEssential: true,
      },
      {
        name: 'Money/ID',
        description: 'Cash and identification',
        category: 'Personal',
        isEssential: true,
      },
      {
        name: 'Match Schedule',
        description: 'Match time and location',
        category: 'Documents',
        isEssential: true,
      },
    ],
  },
  {
    id: 'swimming',
    name: 'Swimming',
    icon: '🏊',
    description: 'Swimming session essentials',
    estimatedDuration: '1-2 hours',
    difficulty: 'easy',
    items: [
      {
        name: 'Swimsuit',
        description: 'Comfortable swimsuit',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Swim Goggles',
        description: 'Clear vision underwater',
        category: 'Equipment',
        isEssential: true,
      },
      {
        name: 'Swim Cap',
        description: 'Protect hair from chlorine',
        category: 'Equipment',
        isEssential: false,
      },
      {
        name: 'Towel',
        description: 'Large beach towel',
        category: 'Accessories',
        isEssential: true,
      },
      {
        name: 'Flip Flops',
        description: 'Poolside footwear',
        category: 'Footwear',
        isEssential: true,
      },
      {
        name: 'Water Bottle',
        description: 'Hydration bottle',
        category: 'Hydration',
        isEssential: true,
      },
      {
        name: 'Shampoo/Conditioner',
        description: 'Post-swim hair care',
        category: 'Hygiene',
        isEssential: false,
      },
      {
        name: 'Change of Clothes',
        description: 'Clean clothes for after',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Phone',
        description: 'Communication device',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Car Keys',
        description: 'Vehicle keys',
        category: 'Transportation',
        isEssential: true,
      },
      {
        name: 'Money/ID',
        description: 'Cash and identification',
        category: 'Personal',
        isEssential: true,
      },
      {
        name: 'Pool Schedule',
        description: 'Pool hours and info',
        category: 'Documents',
        isEssential: false,
      },
    ],
  },
  {
    id: 'school',
    name: 'School/Work',
    icon: '🎒',
    description: 'Daily school or work essentials',
    estimatedDuration: '8-10 hours',
    difficulty: 'easy',
    items: [
      {
        name: 'Laptop/Computer',
        description: 'Work or school computer',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Charger',
        description: 'Device charger',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Notebook',
        description: 'Paper notebook',
        category: 'Supplies',
        isEssential: true,
      },
      {
        name: 'Pens/Pencils',
        description: 'Writing utensils',
        category: 'Supplies',
        isEssential: true,
      },
      {
        name: 'Lunch',
        description: 'Meal for the day',
        category: 'Food',
        isEssential: true,
      },
      {
        name: 'Water Bottle',
        description: 'Hydration bottle',
        category: 'Hydration',
        isEssential: true,
      },
      {
        name: 'Phone',
        description: 'Communication device',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Keys',
        description: 'House and car keys',
        category: 'Transportation',
        isEssential: true,
      },
      {
        name: 'Wallet',
        description: 'Money and cards',
        category: 'Personal',
        isEssential: true,
      },
      {
        name: 'ID Badge',
        description: 'School or work ID',
        category: 'Documents',
        isEssential: true,
      },
      {
        name: 'Backpack/Bag',
        description: 'Carry everything',
        category: 'Accessories',
        isEssential: true,
      },
      {
        name: 'Umbrella',
        description: 'Weather protection',
        category: 'Accessories',
        isEssential: false,
      },
    ],
  },
  {
    id: 'business-trip',
    name: 'Business Trip',
    icon: '✈️',
    description: 'Professional business travel',
    estimatedDuration: '2-7 days',
    difficulty: 'hard',
    items: [
      {
        name: 'Laptop',
        description: 'Work computer',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Charger',
        description: 'Device charger',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Business Cards',
        description: 'Professional cards',
        category: 'Documents',
        isEssential: true,
      },
      {
        name: 'Presentation Materials',
        description: 'Meeting materials',
        category: 'Documents',
        isEssential: true,
      },
      {
        name: 'Business Attire',
        description: 'Professional clothing',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Toiletries',
        description: 'Personal care items',
        category: 'Hygiene',
        isEssential: true,
      },
      {
        name: 'Phone',
        description: 'Communication device',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Phone Charger',
        description: 'Phone charging cable',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Wallet',
        description: 'Money and cards',
        category: 'Personal',
        isEssential: true,
      },
      {
        name: 'ID/Passport',
        description: 'Identification',
        category: 'Documents',
        isEssential: true,
      },
      {
        name: 'Travel Documents',
        description: 'Tickets and reservations',
        category: 'Documents',
        isEssential: true,
      },
      {
        name: 'Medications',
        description: 'Prescription medications',
        category: 'Health',
        isEssential: false,
      },
      {
        name: 'Suitcase',
        description: 'Travel luggage',
        category: 'Accessories',
        isEssential: true,
      },
      {
        name: 'Travel Adapter',
        description: 'International adapter',
        category: 'Electronics',
        isEssential: false,
      },
      {
        name: 'Emergency Contact Info',
        description: 'Important contacts',
        category: 'Documents',
        isEssential: true,
      },
    ],
  },
  {
    id: 'beach',
    name: 'Beach Day',
    icon: '🏖️',
    description: 'Perfect beach outing',
    estimatedDuration: '4-8 hours',
    difficulty: 'easy',
    items: [
      {
        name: 'Beach Towel',
        description: 'Large beach towel',
        category: 'Accessories',
        isEssential: true,
      },
      {
        name: 'Sunscreen',
        description: 'SPF 30+ sunscreen',
        category: 'Safety',
        isEssential: true,
      },
      {
        name: 'Beach Umbrella',
        description: 'Shade protection',
        category: 'Accessories',
        isEssential: false,
      },
      {
        name: 'Beach Chairs',
        description: 'Comfortable seating',
        category: 'Accessories',
        isEssential: false,
      },
      {
        name: 'Swimsuit',
        description: 'Beach attire',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Beach Bag',
        description: 'Carry everything',
        category: 'Accessories',
        isEssential: true,
      },
      {
        name: 'Water Bottle',
        description: 'Hydration',
        category: 'Hydration',
        isEssential: true,
      },
      {
        name: 'Snacks',
        description: 'Beach snacks',
        category: 'Food',
        isEssential: false,
      },
      {
        name: 'Phone',
        description: 'Communication device',
        category: 'Electronics',
        isEssential: true,
      },
      {
        name: 'Keys',
        description: 'Car and house keys',
        category: 'Transportation',
        isEssential: true,
      },
      {
        name: 'Money/ID',
        description: 'Cash and identification',
        category: 'Personal',
        isEssential: true,
      },
      {
        name: 'Beach Toys',
        description: 'Beach games and toys',
        category: 'Entertainment',
        isEssential: false,
      },
      {
        name: 'Change of Clothes',
        description: 'Clean clothes for after',
        category: 'Clothing',
        isEssential: true,
      },
      {
        name: 'Hat/Sunglasses',
        description: 'Sun protection',
        category: 'Accessories',
        isEssential: true,
      },
      {
        name: 'Beach Parking Info',
        description: 'Parking location and fees',
        category: 'Documents',
        isEssential: false,
      },
    ],
  },
];

export const getPresetById = (id: string): EventPreset | undefined => {
  return eventPresets.find(preset => preset.id === id);
};

export const getPresetCategories = (): string[] => {
  const categories = new Set<string>();
  eventPresets.forEach(preset => {
    preset.items.forEach(item => {
      categories.add(item.category);
    });
  });
  return Array.from(categories).sort();
}; 