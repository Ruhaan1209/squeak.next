"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { PlatformProvider } from "@/contexts/PlatformContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PlatformProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </PlatformProvider>
    </AuthProvider>
  );
}
