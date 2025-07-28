import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Scan, Bell, Download, Upload, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onAddItem: () => void;
  onManualScan: () => void;
  isScanning: boolean;
}

export function QuickActions({ onAddItem, onManualScan, isScanning }: QuickActionsProps) {
  const { toast } = useToast();

  const actions = [
    {
      icon: Plus,
      title: "Add Item",
      description: "Register a new item",
      action: onAddItem,
      color: "bg-blue-500",
      badge: "New"
    },
    {
      icon: Scan,
      title: "Manual Scan",
      description: "Trigger RFID scan",
      action: onManualScan,
      color: "bg-green-500",
      badge: isScanning ? "Scanning..." : "Ready",
      disabled: isScanning
    },
    {
      icon: Bell,
      title: "Set Reminder",
      description: "Create smart reminder",
      action: () => {
        toast({
          title: "Reminders",
          description: "Navigate to Smart Reminders to create new reminders.",
        });
      },
      color: "bg-purple-500",
      badge: "Smart"
    },
    {
      icon: Download,
      title: "Export Data",
      description: "Download item list",
      action: () => {
        toast({
          title: "Export Data",
          description: "Data export functionality will be available soon.",
        });
      },
      color: "bg-orange-500",
      badge: "CSV"
    },
    {
      icon: Upload,
      title: "Import Items",
      description: "Bulk import items",
      action: () => {
        toast({
          title: "Import Items",
          description: "Bulk import functionality will be available soon.",
        });
      },
      color: "bg-indigo-500",
      badge: "Bulk"
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Configure system",
      action: () => {
        toast({
          title: "Settings",
          description: "Navigate to Profile & Settings to configure the system.",
        });
      },
      color: "bg-gray-500",
      badge: "Config"
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Badge variant="secondary">6 Actions</Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 justify-start gap-3 hover:shadow-md transition-all duration-200 border border-border hover:border-primary/20"
              onClick={action.action}
              disabled={action.disabled}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-foreground truncate">{action.title}</div>
                <div className="text-sm text-muted-foreground truncate">{action.description}</div>
              </div>
              <Badge 
                variant={action.disabled ? "secondary" : "default"}
                className="text-xs flex-shrink-0"
              >
                {action.badge}
              </Badge>
            </Button>
          );
        })}
      </div>
    </Card>
  );
} 