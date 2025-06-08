
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { validatePassword } from "@/utils/passwordValidation";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useUser();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (passwordError) setPasswordError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message);
      return;
    }
    
    setIsLoading(true);

    try {
      console.log("Starting registration process...");
      
      // Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: undefined, // Disable email confirmation
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        
        // Handle specific error cases
        if (signUpError.message.includes("User already registered")) {
          setError("This email is already registered. Please try signing in instead.");
          return;
        }
        
        throw signUpError;
      }

      console.log("Sign up successful:", signUpData);

      if (!signUpData.user) {
        throw new Error("Registration failed - no user returned");
      }

      // With email confirmation disabled, user should be automatically logged in
      if (signUpData.session) {
        console.log("User automatically signed in after registration");
        setRegistrationSuccess(true);
        
        toast({
          title: "Registration successful!",
          description: "Welcome! Redirecting to dashboard...",
        });
        
        // Refresh user context and navigate
        await refreshUser();
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
        return;
      }

      // Fallback: if no session but user exists, show success and redirect to login
      console.log("Registration completed, redirecting to login");
      setRegistrationSuccess(true);
      
      toast({
        title: "Registration successful!",
        description: "Please sign in with your credentials.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register. Please try again.");
      toast({
        title: "Registration failed",
        description: error.message || "Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent/30">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle>Registration Successful!</CardTitle>
              <CardDescription>
                Welcome! You'll be redirected to the dashboard shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Link to="/dashboard" className="text-primary hover:underline">
                  Go to Dashboard
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <p className="text-muted-foreground">Sign up for Ghost Form</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md mb-4 flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
                <span className="text-destructive">{error}</span>
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={passwordError ? "border-destructive" : ""}
                />
                
                {password && <PasswordStrengthMeter password={password} />}
                
                {passwordError && (
                  <div className="text-destructive text-sm mt-1">
                    {passwordError}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
