import { Monitor, Package, Wifi, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  systemStatus: "active" | "idle" | "disconnected";
}

export function Sidebar({ systemStatus }: SidebarProps) {
  const statusConfig = {
    active: { dot: "bg-success", text: "Online & Scanning" },
    idle: { dot: "bg-warning", text: "Online & Idle" },
    disconnected: { dot: "bg-destructive", text: "Offline" }
  };

  const currentStatus = statusConfig[systemStatus];

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
        <nav className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Package className="w-4 h-4" />
            <span className="text-sm">Items</span>
          </div>
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-sidebar-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-accent-foreground">User</p>
            <p className="text-xs text-sidebar-foreground">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}