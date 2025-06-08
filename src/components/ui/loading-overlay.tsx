
import { Ghost } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
          <Ghost 
            className="h-24 w-24 text-primary animate-ghost-pulse relative z-10" 
            strokeWidth={1.5} 
          />
          <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-muted-foreground animate-pulse bg-gradient-to-r from-primary/80 to-accent bg-clip-text text-transparent font-bold text-lg">
          Loading Ghost Form...
        </p>
      </div>
    </div>
  );
}
