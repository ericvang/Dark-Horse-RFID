import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AccountModal } from "@/components/modals/account-modal";
import { LogoutScreen } from "@/components/modals/logout-screen";
import { mockData } from "@/data/mock-data";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleNavigate = (page: "dashboard" | "items" | "reminders" | "analytics" | "profile") => {
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
      <div className="fixed left-0 top-0 h-full z-50">
        <Sidebar 
          systemStatus={mockData.system.status} 
          activePage={getActivePage()}
          onNavigate={handleNavigate}
          user={mockData.user}
          onAccountSettings={() => setIsAccountModalOpen(true)}
          onLogout={() => setIsLoggedIn(false)}
        />
      </div>
      
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>

      {/* Modals */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={mockData.user}
      />
    </div>
  );
} 