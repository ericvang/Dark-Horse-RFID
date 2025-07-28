import { useState, useRef } from "react";
import { Monitor, Package, Bell, BarChart3, Wifi, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileMenu } from "@/components/ui/user-profile-menu";
import { type User as UserType } from "@/data/mock-data";

interface SidebarProps {
  systemStatus: "active" | "idle" | "disconnected";
  activePage: "dashboard" | "items" | "reminders" | "analytics";
  onNavigate: (page: "dashboard" | "items" | "reminders" | "analytics") => void;
  user: UserType;
  onAccountSettings: () => void;
  onLogout: () => void;
}

export function Sidebar({ 
  systemStatus, 
  activePage, 
  onNavigate, 
  user, 
  onAccountSettings, 
  onLogout 
}: SidebarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userProfileRef = useRef<HTMLDivElement>(null);

  const statusConfig = {
    active: { dot: "bg-success", text: "Online & Scanning" },
    idle: { dot: "bg-warning", text: "Online & Idle" },
    disconnected: { dot: "bg-destructive", text: "Offline" }
  };

  const currentStatus = statusConfig[systemStatus];

  const handleUserProfileClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleNavigate = (page: "dashboard" | "items" | "reminders" | "analytics") => {
    onNavigate(page);
  };

  const handleAccountSettings = () => {
    setIsUserMenuOpen(false);
    onAccountSettings();
  };

  const handleHelpSupport = () => {
    setIsUserMenuOpen(false);
    alert('Help & Support is not yet available.');
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    onLogout();
  };

  const getUserMenuPosition = () => {
    if (!userProfileRef.current) return { top: 0, left: 0 };
    const rect = userProfileRef.current.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
    };
  };

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-accent-foreground">RFID Monitor</h1>
            <p className="text-xs text-sidebar-foreground">Smart Bag Tracking</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <p className="text-xs font-medium text-sidebar-foreground mb-3">NAVIGATION</p>
        <nav className="space-y-1" role="navigation">
          <button
            onClick={() => handleNavigate("dashboard")}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors",
              activePage === "dashboard"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            aria-current={activePage === "dashboard" ? "page" : undefined}
          >
            <Monitor className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNavigate("items")}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors",
              activePage === "items"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            aria-current={activePage === "items" ? "page" : undefined}
          >
            <Package className="w-4 h-4" />
            <span>Items</span>
          </button>
          <button
            onClick={() => handleNavigate("reminders")}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors",
              activePage === "reminders"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            aria-current={activePage === "reminders" ? "page" : undefined}
          >
            <Bell className="w-4 h-4" />
            <span>Smart Reminders</span>
          </button>
          <button
            onClick={() => handleNavigate("analytics")}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors",
              activePage === "analytics"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            aria-current={activePage === "analytics" ? "page" : undefined}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </nav>
      </div>

      {/* System Status */}
      <div className="p-4">
        <p className="text-xs font-medium text-sidebar-foreground mb-3">SYSTEM STATUS</p>
        <div className="bg-sidebar-accent/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-4 h-4 text-sidebar-foreground" />
              <span className="text-sm text-sidebar-accent-foreground">RFID Reader</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", currentStatus.dot)} />
              <span className="text-xs text-sidebar-foreground">{currentStatus.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div
          ref={userProfileRef}
          role="button"
          tabIndex={0}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer"
          onClick={handleUserProfileClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleUserProfileClick();
            }
          }}
          aria-haspopup="true"
          aria-expanded={isUserMenuOpen}
          aria-label="User profile menu"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatarUrl} alt={`${user.name} avatar`} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-foreground truncate">
              System Administrator
            </p>
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 text-sidebar-foreground transition-transform",
            isUserMenuOpen && "rotate-180"
          )} />
        </div>
      </div>

      {/* User Profile Menu */}
      <UserProfileMenu
        isOpen={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        onAccountSettings={handleAccountSettings}
        onHelpSupport={handleHelpSupport}
        onLogout={handleLogout}
        position={getUserMenuPosition()}
      />
    </div>
  );
}