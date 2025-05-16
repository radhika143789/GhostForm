import { ReactNode, Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { LoadingOverlay } from "../ui/loading-overlay";
import { useUser } from "../../contexts/UserContext";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pt-4 md:pl-64 min-h-screen transition-all duration-200">
        <Suspense fallback={<LoadingOverlay />}>
          <div className="container px-4 md:px-6 py-4">
            {user && (
              <div className="mb-4 p-2 bg-gray-100 rounded text-sm text-gray-700">
                Logged in as: <strong>{user.username}</strong>
              </div>
            )}
            {children}
          </div>
        </Suspense>
      </main>
    </div>
  );
}
