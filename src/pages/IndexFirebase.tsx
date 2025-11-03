import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useFirebaseItems } from "@/hooks/useFirebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { ItemCard } from "@/components/dashboard/item-card";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { SearchBar } from "@/components/dashboard/search-bar";
import { ItemGrid } from "@/components/dashboard/item-grid";
import { Header } from "@/components/dashboard/header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemEditModal } from "@/components/modals/item-edit-modal";
import { useToast } from "@/hooks/use-toast";

export function IndexFirebase() {
  const { user } = useAuth();
  const { items, loading, error, updateRFIDStatus, updateItem, deleteItem } = useFirebaseItems(user?.uid);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isScanning, setIsScanning] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = items.length;
    const detected = items.filter(item => item.status === "detected").length;
    const missing = items.filter(item => item.status === "missing").length;
    const essentialMissing = items.filter(
      item => item.status === "missing" && item.isEssential
    ).length;

    return { totalItems, detected, missing, essentialMissing };
  }, [items]);

  // Get missing items for alert banner
  const missingItems = useMemo(() => {
    const missing = items.filter(item => item.status === "missing");
    const essentialMissing = missing.filter(item => item.isEssential);
    const otherMissing = missing.filter(item => !item.isEssential);
    
    return { essentialMissing, otherMissing };
  }, [items]);

  // Filter items based on search and filter
  const filteredItems = useMemo(() => {
    let filtered = items;

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
  }, [items, searchQuery, filterType]);

  const handleManualScan = async () => {
    setIsScanning(true);
    
    // TODO: Replace with actual RFID scan logic
    // This is where your teammate will integrate live RFID scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // TODO: Replace with actual RFID detection logic
    // This will be updated to use real RFID hardware
    try {
      // Placeholder for live RFID integration
      console.log('RFID scan initiated - ready for live integration');
    } catch (error) {
      console.error('Error during RFID scan:', error);
    }
    
    setIsScanning(false);
  };

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
  };

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error loading data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Please check your Firebase connection and try again.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6" role="region" aria-label="Dashboard content">
        {/* Header with Scan Functionality */}
        <Header 
          lastScanTimestamp={new Date().toISOString()}
          onManualScan={handleManualScan}
          isScanning={isScanning}
        />

        {/* Stats Cards */}
        <section aria-label="Statistics overview">
          <StatCards stats={stats} />
        </section>
        
        {/* Alert Banner for Missing Items */}
        {stats.essentialMissing > 0 && (
          <section aria-label="Alerts and warnings" role="alert">
            <AlertBanner
              totalItems={stats.totalItems}
              detectedCount={stats.detected}
              essentialMissingItems={missingItems.essentialMissing}
              otherMissingItems={missingItems.otherMissing}
            />
          </section>
        )}

        {/* Search and Filter Bar */}
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterChange={handleFilterChange}
        />
        
        {/* Items Grid */}
        <section 
          aria-label={`Items list: ${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''} displayed`}
          aria-live="polite"
          aria-atomic="false"
        >
          <ItemGrid 
            items={filteredItems}
            searchQuery={searchQuery}
            onViewItem={handleViewItem}
            onEditItem={handleEditItem}
          />
        </section>

        {/* Item View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent 
            className="max-w-2xl"
            aria-labelledby="item-details-title"
            aria-describedby="item-details-description"
            role="dialog"
          >
            <DialogHeader>
              <DialogTitle id="item-details-title" className="flex items-center gap-2">
                <Package className="h-5 w-5" aria-hidden="true" />
                Item Details
              </DialogTitle>
              <p id="item-details-description" className="sr-only">
                Detailed information about {selectedItem?.name || 'the selected item'}
              </p>
            </DialogHeader>
            {selectedItem ? (
              <div className="space-y-6" role="document">
                {/* Item Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">{selectedItem.name}</h3>
                    <p className="text-muted-foreground">{selectedItem.description}</p>
                  </div>
                  <div className="flex items-center gap-2" role="group" aria-label="Item status indicators">
                    <Badge 
                      variant={selectedItem.status === "detected" ? "secondary" : "destructive"}
                      role="status"
                      aria-label={`Status: ${selectedItem.status === "detected" ? "Detected" : "Missing"}`}
                    >
                      {selectedItem.status === "detected" ? "Detected" : "Missing"}
                    </Badge>
                    {selectedItem.isEssential && (
                      <Badge variant="destructive" aria-label="Essential item">Essential</Badge>
                    )}
                  </div>
                </div>

                {/* Item Information Grid */}
                <dl className="grid grid-cols-2 gap-4" role="list">
                  <div className="space-y-2" role="listitem">
                    <dt className="text-sm font-medium text-muted-foreground">RFID Tag</dt>
                    <dd>
                      <code className="block w-full p-2 bg-muted rounded font-mono text-sm" aria-label={`RFID tag: ${selectedItem.rfid}`}>
                        {selectedItem.rfid}
                      </code>
                    </dd>
                  </div>
                  <div className="space-y-2" role="listitem">
                    <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                    <dd>
                      <Badge variant="outline" className="w-full justify-center" aria-label={`Category: ${selectedItem.category}`}>
                        {selectedItem.category}
                      </Badge>
                    </dd>
                  </div>
                  <div className="space-y-2" role="listitem">
                    <dt className="text-sm font-medium text-muted-foreground">Last Seen</dt>
                    <dd>
                      <time 
                        dateTime={selectedItem.lastSeen} 
                        className="text-sm"
                        aria-label={`Last seen: ${new Date(selectedItem.lastSeen).toLocaleString()}`}
                      >
                        {new Date(selectedItem.lastSeen).toLocaleString()}
                      </time>
                    </dd>
                  </div>
                  <div className="space-y-2" role="listitem">
                    <dt className="text-sm font-medium text-muted-foreground">Essential Item</dt>
                    <dd className="text-sm" aria-label={`Essential item: ${selectedItem.isEssential ? "Yes" : "No"}`}>
                      {selectedItem.isEssential ? "Yes" : "No"}
                    </dd>
                  </div>
                </dl>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t" role="group" aria-label="Item actions">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedItem(null);
                    }}
                    aria-label="Close item details dialog"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      // Switch to edit mode
                      setIsViewModalOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    aria-label={`Edit ${selectedItem.name}`}
                  >
                    Edit Item
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No item data available</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Item Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            // Modal is being closed
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            {selectedItem && (
              <ItemEditModal
                item={selectedItem}
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedItem(null);
                }}
                onSave={async (updatedItem) => {
                  try {
                    await updateItem(updatedItem.id, updatedItem);
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                    toast({
                      title: "Item updated",
                      description: `Item "${updatedItem.name}" updated.`,
                    });
                  } catch (error) {
                    console.error('Error updating item:', error);
                    toast({
                      title: "Error updating item",
                      description: `Failed to update item "${updatedItem.name}".`,
                      variant: "destructive",
                    });
                  }
                }}
                onDelete={async (itemId) => {
                  try {
                    await deleteItem(itemId);
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                    toast({
                      title: "Item deleted",
                      description: `Item "${selectedItem.name}" deleted.`,
                    });
                  } catch (error) {
                    console.error('Error deleting item:', error);
                    toast({
                      title: "Error deleting item",
                      description: "Failed to delete item.",
                      variant: "destructive",
                    });
                  }
                }}
                mode="edit"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}