import { Card } from "@/components/ui/card";
import { Package, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StatsData {
  totalItems: number;
  detected: number;
  missing: number;
  essentialMissing: number;
}

interface StatCardsProps {
  stats: StatsData;
}

export function StatCards({ stats }: StatCardsProps) {
  const { toast } = useToast();

  const cards = [
    {
      icon: Package,
      label: "Total Items",
      value: stats.totalItems,
      bgColor: "bg-primary-muted",
      iconColor: "text-primary",
      description: "All tracked items"
    },
    {
      icon: CheckCircle,
      label: "Detected",
      value: stats.detected,
      bgColor: "bg-success-muted",
      iconColor: "text-success",
      description: "Items currently in bag"
    },
    {
      icon: AlertCircle,
      label: "Missing",
      value: stats.missing,
      bgColor: "bg-warning-muted",
      iconColor: "text-warning",
      description: "Items not detected"
    },
    {
      icon: Zap,
      label: "Essential Missing",
      value: stats.essentialMissing,
      bgColor: "bg-destructive/10",
      iconColor: "text-destructive",
      description: "Critical items missing"
    }
  ];

  const handleCardClick = (card: typeof cards[0]) => {
    toast({
      title: card.label,
      description: card.description,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index} 
            className="p-6 bg-card border-border hover:scale-105 transition-all duration-200 cursor-pointer hover:shadow-lg"
            onClick={() => handleCardClick(card)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}