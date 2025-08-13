import { useState, useEffect } from "react";
import { Bell, Clock, Calendar, MapPin, Plus, Trash2, Edit, Sparkles, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const { user } = useAuth();
  const [allNotifications, setAllNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState<'time' | 'event' | 'location'>('time');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    name: "",
    time: "",
    days: "",
    event: "",
    itemsNeeded: "",
    location: "",
    radius: ""
  });
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [eventReminders, setEventReminders] = useState<EventReminder[]>([]);
  const [locationReminders, setLocationReminders] = useState<LocationReminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Load reminders from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const remindersRef = collection(db, 'reminders');
    const unsubscribe = onSnapshot(remindersRef, (snapshot) => {
      const timeReminders: Reminder[] = [];
      const eventRemindersData: EventReminder[] = [];
      const locationRemindersData: LocationReminder[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          if (data.type === 'time') {
            timeReminders.push({ id: doc.id, ...data } as Reminder);
          } else if (data.type === 'event') {
            eventRemindersData.push({ id: doc.id, ...data } as EventReminder);
          } else if (data.type === 'location') {
            locationRemindersData.push({ id: doc.id, ...data } as LocationReminder);
          }
        }
      });

      setReminders(timeReminders);
      setEventReminders(eventRemindersData);
      setLocationReminders(locationRemindersData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading reminders:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Loading state with clean skeleton
  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-28"></div>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

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

  const handleCreateReminder = () => {
    if (!newReminder.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reminder name",
        variant: "destructive",
      });
      return;
    }

    // Create new reminder based on active tab
    const newId = Date.now().toString();
    
    if (activeTab === 'time') {
      const timeReminder = {
        id: newId,
        name: newReminder.name,
        time: newReminder.time,
        days: newReminder.days,
        enabled: true,
        type: 'time' as const
      };
      setReminders(prev => [...prev, timeReminder]);
    } else if (activeTab === 'event') {
      const eventReminder = {
        id: newId,
        name: newReminder.name,
        event: newReminder.event,
        itemsNeeded: newReminder.itemsNeeded.split(',').map(item => item.trim()),
        enabled: true
      };
      setEventReminders(prev => [...prev, eventReminder]);
    } else if (activeTab === 'location') {
      const locationReminder = {
        id: newId,
        name: newReminder.name,
        location: newReminder.location,
        radius: newReminder.radius,
        enabled: true
      };
      setLocationReminders(prev => [...prev, locationReminder]);
    }

    // Reset form and close dialog
    setNewReminder({
      name: "",
      time: "",
      days: "",
      event: "",
      itemsNeeded: "",
      location: "",
      radius: ""
    });
    setIsDialogOpen(false);

    toast({
      title: "Reminder Created",
      description: "Your reminder has been set successfully!",
    });
  };

  const getCurrentReminders = () => {
    switch (activeTab) {
      case 'time':
        return reminders;
      case 'event':
        return eventReminders;
      case 'location':
        return locationReminders;
      default:
        return [];
    }
  };

  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'time':
        return {
          icon: Clock,
          title: "No Time-Based Reminders",
          description: "Set up reminders for specific times and days to never forget important items.",
          action: "Create Time Reminder"
        };
      case 'event':
        return {
          icon: Calendar,
          title: "No Event Reminders",
          description: "Create reminders tied to specific events to ensure you have everything you need.",
          action: "Create Event Reminder"
        };
      case 'location':
        return {
          icon: MapPin,
          title: "No Location Reminders",
          description: "Set up location-based reminders to get notified when you're near specific places.",
          action: "Create Location Reminder"
        };
      default:
        return {
          icon: Bell,
          title: "No Reminders",
          description: "Get started by creating your first reminder.",
          action: "Create Reminder"
        };
    }
  };

  const emptyState = getEmptyStateContent();
  const currentReminders = getCurrentReminders();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Clean Tech Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Bell className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Smart Reminders</h1>
              <p className="text-muted-foreground text-lg">
                Intelligent notification system for your RFID items
              </p>
            </div>
          </div>
        </div>

        {/* Global Notification Toggle */}
        <Card className="p-6 border border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Zap className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Global Notifications</h3>
                <p className="text-sm text-muted-foreground">Enable or disable all reminder notifications</p>
              </div>
            </div>
            <Switch
              checked={allNotifications}
              onCheckedChange={setAllNotifications}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </Card>

        {/* Tab Navigation - Clean Tech Style */}
        <div className="border-b border-border">
          <div className="flex space-x-8">
            {[
              { id: 'time', label: 'Time-Based', icon: Clock },
              { id: 'event', label: 'Event-Based', icon: Calendar },
              { id: 'location', label: 'Location-Based', icon: MapPin }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {currentReminders.length} {activeTab === 'time' ? 'reminders' : activeTab === 'event' ? 'events' : 'locations'}
              </Badge>
              {currentReminders.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {currentReminders.filter(r => r.enabled).length} active
                </Badge>
              )}
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New {activeTab === 'time' ? 'Time' : activeTab === 'event' ? 'Event' : 'Location'} Reminder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Reminder Name</label>
                    <Input
                      placeholder="e.g., Soccer Practice, Gym Bag"
                      value={newReminder.name}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  {activeTab === 'time' && (
                    <>
                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input
                          type="time"
                          value={newReminder.time}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Days</label>
                        <Input
                          placeholder="e.g., Mon, Wed, Fri or Mon-Fri"
                          value={newReminder.days}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, days: e.target.value }))}
                        />
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'event' && (
                    <div>
                      <label className="text-sm font-medium">Event</label>
                      <Input
                        placeholder="e.g., Weekly Training, Business Meeting"
                        value={newReminder.event}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, event: e.target.value }))}
                      />
                    </div>
                  )}
                  
                  {activeTab === 'location' && (
                    <>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          placeholder="e.g., Local Fitness Center, Downtown Office"
                          value={newReminder.location}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Radius</label>
                        <Input
                          placeholder="e.g., 100m, 200m"
                          value={newReminder.radius}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, radius: e.target.value }))}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateReminder}
                      className="flex-1"
                    >
                      Create Reminder
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Reminders List */}
          {currentReminders.length === 0 ? (
            <Card className="p-12 text-center border border-border">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                <emptyState.icon className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{emptyState.title}</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {emptyState.description}
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                {emptyState.action}
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {currentReminders.map((reminder) => (
                <Card key={reminder.id} className="p-4 border border-border hover:border-border/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {activeTab === 'time' && <Clock className="h-4 w-4 text-slate-700" />}
                        {activeTab === 'event' && <Calendar className="h-4 w-4 text-slate-700" />}
                        {activeTab === 'location' && <MapPin className="h-4 w-4 text-slate-700" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{reminder.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {activeTab === 'time' && (
                            <>
                              <span>{reminder.time}</span>
                              <span>•</span>
                              <span>{reminder.days}</span>
                            </>
                          )}
                          {activeTab === 'event' && (
                            <span>{(reminder as EventReminder).event}</span>
                          )}
                          {activeTab === 'location' && (
                            <>
                              <span>{(reminder as LocationReminder).location}</span>
                              <span>•</span>
                              <span>{(reminder as LocationReminder).radius}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => {
                          if (activeTab === 'time') toggleReminder(reminder.id);
                          if (activeTab === 'event') toggleEventReminder(reminder.id);
                          if (activeTab === 'location') toggleLocationReminder(reminder.id);
                        }}
                        className="data-[state=checked]:bg-primary"
                      />
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (activeTab === 'time') deleteReminder(reminder.id);
                          if (activeTab === 'event') deleteEventReminder(reminder.id);
                          if (activeTab === 'location') deleteLocationReminder(reminder.id);
                        }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}