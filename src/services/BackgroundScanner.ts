
import { toast } from "sonner";
import { User } from "../contexts/UserContext";

export interface ScanResult {
  id: string;
  timestamp: string;
  website: string;
  dataType: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  details?: string;
}

interface FormData {
  element: HTMLFormElement;
  inputs: HTMLInputElement[];
  action: string;
  method: string;
  isSecure: boolean;
}

class BackgroundScanner {
  private isRunning = false;
  private scanInterval: number | null = null;
  private user: User | null = null;
  private onNewThreat: (threat: ScanResult) => void = () => {};
  private formObserver: MutationObserver | null = null;
  private lastScanResults: ScanResult[] = [];

  constructor() {
    this.initializeFormMonitoring();
  }

  public start(user: User, onNewThreat: (threat: ScanResult) => void) {
    if (this.isRunning) return;
    
    this.user = user;
    this.onNewThreat = onNewThreat;
    this.isRunning = true;
    
    // Start comprehensive scanning every 10 seconds
    this.scanInterval = window.setInterval(() => {
      this.performComprehensiveScan();
    }, 10000);
    
    // Immediate initial scan
    this.performComprehensiveScan();
    
    console.log("Real browser-based scanner started for user:", user.id);
  }

  public stop() {
    if (!this.isRunning || this.scanInterval === null) return;
    
    window.clearInterval(this.scanInterval);
    this.isRunning = false;
    this.scanInterval = null;
    this.user = null;
    
    if (this.formObserver) {
      this.formObserver.disconnect();
    }
    
    console.log("Browser scanner stopped");
  }

