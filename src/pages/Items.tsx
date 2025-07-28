import { useState, useMemo } from "react";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash, ChevronLeft, ChevronRight, Plus, GripVertical } from "lucide-react";
import { mockData } from "@/data/mock-data";
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
  const [items, setItems] = useState(mockData.items);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
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

  // Get unique categories from items
  const availableCategories = useMemo(() => {
    const categories = new Set(items.map(item => item.category));
    return Array.from(categories);
  }, [items]);

  // Apply all filters and sorting
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

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
        const fromDate = advancedFilters.dateRange.from;
        const toDate = advancedFilters.dateRange.to;
        
        if (fromDate && itemDate < fromDate) return false;
        if (toDate && itemDate > toDate) return false;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (advancedFilters.sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "category":
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "lastSeen":
          aValue = new Date(a.lastSeen);
          bValue = new Date(b.lastSeen);
          break;
        case "essential":
          aValue = a.isEssential ? 1 : 0;
          bValue = b.isEssential ? 1 : 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return advancedFilters.sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return advancedFilters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, searchTerm, advancedFilters]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleAllItems = () => {
    setSelectedItems(prev => 
      prev.length === paginatedItems.length 
        ? []
        : paginatedItems.map(item => item.id)
    );
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
    announceToScreenReader(`Editing item: ${item.name}`);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreateModalOpen(true);
    announceToScreenReader("Creating new item");
  };

  const handleView = (item: any) => {
    toast({
      title: "Item Details",
      description: `Viewing details for ${item.name}`,
    });
    announceToScreenReader(`Viewing details for ${item.name}`);
  };

  const handleDelete = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
    toast({
      title: "Item Deleted",
      description: "Item has been deleted successfully.",
    });
    announceToScreenReader(`Item ${item?.name || 'deleted'} successfully`);
  };

  const handleSaveItem = (item: any) => {
    if (editingItem) {
      // Update existing item
      setItems(prev => prev.map(existingItem => 
        existingItem.id === item.id ? item : existingItem
      ));
      announceToScreenReader(`Item ${item.name} updated successfully`);
    } else {
      // Create new item
      setItems(prev => [...prev, item]);
      announceToScreenReader(`Item ${item.name} created successfully`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to delete.",
        variant: "destructive",
      });
      announceToScreenReader("No items selected for deletion");
      return;
    }

    setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    toast({
      title: "Items Deleted",
      description: `${selectedItems.length} items have been deleted.`,
    });
    announceToScreenReader(`${selectedItems.length} items deleted successfully`);
  };

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        toast({
          title: "Items Reordered",
          description: "Item order has been updated successfully.",
        });

        announceToScreenReader("Items reordered successfully");
        return newItems;
      });
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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Items Management</h1>
          <p className="text-muted-foreground">Detailed view of all tracked items</p>
        </div>

        {/* Advanced Filters */}
        <AdvancedFilters
          onFiltersChange={handleFiltersChange}
          currentFilters={advancedFilters}
          availableCategories={availableCategories}
        />

        {/* Search */}
        <Card className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label={getAriaLabel('search')}
              aria-describedby="search-description"
            />
            <div id="search-description" className="sr-only">
              {getAriaDescription('searchItems')}
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedItems.length} of {items.length} items
          </p>
          {advancedFilters.categories.length > 0 || advancedFilters.statuses.length > 0 || advancedFilters.essentialOnly || advancedFilters.dateRange.from || advancedFilters.dateRange.to ? (
            <Badge variant="secondary">
              {filteredAndSortedItems.length} filtered results
            </Badge>
          ) : null}
        </div>

        {/* Items Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                      onCheckedChange={toggleAllItems}
                      aria-label="Select all items on this page"
                    />
                  </TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>RFID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={paginatedItems.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {paginatedItems.map((item) => (
                      <DraggableItemRow
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.includes(item.id)}
                        onToggleSelection={toggleItemSelection}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </TableBody>
            </Table>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {selectedItems.length} item(s) selected
              </p>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleBulkDelete}
                aria-label={`Delete ${selectedItems.length} selected items`}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedItems.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredAndSortedItems.length)} of {filteredAndSortedItems.length} items
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className="flex items-center gap-1"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className="flex items-center gap-1"
                aria-label="Go to next page"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Add Item Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleCreate} 
            className="flex items-center gap-2"
            aria-label={getAriaLabel('add')}
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {/* Edit Modal */}
        <ItemEditModal
          item={editingItem}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveItem}
          onDelete={handleDelete}
          mode="edit"
        />

        {/* Create Modal */}
        <ItemEditModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveItem}
          mode="create"
        />
      </div>
    </AppLayout>
  );
}