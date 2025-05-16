import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Shield } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { matchesVaultPatterns, isTrustedDomain, isSecureConnection, isHighRiskDomain, maskPhoneNumber } from "../lib/utils";
import { useToast } from "../components/ui/use-toast";
import { useState as useReactState } from "react";

export default function Register() {
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
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: submitEmail, password }),
      });
      if (response.ok) {
        setUser({ username: submitEmail });
        navigate("/dashboard");
      } else {
        const data = await response.json();
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent/30">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create an account</h1>
          <p className="text-muted-foreground">Sign up for a new Ghost Form account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create your account by entering your email and password</CardDescription>
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
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
