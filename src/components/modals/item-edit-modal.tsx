import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Edit, Plus, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface Item {
  id: string;
  name: string;
  description: string;
  rfid: string;
  category: string;
  isEssential: boolean;
  status: "detected" | "missing";
  lastSeen: string;
}

interface ItemEditModalProps {
  item?: Item;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  onDelete?: (itemId: string) => void;
  mode: "create" | "edit";
}

export function ItemEditModal({ 
  item, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  mode 
}: ItemEditModalProps) {
  const [formData, setFormData] = useState<Partial<Item>>({
    name: "",
    description: "",
    rfid: "",
    category: "electronics",
    isEssential: false,
    status: "detected",
    lastSeen: new Date().toLocaleTimeString()
  });
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (item && mode === "edit") {
      setFormData(item);
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        rfid: generateRFID(),
        category: "electronics",
        isEssential: false,
        status: "detected",
        lastSeen: new Date().toLocaleTimeString()
      });
    }
  }, [item, mode, isOpen]);

  const generateRFID = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleInputChange = (field: keyof Item, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive",
      });
      return;
    }

    const itemToSave: Item = {
      id: item?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description || "",
      rfid: formData.rfid || generateRFID(),
      category: formData.category || "electronics",
      isEssential: formData.isEssential || false,
      status: formData.status || "detected",
      lastSeen: formData.lastSeen || new Date().toLocaleTimeString()
    };

    onSave(itemToSave);
    onClose();
    
    toast({
      title: mode === "create" ? "Item Created" : "Item Updated",
      description: `${itemToSave.name} has been ${mode === "create" ? "created" : "updated"} successfully.`,
    });
  };

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item.id);
      onClose();
      toast({
        title: "Item Deleted",
        description: `${item.name} has been deleted.`,
        variant: "destructive",
      });
    }
  };

  const categories = [
    { value: "electronics", label: "Electronics", color: "bg-blue-100 text-blue-800" },
    { value: "documents", label: "Documents", color: "bg-purple-100 text-purple-800" },
    { value: "keys", label: "Keys", color: "bg-green-100 text-green-800" },
    { value: "medical", label: "Medical", color: "bg-red-100 text-red-800" },
    { value: "personal", label: "Personal", color: "bg-orange-100 text-orange-800" },
    { value: "clothing", label: "Clothing", color: "bg-pink-100 text-pink-800" },
    { value: "accessories", label: "Accessories", color: "bg-indigo-100 text-indigo-800" }
  ];

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side="bottom" className="mobile-modal-content">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                {mode === "create" ? "Add New Item" : "Edit Item"}
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6 mt-4">
              {/* Basic Information */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div className="mobile-form-group">
                    <Label htmlFor="name" className="mobile-form-label">Item Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter item name"
                      className="mobile-form-input"
                    />
                  </div>
                  <div className="mobile-form-group">
                    <Label htmlFor="category" className="mobile-form-label">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="mobile-form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={category.color}>{category.label}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mobile-form-group">
                    <Label htmlFor="description" className="mobile-form-label">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter item description"
                      className="mobile-form-input"
                    />
                  </div>
                </div>
              </Card>

              {/* Technical Details */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Technical Details</h3>
                <div className="space-y-4">
                  <div className="mobile-form-group">
                    <Label htmlFor="rfid" className="mobile-form-label">RFID Tag</Label>
                    <div className="flex gap-2">
                      <Input
                        id="rfid"
                        value={formData.rfid}
                        onChange={(e) => handleInputChange("rfid", e.target.value)}
                        placeholder="RFID tag"
                        className="mobile-form-input font-mono flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleInputChange("rfid", generateRFID())}
                        title="Generate new RFID"
                        className="mobile-touch-target"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mobile-form-group">
                    <Label htmlFor="status" className="mobile-form-label">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="mobile-form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detected">Detected</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Settings */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="mobile-form-label">Essential Item</Label>
                      <p className="text-sm text-muted-foreground">
                        Mark as essential for important alerts
                      </p>
                    </div>
                    <Switch
                      checked={formData.isEssential}
                      onCheckedChange={(checked) => handleInputChange("isEssential", checked)}
                    />
                  </div>
                </div>
              </Card>

              {/* Preview */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Preview</h3>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    {formData.isEssential && (
                      <Badge variant="destructive" className="text-xs">
                        Essential
                      </Badge>
                    )}
                    <Badge
                      variant={formData.status === "detected" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {formData.status === "detected" ? "Detected" : "Missing"}
                    </Badge>
                  </div>
                  <h4 className="font-medium">{formData.name || "Item Name"}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formData.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.value === formData.category)?.label || "Electronics"}
                    </Badge>
                    <code className="text-xs text-muted-foreground">
                      RFID: {formData.rfid || "XXXX"}
                    </code>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4 border-t">
                <div className="flex gap-2">
                  {mode === "edit" && onDelete && (
                    <Button variant="destructive" onClick={handleDelete} className="mobile-button flex-1">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Item
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose} className="mobile-button flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="mobile-button flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {mode === "create" ? "Create Item" : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                {mode === "create" ? "Add New Item" : "Edit Item"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter item name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={category.color}>{category.label}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter item description"
                    className="mt-1"
                  />
                </div>
              </Card>

              {/* Technical Details */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Technical Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rfid">RFID Tag</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="rfid"
                        value={formData.rfid}
                        onChange={(e) => handleInputChange("rfid", e.target.value)}
                        placeholder="RFID tag"
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleInputChange("rfid", generateRFID())}
                        title="Generate new RFID"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detected">Detected</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Settings */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Essential Item</Label>
                      <p className="text-sm text-muted-foreground">
                        Mark as essential for important alerts
                      </p>
                    </div>
                    <Switch
                      checked={formData.isEssential}
                      onCheckedChange={(checked) => handleInputChange("isEssential", checked)}
                    />
                  </div>
                </div>
              </Card>

              {/* Preview */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Preview</h3>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    {formData.isEssential && (
                      <Badge variant="destructive" className="text-xs">
                        Essential
                      </Badge>
                    )}
                    <Badge
                      variant={formData.status === "detected" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {formData.status === "detected" ? "Detected" : "Missing"}
                    </Badge>
                  </div>
                  <h4 className="font-medium">{formData.name || "Item Name"}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formData.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.value === formData.category)?.label || "Electronics"}
                    </Badge>
                    <code className="text-xs text-muted-foreground">
                      RFID: {formData.rfid || "XXXX"}
                    </code>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-2">
                  {mode === "edit" && onDelete && (
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Item
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === "create" ? "Create Item" : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
                 </Dialog>
       )}
     </>
   );
} 