  private initializeFormMonitoring() {
    // Monitor for new forms being added to the page
    this.formObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'FORM' || element.querySelector('form')) {
              this.scanForms();
            }
          }
        });
      });
    });

    if (document.body) {
      this.formObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  private async performComprehensiveScan() {
    const results: ScanResult[] = [];
    
    // Scan forms
    results.push(...this.scanForms());
    
    // Scan connection security
    results.push(...this.scanConnectionSecurity());
    
    // Scan cookies and storage
    results.push(...this.scanCookiesAndStorage());
    
    // Scan for tracking scripts
    results.push(...this.scanTrackingScripts());
    
    // Scan browser security
    results.push(...this.scanBrowserSecurity());
    
    // Only report new threats
    const newThreats = results.filter(result => 
      !this.lastScanResults.some(lastResult => 
        lastResult.website === result.website && 
        lastResult.dataType === result.dataType &&
        lastResult.description === result.description
      )
    );
    
    this.lastScanResults = results;
    
    // Report new threats
    newThreats.forEach(threat => {
      this.onNewThreat(threat);
    });
  }

  private scanForms(): ScanResult[] {
    const results: ScanResult[] = [];
    const forms = document.querySelectorAll('form') as NodeListOf<HTMLFormElement>;
    
    forms.forEach(form => {
      const formData = this.analyzeForm(form);
      
      // Check for insecure form submission
      if (!formData.isSecure && formData.inputs.length > 0) {
        results.push({
          id: `insecure-form-${Date.now()}`,
          timestamp: new Date().toISOString(),
          website: window.location.hostname,
          dataType: "Form Security",
          severity: "high",
          description: `Insecure form detected - data may be transmitted without encryption`,
          details: `Form action: ${formData.action}, Method: ${formData.method}`
        });
      }
      
      // Check for sensitive input fields
      formData.inputs.forEach(input => {
        const inputType = input.type.toLowerCase();
        const inputName = input.name.toLowerCase();
        const inputId = input.id.toLowerCase();
        
        if (inputType === 'password') {
          results.push({
            id: `password-field-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            website: window.location.hostname,
            dataType: "Password",
            severity: formData.isSecure ? "medium" : "critical",
            description: `Password field detected on ${formData.isSecure ? 'secure' : 'insecure'} form`
          });
        }
        
        if (inputName.includes('email') || inputType === 'email') {
          results.push({
            id: `email-field-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            website: window.location.hostname,
            dataType: "Email",
            severity: formData.isSecure ? "low" : "high",
            description: `Email field detected on ${formData.isSecure ? 'secure' : 'insecure'} form`
          });
        }
        
        if (inputName.includes('credit') || inputName.includes('card') || inputName.includes('ccv')) {
          results.push({
            id: `credit-card-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            website: window.location.hostname,
            dataType: "Credit Card",
            severity: formData.isSecure ? "medium" : "critical",
            description: `Credit card field detected on ${formData.isSecure ? 'secure' : 'insecure'} form`
          });
        }
        
        if (inputName.includes('phone') || inputType === 'tel') {
          results.push({
            id: `phone-field-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            website: window.location.hostname,
            dataType: "Phone Number",
            severity: formData.isSecure ? "low" : "medium",
            description: `Phone number field detected on ${formData.isSecure ? 'secure' : 'insecure'} form`
          });
        }
      });
    });
    
    return results;
  }

  private analyzeForm(form: HTMLFormElement): FormData {
    const inputs = Array.from(form.querySelectorAll('input')) as HTMLInputElement[];
    const action = form.action || window.location.href;
    const method = form.method || 'GET';
    const isSecure = action.startsWith('https://') || window.location.protocol === 'https:';
    
    return {
      element: form,
      inputs,
      action,
      method,
      isSecure
    };
  }

  private scanConnectionSecurity(): ScanResult[] {
    const results: ScanResult[] = [];
    
    // Check if current page is secure
    if (window.location.protocol !== 'https:') {
      results.push({
        id: `insecure-connection-${Date.now()}`,
        timestamp: new Date().toISOString(),
        website: window.location.hostname,
        dataType: "Connection Security",
        severity: "high",
        description: "Page loaded over insecure HTTP connection",
        details: "Data transmitted to this page is not encrypted"
      });
    }
    
    // Check for mixed content
    const images = document.querySelectorAll('img[src^="http:"]');
    const scripts = document.querySelectorAll('script[src^="http:"]');
    const links = document.querySelectorAll('link[href^="http:"]');
    
    if (images.length > 0 || scripts.length > 0 || links.length > 0) {
      results.push({
        id: `mixed-content-${Date.now()}`,
        timestamp: new Date().toISOString(),
        website: window.location.hostname,
        dataType: "Mixed Content",
        severity: "medium",
        description: "Page contains insecure HTTP resources on HTTPS page",
        details: `Found ${images.length} images, ${scripts.length} scripts, ${links.length} stylesheets over HTTP`
      });
    }
    
    return results;
  }

  private scanCookiesAndStorage(): ScanResult[] {
    const results: ScanResult[] = [];
    
    // Check for insecure cookies
    const cookies = document.cookie.split(';');
    let insecureCookies = 0;
    
    cookies.forEach(cookie => {
      if (cookie.trim() && !cookie.includes('Secure') && window.location.protocol === 'https:') {
        insecureCookies++;
      }
    });
    
    if (insecureCookies > 0) {
      results.push({
        id: `insecure-cookies-${Date.now()}`,
        timestamp: new Date().toISOString(),
        website: window.location.hostname,
        dataType: "Cookie Security",
        severity: "medium",
        description: `${insecureCookies} cookies without Secure flag detected`,
        details: "Cookies may be transmitted over insecure connections"
      });
    }
    
    // Check localStorage for sensitive data patterns
    try {
      const localStorageKeys = Object.keys(localStorage);
      const sensitivePatterns = ['password', 'token', 'key', 'secret', 'auth', 'credential'];
      
      localStorageKeys.forEach(key => {
        const keyLower = key.toLowerCase();
        if (sensitivePatterns.some(pattern => keyLower.includes(pattern))) {
          results.push({
            id: `sensitive-storage-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            website: window.location.hostname,
            dataType: "Local Storage",
            severity: "high",
            description: `Potentially sensitive data stored in browser: ${key}`,
            details: "Sensitive data in localStorage may persist and be accessible to scripts"
          });
        }
      });
    } catch (e) {
      // localStorage access might be restricted
    }
    
    return results;
  }

  private scanTrackingScripts(): ScanResult[] {
    const results: ScanResult[] = [];
    
    // Common tracking domains
    const trackingDomains = [
      'google-analytics.com',
      'googletagmanager.com',
      'facebook.com',
      'doubleclick.net',
      'amazon-adsystem.com',
      'googlesyndication.com'
    ];
    
    const scripts = document.querySelectorAll('script[src]') as NodeListOf<HTMLScriptElement>;
    const trackingScripts: string[] = [];
    
    scripts.forEach(script => {
      const src = script.src;
      trackingDomains.forEach(domain => {
        if (src.includes(domain)) {
          trackingScripts.push(domain);
        }
      });
    });
    
    if (trackingScripts.length > 0) {
      results.push({
        id: `tracking-scripts-${Date.now()}`,
        timestamp: new Date().toISOString(),
        website: window.location.hostname,
        dataType: "Privacy Tracking",
        severity: "low",
        description: `${trackingScripts.length} tracking scripts detected`,
        details: `Tracking domains: ${[...new Set(trackingScripts)].join(', ')}`
      });
    }
    
    return results;
  }

  private scanBrowserSecurity(): ScanResult[] {
    const results: ScanResult[] = [];
    
    // Check for HTTPS enforcement
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      results.push({
        id: `no-https-${Date.now()}`,
        timestamp: new Date().toISOString(),
        website: window.location.hostname,
        dataType: "Browser Security",
        severity: "high",
        description: "Website does not enforce HTTPS encryption"
      });
    }
    
    // Check for security headers (simplified check via fetch)
    try {
      // This is a basic check - in a real implementation you'd need server cooperation
      const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!hasCSP) {
        results.push({
          id: `no-csp-${Date.now()}`,
          timestamp: new Date().toISOString(),
          website: window.location.hostname,
          dataType: "Security Headers",
          severity: "medium",
          description: "No Content Security Policy detected",
          details: "Missing CSP header may allow XSS attacks"
        });
      }
    } catch (e) {
      // Header check failed
    }
    
    return results;
  }

  // Manual scan for testing
  public triggerManualScan(): ScanResult {
    this.performComprehensiveScan();
    
    // Return a sample of what was found
    return {
      id: `manual-scan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      website: window.location.hostname,
      dataType: "Manual Scan",
      severity: "low",
      description: `Manual scan completed for ${window.location.hostname}`,
      details: "Check the exposure monitor for detailed results"
    };
  }
}

// Create a singleton instance
export const backgroundScanner = new BackgroundScanner();
