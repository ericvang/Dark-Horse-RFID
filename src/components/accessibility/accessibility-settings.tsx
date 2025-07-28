import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAccessibility } from "@/contexts/accessibility-context";
import { getAriaLabel, getAriaDescription } from "@/lib/accessibility";
import { Eye, Type, Zap } from "lucide-react";

export function AccessibilitySettings() {
  const {
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    toggleReducedMotion,
    announceToScreenReader
  } = useAccessibility();

  const handleHighContrastToggle = () => {
    toggleHighContrast();
    announceToScreenReader(
      highContrast ? "High contrast mode disabled" : "High contrast mode enabled"
    );
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large' | 'extra-large') => {
    setFontSize(size);
    announceToScreenReader(`Font size changed to ${size}`);
  };

  const handleReducedMotionToggle = () => {
    toggleReducedMotion();
    announceToScreenReader(
      reducedMotion ? "Motion effects enabled" : "Motion effects reduced"
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Accessibility Settings
        </CardTitle>
        <CardDescription>
          Customize the interface to meet your accessibility needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* High Contrast Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label 
              htmlFor="high-contrast"
              className="text-base font-medium"
            >
              High Contrast Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Increase contrast for better visibility
            </p>
          </div>
          <Switch
            id="high-contrast"
            checked={highContrast}
            onCheckedChange={handleHighContrastToggle}
            aria-label={getAriaLabel('checkbox', 'high contrast mode')}
            aria-describedby="high-contrast-description"
          />
          <div id="high-contrast-description" className="sr-only">
            {getAriaDescription('essentialToggle')}
          </div>
        </div>

        <Separator />

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            <Label htmlFor="font-size" className="text-base font-medium">
              Font Size
            </Label>
          </div>
          <Select value={fontSize} onValueChange={handleFontSizeChange}>
            <SelectTrigger 
              id="font-size"
              className="w-full"
              aria-label={getAriaLabel('select', 'font size')}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (12px)</SelectItem>
              <SelectItem value="medium">Medium (16px)</SelectItem>
              <SelectItem value="large">Large (20px)</SelectItem>
              <SelectItem value="extra-large">Extra Large (24px)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Adjust text size for better readability
          </p>
        </div>

        <Separator />

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <Label 
                htmlFor="reduced-motion"
                className="text-base font-medium"
              >
                Reduced Motion
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Minimize animations and transitions
            </p>
          </div>
          <Switch
            id="reduced-motion"
            checked={reducedMotion}
            onCheckedChange={handleReducedMotionToggle}
            aria-label={getAriaLabel('checkbox', 'reduced motion')}
            aria-describedby="reduced-motion-description"
          />
          <div id="reduced-motion-description" className="sr-only">
            Reduces or eliminates motion effects throughout the application
          </div>
        </div>

        {/* Accessibility Information */}
        <Separator />
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Accessibility Features</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Screen reader compatible with ARIA labels</li>
            <li>• Keyboard navigation support</li>
            <li>• High contrast mode for better visibility</li>
            <li>• Adjustable font sizes</li>
            <li>• Reduced motion support</li>
            <li>• Focus indicators for all interactive elements</li>
          </ul>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Tab</span>
              <span>Navigate through elements</span>
            </div>
            <div className="flex justify-between">
              <span>Enter / Space</span>
              <span>Activate buttons and links</span>
            </div>
            <div className="flex justify-between">
              <span>Escape</span>
              <span>Close modals and dialogs</span>
            </div>
            <div className="flex justify-between">
              <span>Arrow Keys</span>
              <span>Navigate lists and menus</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 