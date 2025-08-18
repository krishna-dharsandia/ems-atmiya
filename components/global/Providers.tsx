"use client";

import { Provider } from "jotai";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
