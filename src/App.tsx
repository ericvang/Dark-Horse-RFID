import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { IndexFirebase } from "./pages/IndexFirebase";
import { Items } from "./pages/Items";
import { SmartReminders } from "./pages/SmartReminders";
import { Analytics } from "./pages/Analytics";
import { Profile } from "./pages/Profile";
import { Presets } from "./pages/Presets";
import { Login } from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AccessibilityProvider } from "./contexts/accessibility-context";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
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
      <AuthProvider>
        <AccessibilityProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><IndexFirebase /></ProtectedRoute>} />
                <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
                <Route path="/reminders" element={<ProtectedRoute><SmartReminders /></ProtectedRoute>} />
                <Route path="/presets" element={<ProtectedRoute><Presets /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AccessibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
