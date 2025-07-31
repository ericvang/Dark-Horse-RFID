import { useState } from "react";
import { EventPresets } from "@/components/dashboard/event-presets";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { PresetItem } from "@/data/event-presets";
import { mockData } from "@/data/mock-data";

export function Presets() {
  const [data, setData] = useState(mockData);
  const { toast } = useToast();

  const handleApplyPreset = (presetItems: PresetItem[]) => {
    const newItems = presetItems.map((presetItem, index) => ({
      id: `preset-${Date.now()}-${index}`,
      name: presetItem.name,
      description: presetItem.description,
      category: presetItem.category,
      rfid: presetItem.rfid || `RFID-${Math.random().toString(36).substr(2, 9)}`,
      status: "missing" as const,
      isEssential: presetItem.isEssential,
      lastSeen: new Date().toISOString(),
    }));

    setData(prev => ({
      ...prev,
      items: [...prev.items, ...newItems]
    }));

    toast({
      title: "Preset Applied",
      description: `Added ${presetItems.length} items from preset`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <EventPresets onApplyPreset={handleApplyPreset} />
      </div>
    </AppLayout>
  );
} 