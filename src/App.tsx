import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import { Items } from "./pages/Items";
import { SmartReminders } from "./pages/SmartReminders";
import { Analytics } from "./pages/Analytics";
import { Profile } from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AccessibilityProvider } from "./contexts/accessibility-context";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/items" element={<Items />} />
              <Route path="/reminders" element={<SmartReminders />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
