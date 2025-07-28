import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon, 
  Save, 
  Trash2, 
  ChevronDown,
  SortAsc,
  SortDesc
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FilterPreset {
  id: string;
  name: string;
  filters: FilterState;
}

interface FilterState {
  categories: string[];
  statuses: string[];
  essentialOnly: boolean;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  availableCategories: string[];
}

export function AdvancedFilters({ 
  onFiltersChange, 
  currentFilters, 
  availableCategories 
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [presets, setPresets] = useState<FilterPreset[]>([
    {
      id: "1",
      name: "Essential Items",
      filters: {
        categories: [],
        statuses: [],
        essentialOnly: true,
        dateRange: { from: undefined, to: undefined },
        sortBy: "name",
        sortOrder: "asc"
      }
    },
    {
      id: "2", 
      name: "Missing Items",
      filters: {
        categories: [],
        statuses: ["missing"],
        essentialOnly: false,
        dateRange: { from: undefined, to: undefined },
        sortBy: "lastSeen",
        sortOrder: "desc"
      }
    }
  ]);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState("");
  const { toast } = useToast();

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "category", label: "Category" },
    { value: "status", label: "Status" },
    { value: "lastSeen", label: "Last Seen" },
    { value: "essential", label: "Essential" }
  ];

  const handleCategoryToggle = (category: string) => {
    const newCategories = currentFilters.categories.includes(category)
      ? currentFilters.categories.filter(c => c !== category)
      : [...currentFilters.categories, category];
    
    onFiltersChange({
      ...currentFilters,
      categories: newCategories
    });
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = currentFilters.statuses.includes(status)
      ? currentFilters.statuses.filter(s => s !== status)
      : [...currentFilters.statuses, status];
    
    onFiltersChange({
      ...currentFilters,
      statuses: newStatuses
    });
  };

  const handleEssentialToggle = (checked: boolean) => {
    onFiltersChange({
      ...currentFilters,
      essentialOnly: checked
    });
  };

  const handleDateRangeChange = (field: "from" | "to", date: Date | undefined) => {
    onFiltersChange({
      ...currentFilters,
      dateRange: {
        ...currentFilters.dateRange,
        [field]: date
      }
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...currentFilters,
      sortBy
    });
  };

  const handleSortOrderToggle = () => {
    onFiltersChange({
      ...currentFilters,
      sortOrder: currentFilters.sortOrder === "asc" ? "desc" : "asc"
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      statuses: [],
      essentialOnly: false,
      dateRange: { from: undefined, to: undefined },
      sortBy: "name",
      sortOrder: "asc"
    });
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset to default.",
    });
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: "Preset Name Required",
        description: "Please enter a name for your filter preset.",
        variant: "destructive",
      });
      return;
    }

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName,
      filters: { ...currentFilters }
    };

    setPresets(prev => [...prev, newPreset]);
    setPresetName("");
    setShowSavePreset(false);
    
    toast({
      title: "Preset Saved",
      description: `Filter preset "${presetName}" has been saved.`,
    });
  };

  const loadPreset = (preset: FilterPreset) => {
    onFiltersChange(preset.filters);
    toast({
      title: "Preset Loaded",
      description: `Filter preset "${preset.name}" has been applied.`,
    });
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
    toast({
      title: "Preset Deleted",
      description: "Filter preset has been deleted.",
    });
  };

  const activeFiltersCount = [
    currentFilters.categories.length,
    currentFilters.statuses.length,
    currentFilters.essentialOnly ? 1 : 0,
    (currentFilters.dateRange.from || currentFilters.dateRange.to) ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Advanced Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSavePreset(true)}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Preset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant="outline"
            size="sm"
            onClick={() => loadPreset(preset)}
            className="text-xs"
          >
            {preset.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                deletePreset(preset.id);
              }}
              className="ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-3 h-3" />
            </Button>
          </Button>
        ))}
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <Separator />
          
          {/* Categories */}
          <div>
            <Label className="text-sm font-medium">Categories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={currentFilters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["detected", "missing"].map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={currentFilters.statuses.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Essential Items */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="essential-only"
              checked={currentFilters.essentialOnly}
              onCheckedChange={handleEssentialToggle}
            />
            <Label htmlFor="essential-only" className="text-sm">
              Essential items only
            </Label>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="flex gap-2 mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentFilters.dateRange.from ? (
                      format(currentFilters.dateRange.from, "PPP")
                    ) : (
                      <span>From date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentFilters.dateRange.from}
                    onSelect={(date) => handleDateRangeChange("from", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentFilters.dateRange.to ? (
                      format(currentFilters.dateRange.to, "PPP")
                    ) : (
                      <span>To date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentFilters.dateRange.to}
                    onSelect={(date) => handleDateRangeChange("to", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Sorting */}
          <div>
            <Label className="text-sm font-medium">Sort By</Label>
            <div className="flex gap-2 mt-2">
              <Select value={currentFilters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSortOrderToggle}
              >
                {currentFilters.sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Save Preset Dialog */}
      {showSavePreset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Save Filter Preset</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="preset-name">Preset Name</Label>
                <Input
                  id="preset-name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Enter preset name"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSavePreset(false)}>
                  Cancel
                </Button>
                <Button onClick={savePreset}>
                  Save Preset
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
} 