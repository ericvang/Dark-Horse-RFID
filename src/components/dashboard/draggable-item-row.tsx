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
      <td className="p-1">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(item.id)}
        />
      </td>
      <td className="p-1">
        <div className="flex items-center justify-center">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </td>
      <td className="p-1">
        <div className="space-y-1">
          <div className="font-medium text-foreground truncate text-sm">{item.name}</div>
          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
        </div>
      </td>
      <td className="p-1">
        <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono truncate block w-full">
          {item.rfid}
        </code>
      </td>
      <td className="p-1">
        <Badge variant="outline" className="truncate block w-full text-xs">{item.category}</Badge>
      </td>
      <td className="p-1">
        <div className="flex flex-col gap-1">
          <Badge
            variant={item.status === "detected" ? "secondary" : "destructive"}
            className="text-xs truncate w-full"
          >
            {item.status === "detected" ? "Detected" : "Missing"}
          </Badge>
          {item.isEssential && (
            <Badge variant="destructive" className="text-xs truncate w-full">
              Essential
            </Badge>
          )}
        </div>
      </td>
      <td className="p-1">
        <div className="text-xs text-muted-foreground text-center">
          {item.isEssential ? "Yes" : "No"}
        </div>
      </td>
      <td className="p-1">
        <div className="text-xs text-muted-foreground truncate">
          {new Date(item.lastSeen).toLocaleDateString()}
        </div>
      </td>
      <td className="p-1">
        <div className="flex items-center gap-1 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('View button clicked for item:', item);
              onView(item);
            }}
            className="h-8 w-8 p-0"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Edit button clicked for item:', item);
              onEdit(item);
            }}
            className="h-8 w-8 p-0"
            title="Edit item"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Delete button clicked for item:', item);
              onDelete(item.id);
            }}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            title="Delete item"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
} 