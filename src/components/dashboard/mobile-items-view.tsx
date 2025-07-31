import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Edit, Trash2, MoreHorizontal, Calendar, Tag, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface MobileItemsViewProps {
  items: Item[];
  selectedItems: string[];
  onToggleSelection: (itemId: string) => void;
  onView: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (itemId: string) => void;
  onArchive?: (itemId: string) => void;
}

export function MobileItemsView({
  items,
  selectedItems,
  onToggleSelection,
  onView,
  onEdit,
  onDelete,
  onArchive
}: MobileItemsViewProps) {
  const isMobile = useIsMobile();

  // Debug logging
  console.log('MobileItemsView - isMobile:', isMobile, 'items count:', items.length);

  const handleItemAction = (action: 'view' | 'edit' | 'delete', item: Item) => {
    switch (action) {
      case 'view':
        onView(item);
        break;
      case 'edit':
        onEdit(item);
        break;
      case 'delete':
        onDelete(item.id);
        break;
    }
  };

  // Always render the mobile view when this component is called
  // The parent component handles the mobile detection logic
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="mobile-items-card">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onCheckedChange={() => onToggleSelection(item.id)}
              className="mt-1 flex-shrink-0"
            />
            
            {/* Item Content */}
            <div className="flex-1 min-w-0">
              {/* Header with Name and Status */}
              <div className="mobile-items-header">
                <div className="flex-1 min-w-0">
                  <h3 className="mobile-items-title">
                    {item.name}
                  </h3>
                  <p className="mobile-items-description">
                    {item.description}
                  </p>
                </div>
                
                {/* Status Badge */}
                <Badge 
                  variant={item.status === "detected" ? "secondary" : "destructive"}
                  className={cn(
                    "mobile-items-status-badge",
                    item.status === "detected" 
                      ? "mobile-items-status-detected" 
                      : "mobile-items-status-missing"
                  )}
                >
                  {item.status === "detected" ? "Detected" : "Missing"}
                </Badge>
              </div>
              
              {/* Item Details Grid */}
              <div className="mobile-items-details">
                <div className="mobile-items-detail-row">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium capitalize">{item.category}</span>
                </div>
                
                <div className="mobile-items-detail-row">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Seen:</span>
                  <span className="font-medium">{item.lastSeen}</span>
                </div>
                
                <div className="mobile-items-detail-row">
                  <Wifi className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">RFID:</span>
                  <span className="mobile-items-rfid-tag">
                    {item.rfid}
                  </span>
                </div>
              </div>
              
              {/* Essential Badge */}
              {item.isEssential && (
                <Badge variant="destructive" className="mobile-items-essential-badge">
                  Essential Item
                </Badge>
              )}
              
              {/* Action Buttons */}
              <div className="mobile-items-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleItemAction('view', item)}
                  className="mobile-items-action-button"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleItemAction('edit', item)}
                  className="mobile-items-action-button"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleItemAction('delete', item)}
                  className="mobile-items-action-button text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 