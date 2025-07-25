import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: string;
  name: string;
  isEssential: boolean;
  status: "detected" | "missing";
}

interface AlertBannerProps {
  totalItems: number;
  detectedCount: number;
  essentialMissingItems: Item[];
  otherMissingItems: Item[];
}

export function AlertBanner({ 
  totalItems, 
  detectedCount, 
  essentialMissingItems, 
  otherMissingItems 
}: AlertBannerProps) {
  const completionPercentage = Math.round((detectedCount / totalItems) * 100);

  return (
    <Card className="p-6 bg-warning-muted border-warning/20 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-warning-foreground" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Essential Items Missing
          </h3>
          
          <p className="text-muted-foreground mb-4">
            {detectedCount} of {totalItems} items in bag
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {essentialMissingItems.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Essential Items Missing:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {essentialMissingItems.map((item) => (
                    <Badge key={item.id} variant="destructive" className="text-xs">
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {otherMissingItems.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Other Missing Items:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {otherMissingItems.map((item) => (
                    <Badge key={item.id} variant="secondary" className="text-xs">
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">
            {completionPercentage}%
          </div>
          <p className="text-xs text-muted-foreground">Complete</p>
          <div className="w-20 h-2 bg-secondary rounded-full mt-2">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}