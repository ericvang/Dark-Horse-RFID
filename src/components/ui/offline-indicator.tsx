import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';

export function OfflineIndicator() {
  const { isOnline } = usePWA();
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
      // Hide after 3 seconds
      const timer = setTimeout(() => setShowOffline(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowOffline(false);
    }
  }, [isOnline]);

  if (!showOffline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">You're offline</span>
    </div>
  );
} 