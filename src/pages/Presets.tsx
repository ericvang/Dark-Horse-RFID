import { useState } from "react";
import { EventPresets } from "@/components/dashboard/event-presets";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { PresetItem } from "@/data/event-presets";
import { useFirebaseItems } from "@/hooks/useFirebase";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";

export function Presets() {
  const { user } = useAuth();
  const { addItem } = useFirebaseItems(user?.uid); // Pass userId here
  const { toast } = useToast();

  const handleApplyPreset = async (presetItems: PresetItem[]) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply presets.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const presetItem of presetItems) {
        const newItem = {
          name: presetItem.name,
          description: presetItem.description,
          category: presetItem.category,
          rfid: presetItem.rfid || `RFID-${Math.random().toString(36).substr(2, 9)}`,
          status: "missing" as const,
          isEssential: presetItem.isEssential,
          lastSeen: new Date().toISOString(),
        };

        await addItem(newItem);
      }

      toast({
        title: "Preset Applied",
        description: `Added ${presetItems.length} items from preset`,
      });
    } catch (error) {
      console.error('Error applying preset:', error);
      toast({
        title: "Error",
        description: "Failed to apply preset. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Authentication check
  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to view presets.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Clean Tech Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Package className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Event Presets</h1>
              <p className="text-muted-foreground text-lg">
                Quick setup for common events and activities
              </p>
            </div>
          </div>
        </div>

        {/* Presets Content */}
        <Card className="border border-border bg-card">
          <div className="p-6">
            <EventPresets onApplyPreset={handleApplyPreset} />
          </div>
        </Card>
      </div>
    </AppLayout>
  );
} 