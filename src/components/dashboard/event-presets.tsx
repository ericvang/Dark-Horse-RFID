import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { eventPresets, EventPreset, PresetItem } from "@/data/event-presets";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface EventPresetsProps {
  onApplyPreset: (items: PresetItem[]) => void;
}

export function EventPresets({ onApplyPreset }: EventPresetsProps) {
  const [selectedPreset, setSelectedPreset] = useState<EventPreset | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handlePresetSelect = (preset: EventPreset) => {
    setSelectedPreset(preset);
    // Select all essential items by default
    const essentialItemNames = preset.items
      .filter(item => item.isEssential)
      .map(item => item.name);
    setSelectedItems(essentialItemNames);
    setIsDialogOpen(true);
  };

  const handleItemToggle = (itemName: string) => {
    setSelectedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleSelectAll = () => {
    if (selectedPreset) {
      setSelectedItems(selectedPreset.items.map(item => item.name));
    }
  };

  const handleSelectEssential = () => {
    if (selectedPreset) {
      const essentialItemNames = selectedPreset.items
        .filter(item => item.isEssential)
        .map(item => item.name);
      setSelectedItems(essentialItemNames);
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleApplyPreset = () => {
    if (selectedPreset) {
      const itemsToAdd = selectedPreset.items.filter(item => 
        selectedItems.includes(item.name)
      );
      onApplyPreset(itemsToAdd);
      setIsDialogOpen(false);
      setSelectedPreset(null);
      setSelectedItems([]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'hard': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const PresetCard = ({ preset }: { preset: EventPreset }) => (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/20"
      onClick={() => handlePresetSelect(preset)}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{preset.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1">{preset.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {preset.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {preset.estimatedDuration && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {preset.estimatedDuration}
              </Badge>
            )}
            {preset.difficulty && (
              <Badge 
                variant="outline" 
                className={cn("text-xs", getDifficultyColor(preset.difficulty))}
              >
                {getDifficultyIcon(preset.difficulty)}
                <span className="ml-1 capitalize">{preset.difficulty}</span>
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {preset.items.length} items
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );

  const PresetDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className={cn("max-w-2xl", isMobile ? "w-[95vw] max-h-[90vh]" : "")}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{selectedPreset?.icon}</span>
            <span>{selectedPreset?.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        {selectedPreset && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {selectedPreset.description}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                Select All ({selectedPreset.items.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectEssential}
                className="text-xs"
              >
                Essential Only ({selectedPreset.items.filter(item => item.isEssential).length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
                className="text-xs"
              >
                Clear Selection
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Select Items to Add:</h4>
                <Badge variant="secondary">
                  {selectedItems.length} selected
                </Badge>
              </div>
              
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {selectedPreset.items.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                        selectedItems.includes(item.name)
                          ? "bg-primary/5 border-primary/20"
                          : "bg-background border-border hover:bg-muted/50"
                      )}
                    >
                      <Checkbox
                        checked={selectedItems.includes(item.name)}
                        onCheckedChange={() => handleItemToggle(item.name)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          {item.isEssential && (
                            <Badge variant="destructive" className="text-xs">
                              Essential
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyPreset}
                disabled={selectedItems.length === 0}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {selectedItems.length} Items
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const PresetSheet = () => (
    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="text-2xl">{selectedPreset?.icon}</span>
            <span>{selectedPreset?.name}</span>
          </SheetTitle>
        </SheetHeader>
        
        {selectedPreset && (
          <div className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground">
              {selectedPreset.description}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                Select All ({selectedPreset.items.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectEssential}
                className="text-xs"
              >
                Essential Only ({selectedPreset.items.filter(item => item.isEssential).length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
                className="text-xs"
              >
                Clear Selection
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Select Items to Add:</h4>
                <Badge variant="secondary">
                  {selectedItems.length} selected
                </Badge>
              </div>
              
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {selectedPreset.items.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                        selectedItems.includes(item.name)
                          ? "bg-primary/5 border-primary/20"
                          : "bg-background border-border hover:bg-muted/50"
                      )}
                    >
                      <Checkbox
                        checked={selectedItems.includes(item.name)}
                        onCheckedChange={() => handleItemToggle(item.name)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          {item.isEssential && (
                            <Badge variant="destructive" className="text-xs">
                              Essential
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyPreset}
                disabled={selectedItems.length === 0}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {selectedItems.length} Items
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Presets</h2>
          <p className="text-muted-foreground">
            Quick setup for common events and activities
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventPresets.map((preset) => (
          <PresetCard key={preset.id} preset={preset} />
        ))}
      </div>

      {isMobile ? <PresetSheet /> : <PresetDialog />}
    </div>
  );
} 