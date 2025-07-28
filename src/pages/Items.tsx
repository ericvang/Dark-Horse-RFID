import { useState } from "react";
import { ArrowLeft, Search, Filter, MoreHorizontal, Eye, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { mockData } from "@/data/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function Items() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { toast } = useToast();

  const filteredItems = mockData.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === "All" || 
                         (activeFilter === "Detected" && item.status === "detected") ||
                         (activeFilter === "Missing" && item.status === "missing");
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

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

  const handleEdit = (itemName: string) => {
    toast({
      title: "Edit Item",
      description: `Edit functionality for ${itemName} will be available soon.`,
    });
  };

  const handleView = (itemName: string) => {
    toast({
      title: "View Item",
      description: `Viewing details for ${itemName}.`,
    });
  };

  const handleDelete = (itemName: string) => {
    toast({
      title: "Delete Item",
      description: `${itemName} has been marked for deletion.`,
      variant: "destructive",
    });
  };

  const filters = [
    { key: "All", label: "All", count: mockData.items.length },
    { key: "Detected", label: "Detected", count: mockData.items.filter(i => i.status === "detected").length },
    { key: "Missing", label: "Missing", count: mockData.items.filter(i => i.status === "missing").length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Items Management</h1>
          <p className="text-muted-foreground">Detailed view of all tracked items</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {filters.map(({ key, label, count }) => (
              <Button
                key={key}
                variant={activeFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(key)}
                className="flex items-center gap-2"
              >
                {label}
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </Card>

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
              {paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItemSelection(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {item.rfid}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={item.status === "detected" ? "secondary" : "destructive"}
                      >
                        {item.status === "detected" ? "Detected" : "Missing"}
                      </Badge>
                      {item.isEssential && (
                        <Badge variant="destructive" className="text-xs">
                          Essential
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.lastSeen}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleView(item.name)}
                        aria-label={`View ${item.name}`}
                        className="hover:bg-muted h-8 w-8"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(item.name)}
                        aria-label={`Edit ${item.name}`}
                        className="hover:bg-muted h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            aria-label={`Delete ${item.name}`}
                            className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Item</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{item.name}"? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleDelete(item.name)}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {filteredItems.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length} items
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="flex items-center gap-1"
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}