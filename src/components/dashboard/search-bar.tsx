import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange?: (filter: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange, onFilterChange }: SearchBarProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilterChange?.(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={selectedFilter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-full sm:w-32">
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
  );
}