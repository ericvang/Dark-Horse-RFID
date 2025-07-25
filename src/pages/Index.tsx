import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { SearchBar } from "@/components/dashboard/search-bar";
import { ItemGrid } from "@/components/dashboard/item-grid";
import { mockData, type Item } from "@/data/mock-data";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [data, setData] = useState(mockData);
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar systemStatus={data.system.status} />
      
      <main className="flex-1 p-8">
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
        />
        
        <ItemGrid 
          items={data.items}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
};

export default Index;
