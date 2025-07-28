import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLayout } from "@/components/layout/AppLayout";
import { AccessibilitySettings } from "@/components/accessibility/accessibility-settings";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Bell, Shield, LogOut, Settings } from "lucide-react";

export function Profile() {
  const [profileData, setProfileData] = useState({
    name: "Dark Horse Radar User",
    email: "user@darkhorseradar.com",
    avatar: ""
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    alerts: true
  });

  const [appearance, setAppearance] = useState({
    theme: "system",
    compact: false,
    animations: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    dataSharing: false,
    analytics: true
  });

  const { toast } = useToast();

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications ${notifications[key] ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleAppearanceChange = (key: keyof typeof appearance, value: any) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: "Appearance Updated",
      description: "Your appearance settings have been saved.",
    });
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy settings have been saved.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and avatar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profileData.avatar} alt="Profile picture" />
                  <AvatarFallback className="text-lg">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <Button onClick={handleProfileUpdate} className="w-full">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Accessibility Settings */}
          <AccessibilitySettings />
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser notifications</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.push}
                onCheckedChange={() => handleNotificationToggle('push')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive text message alerts</p>
              </div>
              <Switch
                id="sms-notifications"
                checked={notifications.sms}
                onCheckedChange={() => handleNotificationToggle('sms')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alert-notifications">Alert Notifications</Label>
                <p className="text-sm text-muted-foreground">Critical system alerts</p>
              </div>
              <Switch
                id="alert-notifications"
                checked={notifications.alerts}
                onCheckedChange={() => handleNotificationToggle('alerts')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Appearance Settings
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={appearance.theme} onValueChange={(value) => handleAppearanceChange('theme', value)}>
                <SelectTrigger id="theme" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact-mode">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
              </div>
              <Switch
                id="compact-mode"
                checked={appearance.compact}
                onCheckedChange={(checked) => handleAppearanceChange('compact', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations">Animations</Label>
                <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
              </div>
              <Switch
                id="animations"
                checked={appearance.animations}
                onCheckedChange={(checked) => handleAppearanceChange('animations', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>
              Control your privacy and data sharing preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="profile-visibility">Profile Visibility</Label>
              <Select value={privacy.profileVisibility} onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}>
                <SelectTrigger id="profile-visibility" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-sharing">Data Sharing</Label>
                <p className="text-sm text-muted-foreground">Allow data to be used for improvements</p>
              </div>
              <Switch
                id="data-sharing"
                checked={privacy.dataSharing}
                onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics">Analytics</Label>
                <p className="text-sm text-muted-foreground">Help improve the application</p>
              </div>
              <Switch
                id="analytics"
                checked={privacy.analytics}
                onCheckedChange={(checked) => handlePrivacyChange('analytics', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account and data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Export Data
              </Button>
              <Button variant="outline" className="flex-1">
                Delete Account
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 