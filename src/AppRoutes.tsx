import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import { Items } from "./pages/Items";
import { SmartReminders } from "./pages/SmartReminders";
import { Analytics } from "./pages/Analytics";
import { Profile } from "./pages/Profile";
import { Presets } from "./pages/Presets";
import NotFound from "./pages/NotFound";
import "./index.css";

export function AppRoutes() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/items" element={<Items />} />
        <Route path="/presets" element={<Presets />} />
        <Route path="/reminders" element={<SmartReminders />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
} 