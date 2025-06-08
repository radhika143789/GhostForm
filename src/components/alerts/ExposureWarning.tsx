
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Eye } from "lucide-react";
import { ScanResult } from "@/services/BackgroundScanner";
import { toast } from "sonner";

interface ExposureWarningProps {
  isOpen: boolean;
  onClose: () => void;
  threat: ScanResult | null;
  onBlock: () => void;
  onAllow: () => void;
  onViewAll?: () => void;
}

export function ExposureWarning({ isOpen, onClose, threat, onBlock, onAllow, onViewAll }: ExposureWarningProps) {
  if (!threat) return null;
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const handleViewAll = () => {
    onClose();
    if (onViewAll) {
      onViewAll();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md border-red-200">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <AlertDialogTitle>Data Exposure Detected!</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className={getSeverityColor(threat.severity)}>
                  {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)} Severity
                </Badge>
                <Badge variant="outline" className="bg-background">
                  Just now
                </Badge>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="font-medium">{threat.dataType} on {threat.website}</div>
                <div className="text-sm text-muted-foreground">{threat.description}</div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto" variant="outline" onClick={handleViewAll}>
            <Eye className="mr-2 h-4 w-4" />
            View All Threats
          </Button>
          <Button className="w-full sm:w-auto" variant="outline" onClick={onAllow}>
            Allow Once
          </Button>
          <Button className="w-full sm:w-auto" variant="destructive" onClick={onBlock}>
            <Shield className="mr-2 h-4 w-4" />
            Block
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
