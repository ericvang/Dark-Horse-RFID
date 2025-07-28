import { useState, useMemo } from "react";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { SearchBar } from "@/components/dashboard/search-bar";
import { ItemGrid } from "@/components/dashboard/item-grid";
import { Header } from "@/components/dashboard/header";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockData } from "@/data/mock-data";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [data, setData] = useState(mockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = data.items.length;
    const detected = data.items.filter(item => item.status === "detected").length;
    const missing = data.items.filter(item => item.status === "missing").length;
    const essentialMissing = data.items.filter(
      item => item.status === "missing" && item.isEssential
    ).length;

    return { totalItems, detected, missing, essentialMissing };
  }, [data.items]);

  // Get missing items for alert banner
  const missingItems = useMemo(() => {
    const missing = data.items.filter(item => item.status === "missing");
    const essentialMissing = missing.filter(item => item.isEssential);
    const otherMissing = missing.filter(item => !item.isEssential);
    
    return { essentialMissing, otherMissing };
  }, [data.items]);

  // Filter items based on search and filter
  const filteredItems = useMemo(() => {
    let filtered = data.items;

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    switch (filterType) {
      case "detected":
        filtered = filtered.filter(item => item.status === "detected");
        break;
      case "missing":
        filtered = filtered.filter(item => item.status === "missing");
        break;
      case "essential":
        filtered = filtered.filter(item => item.isEssential);
        break;
      default:
        // "all" - no additional filtering
        break;
    }

    return filtered;
  }, [data.items, searchQuery, filterType]);

  const handleManualScan = async () => {
    setIsScanning(true);
    
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update timestamp
    setData(prev => ({
      ...prev,
      system: {
        ...prev.system,
        lastScanTimestamp: new Date().toISOString()
      }
    }));
    
    setIsScanning(false);
    
    toast({
      title: "Manual scan completed",
      description: `Found ${stats.detected} of ${stats.totalItems} items`,
    });
  };

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
    toast({
      title: "Filter Applied",
      description: `Showing ${filter === "all" ? "all items" : filter} items`,
    });
  };

  return (
    <AppLayout>
      <Header 
        lastScanTimestamp={data.system.lastScanTimestamp}
        onManualScan={handleManualScan}
        isScanning={isScanning}
      />
      
      <StatCards stats={stats} />
      
      {stats.essentialMissing > 0 && (
        <AlertBanner
          totalItems={stats.totalItems}
          detectedCount={stats.detected}
          essentialMissingItems={missingItems.essentialMissing}
          otherMissingItems={missingItems.otherMissing}
        />
      )}

      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterChange={handleFilterChange}
      />
      
      <ItemGrid 
        items={filteredItems}
        searchQuery={searchQuery}
      />
    </AppLayout>
  );
};

export default Index;
