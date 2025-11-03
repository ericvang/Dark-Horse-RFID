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
    <section className="space-y-4 mb-6" aria-label="Search and filter options">
      {/* Search Input */}
      <div className="relative" role="search" aria-label="Search items">
        <label htmlFor="search-input" className="sr-only">
          Search items by name, description, or category
        </label>
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" 
          aria-hidden="true"
        />
        <Input
          id="search-input"
          type="search"
          placeholder="Search name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mobile-search-input pl-10"
          aria-label="Search items by name, description, or category"
          aria-describedby="search-description"
          autoComplete="off"
          role="searchbox"
        />
        <span id="search-description" className="sr-only">
          Search through your items by name, description, or category
        </span>
      </div>

      {/* Filter Options */}
      {isMobile ? (
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full mobile-button"
              aria-label={`Filter items. Current filter: ${selectedFilter === "all" ? "All Items" : selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}`}
              aria-expanded={isFilterSheetOpen}
              aria-haspopup="dialog"
            >
              <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
              <span aria-hidden="true">Filter: </span>
              <span className="sr-only">Current filter: </span>
              {selectedFilter === "all" ? "All Items" : selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="mobile-modal-content"
            aria-labelledby="filter-dialog-title"
            aria-describedby="filter-dialog-description"
          >
            <SheetHeader>
              <SheetTitle id="filter-dialog-title">Filter Options</SheetTitle>
              <p id="filter-dialog-description" className="sr-only">
                Select a filter option to narrow down the items displayed
              </p>
            </SheetHeader>
            <div className="space-y-4 mt-4" role="group" aria-labelledby="filter-dialog-title">
              <div className="mobile-form-group">
                <label htmlFor="filter-select-mobile" className="mobile-form-label">
                  Filter by Status
                </label>
                <Select value={selectedFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger 
                    id="filter-select-mobile"
                    className="mobile-form-input"
                    aria-label="Filter items by status"
                  >
                    <SelectValue aria-label={`Selected filter: ${selectedFilter === "all" ? "All Items" : selectedFilter}`} />
                  </SelectTrigger>
                  <SelectContent role="listbox" aria-label="Filter options">
                    <SelectItem value="all" role="option">All Items</SelectItem>
                    <SelectItem value="detected" role="option">Detected</SelectItem>
                    <SelectItem value="missing" role="option">Missing</SelectItem>
                    <SelectItem value="essential" role="option">Essential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex items-center gap-4" role="group" aria-label="Filter options">
          <label htmlFor="filter-select-desktop" className="sr-only">
            Filter items by status
          </label>
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger 
              id="filter-select-desktop"
              className="w-48"
              aria-label="Filter items by status"
            >
              <SelectValue aria-label={`Selected filter: ${selectedFilter === "all" ? "All Items" : selectedFilter}`} />
            </SelectTrigger>
            <SelectContent role="listbox" aria-label="Filter options">
              <SelectItem value="all" role="option">All Items</SelectItem>
              <SelectItem value="detected" role="option">Detected</SelectItem>
              <SelectItem value="missing" role="option">Missing</SelectItem>
              <SelectItem value="essential" role="option">Essential</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </section>
  );
}