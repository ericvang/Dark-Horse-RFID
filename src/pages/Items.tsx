import { useState, useMemo, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash, ChevronLeft, ChevronRight, Plus, GripVertical, Package, Sparkles, Target, Zap, AlertTriangle } from "lucide-react";
import { useFirebaseItems } from "@/hooks/useFirebase";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AppLayout } from "@/components/layout/AppLayout";
import { ItemEditModal } from "@/components/modals/item-edit-modal";
import { DraggableItemRow } from "@/components/dashboard/draggable-item-row";
import { AdvancedFilters } from "@/components/dashboard/advanced-filters";
import { useToast } from "@/hooks/use-toast";
import { useAccessibility } from "@/contexts/accessibility-context";
import { getAriaLabel, getAriaDescription, announcements } from "@/lib/accessibility";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

export function Items() {
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
  const { user } = useAuth();
  const { items, loading, error, addItem, updateItem, deleteItem } = useFirebaseItems(user?.uid);
  
  // Debug logging
  console.log('Items component - user:', user);
  console.log('Items component - userId:', user?.uid);
  console.log('Items component - user type:', typeof user);
  console.log('Items component - user keys:', user ? Object.keys(user) : 'null');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [itemOrder, setItemOrder] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    categories: [],
    statuses: [],
    essentialOnly: false,
    dateRange: { from: undefined, to: undefined },
    sortBy: "name",
    sortOrder: "asc"
  });
  const itemsPerPage = 5;
  const { toast } = useToast();
  const { announceToScreenReader } = useAccessibility();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize item order when items change
  useEffect(() => {
    if (items && items.length > 0) {
      // Try to load saved order from localStorage
      const savedOrder = localStorage.getItem('darkhorse-items-order');
      if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          // Only use saved order if it contains valid item IDs
          if (Array.isArray(parsedOrder) && parsedOrder.every(id => items.some(item => item.id === id))) {
            setItemOrder(parsedOrder);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse saved item order:', e);
        }
      }
      // Fall back to default order if no valid saved order
      setItemOrder(items.map(item => item.id));
    }
  }, [items]);

  // Save item order to localStorage whenever it changes
  useEffect(() => {
    if (itemOrder.length > 0) {
      localStorage.setItem('darkhorse-items-order', JSON.stringify(itemOrder));
    }
  }, [itemOrder]);

  // Function to reset item order to default
  const resetItemOrder = () => {
    if (items && items.length > 0) {
      const defaultOrder = items.map(item => item.id);
      setItemOrder(defaultOrder);
      localStorage.removeItem('darkhorse-items-order');
      toast({
        title: "Order Reset",
        description: "Item order has been reset to default.",
      });
    }
  };

  // Get unique categories from items
  const availableCategories = useMemo(() => {
    if (!items || items.length === 0) return [];
    const categories = new Set(items.map(item => item.category));
    return Array.from(categories) as string[];
  }, [items]);

  // Apply all filters and sorting
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items || [];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filters
    if (advancedFilters.categories.length > 0) {
      filtered = filtered.filter(item => 
        advancedFilters.categories.includes(item.category)
      );
    }

    // Apply status filters
    if (advancedFilters.statuses.length > 0) {
      filtered = filtered.filter(item => 
        advancedFilters.statuses.includes(item.status)
      );
    }

    // Apply essential filter
    if (advancedFilters.essentialOnly) {
      filtered = filtered.filter(item => item.isEssential);
    }

    // Apply date range filter
    if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.lastSeen);
        if (advancedFilters.dateRange.from && itemDate < advancedFilters.dateRange.from) return false;
        if (advancedFilters.dateRange.to && itemDate > advancedFilters.dateRange.to) return false;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (advancedFilters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastSeen':
          aValue = new Date(a.lastSeen);
          bValue = new Date(b.lastSeen);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (advancedFilters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [items, searchTerm, advancedFilters]);

  // Get items in current order for display
  const currentItemsInOrder = useMemo(() => {
    if (!filteredAndSortedItems || filteredAndSortedItems.length === 0) return [];
    
    // If we have a custom order, use it; otherwise use the filtered items
    if (itemOrder.length > 0) {
      const orderedItems = [];
      const itemMap = new Map(filteredAndSortedItems.map(item => [item.id, item]));
      
      // Add items in the custom order
      for (const id of itemOrder) {
        if (itemMap.has(id)) {
          orderedItems.push(itemMap.get(id)!);
        }
      }
      
      // Add any remaining items that weren't in the order
      for (const item of filteredAndSortedItems) {
        if (!itemOrder.includes(item.id)) {
          orderedItems.push(item);
        }
      }
      
      return orderedItems;
    }
    
    return filteredAndSortedItems;
  }, [filteredAndSortedItems, itemOrder]);

  // Pagination
  const totalPages = Math.ceil(currentItemsInOrder.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentItemsInOrder.slice(startIndex, endIndex);

  // NOW WE CAN HAVE CONDITIONAL RENDERING AFTER ALL HOOKS ARE CALLED

  // Authentication check - ensure user is fully loaded
  if (!user || !user.uid) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to view your items.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Loading state - ensure we have both user and items loaded
  if (loading || !items) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4 sm:p-6 space-y-4">
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
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Ensure we have items to display
  if (!items || items.length === 0) {
    return (
      <AppLayout>
        <div className="space-y-6">
          {/* Clean Tech Header */}
          <div className="border-b border-border pb-6 w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                <Package className="h-6 w-6 text-slate-700" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground break-words">RFID Items Management</h1>
                <p className="text-muted-foreground text-base md:text-lg break-words">
                  Track, organize, and manage all your RFID-tagged items
                </p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <Card className="p-12 text-center border border-border">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No RFID Items Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You don't have any RFID items yet. Create your first item to get started with tracking and management.
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Item
            </Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Event handlers
  const handleViewItem = (item: any) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
    announceToScreenReader(`Viewing details for ${item.name}`);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
    announceToScreenReader(`Editing ${item.name}`);
  };

  const handleDelete = async (itemId: string) => {
    try {
      const item = items.find(i => i.id === itemId);
      await deleteItem(itemId);
      setSelectedItems(prev => prev.filter(id => id !== itemId));
      toast({
        title: "Item Deleted",
        description: "Item has been deleted successfully.",
      });
      announceToScreenReader(`Item ${item?.name || 'deleted'} successfully`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveItem = async (item: any) => {
    try {
      if (editingItem) {
        // Update existing item
        await updateItem(item.id, item);
        announceToScreenReader(`Item ${item.name} updated successfully`);
      } else {
        // Create new item - ensure all required fields are present
        const newItem = {
          name: item.name,
          description: item.description || "",
          rfid: item.rfid || `RFID-${Math.random().toString(36).substr(2, 9)}`,
          category: item.category || "electronics",
          isEssential: item.isEssential || false,
          status: item.status || "missing" as const,
          lastSeen: new Date().toISOString(),
        };
        
        console.log('Creating new item:', newItem); // Debug log
        await addItem(newItem);
        announceToScreenReader(`Item ${item.name} created successfully`);
      }
    } catch (error) {
      console.error('Error saving item:', error); // Debug log
      toast({
        title: "Error",
        description: "Failed to save item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to delete.",
        variant: "destructive",
      });
      announceToScreenReader("No items selected for deletion");
      return;
    }

    try {
      // Delete items one by one (Firebase doesn't support bulk delete in the free tier)
      for (const itemId of selectedItems) {
        await deleteItem(itemId);
      }
      setSelectedItems([]);
      toast({
        title: "Items Deleted",
        description: `${selectedItems.length} items have been deleted.`,
      });
      announceToScreenReader(`${selectedItems.length} items deleted successfully`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some items. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = itemOrder.indexOf(active.id as string);
      const newIndex = itemOrder.indexOf(over?.id as string);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(itemOrder, oldIndex, newIndex);
        setItemOrder(newOrder);
        toast({
          title: "Item Reordered",
          description: "Item order has been updated.",
        });
        announceToScreenReader("Item reordered successfully");
      }
    }
  };

  const handleFiltersChange = (filters: FilterState) => {
    setAdvancedFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
    announceToScreenReader(announcements.itemsFiltered(filteredAndSortedItems.length));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    announceToScreenReader(announcements.pageChanged(newPage));
  };

  return (
    <AppLayout>
      <div className="space-y-6 w-full">
        {/* Clean Tech Header */}
        <header className="border-b border-border pb-6 w-full" role="banner">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0" aria-hidden="true">
              <Package className="h-6 w-6 text-slate-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground break-words">RFID Items Management</h1>
              <p className="text-muted-foreground text-base md:text-lg break-words">
                Track, organize, and manage all your RFID-tagged items
              </p>
            </div>
          </div>
        </header>

        {/* Stats Cards - Constrained Width */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <Card className="p-4 md:p-6 border border-border bg-card w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                <Package className="h-4 w-4 md:h-5 md:w-5 text-slate-700" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground">Total Items</p>
                <p className="text-lg md:text-2xl font-bold text-foreground truncate">{items.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 md:p-6 border border-border bg-card w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-slate-700" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground">Detected</p>
                <p className="text-lg md:text-2xl font-bold text-foreground truncate">{items.filter(i => i.status === 'detected').length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 md:p-6 border border-border bg-card w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-slate-700" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground">Missing</p>
                <p className="text-lg md:text-2xl font-bold text-foreground truncate">{items.filter(i => i.status === 'missing').length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 md:p-6 border border-border bg-card w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-slate-700" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground">Essential</p>
                <p className="text-lg md:text-2xl font-bold text-foreground truncate">{items.filter(i => i.isEssential).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Advanced Filters */}
        <div className="w-full">
          <AdvancedFilters
            onFiltersChange={handleFiltersChange}
            currentFilters={advancedFilters}
            availableCategories={availableCategories}
          />
        </div>

        {/* Search and Actions - Constrained Width */}
        <div className="space-y-4 w-full">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between w-full">
            <div className="flex-1 w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                  aria-label={getAriaLabel('search')}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0 w-full sm:w-auto">
              
              {selectedItems.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  aria-label={getAriaLabel('delete')}
                  className="w-full sm:w-auto"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedItems.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={resetItemOrder}
                className="w-full sm:w-auto"
                title="Reset item order to default"
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset Order
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                aria-label={getAriaLabel('add')}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {filteredAndSortedItems.length} of {items.length} items
            </Badge>
            {(advancedFilters.categories.length > 0 || advancedFilters.statuses.length > 0 || advancedFilters.essentialOnly || advancedFilters.dateRange.from || advancedFilters.dateRange.to) && (
              <Badge variant="outline" className="text-xs">
                {filteredAndSortedItems.length} filtered results
              </Badge>
            )}
          </div>
          
          {searchTerm && (
            <p className="text-sm text-muted-foreground break-words">
              Searching for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Items Table - Properly Constrained */}
        <Card className="border border-border w-full">
          <div className="p-4 md:p-6 w-full">
            {currentItems.length === 0 ? (
              <div className="text-center py-8 md:py-12 w-full">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                  <Package className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 break-words">
                  {searchTerm || advancedFilters.categories.length > 0 || advancedFilters.statuses.length > 0
                    ? "No items match your current filters."
                    : "No RFID items found"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm md:text-base break-words">
                  {searchTerm || advancedFilters.categories.length > 0 || advancedFilters.statuses.length > 0
                    ? "Try adjusting your search terms or filters to find what you're looking for."
                    : "Create your first RFID item to get started with tracking and management."}
                </p>
                {!searchTerm && advancedFilters.categories.length === 0 && advancedFilters.statuses.length === 0 && (
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Item
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Table Container - Responsive table that fits within page margins */}
                <div className="w-full">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={currentItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="w-full overflow-hidden rounded-lg border border-border">
                        <Table className="w-full table-fixed">
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="w-[6%] px-1 text-xs">Select</TableHead>
                              <TableHead className="w-[6%] px-1 text-xs">Drag</TableHead>
                              <TableHead className="w-[22%] px-1 text-xs">Name</TableHead>
                              <TableHead className="w-[12%] px-1 text-xs">RFID</TableHead>
                              <TableHead className="w-[12%] px-1 text-xs">Category</TableHead>
                              <TableHead className="w-[15%] px-1 text-xs">Status</TableHead>
                              <TableHead className="w-[10%] px-1 text-xs">Essential</TableHead>
                              <TableHead className="w-[12%] px-1 text-xs">Last Seen</TableHead>
                              <TableHead className="w-[12%] px-1 text-xs">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentItems.map((item) => (
                              <DraggableItemRow
                                key={item.id}
                                item={item}
                                isSelected={selectedItems.includes(item.id)}
                                onToggleSelection={(itemId) => {
                                  if (selectedItems.includes(itemId)) {
                                    setSelectedItems(prev => prev.filter(id => id !== itemId));
                                  } else {
                                    setSelectedItems(prev => [...prev, itemId]);
                                  }
                                }}
                                onView={() => handleViewItem(item)}
                                onEdit={() => handleEditItem(item)}
                                onDelete={() => handleDelete(item.id)}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mt-6 pt-6 border-t border-border w-full">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                      Showing {startIndex + 1} to {Math.min(endIndex, currentItemsInOrder.length)} of {currentItemsInOrder.length} items
                    </div>
                    <div className="flex items-center justify-center sm:justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label={getAriaLabel('button')}
                        className="hover:bg-muted"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm px-3 py-1 bg-muted rounded border border-border">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label={getAriaLabel('button')}
                        className="hover:bg-muted"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Modals */}
        <ItemEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          item={editingItem}
          mode="edit"
        />

        <ItemEditModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveItem}
          mode="create"
        />

        {/* Item Detail View Modal */}
        <Dialog 
          open={isViewModalOpen} 
          onOpenChange={(open) => {
            setIsViewModalOpen(open);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Item Details
              </DialogTitle>
            </DialogHeader>
            {viewingItem ? (
              <div className="space-y-6">
                {/* Item Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">{viewingItem.name}</h3>
                    <p className="text-muted-foreground">{viewingItem.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={viewingItem.status === "detected" ? "secondary" : "destructive"}>
                      {viewingItem.status === "detected" ? "Detected" : "Missing"}
                    </Badge>
                    {viewingItem.isEssential && (
                      <Badge variant="destructive">Essential</Badge>
                    )}
                  </div>
                </div>

                {/* Item Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">RFID Tag</label>
                    <code className="block w-full p-2 bg-muted rounded font-mono text-sm">
                      {viewingItem.rfid}
                    </code>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <Badge variant="outline" className="w-full justify-center">
                      {viewingItem.category}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Last Seen</label>
                    <p className="text-sm">
                      {new Date(viewingItem.lastSeen).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Essential Item</label>
                    <p className="text-sm">
                      {viewingItem.isEssential ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setViewingItem(null);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setViewingItem(null);
                      setEditingItem(viewingItem);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit Item
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No item data available</p>
                <p className="text-sm text-muted-foreground">viewingItem is null or undefined</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}