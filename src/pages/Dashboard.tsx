import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, Search, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const exposureData = [
  { name: 'Email', value: 14, color: '#9f75ff' },
  { name: 'Name', value: 22, color: '#8446ff' },
  { name: 'Phone', value: 9, color: '#7822ff' },
  { name: 'Address', value: 5, color: '#6b13f0' },
  { name: 'Credit Card', value: 2, color: '#5b10c7' },
];

const riskData = [
  { name: 'Critical', value: 2, color: '#ef4444' },
  { name: 'High', value: 5, color: '#f97316' },
  { name: 'Medium', value: 12, color: '#eab308' },
  { name: 'Low', value: 28, color: '#22c55e' }
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Dashboard</h1>
        <p className="text-muted-foreground">Monitor and protect your personal data exposure</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protected Data Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/12</div>
            <Progress value={67} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">4 data types require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exposure Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <Progress value={52} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">28% decrease from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Active</div>
            <div className="flex items-center space-x-2 mt-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Monitoring all data points</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">Medium (68/100)</div>
            <Progress value={68} className="h-2 mt-2 bg-amber-100" />
            <p className="text-xs text-muted-foreground mt-2">12 points improved since last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Data Exposure by Type</CardTitle>
            <CardDescription>Where your personal data is being exposed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exposureData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {exposureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Distribution of risks by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Recent Alerts</h2>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical: Credit Card Exposure</AlertTitle>
          <AlertDescription>
            Your credit card information was detected on an insecure form at shopping-site.com.
            Action was blocked automatically.
          </AlertDescription>
        </Alert>
        
        <Alert variant="default" className="bg-amber-50 text-amber-900 border-amber-200">
          <Search className="h-4 w-4" />
          <AlertTitle>Warning: Personal Information Found</AlertTitle>
          <AlertDescription>
            Your home address was found in 3 new public directories. Visit the Risk Assessment page to review.
          </AlertDescription>
        </Alert>
        
        <Alert variant="default" className="bg-blue-50 text-blue-900 border-blue-200">
          <Eye className="h-4 w-4" />
          <AlertTitle>Info: Monitoring Status</AlertTitle>
          <AlertDescription>
            WatchTower has been actively monitoring your data for 7 days. No critical issues found.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
