import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";

interface HeaderProps {
  lastScanTimestamp: string;
  onManualScan: () => void;
  isScanning: boolean;
}

export function Header({ lastScanTimestamp, onManualScan, isScanning }: HeaderProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8" role="banner">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bag Radar Dashboard</h1>
        <p className="text-muted-foreground" aria-live="polite">
          Smart bag management system - Last scan{' '}
          <time dateTime={lastScanTimestamp} aria-label={`Last scan: ${formatTimestamp(lastScanTimestamp)}`}>
            {formatTimestamp(lastScanTimestamp)}
          </time>
        </p>
      </div>
      
      <div className="flex items-center gap-3" role="group" aria-label="System status and actions">
        <Badge 
          variant="secondary" 
          className="bg-success-muted text-success border-success/20"
          role="status"
          aria-label="System status: Active"
        >
          <span className="sr-only">System status: </span>
          <span aria-hidden="true">●</span> Active
        </Badge>
        <Button 
          onClick={onManualScan}
          disabled={isScanning}
          variant="outline"
          className="flex items-center gap-2"
          aria-label={isScanning ? "Scanning in progress" : "Start manual RFID scan"}
          aria-busy={isScanning}
        >
          <Scan 
            className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} 
            aria-hidden="true"
          />
          <span aria-live="polite">
            {isScanning ? 'Scanning...' : 'Manual Scan'}
          </span>
        </Button>
      </div>
    </header>
  );
}