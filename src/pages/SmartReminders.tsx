import { useState } from "react";
import { ArrowLeft, Bell, Clock, Calendar, MapPin, Plus, Trash2, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Reminder {
  id: string;
  name: string;
  time: string;
  days: string;
  enabled: boolean;
  type: 'time' | 'event' | 'location';
}

interface EventReminder {
  id: string;
  name: string;
  event: string;
  itemsNeeded: string[];
  enabled: boolean;
}

interface LocationReminder {
  id: string;
  name: string;
  location: string;
  radius: string;
  enabled: boolean;
}

export function SmartReminders() {
  const [allNotifications, setAllNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState<'time' | 'event' | 'location'>('time');
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      name: "Soccer Kit",
      time: "3:30 PM",
      days: "Mon, Wed, Fri",
      enabled: true,
      type: 'time'
    },
    {
      id: "2", 
      name: "School Backpack",
      time: "7:00 AM",
      days: "Mon-Fri",
      enabled: true,
      type: 'time'
    },
    {
      id: "3",
      name: "Gym Bag",
      time: "5:00 PM", 
      days: "Tue, Thu",
      enabled: false,
      type: 'time'
    }
  ]);

  const [eventReminders, setEventReminders] = useState<EventReminder[]>([
    {
      id: "e1",
      name: "Soccer Practice",
      event: "Weekly Training",
      itemsNeeded: ["Soccer Kit", "Water Bottle", "Cleats"],
      enabled: true
    },
    {
      id: "e2",
      name: "Business Meeting",
      event: "Client Presentation",
      itemsNeeded: ["Laptop", "Charger", "Presentation Files"],
      enabled: true
    }
  ]);

  const [locationReminders, setLocationReminders] = useState<LocationReminder[]>([
    {
      id: "l1",
      name: "Gym Check",
      location: "Local Fitness Center",
      radius: "100m",
      enabled: true
    },
    {
      id: "l2",
      name: "Office Arrival",
      location: "Downtown Office",
      radius: "200m", 
      enabled: false
    }
  ]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const toggleEventReminder = (id: string) => {
    setEventReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const toggleLocationReminder = (id: string) => {
    setLocationReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const deleteEventReminder = (id: string) => {
    setEventReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const deleteLocationReminder = (id: string) => {
    setLocationReminders(prev => prev.filter(reminder => reminder.id !== id));
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
        <button 
          onClick={() => setActiveTab('time')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'time' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="w-4 h-4" />
          Time
        </button>
        <button 
          onClick={() => setActiveTab('event')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'event' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Event
        </button>
        <button 
          onClick={() => setActiveTab('location')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'location' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Location
        </button>
      </div>

      {/* Dynamic Content Based on Active Tab */}
      {activeTab === 'time' && (
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
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteReminder(reminder.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Switch 
                      checked={reminder.enabled} 
                      onCheckedChange={() => toggleReminder(reminder.id)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'event' && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Event-based Reminders</h2>
          <div className="space-y-4">
            {eventReminders.map((reminder) => (
              <Card key={reminder.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{reminder.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-4 h-4" />
                      {reminder.event}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Items: {reminder.itemsNeeded.join(', ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteEventReminder(reminder.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Switch 
                      checked={reminder.enabled} 
                      onCheckedChange={() => toggleEventReminder(reminder.id)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'location' && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Location-based Reminders</h2>
          <div className="space-y-4">
            {locationReminders.map((reminder) => (
              <Card key={reminder.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{reminder.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      {reminder.location} (within {reminder.radius})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteLocationReminder(reminder.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Switch 
                      checked={reminder.enabled} 
                      onCheckedChange={() => toggleLocationReminder(reminder.id)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Reminder Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reminder
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input placeholder="Reminder name" className="mt-1" />
            </div>
            {activeTab === 'time' && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">Time</label>
                  <Input type="time" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Days</label>
                  <Input placeholder="Mon, Wed, Fri" className="mt-1" />
                </div>
              </>
            )}
            {activeTab === 'event' && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">Event</label>
                  <Input placeholder="Event name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Items Needed</label>
                  <Input placeholder="Item1, Item2, Item3" className="mt-1" />
                </div>
              </>
            )}
            {activeTab === 'location' && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Input placeholder="Location name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Radius</label>
                  <Input placeholder="100m" className="mt-1" />
                </div>
              </>
            )}
            <Button className="w-full">Create Reminder</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}