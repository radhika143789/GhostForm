
import { ReactNode, Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { LoadingOverlay } from "../ui/loading-overlay";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ghost-form-theme">
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pt-4 md:pl-64 min-h-screen transition-all duration-200">
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Suspense fallback={<LoadingOverlay />}>
            <div className="container px-4 md:px-6 py-4">
              {children}
            </div>
          </Suspense>
        </main>
      </div>
    </ThemeProvider>
  );
}
