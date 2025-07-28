import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useMemo } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);
  const { toast } = useToast();

  // Sample data for different periods
  const periodData = {
    "This Week": [
      { week: "Mon", packed: 8, forgotten: 1 },
      { week: "Tue", packed: 12, forgotten: 0 },
      { week: "Wed", packed: 10, forgotten: 2 },
      { week: "Thu", packed: 15, forgotten: 1 },
      { week: "Fri", packed: 11, forgotten: 1 },
    ],
    "This Month": [
      { week: "Week 1", packed: 12, forgotten: 2 },
      { week: "Week 2", packed: 15, forgotten: 1 },
      { week: "Week 3", packed: 11, forgotten: 3 },
      { week: "Week 4", packed: 14, forgotten: 1 },
    ],
    "Last Month": [
      { week: "Week 1", packed: 10, forgotten: 3 },
      { week: "Week 2", packed: 13, forgotten: 2 },
      { week: "Week 3", packed: 9, forgotten: 4 },
      { week: "Week 4", packed: 12, forgotten: 2 },
    ],
    "Last 3 Months": [
      { week: "Month 1", packed: 45, forgotten: 8 },
      { week: "Month 2", packed: 52, forgotten: 6 },
      { week: "Month 3", packed: 48, forgotten: 7 },
    ],
    "This Year": [
      { week: "Q1", packed: 145, forgotten: 18 },
      { week: "Q2", packed: 152, forgotten: 16 },
      { week: "Q3", packed: 148, forgotten: 17 },
      { week: "Q4", packed: 155, forgotten: 15 },
    ],
  };

  const chartData = useMemo(() => {
    return periodData[selectedPeriod as keyof typeof periodData] || periodData["This Month"];
  }, [selectedPeriod]);

  const maxValue = Math.max(...chartData.map(d => Math.max(d.packed, d.forgotten)));
  const successRate = Math.round((chartData.reduce((sum, d) => sum + d.packed, 0) / 
    chartData.reduce((sum, d) => sum + d.packed + d.forgotten, 0)) * 100);

  const periods = ["This Week", "This Month", "Last Month", "Last 3 Months", "This Year"];

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    toast({
      title: "Period Changed",
      description: `Analytics updated for ${period}`,
    });
  };

  const handleDataPointClick = (dataPoint: any) => {
    setSelectedDataPoint(dataPoint);
    toast({
      title: `${dataPoint.week} Details`,
      description: `Packed: ${dataPoint.packed} items, Forgotten: ${dataPoint.forgotten} items`,
    });
  };

  const getTrendIcon = () => {
    const currentPeriod = chartData[chartData.length - 1];
    const previousPeriod = chartData[chartData.length - 2];
    
    if (!previousPeriod) return null;
    
    const currentRate = currentPeriod.packed / (currentPeriod.packed + currentPeriod.forgotten);
    const previousRate = previousPeriod.packed / (previousPeriod.packed + previousPeriod.forgotten);
    
    if (currentRate > previousRate) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (currentRate < previousRate) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Target className="w-4 h-4 text-blue-500" />;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Track your packing performance and insights</p>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {selectedPeriod}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {periods.map((period) => (
                  <DropdownMenuItem 
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={selectedPeriod === period ? "bg-accent" : ""}
                  >
                    {period}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Performance Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Packing Performance</h2>
        </div>

        {/* Success Rate Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Packing Success Rate</h3>
            <p className="text-muted-foreground">Items packed vs forgotten this month</p>
          </div>

          {/* Chart */}
          <div className="relative">
            {/* Success Rate Display */}
            <div className="absolute top-8 right-8 text-center">
              <div className="text-3xl font-bold text-foreground">{successRate}%</div>
              <div className="text-sm text-muted-foreground">Success rate</div>
            </div>

            {/* Y-axis labels */}
            <div className="flex flex-col justify-between h-64 absolute -left-4.5 text-sm text-muted-foreground">
              <span>{maxValue + 9}</span>
              <span>{Math.floor((maxValue + 9) * 0.75)}</span>
              <span>{Math.floor((maxValue + 9) * 0.5)}</span>
              <span>{Math.floor((maxValue + 9) * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Grid lines */}
            <div className="h-64 relative border-l border-b border-border">
              {[0, 1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="absolute w-full border-t border-border/30"
                  style={{ top: `${i * 25}%` }}
                />
              ))}

              {/* Bars */}
              <div className="flex items-end justify-around h-full px-4">
                {chartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 w-20">
                    <div className="flex items-end gap-1 h-48">
                      {/* Packed items bar */}
                      <div 
                        className="w-8 bg-primary rounded-t cursor-pointer hover:bg-primary/80 transition-colors"
                        style={{ height: `${(data.packed / maxValue) * 80}%` }}
                        onClick={() => handleDataPointClick(data)}
                        title={`${data.week}: ${data.packed} packed, ${data.forgotten} forgotten`}
                      />
                      {/* Forgotten items bar */}
                      <div 
                        className="w-8 bg-destructive rounded-t cursor-pointer hover:bg-destructive/80 transition-colors"
                        style={{ height: `${(data.forgotten / maxValue) * 80}%` }}
                        onClick={() => handleDataPointClick(data)}
                        title={`${data.week}: ${data.packed} packed, ${data.forgotten} forgotten`}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                      {data.week}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Data Point Info */}
          {selectedDataPoint && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">{selectedDataPoint.week} Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Packed Items:</span>
                  <span className="ml-2 font-medium text-green-600">{selectedDataPoint.packed}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Forgotten Items:</span>
                  <span className="ml-2 font-medium text-red-600">{selectedDataPoint.forgotten}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span className="ml-2 font-medium">
                    {Math.round((selectedDataPoint.packed / (selectedDataPoint.packed + selectedDataPoint.forgotten)) * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Items:</span>
                  <span className="ml-2 font-medium">{selectedDataPoint.packed + selectedDataPoint.forgotten}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Overall Success Rate</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Packed</span>
                <span className="font-medium text-foreground">117</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Forgotten</span>
                <span className="font-medium text-destructive">10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${successRate}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Bag Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Performer</span>
                <span className="font-medium text-foreground">Gym Bag (95%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Needs Improvement</span>
                <span className="font-medium text-warning">Soccer Kit (78%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Most Used</span>
                <span className="font-medium text-foreground">School Backpack</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}