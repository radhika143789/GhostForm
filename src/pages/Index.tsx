
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ghost, Eye, Search, Lock, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

export default function Index() {
  const { currentUser, signOut } = useUser();

  const handleSignOut = async () => {
    await signOut();
    toast("Signed out successfully");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent/30">
      <div className="max-w-5xl w-full space-y-12 py-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Ghost 
                className="h-24 w-24 text-primary animate-ghost-pulse" 
                strokeWidth={1.5} 
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl h-24 w-24 animate-ghost-float"></div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
            Ghost Form
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Invisibly protect your digital footprint with seamless form submissions
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in">
            {currentUser ? (
              <>
                <Link to="/dashboard">
                  <Button size="lg">Dashboard</Button>
                </Link>
                <Button variant="outline" size="lg" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="animate-fade-in border-primary/10 hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                Secure Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Submit forms with confidence knowing your data is protected and encrypted
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in border-primary/10 hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Privacy Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track and control where your personal data is being exposed
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in border-primary/10 hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Search className="h-5 w-5 mr-2 text-primary" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analyze and improve your privacy risk factors in real-time
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Protect Your Data Today</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ghost Form provides a secure way to submit forms while keeping your personal information protected. Join thousands of users who trust Ghost Form for their privacy needs.
          </p>
          {!currentUser && (
            <Link to="/register">
              <Button size="lg" className="mt-4">Start Protecting Your Data</Button>
            </Link>
          )}
        </div>

        <div className="border-t pt-8 flex justify-between items-center text-sm text-muted-foreground">
          <div>© 2024 Ghost Form. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-foreground">Terms</Link>
            <Link to="/" className="hover:text-foreground">Privacy</Link>
            <Link to="/" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
