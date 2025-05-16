import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";

interface Breach {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  Description: string;
  DataClasses: string[];
  IsVerified: boolean;
}

export default function SecurityAlerts() {
  const [email, setEmail] = useState("");
  const [breaches, setBreaches] = useState<Breach[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkBreaches = async () => {
    if (!email) {
      toast({ title: "Please enter an email address." });
      return;
    }
    setLoading(true);
    try {
      // Using HaveIBeenPwned API v3 (requires API key in real usage)
      // For demo, using a mock fetch or public endpoint without key
      const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
        headers: {
          "hibp-api-key": "YOUR_API_KEY_HERE",
          "User-Agent": "YourAppName"
        }
      });
      if (response.status === 404) {
        setBreaches([]);
        toast({ title: "No breaches found for this email." });
      } else if (response.ok) {
        const data = await response.json();
        setBreaches(data);
      } else {
        toast({ title: "Error fetching breach data." });
      }
    } catch (error) {
      toast({ title: "Network error while checking breaches." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Security Alerts & Breach Detection</CardTitle>
          <CardDescription>Check if your email has been involved in data breaches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button onClick={checkBreaches} disabled={loading}>
              {loading ? "Checking..." : "Check Breaches"}
            </Button>
          </div>
          {breaches.length > 0 && (
            <div className="space-y-4">
              {breaches.map(breach => (
                <Card key={breach.Name} className="border-red-500 border">
                  <CardHeader>
                    <CardTitle>{breach.Title}</CardTitle>
                    <CardDescription>{breach.BreachDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p dangerouslySetInnerHTML={{ __html: breach.Description }} />
                    <p><strong>Data exposed:</strong> {breach.DataClasses.join(", ")}</p>
                    <p><strong>Domain:</strong> {breach.Domain}</p>
                    <p><strong>Verified:</strong> {breach.IsVerified ? "Yes" : "No"}</p>
                    <p><strong>Suggested Action:</strong> Change your password and enable two-factor authentication.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
