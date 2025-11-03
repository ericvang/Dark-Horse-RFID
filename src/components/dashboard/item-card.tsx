import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, Eye, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

interface ItemCardProps {
  item: Item;
  onViewItem: (item: Item) => void;
  onEditItem: (item: Item) => void;
}

export function ItemCard({ item, onViewItem, onEditItem }: ItemCardProps) {
  const statusIcon = item.status === "detected" ? CheckCircle : AlertCircle;
  const StatusIcon = statusIcon;
  const { toast } = useToast();
  
  const categoryColors: Record<string, string> = {
    electronics: "bg-blue-100 text-blue-800",
    documents: "bg-purple-100 text-purple-800",
    keys: "bg-green-100 text-green-800",
    medical: "bg-red-100 text-red-800",
    personal: "bg-orange-100 text-orange-800"
  };

  const handleViewDetails = () => {
    onViewItem(item);
  };

  const handleEditItem = () => {
    onEditItem(item);
  };

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer",
        item.status === "missing" && "bg-warning-muted/30"
      )}
      onClick={handleViewDetails}
      role="article"
      aria-label={`Item: ${item.name}, Status: ${item.status}, ${item.isEssential ? 'Essential' : 'Non-essential'}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleViewDetails();
        }
      }}
    >
      <div className="flex items-start justify-between mb-3">
        {item.isEssential && (
          <Badge 
            variant="destructive" 
            className="text-xs"
            aria-label="Essential item"
          >
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
          role="status"
          aria-label={`Item status: ${item.status === "detected" ? "Detected" : "Missing"}`}
        >
          <StatusIcon className="w-3 h-3" aria-hidden="true" />
          <span className="sr-only">Status: </span>
          {item.status === "detected" ? "Detected" : "Missing"}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground">{item.name}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn("text-xs", categoryColors[item.category] || "bg-gray-100 text-gray-800")}
            aria-label={`Category: ${item.category}`}
          >
            {item.category}
          </Badge>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-label={`Last seen: ${item.lastSeen}`}>
            <Clock className="w-3 h-3" aria-hidden="true" />
            <time dateTime={item.lastSeen}>{item.lastSeen}</time>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground font-mono" aria-label={`RFID tag: ${item.rfid}`}>
          <span className="sr-only">RFID tag: </span>
          RFID: {item.rfid}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50" role="group" aria-label="Item actions">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="flex items-center gap-1 text-xs h-7 px-2"
            aria-label={`View details for ${item.name}`}
          >
            <Eye className="w-3 h-3" aria-hidden="true" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleEditItem();
            }}
            className="flex items-center gap-1 text-xs h-7 px-2"
            aria-label={`Edit ${item.name}`}
          >
            <Edit className="w-3 h-3" aria-hidden="true" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
}