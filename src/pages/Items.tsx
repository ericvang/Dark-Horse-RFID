import { useState, useMemo } from "react";
import { Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Item } from "@/data/mock-data";

interface ItemsProps {
  items: Item[];
  lastScanTimestamp: string;
}

export function Items({ items, lastScanTimestamp }: ItemsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Detected" | "Missing">("All");

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || 
                           (statusFilter === "Detected" && item.status === "detected") ||
                           (statusFilter === "Missing" && item.status === "missing");
      
      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const detected = items.filter(item => item.status === "detected").length;
    const missing = items.filter(item => item.status === "missing").length;
    return { total, detected, missing };
  }, [items]);

  const filterButtons = [
    { key: "All" as const, label: "All", count: stats.total },
    { key: "Detected" as const, label: "Detected", count: stats.detected },
    { key: "Missing" as const, label: "Missing", count: stats.missing },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Items Management</h1>
          <p className="text-muted-foreground">
            Detailed view of all tracked items - Last scan {formatTimestamp(lastScanTimestamp)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search items"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex gap-2">
            {filterButtons.map(({ key, label, count }) => (
              <Button
                key={key}
                variant={statusFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(key)}
                className="flex items-center gap-2"
                aria-pressed={statusFilter === key}
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
                  <Checkbox disabled aria-label="Select all items" />
                </TableHead>
                <TableHead scope="col">Item</TableHead>
                <TableHead scope="col">RFID</TableHead>
                <TableHead scope="col">Category</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col">Last Seen</TableHead>
                <TableHead scope="col" className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox disabled aria-label={`Select ${item.name}`} />
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
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={item.status === "detected" ? "secondary" : "destructive"}
                        className={
                          item.status === "detected"
                            ? "bg-success-muted text-success border-success/20"
                            : "bg-warning-muted text-warning border-warning/20"
                        }
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
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        aria-label={`Edit ${item.name}`}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        aria-label={`Delete ${item.name}`}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        aria-label={`More actions for ${item.name}`}
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {items.length} items
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}