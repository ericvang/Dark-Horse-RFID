import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock, Eye, Edit, Trash2, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTouchGestures } from "@/hooks/use-touch-gestures";

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

interface SwipeableItemCardProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (itemId: string) => void;
  onArchive?: (itemId: string) => void;
}

export function SwipeableItemCard({ 
  item, 
  onEdit, 
  onDelete, 
  onArchive 
}: SwipeableItemCardProps) {
  const [isSwiped, setIsSwiped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const statusIcon = item.status === "detected" ? CheckCircle : AlertCircle;
  const StatusIcon = statusIcon;
  
  const categoryColors: Record<string, string> = {
    electronics: "bg-blue-100 text-blue-800",
    documents: "bg-purple-100 text-purple-800",
    keys: "bg-green-100 text-green-800",
    medical: "bg-red-100 text-red-800",
    personal: "bg-orange-100 text-orange-800"
  };

  const handleViewDetails = () => {
    toast({
      title: "Item Details",
      description: `Viewing details for ${item.name}`,
    });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    } else {
      toast({
        title: "Edit Item",
        description: `Edit functionality for ${item.name} will be available soon.`,
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id);
      toast({
        title: "Item Deleted",
        description: `${item.name} has been deleted.`,
      });
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(item.id);
      toast({
        title: "Item Archived",
        description: `${item.name} has been archived.`,
      });
    }
  };

  // Touch gesture handlers
  const { touchHandlers } = useTouchGestures({
    onSwipeLeft: () => {
      if (isMobile) {
        setIsSwiped(true);
        setSwipeDirection('left');
        toast({
          title: "Quick Actions",
          description: "Swipe right to reveal more options",
        });
      }
    },
    onSwipeRight: () => {
      if (isMobile) {
        setIsSwiped(false);
        setSwipeDirection(null);
      }
    },
    onTap: () => {
      if (!isSwiped) {
        handleViewDetails();
      }
    },
    onLongPress: () => {
      if (isMobile) {
        toast({
          title: "Quick Actions",
          description: "Long press for more options",
        });
      }
    }
  });

  const resetSwipe = () => {
    setIsSwiped(false);
    setSwipeDirection(null);
  };

  if (!isMobile) {
    // Fallback to regular item card for desktop
    return (
      <Card 
        className={cn(
          "transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer",
          item.status === "missing" && "bg-warning-muted/30",
          "p-4"
        )}
        onClick={handleViewDetails}
      >
        <div className="flex items-start justify-between mb-3">
          {item.isEssential && (
            <Badge variant="destructive" className="text-xs">
              Essential
            </Badge>
          )}
          
          <Badge 
            variant={item.status === "detected" ? "secondary" : "destructive"}
            className={cn(
              "flex items-center gap-1 text-xs",
              item.status === "detected" 
                ? "bg-success-muted text-success border-success/20" 
                : "bg-warning-muted text-warning border-warning/20"
            )}
          >
            <StatusIcon className="w-3 h-3" />
            {item.status === "detected" ? "Detected" : "Missing"}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-base">{item.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={cn("text-xs", categoryColors[item.category] || "bg-gray-100 text-gray-800")}
            >
              {item.category}
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="hidden sm:inline">{item.lastSeen}</span>
              <span className="sm:hidden">{item.lastSeen.split(' ')[0]}</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground font-mono break-all">
            RFID: {item.rfid}
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-border/50 justify-start">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="flex items-center gap-1 text-xs h-7 px-2"
            >
              <Eye className="w-3 h-3" />
              <span className="text-xs">View</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="flex items-center gap-1 text-xs h-7 px-2"
            >
              <Edit className="w-3 h-3" />
              <span className="text-xs">Edit</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Mobile swipeable card
  return (
    <div className="relative overflow-hidden">
      {/* Swipe Actions Background */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-end pr-4 transition-transform duration-300 ease-out",
        isSwiped ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="h-12 w-12 p-0 rounded-full"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleArchive}
            className="h-12 w-12 p-0 rounded-full"
          >
            <Archive className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Card Content */}
      <Card 
        className={cn(
          "relative transition-transform duration-300 ease-out cursor-pointer",
          item.status === "missing" && "bg-warning-muted/30",
          "p-4",
          isSwiped && "transform -translate-x-20"
        )}
        {...touchHandlers}
        onClick={resetSwipe}
      >
        <div className="flex items-start justify-between mb-3">
          {item.isEssential && (
            <Badge variant="destructive" className="text-xs">
              Essential
            </Badge>
          )}
          
          <Badge 
            variant={item.status === "detected" ? "secondary" : "destructive"}
            className={cn(
              "flex items-center gap-1 text-xs",
              item.status === "detected" 
                ? "bg-success-muted text-success border-success/20" 
                : "bg-warning-muted text-warning border-warning/20"
            )}
          >
            <StatusIcon className="w-3 h-3" />
            {item.status === "detected" ? "Detected" : "Missing"}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-base">{item.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={cn("text-xs", categoryColors[item.category] || "bg-gray-100 text-gray-800")}
            >
              {item.category}
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{item.lastSeen.split(' ')[0]}</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground font-mono break-all">
            RFID: {item.rfid}
          </p>

          {/* Swipe Hint */}
          {!isSwiped && (
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/50">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>← Swipe for actions</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 