import { useState, useRef } from "react";
import { Monitor, Package, Bell, BarChart3, Wifi, User, ChevronDown, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileMenu } from "@/components/ui/user-profile-menu";
import { type User as UserType } from "@/types";
import { Package as PackageIcon, Home, Package2, Bell as BellIcon, BarChart3 as BarChartIcon, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAriaLabel, getAriaDescription } from "@/lib/accessibility";

interface SidebarProps {
  systemStatus: "active" | "idle" | "disconnected";
  activePage: "dashboard" | "items" | "presets" | "reminders" | "analytics" | "profile";
  onNavigate: (page: "dashboard" | "items" | "presets" | "reminders" | "analytics" | "profile") => void;
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

  const handleNavigate = (page: "dashboard" | "items" | "presets" | "reminders" | "analytics" | "profile") => {
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

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      description: "View overview and statistics"
    },
    {
      id: "items",
      label: "Items",
      icon: Package2,
      description: "Manage tracked items"
    },
    {
      id: "presets",
      label: "Event Presets",
      icon: Package,
      description: "Quick setup for common events"
    },
    {
      id: "reminders",
      label: "Smart Reminders",
      icon: BellIcon,
      description: "Set up time and location reminders"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChartIcon,
      description: "View detailed analytics and reports"
    },
    {
      id: "profile",
      label: "Profile & Settings",
      icon: SettingsIcon,
      description: "Manage account and preferences"
    }
  ];

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-accent-foreground">Dark Horse Radar</h1>
            <p className="text-xs text-sidebar-foreground">Smart Bag Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <p className="text-xs font-medium text-sidebar-foreground mb-3">NAVIGATION</p>
        <nav className="space-y-1" role="navigation" aria-label={getAriaLabel('mainNavigation')}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <div key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors justify-start",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}
                  onClick={() => onNavigate(item.id as "dashboard" | "items" | "presets" | "reminders" | "analytics" | "profile")}
                  aria-label={getAriaLabel('link', item.label.toLowerCase())}
                  aria-describedby={`${item.id}-description`}
                  aria-current={isActive ? "page" : undefined}
                  role="menuitem"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="sr-only">(current page)</span>
                  )}
                </Button>
                <div 
                  id={`${item.id}-description`} 
                  className="sr-only"
                >
                  {item.description}
                </div>
              </div>
            );
          })}
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
            <AvatarImage src={user.avatar} alt={`${user.name} avatar`} />
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