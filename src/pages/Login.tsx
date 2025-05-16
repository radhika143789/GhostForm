import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useUser } from "../contexts/UserContext";
import { matchesVaultPatterns, isTrustedDomain, isSecureConnection, isHighRiskDomain, maskPhoneNumber } from "../lib/utils";
import { useToast } from "../components/ui/use-toast";
import { useState as useReactState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWarning, setShowWarning] = useReactState(false);
  const [pendingSubmit, setPendingSubmit] = useReactState(false);
  const [maskedValue, setMaskedValue] = useReactState<string | null>(null);
  const [useMasked, setUseMasked] = useReactState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { toast } = useToast();

  const checkAndWarn = (value: string) => {
    if (matchesVaultPatterns(value)) {
      const domain = window.location.hostname;
      if (!isTrustedDomain(domain) || !isSecureConnection() || isHighRiskDomain(domain)) {
        const masked = maskPhoneNumber(value);
        setMaskedValue(masked);
        setShowWarning(true);
        return true;
      }
    }
    setMaskedValue(null);
    setShowWarning(false);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showWarning) {
      if (!pendingSubmit) {
        toast({
          variant: "destructive",
          title: "Warning",
          description: (
            <>
              ⚠️ You are about to submit your phone number to an unverified website.<br />
              Masked: {maskedValue}<br />
              Do you want to submit masked data instead of real data?
            </>
          ),
          action: (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setUseMasked(true);
                  setShowWarning(false);
                  setPendingSubmit(true);
                }}
              >
                Submit Masked
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setUseMasked(false);
                  setShowWarning(false);
                  setPendingSubmit(true);
                }}
              >
                Submit Real
              </Button>
            </>
          ),
        });
        return;
      }
    }
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    const submitEmail = useMasked && maskedValue ? maskedValue : email;
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: submitEmail, password }),
      });
      if (response.ok) {
        setUser({ username: submitEmail });
        navigate("/dashboard");
      } else {
        const data = await response.json();
        alert(data.error || "Login failed");
      }
    } catch (error) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent/30">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Sign in to your account</h1>
          <p className="text-muted-foreground">Enter your credentials below</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onValueChange={(val) => {
                    setEmail(val);
                    checkAndWarn(val);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onValueChange={(val) => {
                    setPassword(val);
                    checkAndWarn(val);
                  }}
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
