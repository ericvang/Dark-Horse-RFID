import { useState } from "react";
import { ArrowLeft, Bell, Clock, Calendar, MapPin, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface Reminder {
  id: string;
  name: string;
  time: string;
  days: string;
  enabled: boolean;
}

export function SmartReminders() {
  const [allNotifications, setAllNotifications] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      name: "Soccer Kit",
      time: "3:30 PM",
      days: "Mon, Wed, Fri",
      enabled: true
    },
    {
      id: "2", 
      name: "School Backpack",
      time: "7:00 AM",
      days: "Mon-Fri",
      enabled: true
    },
    {
      id: "3",
      name: "Gym Bag",
      time: "5:00 PM", 
      days: "Tue, Thu",
      enabled: false
    }
  ]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Reminders</h1>
          <p className="text-muted-foreground">Configure when to receive notifications</p>
        </div>
      </div>

      {/* All Notifications Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">All Notifications</h3>
              <p className="text-sm text-muted-foreground">Turn off to mute all pack reminders and alerts</p>
            </div>
          </div>
          <Switch 
            checked={allNotifications} 
            onCheckedChange={setAllNotifications}
          />
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-8 border-b border-border">
        <button className="flex items-center gap-2 pb-3 border-b-2 border-primary text-primary">
          <Clock className="w-4 h-4" />
          Time
        </button>
        <button className="flex items-center gap-2 pb-3 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          Event
        </button>
        <button className="flex items-center gap-2 pb-3 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          Location
        </button>
      </div>

      {/* Time-based Reminders */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Time-based Reminders</h2>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{reminder.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    {reminder.time}, {reminder.days}
                  </div>
                </div>
                <Switch 
                  checked={reminder.enabled} 
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Reminder Button */}
      <Button className="w-full" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add Time Reminder
      </Button>
    </div>
  );
}