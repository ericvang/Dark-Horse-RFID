import { ArrowLeft, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const chartData = [
  { week: "Week 1", packed: 23, forgotten: 4 },
  { week: "Week 2", packed: 27, forgotten: 3 },
  { week: "Week 3", packed: 31, forgotten: 2 },
  { week: "Week 4", packed: 36, forgotten: 1 }
];

export function Analytics() {
  const successRate = 85;
  const maxValue = Math.max(...chartData.map(d => d.packed));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your packing habits</p>
        </div>
      </div>

      {/* Performance Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Packing Performance</h2>
        <Button variant="outline" className="gap-2">
          This Month
          <ChevronDown className="w-4 h-4" />
        </Button>
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
          <div className="flex flex-col justify-between h-64 absolute -left-8 text-sm text-muted-foreground">
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
                      className="w-8 bg-primary rounded-t"
                      style={{ height: `${(data.packed / maxValue) * 80}%` }}
                    />
                    {/* Forgotten items bar */}
                    <div 
                      className="w-8 bg-destructive rounded-t"
                      style={{ height: `${(data.forgotten / maxValue) * 80}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{data.week}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                className="bg-primary h-2 rounded-full" 
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
  );
}