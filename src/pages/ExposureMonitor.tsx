
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Shield, AlertTriangle, Check, X, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { backgroundScanner, ScanResult } from "@/services/BackgroundScanner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast as sonnerToast } from "sonner";

interface ExposureEvent {
  id: string;
  timestamp: string;
  website: string;
  dataType: string;
  action: "blocked" | "allowed" | "pending";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  userId?: string;
}

export default function ExposureMonitor() {
  const [events, setEvents] = useState<ExposureEvent[]>([]);
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [isExtensionActive, setIsExtensionActive] = useState(true);
  const [realTimeEvents, setRealTimeEvents] = useState<ExposureEvent[]>([]);

  // All events are now real-time events only
  const allEvents = realTimeEvents;
  const userEvents = allEvents.filter(event => 
    event.userId === currentUser?.id || !event.userId
  );

  // Listen for real scan results from the background scanner
  useEffect(() => {
    const handleRealScanResult = (event: CustomEvent) => {
      const scanResult = event.detail as ScanResult;
      
      const newEvent: ExposureEvent = {
        id: scanResult.id,
        timestamp: scanResult.timestamp,
        website: scanResult.website,
        dataType: scanResult.dataType,
        action: "pending",
        severity: scanResult.severity,
        description: scanResult.description,
        userId: currentUser?.id
      };
      
      setRealTimeEvents(prev => [newEvent, ...prev]);
      
      console.log("Real scan result added to monitor:", newEvent);
    };

    // Custom event listener for real scan results
    window.addEventListener('scanResult', handleRealScanResult as EventListener);
    
    return () => {
      window.removeEventListener('scanResult', handleRealScanResult as EventListener);
    };
  }, [currentUser]);

  const handleAction = (id: string, newAction: "blocked" | "allowed") => {
    setRealTimeEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, action: newAction } : event
      )
    );
    
    toast({
      title: newAction === "blocked" ? "Data Protected" : "Access Allowed",
      description: `This exposure event has been ${newAction}.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "blocked": 
        return <Badge variant="destructive" className="flex gap-1 items-center"><X className="h-3 w-3" /> Blocked</Badge>;
      case "allowed": 
        return <Badge variant="default" className="bg-green-500 flex gap-1 items-center"><Check className="h-3 w-3" /> Allowed</Badge>;
      case "pending": 
        return <Badge variant="outline" className="flex gap-1 items-center"><AlertTriangle className="h-3 w-3" /> Pending</Badge>;
      default: 
        return <Badge variant="outline">{action}</Badge>;
    }
  };
  
  const testBackgroundScanner = () => {
    const result = backgroundScanner.triggerManualScan();
    
    // Create a test event to show immediate feedback
    const testEvent: ExposureEvent = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      website: window.location.hostname,
      dataType: "Manual Test",
      action: "pending",
      severity: "medium",
      description: "Manual privacy scan test - checking current page for threats",
      userId: currentUser?.id
    };
    
    setRealTimeEvents(prev => [testEvent, ...prev]);
    setIsTestDialogOpen(false);
    
    sonnerToast.success("Manual scan initiated", {
      description: "Scanning current page for privacy threats...",
    });
  };

  const pendingEvents = userEvents.filter(event => event.action === "pending");
  const recentEvents = userEvents.filter(event => event.action !== "pending");

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exposure Monitor</h1>
          <p className="text-muted-foreground">Real-time monitoring of your data exposure incidents</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 flex gap-1 items-center">
              <UserRound className="h-3 w-3" /> 
              {currentUser?.email || "Anonymous"}
            </Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="flex gap-2 items-center"
            onClick={() => setIsTestDialogOpen(true)}
          >
            <Shield className="h-4 w-4" />
            Scanner Control
          </Button>
        </div>
      </div>

      {isExtensionActive && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Real-time Privacy Scanner Active</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Monitoring forms, connections, cookies, and tracking scripts on this page.
            </p>
          </CardContent>
        </Card>
      )}

      {userEvents.length === 0 && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Privacy Threats Detected</h3>
            <p className="text-sm text-gray-500 mb-4">
              The scanner is actively monitoring this page. Any privacy threats or data exposure risks will appear here.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsTestDialogOpen(true)}
              className="flex gap-2 items-center"
            >
              <Shield className="h-4 w-4" />
              Run Manual Scan
            </Button>
          </CardContent>
        </Card>
      )}

      {pendingEvents.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" /> 
              Pending Decisions Required
            </CardTitle>
            <CardDescription className="text-amber-700">
              The following incidents require your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingEvents.map(event => (
                <div key={event.id} className="bg-white p-4 rounded-lg border border-amber-200 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="font-medium">{event.dataType} on {event.website}</div>
                    <div className="text-sm text-muted-foreground">{event.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">{formatDate(event.timestamp)}</div>
                  </div>
                  <div className="flex items-start sm:items-center gap-2 sm:flex-shrink-0">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" onClick={() => handleAction(event.id, "blocked")}>
                        Block
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAction(event.id, "allowed")}>
                        Allow
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recentEvents.length > 0 && (
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="blocked">Blocked</TabsTrigger>
              <TabsTrigger value="allowed">Allowed</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground">
              {recentEvents.length} total events
            </div>
          </div>

          <TabsContent value="all" className="mt-4 space-y-4">
            {recentEvents.map(event => (
              <ExposureEventCard 
                key={event.id} 
                event={event} 
                formatDate={formatDate} 
                getSeverityColor={getSeverityColor} 
                getActionBadge={getActionBadge}
              />
            ))}
          </TabsContent>

          <TabsContent value="blocked" className="mt-4 space-y-4">
            {recentEvents
              .filter(event => event.action === "blocked")
              .map(event => (
                <ExposureEventCard 
                  key={event.id} 
                  event={event} 
                  formatDate={formatDate} 
                  getSeverityColor={getSeverityColor} 
                  getActionBadge={getActionBadge}
                />
              ))}
          </TabsContent>

          <TabsContent value="allowed" className="mt-4 space-y-4">
            {recentEvents
              .filter(event => event.action === "allowed")
              .map(event => (
                <ExposureEventCard 
                  key={event.id} 
                  event={event} 
                  formatDate={formatDate} 
                  getSeverityColor={getSeverityColor} 
                  getActionBadge={getActionBadge}
                />
              ))}
          </TabsContent>
        </Tabs>
      )}
      
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Scanner Control</DialogTitle>
            <DialogDescription>
              Control real-time privacy scanning and run manual tests
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Scanner Status</div>
                <div className="text-sm text-muted-foreground">Real-time privacy monitoring</div>
              </div>
              <Badge className={isExtensionActive ? "bg-green-500" : "bg-red-500"}>
                {isExtensionActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="text-sm">
                <strong>Current page scan includes:</strong>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• Form security analysis</li>
                  <li>• Connection encryption check</li>
                  <li>• Cookie security audit</li>
                  <li>• Tracking script detection</li>
                  <li>• Browser security headers</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="flex-1"
                variant={isExtensionActive ? "destructive" : "outline"}
                onClick={() => {
                  setIsExtensionActive(!isExtensionActive);
                  if (!isExtensionActive) {
                    backgroundScanner.start(currentUser!, () => {});
                  } else {
                    backgroundScanner.stop();
                  }
                }}
              >
                {isExtensionActive ? "Disable Scanner" : "Enable Scanner"}
              </Button>
              <Button 
                className="flex-1"
                onClick={testBackgroundScanner}
                disabled={!isExtensionActive}
              >
                Run Manual Scan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ExposureEventCardProps {
  event: ExposureEvent;
  formatDate: (date: string) => string;
  getSeverityColor: (severity: string) => string;
  getActionBadge: (action: string) => JSX.Element;
}

function ExposureEventCard({ event, formatDate, getSeverityColor, getActionBadge }: ExposureEventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className={`w-full sm:w-1 ${event.action === "blocked" ? "bg-red-500" : event.action === "allowed" ? "bg-green-500" : "bg-gray-300"}`}></div>
        <div className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div>
              <div className="font-medium text-lg flex items-center gap-2">
                {event.dataType} 
                <span className="text-sm font-normal text-muted-foreground">on {event.website}</span>
              </div>
              <p className="text-sm mt-1">{event.description}</p>
            </div>
            <div className="flex gap-2 items-start sm:flex-shrink-0">
              <Badge className={getSeverityColor(event.severity)}>
                {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
              </Badge>
              {getActionBadge(event.action)}
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
            <Eye className="h-3 w-3" />
            Detected {formatDate(event.timestamp)}
          </div>
        </div>
      </div>
    </Card>
  );
}
