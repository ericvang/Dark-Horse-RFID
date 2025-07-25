import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LogoutScreenProps {
  onLoginAgain: () => void;
}

export function LogoutScreen({ onLoginAgain }: LogoutScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center animate-fade-in">
      <Card className="p-8 max-w-md w-full mx-4 text-center space-y-6 animate-scale-in">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Successfully Logged Out</h2>
          <p className="text-muted-foreground">
            You have been successfully logged out of the RFID Bag Monitor system.
          </p>
        </div>
        
        <Button 
          onClick={onLoginAgain}
          className="w-full"
          size="lg"
        >
          Log In Again
        </Button>
      </Card>
    </div>
  );
}