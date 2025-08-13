import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange?: (filter: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange, onFilterChange }: SearchBarProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilterChange?.(value);
    if (isMobile) {
      setIsFilterSheetOpen(false);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="mobile-search-icon w-4 h-4" />
        <Input
          placeholder="      Search name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mobile-search-input"
        />
      </div>

      {/* Filter Options */}
      {isMobile ? (
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mobile-button">
              <Filter className="w-4 h-4 mr-2" />
              Filter: {selectedFilter === "all" ? "All Items" : selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="mobile-modal-content">
            <SheetHeader>
              <SheetTitle>Filter Options</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="mobile-form-group">
                <label className="mobile-form-label">Filter by Status</label>
                <Select value={selectedFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="mobile-form-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="detected">Detected</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                    <SelectItem value="essential">Essential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex items-center gap-4">
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="detected">Detected</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
              <SelectItem value="essential">Essential</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}