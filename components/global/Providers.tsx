"use client";

import { Provider } from "jotai";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { logFiglet } from "@/utils/other/art";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    logFiglet('E M S');
  }, []);

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
