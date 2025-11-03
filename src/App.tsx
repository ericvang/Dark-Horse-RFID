import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense } from "react";
import { AccessibilityProvider } from "./contexts/accessibility-context";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import "./index.css";

// Lazy load pages for better performance
const IndexFirebase = lazy(() => import("./pages/IndexFirebase").then(module => ({ default: module.IndexFirebase })));
const Items = lazy(() => import("./pages/Items").then(module => ({ default: module.Items })));
const SmartReminders = lazy(() => import("./pages/SmartReminders").then(module => ({ default: module.SmartReminders })));
const Analytics = lazy(() => import("./pages/Analytics").then(module => ({ default: module.Analytics })));
const Profile = lazy(() => import("./pages/Profile").then(module => ({ default: module.Profile })));
const Presets = lazy(() => import("./pages/Presets").then(module => ({ default: module.Presets })));
const Login = lazy(() => import("./pages/Login").then(module => ({ default: module.Login })));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
      <p className="text-muted-foreground">Loading...</p>
      <span className="sr-only">Page is loading, please wait</span>
    </div>
  </div>
);

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
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
              <Toaster />
            </div>
          </Router>
        </AccessibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
