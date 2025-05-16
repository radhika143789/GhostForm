
import { Ghost } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Ghost 
            className="h-24 w-24 text-primary animate-pulse" 
            strokeWidth={1.5} 
          />
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
        </div>
        <p className="text-muted-foreground animate-pulse">
          Loading Ghost Form...
        </p>
      </div>
    </div>
  );
}
