import { ItemCard } from "./item-card";
import { Package } from "lucide-react";

interface Item {
  id: string;
  name: string;
  description: string;
  rfid: string;
  category: string;
  isEssential: boolean;
  status: "detected" | "missing";
  lastSeen: string;
}

interface ItemGridProps {
  items: Item[];
  searchQuery: string;
  onViewItem: (item: Item) => void;
  onEditItem: (item: Item) => void;
}

export function ItemGrid({ items, searchQuery, onViewItem, onEditItem }: ItemGridProps) {
  const filteredItems = items.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  });

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {searchQuery ? "No matching items found" : "No items to display"}
        </h3>
        <p className="text-muted-foreground">
          {searchQuery 
            ? "Try adjusting your search query" 
            : "Start by adding items to your bag"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredItems.map((item) => (
        <ItemCard key={item.id} item={item} onViewItem={onViewItem} onEditItem={onEditItem} />
      ))}
    </div>
  );
}