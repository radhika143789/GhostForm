
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Shield, AlertTriangle, Check, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ExposureEvent {
  id: string;
  timestamp: string;
  website: string;
  dataType: string;
  action: "blocked" | "allowed" | "pending";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

const initialEvents: ExposureEvent[] = [
  {
    id: "1",
    timestamp: "2025-04-25T10:23:18",
    website: "shopping-site.com",
    dataType: "Credit Card",
    action: "blocked",
    severity: "critical",
    description: "Credit card information detected on an insecure form"
  },
  {
    id: "2",
    timestamp: "2025-04-25T09:45:32",
    website: "social-network.com",
    dataType: "Phone Number",
    action: "allowed",
    severity: "medium",
    description: "Phone number shared on trusted platform (user approved)"
  },
  {
    id: "3",
    timestamp: "2025-04-24T16:12:05",
    website: "unknown-form.net",
    dataType: "Email",
    action: "blocked",
    severity: "high",
    description: "Email detected on suspicious form submission"
  },
  {
    id: "4",
    timestamp: "2025-04-24T14:38:20",
    website: "job-application.com",
    dataType: "Full Name",
    action: "allowed",
    severity: "low",
    description: "Name entered on secure job application form"
  },
  {
    id: "5",
    timestamp: "2025-04-24T11:27:59",
    website: "marketing-survey.com",
    dataType: "Home Address",
    action: "pending",
    severity: "high",
    description: "Home address about to be shared with marketing company"
  },
  {
    id: "6",
    timestamp: "2025-04-23T20:14:34",
    website: "travel-booking.com",
    dataType: "Date of Birth",
    action: "allowed",
    severity: "medium",
    description: "DOB entered on travel booking site (required field)"
  },
  {
    id: "7",
    timestamp: "2025-04-23T15:52:47",
    website: "phishing-attempt.co",
    dataType: "Bank Account",
    action: "blocked",
    severity: "critical",
    description: "Bank details entered on known phishing site"
  }
];

export default function ExposureMonitor() {
  const [events, setEvents] = useState<ExposureEvent[]>(initialEvents);
  const { toast } = useToast();

  const handleAction = (id: string, newAction: "blocked" | "allowed") => {
    setEvents(prev => 
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

  const pendingEvents = events.filter(event => event.action === "pending");
  const recentEvents = events.filter(event => event.action !== "pending");

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exposure Monitor</h1>
        <p className="text-muted-foreground">Track and manage your data exposure incidents</p>
      </div>

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
