
import { ReactNode, useEffect, useState } from "react";
import { backgroundScanner, ScanResult } from "@/services/BackgroundScanner";
import { useUser } from "@/contexts/UserContext";
import { ExposureWarning } from "@/components/alerts/ExposureWarning";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ScannerProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [threatDetected, setThreatDetected] = useState<ScanResult | null>(null);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [detectedThreats, setDetectedThreats] = useState<ScanResult[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Start scanner when user is available
    if (currentUser) {
      backgroundScanner.start(currentUser, handleThreatDetected);
    }
    
    // Clean up scanner when component unmounts
    return () => {
      backgroundScanner.stop();
    };
  }, [currentUser]);
  
  const handleThreatDetected = (threat: ScanResult) => {
    console.log("New threat detected:", threat);
    
    // Add to detected threats list
    setDetectedThreats(prev => [threat, ...prev]);
    
    // Only show warning for medium+ severity threats
    if (threat.severity === "medium" || threat.severity === "high" || threat.severity === "critical") {
      setThreatDetected(threat);
      setIsWarningOpen(true);
      
      // Also show a toast for immediate feedback
      toast(threat.description, {
        description: `${threat.dataType} threat detected on ${threat.website}`,
        duration: 5000,
      });
    } else {
      // For low severity, just show toast
      toast.info("Privacy scan result", {
        description: threat.description,
        duration: 3000,
      });
    }
  };
  
  const handleClose = () => {
    setIsWarningOpen(false);
    setThreatDetected(null);
  };
  
  const handleBlock = () => {
    if (threatDetected) {
      toast.success("Threat blocked", {
        description: `${threatDetected.dataType} on ${threatDetected.website} has been blocked.`,
      });
    }
    handleClose();
  };
  
  const handleAllow = () => {
    if (threatDetected) {
      toast("Access allowed", {
        description: `You've allowed ${threatDetected.dataType} access on ${threatDetected.website}.`,
      });
    }
    handleClose();
  };
  
  const handleViewAll = () => {
    navigate("/monitor");
    toast("Navigated to Exposure Monitor", {
      description: "View all your exposure threats here",
    });
  };

  return (
    <>
      {children}
      <ExposureWarning
        isOpen={isWarningOpen}
        onClose={handleClose}
        threat={threatDetected}
        onBlock={handleBlock}
        onAllow={handleAllow}
        onViewAll={handleViewAll}
      />
    </>
  );
}
