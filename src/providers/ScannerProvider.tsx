
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
    setThreatDetected(threat);
    setIsWarningOpen(true);
    
    // In a real app, you might want to add this threat to your state/database
  };
  
  const handleClose = () => {
    setIsWarningOpen(false);
    setThreatDetected(null);
  };
  
  const handleBlock = () => {
    toast.success("Threat blocked", {
      description: `${threatDetected?.dataType} on ${threatDetected?.website} has been blocked.`,
    });
    handleClose();
  };
  
  const handleAllow = () => {
    toast("Access allowed", {
      description: `You've allowed ${threatDetected?.dataType} access on ${threatDetected?.website}.`,
    });
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
