import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { AccountModal } from "@/components/modals/account-modal";
import { LogoutScreen } from "@/components/modals/logout-screen";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Map URL paths to sidebar page states
  const getActivePage = () => {
    switch (location.pathname) {
      case "/":
        return "dashboard";
      case "/items":
        return "items";
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

  const handleNavigate = (page: "dashboard" | "items" | "reminders" | "analytics" | "profile" | "presets") => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    switch (page) {
      case "dashboard":
        navigate("/");
        break;
      case "items":
        navigate("/items");
        break;
      case "reminders":
        navigate("/reminders");
        break;
      case "analytics":
        navigate("/analytics");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "presets":
        navigate("/presets");
        break;
    }
  };

  const handleLoginAgain = () => {
    window.location.reload();
  };

  if (!isLoggedIn) {
    return <LogoutScreen onLoginAgain={handleLoginAgain} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed left-0 top-0 h-full z-50 transform transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
            }`
          : 'fixed left-0 top-0 h-full z-50'
        }
      `}>
        <Sidebar 
          systemStatus="active" 
          activePage={getActivePage()}
          onNavigate={handleNavigate}
          user={{
            id: user?.uid || '',
            name: user?.displayName || user?.email || 'User',
            email: user?.email || '',
            avatar: user?.photoURL || undefined,
            preferences: {
              notifications: true,
              theme: 'system' as const,
              accessibility: {
                highContrast: false,
                largeText: false,
                reduceMotion: false,
              },
            },
          }}
          onAccountSettings={() => setIsAccountModalOpen(true)}
          onLogout={() => setIsLoggedIn(false)}
        />
      </div>
      
      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isMobile 
          ? 'ml-0 p-4 mobile-bottom-nav-spacing' 
          : 'ml-64 p-8'
        }
      `}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="mobile-header-spacing mb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="mobile-touch-target"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold">Dark Horse Radar</h1>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>
        )}
        
        {/* Page Content with Smooth Transitions */}
        <div className="page-transition mobile-fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav
          onNavigate={handleNavigate}
        />
      )}

      {/* Modals */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={{
          id: user?.uid || '',
          name: user?.displayName || user?.email || 'User',
          email: user?.email || '',
          avatar: user?.photoURL || undefined,
          preferences: {
            notifications: true,
            theme: 'system' as const,
            accessibility: {
              highContrast: false,
              largeText: false,
              reduceMotion: false,
            },
          },
        }}
      />
    </div>
  );
} 