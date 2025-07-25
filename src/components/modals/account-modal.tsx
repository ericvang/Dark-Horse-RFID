import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type User as UserType } from "@/data/mock-data";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
}

export function AccountModal({ isOpen, onClose, user }: AccountModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="animate-scale-in"
        aria-labelledby="account-modal-title"
        role="dialog"
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle id="account-modal-title" className="text-xl font-semibold">
            Account Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatarUrl} alt={`${user.name} avatar`} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">System Administrator</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}