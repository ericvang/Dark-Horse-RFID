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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bag Radar Dashboard</h1>
        <p className="text-muted-foreground">
          Smart bag management system - Last scan {formatTimestamp(lastScanTimestamp)}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-success-muted text-success border-success/20">
          ● Active
        </Badge>
        <Button 
          onClick={onManualScan}
          disabled={isScanning}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Scan className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Manual Scan'}
        </Button>
      </div>
    </div>
  );
}