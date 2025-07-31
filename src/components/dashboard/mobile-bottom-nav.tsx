import { Home, Package2, Bell, BarChart3, Settings, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileBottomNavProps {
  onNavigate: (page: "dashboard" | "items" | "presets" | "reminders" | "analytics" | "profile") => void;
}

export function MobileBottomNav({ onNavigate }: MobileBottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const getActivePage = () => {
    switch (location.pathname) {
      case "/":
        return "dashboard";
      case "/items":
        return "items";
      case "/presets":
        return "presets";
      case "/reminders":
        return "reminders";
      case "/analytics":
        return "analytics";
      case "/profile":
        return "profile";
      default:
        return "dashboard";
    }
  };

  const activePage = getActivePage();

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/"
    },
    {
      id: "items",
      label: "Items",
      icon: Package2,
      path: "/items"
    },
    {
      id: "presets",
      label: "Presets",
      icon: Sparkles,
      path: "/presets"
    },
    {
      id: "reminders",
      label: "Reminders",
      icon: Bell,
      path: "/reminders"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/analytics"
    },
    {
      id: "profile",
      label: "Profile",
      icon: Settings,
      path: "/profile"
    }
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    onNavigate(item.id as "dashboard" | "items" | "presets" | "reminders" | "analytics" | "profile");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0 flex-1",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
} 