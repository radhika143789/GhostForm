
import { toast } from "sonner";
import { User } from "../contexts/UserContext";

export interface ScanResult {
  id: string;
  timestamp: string;
  website: string;
  dataType: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

class BackgroundScanner {
  private isRunning = false;
  private scanInterval: number | null = null;
  private user: User | null = null;
  private onNewThreat: (threat: ScanResult) => void = () => {};

  constructor() {
    // Initialize scanner
  }

  public start(user: User, onNewThreat: (threat: ScanResult) => void) {
    if (this.isRunning) return;
    
    this.user = user;
    this.onNewThreat = onNewThreat;
    this.isRunning = true;
    
    // Simulate background scanning with periodic checks
    this.scanInterval = window.setInterval(() => {
      this.simulateScan();
    }, 30000); // Check every 30 seconds
    
    console.log("Background scanner started for user:", user.id);
  }

  public stop() {
    if (!this.isRunning || this.scanInterval === null) return;
    
    window.clearInterval(this.scanInterval);
    this.isRunning = false;
    this.scanInterval = null;
    this.user = null;
    
    console.log("Background scanner stopped");
  }

  private simulateScan() {
    // Randomly decide if we should trigger a warning (10% chance)
    if (Math.random() < 0.1 && this.user) {
      const threat = this.generateRandomThreat();
      this.onNewThreat(threat);
    }
  }

  private generateRandomThreat(): ScanResult {
    const websites = ["shopping-site.com", "unknown-form.net", "social-network.com", "email-provider.com"];
    const dataTypes = ["Email", "Password", "Credit Card", "Home Address", "Phone Number"];
    const severities: Array<"low" | "medium" | "high" | "critical"> = ["low", "medium", "high", "critical"];
    
    const randomWebsite = websites[Math.floor(Math.random() * websites.length)];
    const randomDataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      website: randomWebsite,
      dataType: randomDataType,
      severity: randomSeverity,
      description: `${randomDataType} detected on ${randomWebsite}`
    };
  }

  // Manual scan functionality for testing
  public triggerManualScan(): ScanResult {
    const threat = this.generateRandomThreat();
    this.onNewThreat(threat);
    return threat;
  }
}

// Create a singleton instance
export const backgroundScanner = new BackgroundScanner();
