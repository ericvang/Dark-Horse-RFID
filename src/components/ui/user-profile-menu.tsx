import { useEffect, useRef } from "react";
import { Settings, HelpCircle, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountSettings: () => void;
  onHelpSupport: () => void;
  onLogout: () => void;
  position: { top: number; left: number };
}

export function UserProfileMenu({ 
  isOpen, 
  onClose, 
  onAccountSettings, 
  onHelpSupport, 
  onLogout,
  position 
}: UserProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      // Focus first menu item
      const firstButton = menuRef.current?.querySelector('button');
      firstButton?.focus();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Portal overlay */}
      <div className="fixed inset-0 z-40 bg-black/20" />
      
      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 animate-scale-in"
        style={{
          top: position.top - 180, // Position above the user profile
          left: position.left,
        }}
        role="menu"
        aria-orientation="vertical"
      >
        <Card className="w-48 p-1 shadow-lg border bg-popover">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal h-8"
              onClick={onAccountSettings}
              role="menuitem"
            >
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal h-8"
              onClick={onHelpSupport}
              role="menuitem"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Button>
            
            <Separator className="my-1" />
            
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal h-8 text-destructive hover:text-destructive"
              onClick={onLogout}
              role="menuitem"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}