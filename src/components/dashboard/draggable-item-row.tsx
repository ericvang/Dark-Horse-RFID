import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

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

interface DraggableItemRowProps {
  item: Item;
  isSelected: boolean;
  onToggleSelection: (itemId: string) => void;
  onView: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (itemId: string) => void;
}

export function DraggableItemRow({
  item,
  isSelected,
  onToggleSelection,
  onView,
  onEdit,
  onDelete
}: DraggableItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'bg-muted/50' : ''} hover:bg-muted/30 transition-colors`}
    >
      <td className="p-4">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(item.id)}
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="space-y-1">
            <div className="font-medium text-foreground">{item.name}</div>
            <div className="text-sm text-muted-foreground">{item.description}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {item.rfid}
        </code>
      </td>
      <td className="p-4">
        <Badge variant="outline">{item.category}</Badge>
      </td>
      <td className="p-4">
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
      </td>
      <td className="p-4 text-sm text-muted-foreground">
        {item.lastSeen}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onView(item)}
            aria-label={`View ${item.name}`}
            className="hover:bg-muted h-8 w-8"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(item)}
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
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
} 