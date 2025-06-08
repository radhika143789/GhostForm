
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Shield, 
  User, 
  BarChart3,
  Settings, 
  Search, 
  Eye,
  X,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Data Vault",
    href: "/vault",
    icon: Shield,
  },
  {
    title: "Exposure Monitor",
    href: "/monitor",
    icon: Eye,
  },
  {
    title: "Risk Assessment",
    href: "/risk-assessment",
    icon: Search,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden" 
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-primary animate-pulse-shield" />
              <span className="ml-2 font-bold text-lg">GhostForm</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-primary/10 rounded-full h-8 w-8">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">User Account</p>
                <p className="text-xs text-muted-foreground">Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
