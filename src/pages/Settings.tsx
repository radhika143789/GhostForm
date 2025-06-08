
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    realTimeMonitoring: true,
    notifyDataExposure: true,
    blockUnsecureForms: true,
    notifyDataBreaches: true,
    scanFrequency: 4, // hours
    sensitivityLevel: 75, // percentage
    emailNotifications: true,
    smsNotifications: false,
    email: "user@example.com",
    phone: "+1 (555) 123-4567"
  });
  
  const { toast } = useToast();

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSliderChange = (key: string, value: number[]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your privacy settings have been updated.",
    });
  };

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your privacy protection preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Protection Settings</CardTitle>
          <CardDescription>Configure how WatchTower protects your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="realTimeMonitoring">Real-time Monitoring</Label>
                <p className="text-sm text-muted-foreground">
                  Monitor data exposure while browsing
                </p>
              </div>
              <Switch
                id="realTimeMonitoring"
                checked={settings.realTimeMonitoring}
                onCheckedChange={() => handleToggle("realTimeMonitoring")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyDataExposure">Data Exposure Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get alerts when your data is about to be exposed
                </p>
              </div>
              <Switch
                id="notifyDataExposure"
                checked={settings.notifyDataExposure}
                onCheckedChange={() => handleToggle("notifyDataExposure")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="blockUnsecureForms">Block Unsecure Forms</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent submission of data to insecure websites
                </p>
              </div>
              <Switch
                id="blockUnsecureForms"
                checked={settings.blockUnsecureForms}
                onCheckedChange={() => handleToggle("blockUnsecureForms")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyDataBreaches">Data Breach Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get alerts when your data appears in known breaches
                </p>
              </div>
              <Switch
                id="notifyDataBreaches"
                checked={settings.notifyDataBreaches}
                onCheckedChange={() => handleToggle("notifyDataBreaches")}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="scanFrequency">Scan Frequency</Label>
              <p className="text-sm text-muted-foreground mb-4">
                How often WatchTower scans for your data (in hours)
              </p>
              <div className="pt-2">
                <Slider 
                  id="scanFrequency"
                  defaultValue={[settings.scanFrequency]} 
                  max={24} 
                  min={1} 
                  step={1}
                  onValueChange={(values) => handleSliderChange("scanFrequency", values)}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>1 hr (more frequent)</span>
                  <span>Current: {settings.scanFrequency} hrs</span>
                  <span>24 hrs (less frequent)</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="sensitivityLevel">Protection Sensitivity</Label>
              <p className="text-sm text-muted-foreground mb-4">
                How sensitive WatchTower should be to potential privacy risks
              </p>
              <div className="pt-2">
                <Slider 
                  id="sensitivityLevel"
                  defaultValue={[settings.sensitivityLevel]} 
                  max={100} 
                  min={0} 
                  step={5}
                  onValueChange={(values) => handleSliderChange("sensitivityLevel", values)}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Low (fewer alerts)</span>
                  <span>Current: {settings.sensitivityLevel}%</span>
                  <span>High (more alerts)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts via email
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>
            
            {settings.emailNotifications && (
              <div className="ml-7 border-l-2 pl-4 border-muted">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-2"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts via text message
                </p>
              </div>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={() => handleToggle("smsNotifications")}
              />
            </div>
            
            {settings.smsNotifications && (
              <div className="ml-7 border-l-2 pl-4 border-muted">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your WatchTower account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">Export My Data</Button>
            <Button variant="outline" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
